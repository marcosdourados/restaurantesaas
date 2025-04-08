#!/bin/bash

echo "=== Configurando sistema completo RestauranteSaaS ==="

# Instalação das dependências básicas
apt update && apt upgrade -y
apt install -y git curl build-essential

# Instalar Node.js na versão correta
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Instalar o gerenciador de pacotes pnpm
npm install -g pnpm

# Configurar o banco de dados
POSTGRES_PASSWORD=$(openssl rand -base64 12)
echo "Senha gerada para o PostgreSQL: $POSTGRES_PASSWORD"

# Configurar o ambiente
cat > docker-compose.yml << 'DOCKER_EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: restaurant-saas-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: restaurant_saas
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    networks:
      - restaurant-network

  restaurant-app:
    image: getmeili/meilisearch:latest
    container_name: restaurant-saas-app
    ports:
      - "3000:3000"
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_NO_ANALYTICS=true
    volumes:
      - meili_data:/data.ms
    restart: always
    networks:
      - restaurant-network
      
  nginx:
    image: nginx:alpine
    container_name: restaurant-saas-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/html:/usr/share/nginx/html
      - ./nginx/ssl:/etc/nginx/ssl
    restart: always
    networks:
      - restaurant-network

volumes:
  postgres_data:
  meili_data:

networks:
  restaurant-network:
    driver: bridge
DOCKER_EOF

# Substituir a senha do PostgreSQL no arquivo
sed -i "s/\${POSTGRES_PASSWORD}/$POSTGRES_PASSWORD/g" docker-compose.yml

# Configurar o Nginx
mkdir -p nginx/conf.d
mkdir -p nginx/html

cat > nginx/conf.d/app.conf << 'NGINX_EOF'
server {
    listen 80;
    server_name localhost;

    access_log /var/log/nginx/restaurant-access.log;
    error_log /var/log/nginx/restaurant-error.log;

    location / {
        proxy_pass http://restaurant-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /meilisearch {
        proxy_pass http://restaurant-app:7700;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX_EOF

# Criar uma página de pré-carregamento enquanto o MeiliSearch inicia
cat > nginx/html/index.html << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Restaurante SaaS</title>
    <meta http-equiv="refresh" content="10;url=/">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            max-width: 600px;
            text-align: center;
            padding: 40px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        h1 {
            color: #e74c3c;
        }
        .loader {
            border: 5px solid #f3f3f3;
            border-top: 5px solid #e74c3c;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Restaurante SaaS</h1>
        <p>Inicializando o sistema, por favor aguarde...</p>
        <div class="loader"></div>
        <p>O sistema estará disponível em instantes.</p>
    </div>
</body>
</html>
HTML_EOF

# Iniciar os serviços
docker-compose up -d

# Criar usuário administrativo no MeiliSearch após inicialização
echo "Aguardando inicialização do MeiliSearch..."
sleep 15

# Criar índices e configurações iniciais
curl -X POST 'http://localhost:7700/indexes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer masterKey' \
  --data-raw '{
    "uid": "restaurants",
    "primaryKey": "id"
  }'

curl -X POST 'http://localhost:7700/indexes' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer masterKey' \
  --data-raw '{
    "uid": "users",
    "primaryKey": "id"
  }'

# Adicionar dados de exemplo
curl -X POST 'http://localhost:7700/indexes/restaurants/documents' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer masterKey' \
  --data-raw '[
    {
      "id": "1",
      "name": "Restaurante Exemplo",
      "description": "Um restaurante completo para demonstração",
      "address": "Avenida Principal, 123",
      "phone": "1188889999"
    }
  ]'

curl -X POST 'http://localhost:7700/indexes/users/documents' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer masterKey' \
  --data-raw '[
    {
      "id": "1",
      "username": "admin",
      "password": "e8b5d682452bdf0fc26311ffdbd5bf299eac1c52",
      "name": "Administrador",
      "email": "admin@restaurantesaas.com",
      "role": "admin"
    }
  ]'

echo "=== Instalação concluída! ==="
echo "O sistema está disponível em: http://$(hostname -I | awk '{print $1}')"
echo "Usuário administrativo: admin"
echo "Senha: RestauranteSaaS123"
echo "Senha do banco de dados: $POSTGRES_PASSWORD (guarde esta informação!)"
