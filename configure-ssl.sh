#!/bin/bash

# Script para configurar SSL com Let's Encrypt
DOMAIN="atendimento.adm.br"
EMAIL="admin@$DOMAIN"

echo "=== Configurando SSL para $DOMAIN ==="

# Atualizar configuração do Nginx
echo "Atualizando configuração do Nginx..."
cat > nginx/conf.d/app.conf << EOL
server {
    listen 80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$host\$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # Configurações SSL recomendadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:10m;
    ssl_session_tickets off;
    ssl_stapling on;
    ssl_stapling_verify on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL

# Recarregar o Nginx
echo "Recarregando configuração do Nginx..."
docker-compose restart nginx

# Obter certificado SSL com Certbot
echo "Solicitando certificado SSL com Certbot..."
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $EMAIL --agree-tos --no-eff-email -d $DOMAIN

# Configurar renovação automática
echo "Configurando renovação automática do certificado..."
(crontab -l 2>/dev/null; echo "0 3 * * * docker-compose -f $(pwd)/docker-compose.yml run --rm certbot renew --quiet && docker-compose -f $(pwd)/docker-compose.yml restart nginx") | crontab -

# Atualizar variáveis de ambiente para HTTPS
echo "Atualizando variáveis de ambiente para HTTPS..."

# Atualizar .env do backend
sed -i "s|FRONTEND_URL=http://localhost|FRONTEND_URL=https://$DOMAIN|g" backend/.env

# Atualizar .env do frontend
sed -i "s|NEXT_PUBLIC_API_URL=http://localhost/api|NEXT_PUBLIC_API_URL=https://$DOMAIN/api|g" frontend/.env

# Reiniciar os serviços
echo "Reiniciando os serviços..."
docker-compose down
docker-compose up -d

echo "=== Configuração SSL concluída com sucesso! ==="
echo "Seu site está disponível em: https://$DOMAIN"
echo "Certificados serão renovados automaticamente a cada 90 dias" 