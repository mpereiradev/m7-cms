Especificação Backend – API do CMS Multi‑site
Visão Geral

Esta especificação define a API de back‑end do sistema de gestão de conteúdos multi‑site. O objetivo é fornecer um serviço centralizado e multi‑tenant que sirva dados para diferentes sites institucionais a partir de uma única instância. O back‑end será construído em Node.js com TypeScript usando o framework NestJS para aproveitar seu sistema de módulos e injeção de dependências. Os dados serão armazenados em PostgreSQL hospedado no Supabase, que oferece recursos de Row Level Security (RLS) e Supavisor para pool de conexões multi‑tenant. A API exposta seguirá o estilo REST; em fases futuras poderá ser ampliada com GraphQL, por isso a arquitetura deve ser hexagonal/modular para facilitar essa evolução.

Requisitos Funcionais
Multi‑tenancy
Isolamento por locatário (tenant): a aplicação deve atender diversos sites (tenants) a partir de uma única base. Todas as tabelas incluem o campo tenant_id (UUID) e a política de RLS garante que cada requisição só enxergue dados do seu locatário. Ao criar um novo tenant, é gerado um slug, configurações iniciais e usuários associados.
Gerenciamento de sites: endpoints permitem criar, editar e remover sites, definindo domínio, idiomas, tema, logotipo e integrações.
Conteúdo e Estruturas
Páginas e seções: as páginas institucionais são compostas por várias seções ao invés de um único campo de texto. Cada página está relacionada com entidades section, que possuem type, order e content (JSON). Essa abordagem permite construir layouts variados (hero, texto, imagem, galeria, depoimentos etc.) e reflete a prática de usar editores de bloco como Editor.js para gerar dados estruturados em JSON.
Posts e categorias: gerenciamento de notícias ou artigos com campos de título, slug, resumo, corpo (JSON), categorias (hierárquicas), tags e agendamento de publicação. Filtrar por categoria, data ou tag. Os posts podem estar em rascunho ou publicados.
Galeria de imagens: cada galeria agrupa imagens armazenadas no Supabase Storage. As imagens devem ser otimizadas para exibição em grid e modal; o artigo da Vercel enfatiza a importância de carregar diferentes tamanhos de imagem e de usar CDN para obter performance. As tabelas relacionam galleries a gallery_items com metadados e ordem.
Galeria de vídeos: suportar vídeos de YouTube, Vimeo e arquivos locais. Metadados incluem source_type, url, title, description e thumbnail_media_id. A reprodução é responsabilidade do front‑end, que pode usar bibliotecas como react‑player.
Publicações de mídias sociais: armazenar URLs de posts de redes sociais (Facebook, Instagram, LinkedIn, Pinterest, TikTok, X/Twitter, YouTube). No front‑end esses posts serão incorporados via bibliotecas como react‑social‑media‑embed, que não requer tokens e suporta personalização.
Banners e slides: coleções de imagens com título, link, ordem e datas de início/fim de exibição. Permitem criar carrosséis na home e em páginas internas.
Formulários de contato: registrar envios de formulários. A tabela contact_form_submissions armazena name, email, subject, message, tenant_id e submitted_at. O back‑end deve expor um endpoint público para submissão e enviar notificações (e‑mail, Slack) por webhook. Validações de spam (reCAPTCHA) e campos personalizados deverão ser suportadas em versões futuras.
Dados da empresa e filiais: cada site pode cadastrar várias lojas/filiais com endereço, telefone, WhatsApp, e‑mail, localização no mapa e horários de atendimento. As tabelas stores e store_hours armazenam essas informações com suporte a traduções.
Biblioteca de mídia: upload e gerenciamento de arquivos. Os metadados são armazenados em media (nome, URL, tipo MIME, tamanhos, tenant). É necessário gerar miniaturas e tamanhos otimizados para uso nas diversas seções.
Internacionalização (i18n): todos os textos (páginas, posts, seções, categorias, banners, lojas) suportam múltiplos idiomas. As traduções são armazenadas em tabelas dedicadas (*_translations) com language_code e campos de texto.
Usuários e Autenticação
Cadastro e login: delegar a autenticação a Supabase Auth. Os usuários podem se registrar via e‑mail/senha ou provedores OAuth. Os dados sensíveis permanecem sob controle do Supabase; o sistema mantém uma tabela users para complementar nome, foto e outras preferências.
Papéis (roles) e permissões: implementar Role‑Based Access Control inspirado no Strapi. Perfis típicos: super_admin, admin, editor, author e viewer. As permissões serão aplicadas tanto nas políticas RLS quanto nos serviços da aplicação.
Associação Usuário/Tenant: a tabela tenant_users vincula usuários a sites. Usuários podem ser convidados por um administrador e aceitar o convite por e‑mail.
API REST

A API seguirá o estilo REST com versionamento (/api/v1/...). Para cada entidade haverá endpoints públicos para leitura (quando aplicável) e endpoints administrativos para CRUD com autenticação. As rotas devem aceitar filtros (slug, categoria, idioma, datas), ordenações e paginação. Endpoints de pré‑visualização deverão exigir um token especial para recuperar conteúdos em rascunho.

Embora o GraphQL seja útil para consultas flexíveis, ele será implementado em uma fase posterior. A arquitetura deve, portanto, separar o domínio (modelos e regras) das camadas de aplicação e infraestrutura. Assim, controladores REST podem ser substituídos por resolvers GraphQL sem reescrever regras de negócio.

Webhooks e Integrações
Webhooks de publicação: quando um conteúdo é publicado ou atualizado, a API deve disparar webhooks configuráveis (ex.: para Slack, automações de marketing). Cada tenant define seus webhooks e endpoints.
Notificações de formulário: ao receber uma submissão de formulário, enviar e‑mail ou mensagem para o administrador do site. Registrar logs.
Future extensibility: a camada de aplicação deve permitir integração com serviços adicionais como sistemas de pagamento, chatbots ou geração de PDFs no futuro.
Modelagem de Dados (Resumo)

A modelagem baseia‑se em tabelas normalizadas. Todas incluem tenant_id e timestamps. Algumas tabelas principais:

Tabela	Campos principais	Descrição
tenants	id, slug, name, domain, logo_url, languages (array), theme, created_at	Cada site/cliente.
users	id, email, name, photo_url, created_at	Usuários do sistema; dados sensíveis em Supabase Auth.
tenant_users	id, tenant_id (FK), user_id (FK), role	Relação usuário–tenant com papel.
pages	id, tenant_id, slug, status (draft/published), published_at, created_at, updated_at	Páginas estáticas compostas por seções.
page_translations	id, page_id (FK), language_code, title, seo_title, seo_description	Traduções de páginas.
sections	id, page_id (FK), type, order, content (JSONB)	Seções de páginas (hero, texto, galeria, vídeo, etc.).
posts	id, tenant_id, slug, status, published_at, author_id (FK), created_at	Posts de blog ou notícias.
post_translations	id, post_id (FK), language_code, title, summary, content (JSONB)	Traduções de posts.
categories	id, tenant_id, parent_id, slug, order, created_at	Categorias hierárquicas.
category_translations	id, category_id, language_code, name, description	Traduções de categorias.
tags	id, tenant_id, slug, created_at	Etiquetas; relação N:N com posts.
media	id, tenant_id, filename, url, mime_type, size, width, height, created_at	Arquivos de mídia.
galleries	id, tenant_id, slug, created_at	Galerias de imagens.
gallery_items	id, gallery_id, media_id, order, caption (JSONB)	Relação de imagens nas galerias.
videos	id, tenant_id, source_type, url, title, description (JSONB), thumbnail_media_id, order, created_at	Galeria de vídeos.
social_posts	id, tenant_id, platform, url, title, published_at, order, created_at	Posts de redes sociais para embed.
banners	id, tenant_id, title, media_id, cta_label, link_url, display_start, display_end, order	Banners/slides.
stores	id, tenant_id, slug, created_at	Filiais/lojas.
store_translations	id, store_id (FK), language_code, name, address, description, email, phone, whatsapp	Conteúdo multilíngue das lojas.
store_hours	id, store_id (FK), weekday, open_time, close_time	Horários de atendimento.
contact_form_submissions	id, tenant_id, name, email, subject, message, submitted_at	Submissões de formulários de contato.
settings	id, tenant_id, key, value (JSONB)	Configurações diversas (Analytics, reCAPTCHA, SMTP, etc.).

Outras tabelas (ex.: relacionamentos N:N entre posts e tags, ou páginas e banners) podem ser incluídas conforme necessário. O domínio deve ser modelado de forma agnóstica à camada de acesso, permitindo que a lógica de negócios seja independente de detalhes do banco.

Módulos e Camadas do NestJS

Seguindo uma abordagem hexagonal, o projeto será organizado em camadas:

Camada de Domínio: contém entidades (classes com dados e invariantes), agregados e serviços de domínio. Não depende de nenhuma tecnologia externa.
Camada de Aplicação: orquestra casos de uso (ex.: “Criar Página”, “Publicar Post”), valida entradas e delega ao domínio. Define interfaces (portas) para repositórios, serviços de envio de e‑mail e webhooks.
Camada de Infraestrutura: implementa interfaces da aplicação usando NestJS, Prisma/TypeORM para acesso ao banco, integração com Supabase Storage, serviços externos e provedores de autenticação. Exponibiliza controladores REST para cada caso de uso.

A divisão em módulos do NestJS permanece semelhante ao documento original, mas agora cada módulo expõe apenas controladores REST. Para cada agregação de dados haverá um serviço e um repositório. Os principais módulos incluem:

AuthModule: integra‑se com Supabase Auth para validação de JWT e emissão de tokens de pré‑visualização. Define guards e decorators para extrair user_id e tenant_id do contexto da requisição.
TenantsModule: gerencia criação e edição de sites (tenants). Controladores expõem endpoints como POST /tenants para criação, GET /tenants/:id para detalhes e PUT /tenants/:id para atualização. Internamente, usa serviços para configurar buckets, domínios e seeds.
UsersModule: administra usuários e associações com tenants. Inclui endpoints para listar usuários de um tenant, convidar novos usuários, alterar papéis e remover membros.
PagesModule: oferece CRUD de páginas e suas seções. Endpoints permitem criar páginas (POST /pages), adicionar seções (POST /pages/:id/sections), atualizar ordem e recuperar uma página completa (incluindo traduções e seções). Implementa mecanismo de preview por token.
PostsModule: gerencia posts, categorias, tags e traduções. Disponibiliza endpoints como GET /posts, POST /posts, PUT /posts/:id, DELETE /posts/:id e filtros por categoria, tag e status.
MediaModule: integra com Supabase Storage para upload, listagem e exclusão de arquivos. Gera URLs assinadas para uploads e realiza geração de miniaturas. Expostos em rotas como POST /media/upload.
GalleryModule: cuida de galerias de imagens e vídeos. Endpoints permitem criar galerias (POST /galleries), adicionar itens (POST /galleries/:id/items), reordenar e remover. Para vídeos, registra metadados e integra com serviços de hospedagem.
SocialModule: CRUD simples de posts sociais. Valida URLs e plataformas suportadas.
BannersModule: administra banners/slides com campos de título, mídia, link e datas de exibição. Endpoints para listar banners ativos para cada site e para gestão no painel.
StoreModule: gerencia lojas/filiais e horários de atendimento. Inclui rotas para listar lojas e registrar ou alterar horários específicos por dia da semana.
ContactFormModule: expõe endpoint público POST /contact para receber envios. Internamente, grava no banco e dispara notificações por e‑mail/webhook. Inclui endpoint para listar submissões (GET /contact/submissions) restrito a administradores.
SettingsModule: persiste configurações de site e integrações (SEO padrão, reCAPTCHA, SMTP, redes sociais). Endpoints para consultar e atualizar configurações.

Cada módulo implementa seus casos de uso em serviços de aplicação e define repositórios que são injetados via interfaces. Esse design facilita a substituição do banco ou a adição de um resolver GraphQL no futuro.

Segurança e Desempenho
RLS: ativar Row Level Security em todas as tabelas e criar políticas que filtrem dados pelo tenant_id e papel do usuário. O back‑end também deve validar as permissões no serviço de aplicação para garantir que usuários não elevem privilégios.
Rate Limiting: proteger endpoints públicos (formulário de contato, consulta de posts) usando o pacote @nestjs/throttler ou similar. Definir limites por IP e por tenant.
Validação e sanitização: utilizar class-validator e/ou Zod para validar DTOs e sanitizar entradas, prevenindo injeções SQL ou XSS. Sanitizar URLs de mídias sociais e parâmetros de upload.
Armazenamento de arquivos: usar buckets individuais por tenant no Supabase Storage; definir permissões de leitura (public/private) adequadas e gerar URLs assinadas para downloads privados. Criar miniaturas em background para otimização de front‑end.
Desempenho e escalabilidade: a utilização do Supavisor e RLS ajuda a escalar o Postgres para múltiplos locatários. Configurar cache (Redis) para consultas frequentes (posts recentes, banners) e usar HTTP caching (Cache-Control e ETag) nas respostas públicas.
Plano de Implementação e Divisão de Subagentes
Planejamento e Infraestrutura
Criar projeto no Supabase, definindo esquema de banco, buckets de storage e habilitando RLS. Criar funções e políticas necessárias. Definir variáveis de ambiente (chaves do Supabase, SMTP, reCAPTCHA).
Inicializar repositório monorepo com NestJS (cms-api) e configurar ferramentas de qualidade (ESLint, Prettier, Husky) e TypeScript.
Escolher ORM (Prisma ou TypeORM) e gerar migrações para todas as tabelas descritas. Executar as migrações localmente e no Supabase.
Estrutura Hexagonal
Criar pastas domain, application, infrastructure. No domínio, definir entidades (Page, Post, Category, Media, etc.) e serviços de domínio. Na aplicação, criar casos de uso (use cases) e portas (interfaces para repositórios, e‑mail, webhooks). Na infraestrutura, implementar repositórios usando o ORM, serviços de e‑mail (SMTP), serviços de webhook e controladores REST usando NestJS.
Implementação de Módulos
Implementar módulo por módulo, começando pelo AuthModule e TenantsModule. Em cada módulo:
Definir DTOs de entrada e saída.
Implementar casos de uso na camada de aplicação.
Criar repositórios com consultas SQL usando ORM com filtros por tenant_id.
Expor controladores REST em controllers/ que recebem requisições, validam dados e delegam para a aplicação.
Ao implementar o MediaModule, integrar o Supabase Storage para upload e criação de URLs assinadas. Para miniaturas, considerar serviços de imagem (Supabase transformações ou Cloudinary) e gerar variantes em background.
No ContactFormModule, integrar verificação de reCAPTCHA no ponto de entrada e configurar envio de e‑mails via SMTP ou serviços como SendGrid.
Para notificações e webhooks, criar um serviço genérico que lê configurações do tenant e dispara chamadas HTTP.
Documentação e Testes
Utilizar Swagger (via @nestjs/swagger) para gerar documentação da API REST. Disponibilizar endpoint /api-docs protegido por autenticação.
Escrever testes unitários (Jest) para serviços de aplicação e repositórios, e testes end‑to‑end para endpoints públicos e administrativos.
Configurar CI (GitHub Actions) para rodar testes e verificar qualidade do código em cada PR.
Deploy e Observabilidade
Automatizar deploy para ambientes de staging e produção (Vercel Functions, AWS Lambda ou DigitalOcean Apps). Configurar variáveis de ambiente nos ambientes e permissões de acesso ao Supabase.
Implementar monitoramento de métricas e logs (ex.: Prometheus/Grafana, Logtail). Definir alertas para erros de API, falhas de banco ou picos de tráfego.
Evolução para GraphQL
Depois que a API REST estiver estável, iniciar a implementação de um gateway GraphQL. A camada de aplicação e domínio já deve expor interfaces que podem ser consumidas por resolvers GraphQL. Assim, será possível suportar consultas aninhadas (ex.: páginas com seções e galerias) sem reescrever serviços.
Justificativa das Escolhas

Ao escolher NestJS e uma arquitetura hexagonal, o projeto torna‑se modular, testável e preparado para evoluções futuras. A utilização do Supabase reduz o esforço operacional pois combina Postgres gerenciado, autenticação, storage e RLS. Optar inicialmente por REST simplifica o desenvolvimento e integração com front‑ends, ao mesmo tempo em que a separação em camadas permite adicionar GraphQL posteriormente com baixa fricção. O uso de Editor.js nos dados de seções justifica a estrutura em blocos, permitindo composições flexíveis. As bibliotecas de front‑end citadas, como react‑player e react‑social‑media‑embed, orientam a definição de campos e metadados necessários, garantindo que o back‑end forneça informação suficiente para a renderização.

Esta especificação fornece um guia detalhado para implementar uma API robusta, multi‑tenant e extensível. Ao seguir estas orientações, os agentes de desenvolvimento conseguirão construir o back‑end do CMS que atende aos requisitos de curto prazo (REST) e prepara o terreno para evoluções como GraphQL e integrações adicionais.