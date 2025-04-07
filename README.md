# RestauranteSaaS - Sistema SaaS para Gerenciamento de Restaurantes

Um sistema completo para gestão de restaurantes, bares e estabelecimentos similares, com funcionalidades para gerenciamento de mesas, pedidos, cardápio, financeiro e muito mais.

## 📋 Requisitos do Sistema

- Docker e Docker Compose
- Node.js 18.x ou superior (para desenvolvimento local)
- PostgreSQL (gerenciado via Docker)

## 🚀 Instalação em Produção (VPS)

### Método Automatizado (Recomendado)

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/restaurantesaas.git
cd restaurantesaas
```

2. Execute o script de deploy:
```bash
./deploy.sh
```

3. Acesse o sistema em http://seu-ip-ou-dominio

### Configurando HTTPS com Let's Encrypt

Se você tem um domínio apontando para seu servidor, configure HTTPS:

```bash
./configure-ssl.sh
```

O domínio configurado por padrão é `atendimento.adm.br`.

### Instalação Manual

1. Clone este repositório:
```bash
git clone https://github.com/seu-usuario/restaurantesaas.git
cd restaurantesaas
```

2. Configure as variáveis de ambiente:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Edite os arquivos `.env` com suas configurações.

4. Inicie os containers:
```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:
```bash
docker-compose exec backend npx prisma migrate deploy
```

## 🛠️ Desenvolvimento Local

### Backend

1. Instale as dependências:
```bash
cd backend
npm install
```

2. Configure o banco de dados:
```bash
npx prisma migrate dev
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Frontend

1. Instale as dependências:
```bash
cd frontend
pnpm install
```

2. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

## 🧪 Testes

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
pnpm test
```

## 📚 Documentação

A documentação completa da API está disponível em:
- Local: http://localhost:3001/api/docs
- Produção: https://atendimento.adm.br/api/docs

## 🔄 CI/CD

O projeto conta com pipelines de CI/CD configurados no GitHub Actions. A cada push na branch `main`, os seguintes passos são executados:
- Verificação de qualidade de código
- Execução de testes
- Build de containers
- Deploy automático (em ambientes configurados)

## 🔒 Segurança

O sistema implementa diversas medidas de segurança:
- Autenticação JWT
- Proteção contra ataques CSRF
- Rate limiting
- Validação de dados com Zod
- Sanitização de entradas
- HTTPS com Let's Encrypt

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, leia as [diretrizes de contribuição](CONTRIBUTING.md) para detalhes sobre como contribuir. 