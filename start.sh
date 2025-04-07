#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento local
echo "=== Iniciando ambiente de desenvolvimento do RestauranteSaaS ==="

# Verificar a versão do Node.js
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v18.0.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Versão do Node.js muito antiga: $NODE_VERSION"
    echo "Este projeto requer Node.js v18.0.0 ou superior."
    
    # Verificar se o NVM está instalado
    if command -v nvm &> /dev/null; then
        echo "NVM detectado. Instalando Node.js v18..."
        nvm install 18
        nvm use 18
    else
        echo "Por favor, atualize seu Node.js para v18.0.0 ou superior:"
        echo "https://nodejs.org/en/download/"
        exit 1
    fi
fi

# Verificar se o PostgreSQL está rodando
if ! docker ps | grep postgres &> /dev/null; then
    echo "Iniciando o banco de dados PostgreSQL..."
    docker run --name postgres-restaurant -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=restaurant_saas -p 5432:5432 -d postgres:15-alpine
    sleep 5  # Aguardar o banco iniciar
fi

# Configurar variáveis de ambiente para desenvolvimento, se não existirem
if [ ! -f backend/.env ]; then
    echo "Criando arquivo .env para o backend..."
    cat > backend/.env << 'EOL'
# Ambiente
NODE_ENV=development

# Servidor
PORT=3001
HOST=localhost
API_PREFIX=/api

# Banco de dados
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/restaurant_saas

# Frontend URL para CORS
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=desenvolvimento_secreto_123
JWT_EXPIRATION=24h

# Logging
LOG_LEVEL=debug

# Taxa de limites de requisição
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200

# Configurações de upload
MAX_FILE_SIZE=10
EOL
fi

if [ ! -f frontend/.env ]; then
    echo "Criando arquivo .env para o frontend..."
    cat > frontend/.env << 'EOL'
# Ambiente
NODE_ENV=development

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Configurações do Next.js
NEXT_TELEMETRY_DISABLED=1
EOL
fi

# Instalar dependências e iniciar o backend em uma janela de terminal
echo "Instalando dependências e iniciando o backend..."
gnome-terminal --title="Backend" -- bash -c "cd backend && npm install && npx prisma migrate dev --name initial && npm run dev; exec bash" || \
xterm -title "Backend" -e "cd backend && npm install && npx prisma migrate dev --name initial && npm run dev; exec bash" || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/backend && npm install && npx prisma migrate dev --name initial && npm run dev"' || \
echo "Não foi possível abrir um terminal para o backend. Execute manualmente: cd backend && npm install && npx prisma migrate dev && npm run dev"

# Aguardar um pouco para o backend iniciar
sleep 5

# Instalar dependências e iniciar o frontend em outra janela de terminal
echo "Instalando dependências e iniciando o frontend..."
gnome-terminal --title="Frontend" -- bash -c "cd frontend && pnpm install && pnpm dev; exec bash" || \
xterm -title "Frontend" -e "cd frontend && pnpm install && pnpm dev; exec bash" || \
osascript -e 'tell app "Terminal" to do script "cd '"$(pwd)"'/frontend && pnpm install && pnpm dev"' || \
echo "Não foi possível abrir um terminal para o frontend. Execute manualmente: cd frontend && pnpm install && pnpm dev"

echo "=== Ambiente de desenvolvimento iniciado! ==="
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3000" 