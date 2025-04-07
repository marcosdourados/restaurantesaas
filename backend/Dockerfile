FROM node:20-alpine AS builder

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Instala dependências
RUN npm ci

# Copia os arquivos do projeto
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Compila o TypeScript
RUN npm run build

# Segunda etapa - imagem de produção
FROM node:20-alpine AS production

# Define variáveis de ambiente para produção
ENV NODE_ENV=production

# Diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production

# Cria diretório de logs
RUN mkdir -p logs

# Copia os arquivos compilados e o Prisma Client da etapa de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Criar usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

# Expõe a porta
EXPOSE 3001

# Executa a migração e inicia o servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"] 