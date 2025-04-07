// Arquivo de migração inicial para o banco de dados
// Este arquivo será executado para criar as tabelas iniciais do sistema

-- Criação das tabelas principais

-- Restaurantes
CREATE TABLE "restaurants" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "logo_url" TEXT,
  "address" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "tax_id" TEXT,
  "settings" TEXT DEFAULT '{}',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Papéis de usuário
CREATE TABLE "roles" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "permissions" TEXT DEFAULT '{}',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Usuários
CREATE TABLE "users" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "role_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "last_login" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE,
  FOREIGN KEY ("role_id") REFERENCES "roles"("id"),
  UNIQUE ("email", "restaurant_id")
);

-- Categorias de produtos
CREATE TABLE "categories" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "image_url" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE
);

-- Produtos
CREATE TABLE "products" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "category_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" REAL NOT NULL,
  "cost" REAL,
  "image_url" TEXT,
  "available" BOOLEAN NOT NULL DEFAULT true,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE,
  FOREIGN KEY ("category_id") REFERENCES "categories"("id")
);

-- Imagens adicionais de produtos
CREATE TABLE "product_images" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "product_id" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE
);

-- Áreas do estabelecimento
CREATE TABLE "areas" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE
);

-- Mesas
CREATE TABLE "tables" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "area_id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "seats" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'available',
  "qr_code_url" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE,
  FOREIGN KEY ("area_id") REFERENCES "areas"("id")
);

-- Sessões de mesa
CREATE TABLE "table_sessions" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "table_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "customer_name" TEXT,
  "people_count" INTEGER,
  "status" TEXT NOT NULL DEFAULT 'open',
  "opened_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "closed_at" DATETIME,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("table_id") REFERENCES "tables"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Pedidos
CREATE TABLE "orders" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "restaurant_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "table_id" TEXT,
  "session_id" TEXT,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "customer_name" TEXT,
  "customer_phone" TEXT,
  "customer_email" TEXT,
  "address" TEXT,
  "subtotal" REAL NOT NULL,
  "service_fee" REAL,
  "delivery_fee" REAL,
  "total" REAL NOT NULL,
  "payment_method" TEXT,
  "notes" TEXT,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("id"),
  FOREIGN KEY ("table_id") REFERENCES "tables"("id"),
  FOREIGN KEY ("session_id") REFERENCES "table_sessions"("id")
);

-- Itens de pedido
CREATE TABLE "order_items" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "order_id" TEXT NOT NULL,
  "product_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" REAL NOT NULL,
  "total_price" REAL NOT NULL,
  "notes" TEXT,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
  FOREIGN KEY ("product_id") REFERENCES "products"("id")
);

-- Histórico de status de pedido
CREATE TABLE "order_status" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "order_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "notes" TEXT,
  "user_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE,
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Contas
CREATE TABLE "bills" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "session_id" TEXT NOT NULL,
  "restaurant_id" TEXT NOT NULL,
  "subtotal" REAL NOT NULL,
  "service_fee" REAL NOT NULL,
  "total" REAL NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'open',
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("session_id") REFERENCES "table_sessions"("id"),
  FOREIGN KEY ("restaurant_id") REFERENCES "restaurants"("id") ON DELETE CASCADE
);

-- Divisões de conta
CREATE TABLE "bill_splits" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "bill_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "paid" BOOLEAN NOT NULL DEFAULT false,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE CASCADE
);

-- Pagamentos
CREATE TABLE "payments" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "bill_id" TEXT NOT NULL,
  "split_id" TEXT,
  "method" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "notes" TEXT,
  "user_id" TEXT NOT NULL,
  "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("bill_id") REFERENCES "bills"("id") ON DELETE CASCADE,
  FOREIGN KEY ("split_id") REFERENCES "bill_splits"("id"),
  FOREIGN KEY ("user_id") REFERENCES "users"("id")
);

-- Inserção de dados iniciais

-- Papéis padrão
INSERT INTO "roles" ("id", "name", "description", "permissions") VALUES
('role_admin', 'Administrador', 'Acesso completo ao sistema', '{"all": true}'),
('role_manager', 'Gerente', 'Gerenciamento do estabelecimento', '{"dashboard": true, "reports": true, "products": true, "users": true, "tables": true, "orders": true}'),
('role_waiter', 'Garçom', 'Atendimento às mesas', '{"tables": true, "orders": true}'),
('role_kitchen', 'Cozinha', 'Visualização e atualização de pedidos', '{"orders": true}'),
('role_cashier', 'Caixa', 'Fechamento de contas e pagamentos', '{"tables": true, "orders": true, "bills": true}'),
('role_delivery', 'Entregador', 'Entregas de pedidos', '{"delivery": true}');
