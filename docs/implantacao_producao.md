# Guia de Implantação em Produção

Este documento descreve os passos necessários para implantar o sistema SaaS para restaurantes em um ambiente de produção.

## Requisitos de Infraestrutura

### Servidor
- CPU: 2 vCPUs mínimo (4 vCPUs recomendado)
- RAM: 4GB mínimo (8GB recomendado)
- Armazenamento: 20GB SSD mínimo
- Sistema Operacional: Ubuntu 20.04 LTS ou superior

### Banco de Dados
- PostgreSQL 13+
- 2GB RAM mínimo dedicado
- 20GB SSD mínimo

### Rede
- Domínio personalizado
- Certificado SSL
- Firewall configurado

## Preparação do Ambiente

### 1. Atualizar o Sistema
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Instalar Dependências
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Instalar Nginx
sudo apt install -y nginx

# Instalar PM2 (gerenciador de processos)
sudo npm install -g pm2
```

### 3. Configurar PostgreSQL
```bash
# Criar usuário e banco de dados
sudo -u postgres psql -c "CREATE USER restaurantesaas WITH PASSWORD 'senha_segura';"
sudo -u postgres psql -c "CREATE DATABASE restaurantesaas_prod;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE restaurantesaas_prod TO restaurantesaas;"
```

## Implantação do Backend

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/restaurante-saas.git
cd restaurante-saas
```

### 2. Configurar Variáveis de Ambiente
```bash
cd backend
cp .env.example .env.production
```

Edite o arquivo `.env.production` com as configurações de produção:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://restaurantesaas:senha_segura@localhost:5432/restaurantesaas_prod
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=24h
```

### 3. Instalar Dependências e Compilar
```bash
npm install
npm run build
```

### 4. Executar Migrações
```bash
npx prisma migrate deploy
```

### 5. Configurar PM2
Crie um arquivo `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'restaurante-saas-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
};
```

Inicie a aplicação:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Implantação do Frontend

### 1. Configurar Variáveis de Ambiente
```bash
cd ../frontend
cp .env.example .env.production
```

Edite o arquivo `.env.production` com as configurações de produção:
```
NEXT_PUBLIC_API_URL=https://api.seudominio.com
```

### 2. Instalar Dependências e Compilar
```bash
npm install
npm run build
```

### 3. Configurar PM2 para o Frontend
Adicione ao arquivo `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    // ... configuração do backend
    {
      name: 'restaurante-saas-frontend',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

Inicie a aplicação:
```bash
pm2 start ecosystem.config.js --env production
pm2 save
```

## Configuração do Nginx

### 1. Criar Configuração para o Backend
```bash
sudo nano /etc/nginx/sites-available/api.seudominio.com
```

Adicione o seguinte conteúdo:
```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. Criar Configuração para o Frontend
```bash
sudo nano /etc/nginx/sites-available/seudominio.com
```

Adicione o seguinte conteúdo:
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Ativar as Configurações
```bash
sudo ln -s /etc/nginx/sites-available/api.seudominio.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/seudominio.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. Configurar SSL com Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
sudo certbot --nginx -d api.seudominio.com
```

## Monitoramento e Manutenção

### 1. Configurar Monitoramento
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 2. Backup Automático do Banco de Dados
Crie um script de backup:
```bash
sudo nano /usr/local/bin/backup-db.sh
```

Adicione o seguinte conteúdo:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/restaurantesaas"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p $BACKUP_DIR
pg_dump -U restaurantesaas restaurantesaas_prod | gzip > "$BACKUP_DIR/restaurantesaas_$TIMESTAMP.sql.gz"
find $BACKUP_DIR -type f -mtime +7 -delete
```

Torne o script executável e configure o cron:
```bash
sudo chmod +x /usr/local/bin/backup-db.sh
sudo crontab -e
```

Adicione a linha:
```
0 2 * * * /usr/local/bin/backup-db.sh
```

### 3. Atualizações de Segurança
Configure atualizações automáticas de segurança:
```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Verificação Final

1. Verifique se o backend está acessível: `https://api.seudominio.com/health`
2. Verifique se o frontend está acessível: `https://seudominio.com`
3. Teste o login e as principais funcionalidades
4. Verifique os logs: `pm2 logs`

## Procedimento de Rollback

Em caso de problemas após uma atualização:

1. Reverter para a versão anterior do código:
```bash
cd /caminho/para/restaurante-saas
git checkout versao-anterior
```

2. Reconstruir e reiniciar:
```bash
cd backend
npm install
npm run build
pm2 restart restaurante-saas-api

cd ../frontend
npm install
npm run build
pm2 restart restaurante-saas-frontend
```

3. Restaurar banco de dados (se necessário):
```bash
gunzip -c /var/backups/restaurantesaas/restaurantesaas_[timestamp].sql.gz | sudo -u postgres psql restaurantesaas_prod
```
