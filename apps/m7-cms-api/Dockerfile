# ── Stage 1: build ─────────────────────────────────────────────────
FROM node:22-alpine AS build
RUN npm i -g pnpm@11
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/m7-cms-api ./apps/m7-cms-api

RUN pnpm install --frozen-lockfile
RUN pnpm --filter m7-cms-api build

# ── Stage 2: prod deps only ───────────────────────────────────────
FROM node:22-alpine AS prod-deps
RUN npm i -g pnpm@11
WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/m7-cms-api/package.json apps/m7-cms-api/package.json

RUN pnpm install --frozen-lockfile --prod

# ── Stage 3: production runtime ──────────────────────────────────
FROM node:22-alpine AS runtime
RUN apk add --no-cache dumb-init
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY --from=build /app/apps/m7-cms-api/dist ./dist
COPY --from=prod-deps /app/node_modules ./node_modules
COPY apps/m7-cms-api/package.json ./package.json

EXPOSE 3001
USER node
CMD ["dumb-init", "node", "dist/main.js"]
