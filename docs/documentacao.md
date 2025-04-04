# Documentação do Sistema SaaS para Restaurantes

## Visão Geral

Este sistema é uma solução completa para gerenciamento de restaurantes, bares e lanchonetes, oferecido como Software as a Service (SaaS). A aplicação permite o gerenciamento de múltiplos estabelecimentos, com funcionalidades que abrangem desde o atendimento local até entregas, incluindo emissão de cupons fiscais e integrações com sistemas de pagamento.

## Arquitetura do Sistema

O sistema foi desenvolvido utilizando uma arquitetura moderna e escalável:

- **Frontend**: Next.js com TailwindCSS
- **Backend**: Node.js com Express e TypeScript
- **Banco de Dados**: PostgreSQL (produção) e SQLite (desenvolvimento)
- **Autenticação**: JWT (JSON Web Tokens)
- **APIs**: RESTful
- **Integrações**: Pagamentos, Fiscal e Mensageria (WhatsApp)

## Módulos Principais

### 1. Gerenciamento de Restaurantes

Permite o cadastro e administração de múltiplos estabelecimentos, com configurações específicas para cada um.

### 2. Gerenciamento de Usuários

Sistema completo de gerenciamento de usuários com diferentes papéis e permissões, garantindo segurança e controle de acesso.

### 3. Gerenciamento de Cardápio

Organização do cardápio em categorias e produtos, com suporte a imagens, descrições, preços e disponibilidade.

### 4. Gerenciamento de Mesas

Controle de mesas com QR codes para acesso ao cardápio digital, status em tempo real e divisão em áreas.

### 5. Gerenciamento de Pedidos

Sistema completo para pedidos locais (salão) e delivery, com acompanhamento de status e histórico.

### 6. Gerenciamento de Entregas

Controle de entregas com atribuição de entregadores, rastreamento e notificações automáticas.

## Integrações

### 1. Pagamentos

- Processamento de pagamentos via PIX com geração de QR Code
- Processamento de pagamentos com cartão de crédito
- Verificação de status de transações
- Sistema de estornos

### 2. Fiscal

- Emissão de notas fiscais para pedidos
- Geração de DANFE em PDF
- Cancelamento de notas fiscais
- Verificação de status de documentos fiscais

### 3. WhatsApp

- Envio de mensagens diretas
- Envio de mensagens com templates
- Notificações automáticas de status de pedidos
- Acompanhamento de entregas com links de rastreamento

## Requisitos de Sistema

### Ambiente de Produção

- Node.js 16+
- PostgreSQL 13+
- 2GB RAM mínimo
- 10GB de espaço em disco

### Ambiente de Desenvolvimento

- Node.js 16+
- PostgreSQL 13+ ou SQLite 3
- Git

## Instalação e Configuração

### Backend

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/restaurante-saas.git
cd restaurante-saas/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate deploy
```

5. Inicie o servidor:
```bash
npm run start
```

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd ../frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso do Sistema

### Acesso Inicial

1. Acesse o sistema pelo navegador: `http://localhost:3000`
2. Faça login com as credenciais padrão:
   - Email: admin@restaurantesaas.com
   - Senha: admin123

### Configuração Inicial

1. Altere a senha padrão
2. Configure seu restaurante
3. Crie usuários adicionais
4. Configure categorias e produtos
5. Configure áreas e mesas

## Suporte e Manutenção

Para suporte técnico, entre em contato:
- Email: suporte@restaurantesaas.com
- WhatsApp: (11) 99999-9999

## Atualizações e Melhorias Futuras

- Integração com sistemas de delivery externos (iFood, Uber Eats)
- Aplicativo móvel para garçons
- Dashboard avançado com análise de dados
- Sistema de fidelidade para clientes
- Integração com sistemas de ERP
