#!/bin/bash

# Script de deploy para o sistema RestauranteSaaS
echo "=== Iniciando deploy do RestauranteSaaS ==="

# Verificar se o Docker e Docker Compose estão instalados
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null
then
    echo "Docker e/ou Docker Compose não estão instalados. Instalando..."
    
    # Instalar Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    
    # Instalar Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "Docker e Docker Compose instalados com sucesso!"
fi

# Criar diretório para logs do Nginx
echo "Criando diretórios necessários..."
mkdir -p nginx/conf.d
mkdir -p nginx/certbot/conf
mkdir -p nginx/certbot/www
mkdir -p backend/logs
mkdir -p frontend/public/avatars

# Criar configuração Nginx
echo "Configurando Nginx..."
cat > nginx/conf.d/app.conf << 'EOL'
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
}
EOL

# Verificar se o arquivo .env existe no backend, se não, criar
if [ ! -f backend/.env ]; then
    echo "Criando arquivo .env para o backend..."
    cat > backend/.env << 'EOL'
# Ambiente
NODE_ENV=production

# Servidor
PORT=3001
HOST=0.0.0.0
API_PREFIX=/api

# Banco de dados
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/restaurant_saas

# Frontend URL para CORS
FRONTEND_URL=http://localhost

# JWT
JWT_SECRET=seu_segredo_super_seguro_123456
JWT_EXPIRATION=24h

# Logging
LOG_LEVEL=info

# Taxa de limites de requisição
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200

# Configurações de upload
MAX_FILE_SIZE=10
EOL
fi

# Verificar se o arquivo .env existe no frontend, se não, criar
if [ ! -f frontend/.env ]; then
    echo "Criando arquivo .env para o frontend..."
    cat > frontend/.env << 'EOL'
# Ambiente
NODE_ENV=production

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost/api

# Configurações do Next.js
NEXT_TELEMETRY_DISABLED=1
EOL
fi

# Iniciar os containers com Docker Compose
echo "Iniciando os containers..."
docker-compose down
docker-compose build
docker-compose up -d

# Executar as migrações do banco de dados
echo "Executando migrações do banco de dados..."
sleep 10 # Aguardar o banco de dados iniciar completamente
docker-compose exec backend npx prisma migrate deploy

echo "=== Deploy concluído com sucesso! ==="
echo "O sistema estará disponível em: http://atendimento.adm.br"
echo "Para configurar HTTPS, execute: ./configure-ssl.sh" 