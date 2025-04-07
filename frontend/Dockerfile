FROM node:20-alpine AS deps

WORKDIR /app

# Instala pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json pnpm-lock.yaml* ./

# Instala dependências
RUN pnpm install --frozen-lockfile

# Stage de build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Copia dependências do stage anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Variáveis de ambiente para build
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build da aplicação
RUN pnpm build

# Stage de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Instala pnpm
RUN corepack enable
RUN corepack prepare pnpm@latest --activate

# Variáveis de ambiente para produção
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos de build necessários
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Define usuário não-root
USER nextjs

# Expõe a porta
EXPOSE 3000

# Configura health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost:3000/api/health" ]

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 