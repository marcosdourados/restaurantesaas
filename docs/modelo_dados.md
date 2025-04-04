# Modelo de Dados - Sistema SaaS para Restaurantes

## Visão Geral

Este documento define o modelo de dados para o sistema SaaS de restaurantes, detalhando as entidades principais, seus atributos, relacionamentos e restrições. O modelo foi projetado para suportar todas as funcionalidades do sistema, com foco em escalabilidade, performance e integridade dos dados.

## Diagrama de Entidade-Relacionamento

```
+----------------+       +----------------+       +----------------+
| Restaurants    |       | Users          |       | Roles          |
+----------------+       +----------------+       +----------------+
| PK id          |<----->| PK id          |<----->| PK id          |
| name           |       | FK restaurant_id|       | name           |
| logo_url       |       | FK role_id     |       | description    |
| address        |       | name           |       | permissions    |
| phone          |       | email          |       | created_at     |
| email          |       | password       |       | updated_at     |
| tax_id         |       | active         |       +----------------+
| settings       |       | last_login     |
| created_at     |       | created_at     |
| updated_at     |       | updated_at     |
+----------------+       +----------------+

+----------------+       +----------------+       +----------------+
| Categories     |       | Products       |       | ProductImages  |
+----------------+       +----------------+       +----------------+
| PK id          |       | PK id          |       | PK id          |
| FK restaurant_id|<----->| FK restaurant_id|<----->| FK product_id  |
| name           |       | FK category_id |       | url            |
| description    |<----->| name           |       | order          |
| image_url      |       | description    |       | created_at     |
| order          |       | price          |       | updated_at     |
| active         |       | cost           |       +----------------+
| created_at     |       | image_url      |
| updated_at     |       | available      |
+----------------+       | created_at     |
                         | updated_at     |
                         +----------------+

+----------------+       +----------------+       +----------------+
| Areas          |       | Tables         |       | TableSessions  |
+----------------+       +----------------+       +----------------+
| PK id          |       | PK id          |       | PK id          |
| FK restaurant_id|<----->| FK restaurant_id|<----->| FK table_id    |
| name           |       | FK area_id     |       | FK user_id     |
| description    |<----->| number         |       | customer_name  |
| created_at     |       | seats          |       | people_count   |
| updated_at     |       | status         |       | status         |
+----------------+       | qr_code_url    |       | opened_at      |
                         | created_at     |       | closed_at      |
                         | updated_at     |       | created_at     |
                         +----------------+       | updated_at     |
                                                  +----------------+

+----------------+       +----------------+       +----------------+
| Orders         |       | OrderItems     |       | OrderStatus    |
+----------------+       +----------------+       +----------------+
| PK id          |       | PK id          |       | PK id          |
| FK restaurant_id|<----->| FK order_id    |<----->| FK order_id    |
| FK user_id     |       | FK product_id  |       | status         |
| FK table_id    |       | name           |       | notes          |
| FK session_id  |       | quantity       |       | FK user_id     |
| type           |       | unit_price     |       | created_at     |
| status         |<----->| total_price    |       +----------------+
| customer_name  |       | notes          |
| customer_phone |       | status         |
| customer_email |       | created_at     |
| address        |       | updated_at     |
| subtotal       |       +----------------+
| service_fee    |
| delivery_fee   |
| total          |
| payment_method |
| notes          |
| created_at     |
| updated_at     |
+----------------+

+----------------+       +----------------+       +----------------+
| Bills          |       | BillSplits     |       | Payments       |
+----------------+       +----------------+       +----------------+
| PK id          |       | PK id          |       | PK id          |
| FK session_id  |<----->| FK bill_id     |<----->| FK bill_id     |
| FK restaurant_id|       | name           |       | FK split_id    |
| subtotal       |       | amount         |       | method         |
| service_fee    |<----->| paid           |       | amount         |
| total          |       | created_at     |       | notes          |
| status         |       | updated_at     |       | FK user_id     |
| created_at     |       +----------------+       | created_at     |
| updated_at     |                                | updated_at     |
+----------------+                                +----------------+

+----------------+       +----------------+       +----------------+
| Invoices       |       | Deliveries     |       | Couriers       |
+----------------+       +----------------+       +----------------+
| PK id          |       | PK id          |       | PK id          |
| FK restaurant_id|<----->| FK order_id    |<----->| FK restaurant_id|
| FK order_id    |       | FK courier_id  |       | name           |
| fiscal_id      |       | status         |       | phone          |
| access_key     |       | tracking_code  |       | email          |
| customer_name  |<----->| estimated_time |       | vehicle        |
| customer_tax_id|       | started_at     |       | license_plate  |
| total_amount   |       | delivered_at   |       | active         |
| issue_date     |       | notes          |       | created_at     |
| status         |       | created_at     |       | updated_at     |
| pdf_url        |       | updated_at     |       +----------------+
| xml_url        |       +----------------+
| created_at     |
| updated_at     |
+----------------+
```

## Detalhamento das Entidades

### Restaurants

Armazena informações sobre os estabelecimentos cadastrados no sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do restaurante |
| name | VARCHAR(100) | Nome do estabelecimento |
| logo_url | VARCHAR(255) | URL do logotipo |
| address | JSONB | Endereço completo (rua, número, bairro, cidade, estado, CEP) |
| phone | VARCHAR(20) | Telefone de contato |
| email | VARCHAR(100) | Email de contato |
| tax_id | VARCHAR(20) | CNPJ do estabelecimento |
| settings | JSONB | Configurações personalizadas (tema, moeda, fuso horário, etc.) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Users

Armazena informações sobre os usuários do sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do usuário |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| role_id | UUID | Referência ao papel/função (FK) |
| name | VARCHAR(100) | Nome completo do usuário |
| email | VARCHAR(100) | Email do usuário (único) |
| password | VARCHAR(255) | Senha criptografada |
| active | BOOLEAN | Status de ativação |
| last_login | TIMESTAMP | Data/hora do último login |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Roles

Define os papéis e permissões dos usuários.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do papel |
| name | VARCHAR(50) | Nome do papel (admin, gerente, garçom, etc.) |
| description | VARCHAR(255) | Descrição do papel |
| permissions | JSONB | Lista de permissões associadas |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Categories

Categorias de produtos do cardápio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da categoria |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| name | VARCHAR(50) | Nome da categoria |
| description | VARCHAR(255) | Descrição da categoria |
| image_url | VARCHAR(255) | URL da imagem da categoria |
| order | INTEGER | Ordem de exibição |
| active | BOOLEAN | Status de ativação |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Products

Produtos disponíveis no cardápio.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do produto |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| category_id | UUID | Referência à categoria (FK) |
| name | VARCHAR(100) | Nome do produto |
| description | TEXT | Descrição detalhada |
| price | DECIMAL(10,2) | Preço de venda |
| cost | DECIMAL(10,2) | Custo do produto |
| image_url | VARCHAR(255) | URL da imagem principal |
| available | BOOLEAN | Disponibilidade atual |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### ProductImages

Imagens adicionais dos produtos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da imagem |
| product_id | UUID | Referência ao produto (FK) |
| url | VARCHAR(255) | URL da imagem |
| order | INTEGER | Ordem de exibição |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Areas

Áreas do estabelecimento (salão, varanda, etc.).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da área |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| name | VARCHAR(50) | Nome da área |
| description | VARCHAR(255) | Descrição da área |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Tables

Mesas do estabelecimento.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da mesa |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| area_id | UUID | Referência à área (FK) |
| number | VARCHAR(10) | Número/identificação da mesa |
| seats | INTEGER | Quantidade de lugares |
| status | ENUM | Status atual (available, occupied, reserved) |
| qr_code_url | VARCHAR(255) | URL do QR code da mesa |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### TableSessions

Sessões de atendimento nas mesas.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da sessão |
| table_id | UUID | Referência à mesa (FK) |
| user_id | UUID | Referência ao usuário que abriu (FK) |
| customer_name | VARCHAR(100) | Nome do cliente principal |
| people_count | INTEGER | Quantidade de pessoas |
| status | ENUM | Status (open, closed) |
| opened_at | TIMESTAMP | Data/hora de abertura |
| closed_at | TIMESTAMP | Data/hora de fechamento |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Orders

Pedidos realizados (mesa ou delivery).

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do pedido |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| user_id | UUID | Referência ao usuário que registrou (FK) |
| table_id | UUID | Referência à mesa (FK, pode ser nulo para delivery) |
| session_id | UUID | Referência à sessão (FK, pode ser nulo para delivery) |
| type | ENUM | Tipo (table, delivery) |
| status | ENUM | Status (pending, preparing, ready, delivered, canceled) |
| customer_name | VARCHAR(100) | Nome do cliente (para delivery) |
| customer_phone | VARCHAR(20) | Telefone do cliente (para delivery) |
| customer_email | VARCHAR(100) | Email do cliente (para delivery) |
| address | JSONB | Endereço de entrega (para delivery) |
| subtotal | DECIMAL(10,2) | Valor subtotal |
| service_fee | DECIMAL(10,2) | Taxa de serviço |
| delivery_fee | DECIMAL(10,2) | Taxa de entrega (para delivery) |
| total | DECIMAL(10,2) | Valor total |
| payment_method | VARCHAR(20) | Método de pagamento |
| notes | TEXT | Observações gerais |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### OrderItems

Itens dos pedidos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do item |
| order_id | UUID | Referência ao pedido (FK) |
| product_id | UUID | Referência ao produto (FK) |
| name | VARCHAR(100) | Nome do produto (snapshot) |
| quantity | INTEGER | Quantidade |
| unit_price | DECIMAL(10,2) | Preço unitário |
| total_price | DECIMAL(10,2) | Preço total (quantidade * unitário) |
| notes | TEXT | Observações específicas do item |
| status | ENUM | Status (pending, preparing, ready, delivered, canceled) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### OrderStatus

Histórico de status dos pedidos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do registro |
| order_id | UUID | Referência ao pedido (FK) |
| status | ENUM | Status do pedido |
| notes | TEXT | Observações sobre a mudança de status |
| user_id | UUID | Referência ao usuário que alterou (FK) |
| created_at | TIMESTAMP | Data/hora da mudança de status |

### Bills

Contas para fechamento de mesa.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da conta |
| session_id | UUID | Referência à sessão da mesa (FK) |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| subtotal | DECIMAL(10,2) | Valor subtotal |
| service_fee | DECIMAL(10,2) | Taxa de serviço |
| total | DECIMAL(10,2) | Valor total |
| status | ENUM | Status (open, partially_paid, paid, closed) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### BillSplits

Divisões de conta.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da divisão |
| bill_id | UUID | Referência à conta (FK) |
| name | VARCHAR(50) | Nome/identificação da parte |
| amount | DECIMAL(10,2) | Valor da parte |
| paid | BOOLEAN | Status de pagamento |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Payments

Pagamentos realizados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do pagamento |
| bill_id | UUID | Referência à conta (FK) |
| split_id | UUID | Referência à divisão (FK, pode ser nulo) |
| method | VARCHAR(20) | Método de pagamento |
| amount | DECIMAL(10,2) | Valor pago |
| notes | TEXT | Observações sobre o pagamento |
| user_id | UUID | Referência ao usuário que registrou (FK) |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Invoices

Documentos fiscais emitidos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da nota fiscal |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| order_id | UUID | Referência ao pedido (FK) |
| fiscal_id | VARCHAR(50) | Número da nota fiscal |
| access_key | VARCHAR(50) | Chave de acesso |
| customer_name | VARCHAR(100) | Nome do cliente |
| customer_tax_id | VARCHAR(20) | CPF/CNPJ do cliente |
| total_amount | DECIMAL(10,2) | Valor total |
| issue_date | TIMESTAMP | Data de emissão |
| status | ENUM | Status (issued, canceled) |
| pdf_url | VARCHAR(255) | URL do PDF da nota |
| xml_url | VARCHAR(255) | URL do XML da nota |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Deliveries

Entregas de pedidos.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único da entrega |
| order_id | UUID | Referência ao pedido (FK) |
| courier_id | UUID | Referência ao entregador (FK) |
| status | ENUM | Status (pending, in_progress, delivered, canceled) |
| tracking_code | VARCHAR(20) | Código de rastreamento |
| estimated_time | INTEGER | Tempo estimado em minutos |
| started_at | TIMESTAMP | Data/hora de início da entrega |
| delivered_at | TIMESTAMP | Data/hora da entrega |
| notes | TEXT | Observações sobre a entrega |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Couriers

Entregadores cadastrados.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do entregador |
| restaurant_id | UUID | Referência ao restaurante (FK) |
| name | VARCHAR(100) | Nome completo |
| phone | VARCHAR(20) | Telefone de contato |
| email | VARCHAR(100) | Email |
| vehicle | VARCHAR(50) | Tipo de veículo |
| license_plate | VARCHAR(20) | Placa do veículo |
| active | BOOLEAN | Status de ativação |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

## Índices e Constraints

### Índices Primários

- Todas as tabelas têm um índice primário na coluna `id`

### Índices Secundários

- `users`: índice em `email` (único), `restaurant_id`, `role_id`
- `products`: índice em `restaurant_id`, `category_id`
- `categories`: índice em `restaurant_id`
- `tables`: índice em `restaurant_id`, `area_id`, `status`
- `orders`: índice em `restaurant_id`, `table_id`, `session_id`, `status`, `created_at`
- `order_items`: índice em `order_id`, `product_id`
- `table_sessions`: índice em `table_id`, `status`
- `bills`: índice em `session_id`, `status`
- `payments`: índice em `bill_id`, `split_id`
- `invoices`: índice em `restaurant_id`, `order_id`, `fiscal_id`
- `deliveries`: índice em `order_id`, `courier_id`, `status`

### Constraints de Chave Estrangeira

- `users.restaurant_id` → `restaurants.id`
- `users.role_id` → `roles.id`
- `categories.restaurant_id` → `restaurants.id`
- `products.restaurant_id` → `restaurants.id`
- `products.category_id` → `categories.id`
- `product_images.product_id` → `products.id`
- `areas.restaurant_id` → `restaurants.id`
- `tables.restaurant_id` → `restaurants.id`
- `tables.area_id` → `areas.id`
- `table_sessions.table_id` → `tables.id`
- `table_sessions.user_id` → `users.id`
- `orders.restaurant_id` → `restaurants.id`
- `orders.user_id` → `users.id`
- `orders.table_id` → `tables.id`
- `orders.session_id` → `table_sessions.id`
- `order_items.order_id` → `orders.id`
- `order_items.product_id` → `products.id`
- `order_status.order_id` → `orders.id`
- `order_status.user_id` → `users.id`
- `bills.session_id` → `table_sessions.id`
- `bills.restaurant_id` → `restaurants.id`
- `bill_splits.bill_id` → `bills.id`
- `payments.bill_id` → `bills.id`
- `payments.split_id` → `bill_splits.id`
- `payments.user_id` → `users.id`
- `invoices.restaurant_id` → `restaurants.id`
- `invoices.order_id` → `orders.id`
- `deliveries.order_id` → `orders.id`
- `deliveries.courier_id` → `couriers.id`
- `couriers.restaurant_id` → `restaurants.id`

## Considerações para o MVP

Para o MVP, implementaremos um subconjunto das entidades acima, focando nas funcionalidades essenciais:

1. **Autenticação e Usuários**: `restaurants`, `users`, `roles`
2. **Produtos e Categorias**: `categories`, `products`
3. **Mesas e Pedidos**: `areas`, `tables`, `table_sessions`, `orders`, `order_items`
4. **Contas**: Versão simplificada de `bills` e `payments`

As entidades mais complexas, como `bill_splits` (divisão detalhada), `invoices` (documentos fiscais) e o sistema completo de delivery, serão implementadas após o MVP.

## Estratégia de Migração

O esquema de banco de dados será versionado usando migrações, permitindo atualizações incrementais e rollbacks quando necessário. Cada migração será um arquivo SQL ou um script Prisma que representa uma alteração atômica no esquema.

Exemplo de migração inicial para o MVP:

```sql
-- Criação das tabelas principais para o MVP
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(255),
  address JSONB,
  phone VARCHAR(20),
  email VARCHAR(100),
  tax_id VARCHAR(20),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  description VARCHAR(255),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(email, restaurant_id)
);

-- Outras tabelas do MVP...
```

## Próximos Passos

1. Implementar o esquema inicial do MVP usando Prisma
2. Criar seed data para desenvolvimento e testes
3. Configurar backup e estratégias de recuperação
4. Implementar lógica de soft delete para registros importantes
5. Adicionar triggers para atualização automática de timestamps
