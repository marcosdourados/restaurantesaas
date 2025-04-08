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

# Iniciar os containers com Docker Compose
echo "Iniciando os containers..."
docker-compose pull
docker-compose up -d

echo "=== Deploy concluído com sucesso! ==="
echo "O sistema estará disponível em: http://$(hostname -I | awk '{print $1}')"
