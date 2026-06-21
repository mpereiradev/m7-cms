Especificação Front‑end – Painel de Administração do CMS
Visão Geral

Este documento especifica o painel de administração do CMS multi‑site. Enquanto o back‑end expõe uma API REST multi‑tenant, o painel será uma aplicação separada desenvolvida em Next.js (versão 14 ou superior) usando TypeScript. O objetivo é fornecer uma interface amigável para que administradores e editores gerenciem conteúdos (páginas, posts, galerias, banners, lojas, etc.), usuários, configurações e traduções. O painel deve ser multilingue, respeitar permissões por papel, suportar edição em blocos via Editor.js e integrar‑se com o Supabase para autenticação e armazenamento de arquivos.

Requisitos Funcionais
Autenticação e Multi‑tenancy
Login e Sessões: usar Supabase Auth para login via e‑mail/senha e provedores OAuth. Após autenticação, armazenar o JWT em cookies seguros (HttpOnly) e recuperar o user_id e tenant_id para cada requisição. Implementar rota de login (/login) e página de recuperação de senha.
Seleção de site: administradores com acesso a múltiplos sites precisam selecionar o tenant ativo após o login. O painel deve mostrar apenas os dados associados ao tenant_id atual.
Papéis e Permissões: aplicar RBAC para restringir ações. Usuários com papel admin podem gerenciar tudo dentro de um tenant; editor pode criar e editar conteúdos, mas não modificar usuários; author pode criar posts e páginas próprios; viewer tem acesso somente leitura. Ajustar menus e botões conforme permissões.
Gestão de Conteúdo

O painel deve oferecer telas CRUD (criar, ler, atualizar, remover) para todas as entidades do CMS. Cada tela deve fornecer formulários com validação, listagens paginadas, filtros e ordenação. As principais seções são:

Dashboard: visão geral com estatísticas rápidas (quantidade de páginas, posts, banners ativos, submissões de formulários de contato recentes). Para gráficos, utilizar uma biblioteca leve como react‑charts ou Recharts. Exibir notificações pendentes (ex.: posts agendados para publicar).
Páginas: listagem de páginas com títulos, status (rascunho/publicado), idiomas disponíveis e data de atualização. Tela de edição que permite:
Definir título, slug e SEO (por idioma) usando formulários multi‑aba.
Montar seções arrastando blocos (Editor.js) – cada bloco representa um tipo de conteúdo (texto rico, imagem, vídeo, galeria, depoimento, lista de posts). O Editor.js é recomendado porque produz JSON estruturado e modular.
Reordenar e duplicar seções via drag‑and‑drop.
Salvar como rascunho ou publicar imediatamente. Permitir agendar a publicação com data/hora.
Posts: área de blog/notícias. Permitir criar posts com título, slug, resumo, capa (upload de imagem), corpo (Editor.js), categorias e tags. Suportar rascunhos, agendamento e preview. A listagem deve permitir filtros por status, categoria, tag, autor e data.
Categorias e Tags: gerenciamento de categorias hierárquicas (com árvore) e tags livres. Permitir renomear e alterar ordem. As categorias devem possuir traduções.
Galerias de Imagens: criar galerias, adicionar fotos via upload (Supabase Storage) e reordenar itens. Ao enviar, gerar miniaturas e diferentes tamanhos de imagem; a importância de diferentes resoluções para grid e modal é enfatizada pelo artigo da Vercel. Incluir campos de legenda por idioma.
Galerias de Vídeos: adicionar vídeos fornecendo URL de YouTube/Vimeo ou fazendo upload de arquivo local. Registrar título, descrição, ordem e miniatura. O front‑end usa bibliotecas como react‑player para exibição, portanto basta armazenar metadados.
Publicações de Mídias Sociais: cadastrar links de posts de redes sociais. Validar a URL e a plataforma suportada (Facebook, Instagram, TikTok, etc.). A listagem permite reordenar e ativar/desativar cada publicação. O front‑end utiliza react‑social‑media‑embed, que não requer tokens.
Banners/Slides: criar e editar banners com imagem, título, botão (rótulo e link) e períodos de exibição. Permitir selecionar a página onde o banner será exibido (home ou páginas específicas). Usar upload para a imagem e pré‑visualizar o carrossel.
Lojas/Filiais: cadastro de filiais com endereço, contatos, localização (link de mapa), descrição e horários de atendimento. A interface deve permitir adicionar vários horários (segunda‑feira, terça‑feira etc.) com campos de abertura/fechamento. Incluir traduções dos campos.
Formulários de Contato: visualizar submissões de formulários recebidas. Permitir filtrar por data, assunto e status (novo/processado). No MVP, o formulário é fixo (nome, e‑mail, assunto, mensagem); em versões futuras, permitir campos personalizados.
Usuários e Papéis: listar usuários do tenant, convidar novos usuários por e‑mail, atribuir papéis e remover acesso. Para convites, disparar e‑mail através do Supabase Auth. Mostrar nome, e‑mail e último acesso.
Configurações: tela para definir configurações gerais do site: idiomas habilitados, metadados SEO padrão, integrações (Google Analytics, reCAPTCHA, SMTP), logotipo e cores do tema. Essas opções são salvas na tabela settings.
Internacionalização (i18n)
O painel deve ser multilíngue para os próprios administradores, suportando pelo menos Português (pt-BR) e Inglês. Utilizar uma biblioteca como next-intl para mensagens e datas. A interface de edição de conteúdo também precisa suportar tradução por idioma; ex.: nas páginas e posts, exibir abas ou guias para cada idioma com campos dedicados.
UX e Tecnologias
Next.js App Router: utilizar roteamento por pastas (/app) com Server Components para páginas que não dependem de eventos do navegador e Client Components para formulários e drag‑and‑drop. Usar useRouter para navegação programática e interceptar transições para feedback de carregamento.
UI Library: adotar shadcn/ui combinada com Tailwind CSS para ter componentes acessíveis, adaptáveis e com estilos consistentes. Shadcn utiliza Radix UI e é altamente customizável.
Formulários: usar React Hook Form para gerenciar estado de formulários. O artigo citado explica que React Hook Form utiliza inputs não controlados via ref, o que reduz re‑renders e melhora performance. Integrar com bibliotecas de validação como Zod para definir schemas de dados.
Editor de Blocos: integrar Editor.js através de um wrapper React para permitir edição rica em blocos. Editor.js produz dados em JSON estruturado, sendo ideal para as seções de páginas e corpo de posts.
Upload e Mídia: usar o SDK do Supabase para upload de arquivos diretamente do navegador para o bucket correspondente ao tenant. Mostrar preview de imagens e barra de progresso. Armazenar o media_id retornado pela API para relacionar o item.
Drag‑and‑Drop e Ordenação: para reordenar seções, galerias e banners, usar bibliotecas como @dnd-kit/core ou react-beautiful-dnd, que fornecem interações acessíveis. Persistir a nova ordem após soltar.
Tabela/Data Grid: as listagens de entidades podem usar componentes de tabela do shadcn ou bibliotecas como @tanstack/react-table para suporte a paginação, filtros e ordenação.
Acessibilidade: garantir que todos os componentes tenham ARIA labels, suporte a teclado e contraste de cores adequado. As bibliotecas selecionadas (shadcn, Radix UI) já seguem essas práticas, mas é necessário validar no contexto do painel.
Integração com a API
SDK Client: criar um pequeno SDK em TypeScript (lib/apiClient.ts) que encapsula chamadas HTTP para a API. Deve incluir funções como getPages(), createPage(data), uploadMedia(file), submitLogin(credentials), etc. Anexar o token de autenticação (JWT) nos headers e tratar erros padronizados.
SWR/React Query: utilizar React Query ou SWR para buscar dados e manter o cache local. Isso permite revalidação automática após a criação/edição e fornece estados de loading/error padrão.
Paginação e Filtros: as tabelas deverão passar parâmetros como page, perPage, search, sort e filters para a API REST e atualizar a UI conforme a resposta.
Preview: ao editar páginas ou posts, disponibilizar um botão de “Pré‑visualizar” que gere um token de preview via API e abra o site público em uma nova aba com os dados de rascunho.
Plano de Implementação
Inicialização do Projeto
Criar diretório admin-panel no monorepo e inicializar um projeto Next.js com TypeScript e Tailwind. Instalar dependências: @supabase/auth-helpers-nextjs, react-hook-form, zod, @hookform/resolvers, @tanstack/react-table, @dnd-kit/core, next-intl, shadcn/ui, editorjs, @editorjs/editorjs, react-query ou @tanstack/react-query.
Configurar next.config.js para permitir upload de imagens de domínios do Supabase e Cloudinary, se usados.
Estrutura de Rotas
/login e /forgot-password: páginas de autenticação. Após login, redirecionar para /dashboard.
/: redirecionar para /dashboard. Componentes de layout (sidebar, header) ficam em app/layout.tsx.
/dashboard: mostrar estatísticas e notificações.
/pages: listagem de páginas. /pages/new para criar e /pages/[id] para editar.
/posts: listagem de posts. /posts/new e /posts/[id] para criação/edição.
/categories, /tags: gerenciar categorias e tags.
/galleries/images, /galleries/videos: gerenciar galerias. Páginas de detalhes permitem adicionar itens.
/social: gerenciar posts sociais.
/banners: gerenciar banners e slides.
/stores: gerenciar lojas e horários.
/contact-submissions: listar envios de formulários de contato.
/users: gerenciar usuários e papéis.
/settings: configurações gerais.
Componentização
Criar componentes reutilizáveis como Sidebar, TopBar, PageForm, PostForm, GalleryForm, BannerForm, StoreForm, UserTable, etc. Utilizar React Hook Form para cada formulário e abstrair campos comuns (entrada de texto, selects com busca, upload de imagem, campos multilíngues).
Implementar BlockEditor para integrar Editor.js nas páginas e posts. Salvar o JSON retornado e passar ao backend.
Implementar MediaUploader que envia arquivos ao Supabase Storage, exibe progresso e retorna media_id para ser associado no banco.
Criar componentes de Modal e Drawer para confirmações de exclusão, pré‑visualizações e formulários rápidos.
Estado e Comunicação com API
Configurar React Query no layout.tsx com um QueryClientProvider. Definir um apiClient com interceptors de autenticação.
Para cada recurso (páginas, posts, etc.), criar hooks como usePages(), useCreatePage(), useUpdatePage(), etc., que encapsulam o uso do React Query e da API.
Autenticação e Proteção de Rotas
No middleware.ts, verificar a existência do token de sessão nos cookies. Redirecionar usuários não autenticados para /login.
Criar provider AuthProvider para expor estado do usuário e papel. Proteger componentes e rotas com RoleGuard que verifica permissões.
Internacionalização
Configurar next-intl com diretórios de mensagens em locales/. Criar provider IntlProvider no layout. As páginas do painel podem ter seletor de idioma para mudar a interface de administração.
Nas telas de edição de conteúdo, criar tabs ou acordions por idioma. Validar que todos os campos obrigatórios estejam preenchidos para cada idioma antes de publicar.
Testes e Qualidade
Escrever testes unitários com Jest e React Testing Library para componentes de formulário, tabelas e hooks. Criar testes end‑to‑end com Cypress para fluxos principais (login, criação de página, upload de imagem, publicação).
Configurar Husky para executar lint e testes antes de cada commit. Utilizar ESLint e Prettier para consistência de código.
Deploy
Implantar o painel em Vercel ou Netlify. Definir variáveis de ambiente (URL da API, chave pública do Supabase, chaves do reCAPTCHA, etc.) nas plataformas. Habilitar Preview Deploys para revisar mudanças antes de publicar.
Justificativa das Escolhas

Construir o painel em Next.js permite aproveitar o mesmo ecossistema do site público, com SSR e rotaçãonão e controle fino de dados. O Editor.js permite construir seções personalizáveis com saída em JSON, fundamental para páginas com layout variado. React Hook Form foi escolhido pelos ganhos de performance e facilidade de uso, crucial em formulários complexos da administração. A escolha de shadcn/ui com Tailwind assegura componentes acessíveis e personalizáveis. A integração com Supabase unifica autenticação, banco e storage, simplificando a infraestrutura. Por fim, a separação clara entre painel (Next.js) e API (NestJS) facilita manutenção e escalabilidade; cada parte pode evoluir em seu próprio ritmo e ser implantada independentemente.

Esta especificação fornece um roteiro para construir um painel de administração moderno, seguro e escalável. Seguindo este guia, os agentes de desenvolvimento poderão criar uma interface completa que permita aos clientes gerenciar conteúdos e configurações de seus sites institucionais com eficiência.