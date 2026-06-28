# Infraestrutura — m7-cms no Google Cloud

## Visão Geral

O projeto roda duas aplicações independentes no **Cloud Run**, com CI/CD automático via **Cloud Build** acionado por push na branch `main` do GitHub.

```
GitHub (main branch)
       │
       ▼
 Cloud Build Trigger
 ┌─────────────────┐     ┌─────────────────┐
 │ m7-cms-api-     │     │ m7-cms-web-     │
 │ deploy          │     │ deploy          │
 └────────┬────────┘     └────────┬────────┘
          │                       │
          ▼                       ▼
 Artifact Registry ─────────────────────────
 southamerica-east1-docker.pkg.dev/
   glass-sylph-491920-a4/m7-cms/
     m7-cms-api:<sha>          m7-cms-web:<sha>
          │                       │
          ▼                       ▼
 Cloud Run (southamerica-east1)
 ┌──────────────────┐   ┌──────────────────┐
 │   m7-cms-api     │   │   m7-cms-web     │
 │   port 3001      │   │   port 3000      │
 │   min 1 / max 2  │   │   min 1 / max 2  │
 └──────────────────┘   └──────────────────┘
```

---

## Recursos GCP Criados

| Recurso | Tipo | Nome / ID |
|---|---|---|
| Projeto | GCP Project | `glass-sylph-491920-a4` |
| Região | — | `southamerica-east1` |
| Registry | Artifact Registry | `m7-cms` |
| Trigger API | Cloud Build | `m7-cms-api-deploy` |
| Trigger Web | Cloud Build | `m7-cms-web-deploy` |
| Serviço API | Cloud Run | `m7-cms-api` |
| Serviço Web | Cloud Run | `m7-cms-web` |

---

## CI/CD — Como Funciona

### Fluxo por push na `main`

1. O GitHub notifica o Cloud Build via webhook (GitHub App instalado).
2. Cada trigger filtra as mudanças pelos caminhos configurados (`includedFiles`).
3. O Cloud Build executa o arquivo YAML correspondente.
4. A imagem é construída, enviada ao Artifact Registry e o Cloud Run é atualizado.

### Triggers e seus filtros

| Trigger | Arquivo de build | Arquivos monitorados |
|---|---|---|
| `m7-cms-api-deploy` | `cloudbuild.api.yaml` | `apps/m7-cms-api/**`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json` |
| `m7-cms-web-deploy` | `cloudbuild.web.yaml` | `apps/m7-cms-web/**`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `package.json` |

Mudanças exclusivas em um app não disparam o build do outro.

### Imagens Docker

As imagens são publicadas com duas tags:
- `:$COMMIT_SHA` — imutável, permite rollback por SHA exato
- `:latest` — sempre aponta para o último deploy bem-sucedido

---

## Segredos (Secret Manager)

Todos os segredos ficam no **Secret Manager** com o prefixo `m7-cms-*`. As versões `latest` são usadas em builds e deploys.

### Segredos da API (`m7-cms-api`)

Injetados como variáveis de ambiente no container em tempo de execução via Cloud Run.

| Secret Manager name | Variável no container | Descrição |
|---|---|---|
| `m7-cms-api-DATABASE_URL` | `DATABASE_URL` | Connection string PostgreSQL do Supabase |
| `m7-cms-api-SUPABASE_JWKS_URL` | `SUPABASE_JWKS_URL` | URL JWKS para validação de JWT do Supabase |
| `m7-cms-api-SMTP_HOST` | `SMTP_HOST` | Host do servidor SMTP |
| `m7-cms-api-SMTP_PORT` | `SMTP_PORT` | Porta SMTP (ex: 587) |
| `m7-cms-api-SMTP_USER` | `SMTP_USER` | Usuário SMTP |
| `m7-cms-api-SMTP_PASS` | `SMTP_PASS` | Senha SMTP |
| `m7-cms-api-SMTP_FROM` | `SMTP_FROM` | Endereço de remetente (ex: noreply@seudominio.com) |

### Segredos do Web (`m7-cms-web`)

Injetados como `--build-arg` durante o `docker build` (baked na imagem Next.js). Valores `NEXT_PUBLIC_*` são expostos no bundle JavaScript — não coloque segredos aqui.

| Secret Manager name | Build arg no Dockerfile | Descrição |
|---|---|---|
| `m7-cms-web-NEXT_PUBLIC_SUPABASE_URL` | `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `m7-cms-web-NEXT_PUBLIC_SUPABASE_ANON_KEY` | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave anon/pública do Supabase |
| `m7-cms-web-NEXT_PUBLIC_API_URL` | `NEXT_PUBLIC_API_URL` | URL base da API (URL do Cloud Run de `m7-cms-api`) |

> **Atenção:** O nome do build arg no Dockerfile é `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, mas o secret no Secret Manager é `m7-cms-web-NEXT_PUBLIC_SUPABASE_ANON_KEY`. O `cloudbuild.web.yaml` faz o mapeamento.

### Como atualizar um segredo

```bash
# Exemplo: atualizar DATABASE_URL
echo -n "postgresql://user:pass@host:5432/db" | \
  gcloud secrets versions add m7-cms-api-DATABASE_URL \
  --data-file=- \
  --project=glass-sylph-491920-a4
```

> O Cloud Run lê a versão `latest` automaticamente. Após atualizar um segredo, faça um novo deploy (ou um push forçado na main) para que o serviço use o novo valor.

---

## IAM — Service Accounts

| Service Account | Papéis concedidos | Usado por |
|---|---|---|
| `1073283868349@cloudbuild.gserviceaccount.com` (Cloud Build SA) | `run.admin`, `iam.serviceAccountUser`, `artifactregistry.writer`, `secretmanager.secretAccessor` | Cloud Build (fallback) |
| `1073283868349-compute@developer.gserviceaccount.com` (Compute SA) | `run.admin`, `iam.serviceAccountUser`, `artifactregistry.writer`, `artifactregistry.reader`, `secretmanager.secretAccessor` | Triggers do Cloud Build + runtime do Cloud Run |

---

## Rede e Tráfego

- **Ingress:** `all` — aceita tráfego externo direto (internet)
- **Autenticação:** `--allow-unauthenticated` — endpoints públicos sem token GCP
- **HTTPS:** automático via `*.run.app` (gerenciado pelo Cloud Run)
- **DNS customizado:** configure após obter as URLs dos serviços (ver seção abaixo)

### URLs dos serviços

Após o primeiro deploy, obtenha as URLs com:

```bash
gcloud run services describe m7-cms-api \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4 \
  --format="value(status.url)"

gcloud run services describe m7-cms-web \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4 \
  --format="value(status.url)"
```

A URL da API deve ser colocada no segredo `m7-cms-web-NEXT_PUBLIC_API_URL` (no formato `https://<url>/api/v1`).

### Mapeamento de domínio customizado

Quando os domínios estiverem apontando para o Cloud Run:

```bash
# Mapear domínio para o serviço web
gcloud run domain-mappings create \
  --service=m7-cms-web \
  --domain=admin.seudominio.com \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4

# Mapear domínio para a API
gcloud run domain-mappings create \
  --service=m7-cms-api \
  --domain=api.seudominio.com \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4
```

O Cloud Run fornece os registros DNS (CNAME/A) necessários após esses comandos.

---

## Escalabilidade

| Configuração | API | Web |
|---|---|---|
| Instâncias mínimas | 1 | 1 |
| Instâncias máximas | 2 | 2 |
| Memória | 512Mi | 512Mi |
| CPU | 1 vCPU | 1 vCPU |

Com mínimo 1 instância, não há cold start — o serviço sempre está quente.

---

## Checklist pós-configuração

Antes do primeiro deploy funcionar corretamente:

- [ ] Preencher todos os segredos no Secret Manager (atualmente com valor `PLACEHOLDER`)
- [ ] Após primeiro deploy da API, pegar a URL e atualizar `m7-cms-web-NEXT_PUBLIC_API_URL`
- [ ] Fazer um push na `main` para acionar o CI/CD e validar o pipeline completo
- [ ] Confirmar que os dois serviços Cloud Run estão `ACTIVE` no console

---

## Deploy Manual (sem push no Git)

```bash
# Acionar trigger da API manualmente
gcloud builds triggers run m7-cms-api-deploy \
  --branch=main \
  --project=glass-sylph-491920-a4

# Acionar trigger do Web manualmente
gcloud builds triggers run m7-cms-web-deploy \
  --branch=main \
  --project=glass-sylph-491920-a4
```

---

## Rollback

```bash
# Listar revisões disponíveis
gcloud run revisions list \
  --service=m7-cms-api \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4

# Reverter para uma revisão específica
gcloud run services update-traffic m7-cms-api \
  --to-revisions=m7-cms-api-00001-xxx=100 \
  --region=southamerica-east1 \
  --project=glass-sylph-491920-a4
```
