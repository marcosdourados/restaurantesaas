# Estrutura de APIs - Sistema SaaS para Restaurantes

## Visão Geral

Este documento define a estrutura de APIs do sistema SaaS para restaurantes, detalhando os endpoints disponíveis, métodos HTTP, parâmetros, respostas e autenticação. A API seguirá os princípios RESTful, com recursos bem definidos e operações padronizadas.

## Padrões da API

### Base URL

```
https://api.restaurantesaas.com/v1
```

### Autenticação

Todas as requisições (exceto login e registro) devem incluir um token JWT no cabeçalho de autorização:

```
Authorization: Bearer {token}
```

### Formato de Resposta

Todas as respostas seguirão o formato padrão:

```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso",
  "errors": null
}
```

Em caso de erro:

```json
{
  "success": false,
  "data": null,
  "message": "Erro ao processar requisição",
  "errors": [
    {
      "code": "INVALID_INPUT",
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

### Códigos de Status HTTP

- 200: Sucesso
- 201: Recurso criado
- 400: Requisição inválida
- 401: Não autorizado
- 403: Acesso proibido
- 404: Recurso não encontrado
- 422: Erro de validação
- 500: Erro interno do servidor

### Paginação

Endpoints que retornam listas suportam paginação através dos parâmetros:

- `page`: Número da página (começa em 1)
- `limit`: Itens por página (padrão: 20, máximo: 100)

Exemplo de resposta paginada:

```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 150,
      "page": 2,
      "limit": 20,
      "pages": 8
    }
  },
  "message": "Recursos listados com sucesso",
  "errors": null
}
```

### Filtragem e Ordenação

- Filtragem: `?filter[campo]=valor`
- Ordenação: `?sort=campo` ou `?sort=-campo` (descendente)

## Endpoints da API

### Autenticação e Usuários

#### Registro de Usuário

```
POST /auth/register
```

**Corpo da Requisição:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "senha123",
  "password_confirmation": "senha123",
  "restaurant_name": "Restaurante do João",
  "phone": "11999998888"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123456",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "created_at": "2025-04-04T15:30:00Z"
    },
    "restaurant": {
      "id": "rst_123456",
      "name": "Restaurante do João"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuário registrado com sucesso",
  "errors": null
}
```

#### Login

```
POST /auth/login
```

**Corpo da Requisição:**
```json
{
  "email": "joao@exemplo.com",
  "password": "senha123"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_123456",
      "name": "João Silva",
      "email": "joao@exemplo.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "restaurant": {
      "id": "rst_123456",
      "name": "Restaurante do João"
    }
  },
  "message": "Login realizado com sucesso",
  "errors": null
}
```

#### Renovação de Token

```
POST /auth/refresh
```

**Cabeçalhos:**
```
Authorization: Bearer {token_atual}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token renovado com sucesso",
  "errors": null
}
```

#### Obter Perfil do Usuário

```
GET /users/me
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123456",
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "role": "admin",
    "restaurant_id": "rst_123456",
    "created_at": "2025-04-04T15:30:00Z",
    "updated_at": "2025-04-04T15:30:00Z"
  },
  "message": "Perfil obtido com sucesso",
  "errors": null
}
```

#### Listar Usuários do Restaurante

```
GET /users
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "usr_123456",
        "name": "João Silva",
        "email": "joao@exemplo.com",
        "role": "admin",
        "created_at": "2025-04-04T15:30:00Z"
      },
      {
        "id": "usr_123457",
        "name": "Maria Souza",
        "email": "maria@exemplo.com",
        "role": "waiter",
        "created_at": "2025-04-04T16:30:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Usuários listados com sucesso",
  "errors": null
}
```

#### Criar Usuário

```
POST /users
```

**Corpo da Requisição:**
```json
{
  "name": "Pedro Santos",
  "email": "pedro@exemplo.com",
  "password": "senha123",
  "password_confirmation": "senha123",
  "role": "waiter"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "usr_123458",
    "name": "Pedro Santos",
    "email": "pedro@exemplo.com",
    "role": "waiter",
    "created_at": "2025-04-04T17:30:00Z"
  },
  "message": "Usuário criado com sucesso",
  "errors": null
}
```

### Restaurante e Configurações

#### Obter Informações do Restaurante

```
GET /restaurant
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "rst_123456",
    "name": "Restaurante do João",
    "logo_url": "https://storage.restaurantesaas.com/logos/rst_123456.png",
    "address": {
      "street": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567"
    },
    "phone": "11999998888",
    "email": "contato@restaurantedojoao.com.br",
    "tax_id": "12.345.678/0001-90",
    "settings": {
      "theme_color": "#FF5722",
      "currency": "BRL",
      "timezone": "America/Sao_Paulo"
    },
    "created_at": "2025-04-04T15:30:00Z",
    "updated_at": "2025-04-04T15:30:00Z"
  },
  "message": "Informações do restaurante obtidas com sucesso",
  "errors": null
}
```

#### Atualizar Informações do Restaurante

```
PUT /restaurant
```

**Corpo da Requisição:**
```json
{
  "name": "Restaurante do João - Matriz",
  "address": {
    "street": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
  },
  "phone": "11999998888",
  "email": "contato@restaurantedojoao.com.br",
  "tax_id": "12.345.678/0001-90",
  "settings": {
    "theme_color": "#4CAF50",
    "currency": "BRL",
    "timezone": "America/Sao_Paulo"
  }
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "rst_123456",
    "name": "Restaurante do João - Matriz",
    "updated_at": "2025-04-04T18:30:00Z"
  },
  "message": "Restaurante atualizado com sucesso",
  "errors": null
}
```

### Produtos e Categorias

#### Listar Categorias

```
GET /categories
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cat_123456",
        "name": "Entradas",
        "description": "Pratos para começar sua refeição",
        "image_url": "https://storage.restaurantesaas.com/categories/cat_123456.png",
        "order": 1,
        "created_at": "2025-04-04T15:30:00Z"
      },
      {
        "id": "cat_123457",
        "name": "Pratos Principais",
        "description": "Nossos principais pratos",
        "image_url": "https://storage.restaurantesaas.com/categories/cat_123457.png",
        "order": 2,
        "created_at": "2025-04-04T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 5,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Categorias listadas com sucesso",
  "errors": null
}
```

#### Criar Categoria

```
POST /categories
```

**Corpo da Requisição:**
```json
{
  "name": "Sobremesas",
  "description": "Opções para finalizar sua refeição",
  "order": 3
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "cat_123458",
    "name": "Sobremesas",
    "description": "Opções para finalizar sua refeição",
    "image_url": null,
    "order": 3,
    "created_at": "2025-04-04T19:30:00Z"
  },
  "message": "Categoria criada com sucesso",
  "errors": null
}
```

#### Listar Produtos

```
GET /products
```

**Parâmetros de Consulta:**
- `?category_id=cat_123456` (opcional)
- `?filter[name]=arroz` (opcional)
- `?sort=price` (opcional)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prd_123456",
        "name": "Risoto de Funghi",
        "description": "Risoto cremoso com mix de cogumelos",
        "price": 45.90,
        "image_url": "https://storage.restaurantesaas.com/products/prd_123456.png",
        "category_id": "cat_123457",
        "category_name": "Pratos Principais",
        "available": true,
        "created_at": "2025-04-04T15:30:00Z"
      },
      {
        "id": "prd_123457",
        "name": "Filé ao Molho Madeira",
        "description": "Filé mignon grelhado com molho madeira e batatas",
        "price": 59.90,
        "image_url": "https://storage.restaurantesaas.com/products/prd_123457.png",
        "category_id": "cat_123457",
        "category_name": "Pratos Principais",
        "available": true,
        "created_at": "2025-04-04T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "pages": 2
    }
  },
  "message": "Produtos listados com sucesso",
  "errors": null
}
```

#### Criar Produto

```
POST /products
```

**Corpo da Requisição:**
```json
{
  "name": "Pudim de Leite",
  "description": "Pudim tradicional com calda de caramelo",
  "price": 15.90,
  "category_id": "cat_123458",
  "available": true
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "prd_123458",
    "name": "Pudim de Leite",
    "description": "Pudim tradicional com calda de caramelo",
    "price": 15.90,
    "image_url": null,
    "category_id": "cat_123458",
    "category_name": "Sobremesas",
    "available": true,
    "created_at": "2025-04-04T19:45:00Z"
  },
  "message": "Produto criado com sucesso",
  "errors": null
}
```

### Mesas e Áreas

#### Listar Áreas

```
GET /areas
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "are_123456",
        "name": "Salão Principal",
        "description": "Área interna climatizada",
        "created_at": "2025-04-04T15:30:00Z"
      },
      {
        "id": "are_123457",
        "name": "Varanda",
        "description": "Área externa coberta",
        "created_at": "2025-04-04T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Áreas listadas com sucesso",
  "errors": null
}
```

#### Criar Área

```
POST /areas
```

**Corpo da Requisição:**
```json
{
  "name": "Mezanino",
  "description": "Área elevada com vista para o salão"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "are_123458",
    "name": "Mezanino",
    "description": "Área elevada com vista para o salão",
    "created_at": "2025-04-04T20:00:00Z"
  },
  "message": "Área criada com sucesso",
  "errors": null
}
```

#### Listar Mesas

```
GET /tables
```

**Parâmetros de Consulta:**
- `?area_id=are_123456` (opcional)
- `?status=occupied` (opcional: occupied, available, reserved)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "tbl_123456",
        "number": "01",
        "seats": 4,
        "area_id": "are_123456",
        "area_name": "Salão Principal",
        "status": "available",
        "qr_code_url": "https://storage.restaurantesaas.com/qrcodes/tbl_123456.png",
        "created_at": "2025-04-04T15:30:00Z"
      },
      {
        "id": "tbl_123457",
        "number": "02",
        "seats": 2,
        "area_id": "are_123456",
        "area_name": "Salão Principal",
        "status": "occupied",
        "qr_code_url": "https://storage.restaurantesaas.com/qrcodes/tbl_123457.png",
        "created_at": "2025-04-04T15:30:00Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Mesas listadas com sucesso",
  "errors": null
}
```

#### Criar Mesa

```
POST /tables
```

**Corpo da Requisição:**
```json
{
  "number": "03",
  "seats": 6,
  "area_id": "are_123456"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "tbl_123458",
    "number": "03",
    "seats": 6,
    "area_id": "are_123456",
    "area_name": "Salão Principal",
    "status": "available",
    "qr_code_url": "https://storage.restaurantesaas.com/qrcodes/tbl_123458.png",
    "created_at": "2025-04-04T20:15:00Z"
  },
  "message": "Mesa criada com sucesso",
  "errors": null
}
```

#### Abrir Mesa

```
POST /tables/{table_id}/open
```

**Corpo da Requisição:**
```json
{
  "customer_name": "Carlos Oliveira",
  "people_count": 3
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "table_id": "tbl_123456",
    "table_number": "01",
    "status": "occupied",
    "session_id": "ses_123456",
    "customer_name": "Carlos Oliveira",
    "people_count": 3,
    "opened_at": "2025-04-04T20:30:00Z",
    "waiter": {
      "id": "usr_123457",
      "name": "Maria Souza"
    }
  },
  "message": "Mesa aberta com sucesso",
  "errors": null
}
```

#### Transferir Mesa

```
POST /tables/{table_id}/transfer
```

**Corpo da Requisição:**
```json
{
  "target_table_id": "tbl_123458"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "source_table_id": "tbl_123456",
    "source_table_number": "01",
    "source_table_status": "available",
    "target_table_id": "tbl_123458",
    "target_table_number": "03",
    "target_table_status": "occupied",
    "session_id": "ses_123456"
  },
  "message": "Mesa transferida com sucesso",
  "errors": null
}
```

### Pedidos

#### Criar Pedido (Mesa)

```
POST /orders/table
```

**Corpo da Requisição:**
```json
{
  "table_id": "tbl_123458",
  "items": [
    {
      "product_id": "prd_123456",
      "quantity": 2,
      "notes": "Sem cebola"
    },
    {
      "product_id": "prd_123457",
      "quantity": 1,
      "notes": "Ao ponto"
    }
  ]
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "ord_123456",
    "table_id": "tbl_123458",
    "table_number": "03",
    "session_id": "ses_123456",
    "status": "pending",
    "items": [
      {
        "id": "itm_123456",
        "product_id": "prd_123456",
        "product_name": "Risoto de Funghi",
        "quantity": 2,
        "unit_price": 45.90,
        "total_price": 91.80,
        "notes": "Sem cebola",
        "status": "pending"
      },
      {
        "id": "itm_123457",
        "product_id": "prd_123457",
        "product_name": "Filé ao Molho Madeira",
        "quantity": 1,
        "unit_price": 59.90,
        "total_price": 59.90,
        "notes": "Ao ponto",
        "status": "pending"
      }
    ],
    "subtotal": 151.70,
    "created_at": "2025-04-04T20:45:00Z",
    "created_by": {
      "id": "usr_123457",
      "name": "Maria Souza"
    }
  },
  "message": "Pedido criado com sucesso",
  "errors": null
}
```

#### Criar Pedido (Delivery)

```
POST /orders/delivery
```

**Corpo da Requisição:**
```json
{
  "customer": {
    "name": "Ana Silva",
    "phone": "11987654321",
    "email": "ana@exemplo.com"
  },
  "address": {
    "street": "Av. Paulista, 1000",
    "number": "Apto 50",
    "neighborhood": "Bela Vista",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01310-100"
  },
  "items": [
    {
      "product_id": "prd_123456",
      "quantity": 1,
      "notes": ""
    },
    {
      "product_id": "prd_123458",
      "quantity": 2,
      "notes": ""
    }
  ],
  "payment_method": "credit_card",
  "delivery_fee": 10.00,
  "notes": "Tocar o interfone 5002"
}
```

**Resposta (201):**
```json
{
  "success": true,
  "data": {
    "id": "ord_123457",
    "type": "delivery",
    "status": "pending",
    "customer": {
      "name": "Ana Silva",
      "phone": "11987654321",
      "email": "ana@exemplo.com"
    },
    "address": {
      "street": "Av. Paulista, 1000",
      "number": "Apto 50",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01310-100"
    },
    "items": [
      {
        "id": "itm_123458",
        "product_id": "prd_123456",
        "product_name": "Risoto de Funghi",
        "quantity": 1,
        "unit_price": 45.90,
        "total_price": 45.90,
        "notes": "",
        "status": "pending"
      },
      {
        "id": "itm_123459",
        "product_id": "prd_123458",
        "product_name": "Pudim de Leite",
        "quantity": 2,
        "unit_price": 15.90,
        "total_price": 31.80,
        "notes": "",
        "status": "pending"
      }
    ],
    "subtotal": 77.70,
    "delivery_fee": 10.00,
    "total": 87.70,
    "payment_method": "credit_card",
    "notes": "Tocar o interfone 5002",
    "tracking_code": "DEL123457",
    "tracking_url": "https://app.restaurantesaas.com/tracking/DEL123457",
    "created_at": "2025-04-04T21:00:00Z"
  },
  "message": "Pedido de delivery criado com sucesso",
  "errors": null
}
```

#### Listar Pedidos

```
GET /orders
```

**Parâmetros de Consulta:**
- `?type=table` (opcional: table, delivery)
- `?status=pending` (opcional: pending, preparing, ready, delivered, canceled)
- `?table_id=tbl_123458` (opcional)
- `?date_start=2025-04-04&date_end=2025-04-04` (opcional)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ord_123456",
        "type": "table",
        "table_number": "03",
        "customer_name": "Carlos Oliveira",
        "status": "pending",
        "items_count": 3,
        "total": 151.70,
        "created_at": "2025-04-04T20:45:00Z"
      },
      {
        "id": "ord_123457",
        "type": "delivery",
        "customer_name": "Ana Silva",
        "status": "pending",
        "items_count": 2,
        "total": 87.70,
        "created_at": "2025-04-04T21:00:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Pedidos listados com sucesso",
  "errors": null
}
```

#### Obter Detalhes do Pedido

```
GET /orders/{order_id}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "ord_123456",
    "type": "table",
    "table_id": "tbl_123458",
    "table_number": "03",
    "session_id": "ses_123456",
    "customer_name": "Carlos Oliveira",
    "status": "pending",
    "items": [
      {
        "id": "itm_123456",
        "product_id": "prd_123456",
        "product_name": "Risoto de Funghi",
        "quantity": 2,
        "unit_price": 45.90,
        "total_price": 91.80,
        "notes": "Sem cebola",
        "status": "pending"
      },
      {
        "id": "itm_123457",
        "product_id": "prd_123457",
        "product_name": "Filé ao Molho Madeira",
        "quantity": 1,
        "unit_price": 59.90,
        "total_price": 59.90,
        "notes": "Ao ponto",
        "status": "pending"
      }
    ],
    "subtotal": 151.70,
    "service_fee": 15.17,
    "total": 166.87,
    "created_at": "2025-04-04T20:45:00Z",
    "updated_at": "2025-04-04T20:45:00Z",
    "created_by": {
      "id": "usr_123457",
      "name": "Maria Souza"
    },
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2025-04-04T20:45:00Z",
        "user_name": "Maria Souza"
      }
    ]
  },
  "message": "Detalhes do pedido obtidos com sucesso",
  "errors": null
}
```

#### Atualizar Status do Pedido

```
PUT /orders/{order_id}/status
```

**Corpo da Requisição:**
```json
{
  "status": "preparing",
  "notes": "Iniciando preparo na cozinha"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "id": "ord_123456",
    "status": "preparing",
    "updated_at": "2025-04-04T21:15:00Z",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2025-04-04T20:45:00Z",
        "user_name": "Maria Souza"
      },
      {
        "status": "preparing",
        "timestamp": "2025-04-04T21:15:00Z",
        "user_name": "Pedro Santos",
        "notes": "Iniciando preparo na cozinha"
      }
    ]
  },
  "message": "Status do pedido atualizado com sucesso",
  "errors": null
}
```

### Contas e Pagamentos

#### Obter Conta da Mesa

```
GET /tables/{table_id}/bill
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "table_id": "tbl_123458",
    "table_number": "03",
    "session_id": "ses_123456",
    "customer_name": "Carlos Oliveira",
    "opened_at": "2025-04-04T20:30:00Z",
    "orders": [
      {
        "id": "ord_123456",
        "created_at": "2025-04-04T20:45:00Z",
        "items": [
          {
            "id": "itm_123456",
            "product_name": "Risoto de Funghi",
            "quantity": 2,
            "unit_price": 45.90,
            "total_price": 91.80
          },
          {
            "id": "itm_123457",
            "product_name": "Filé ao Molho Madeira",
            "quantity": 1,
            "unit_price": 59.90,
            "total_price": 59.90
          }
        ]
      }
    ],
    "subtotal": 151.70,
    "service_fee": 15.17,
    "total": 166.87,
    "splits": [],
    "payments": []
  },
  "message": "Conta obtida com sucesso",
  "errors": null
}
```

#### Dividir Conta

```
POST /tables/{table_id}/bill/split
```

**Corpo da Requisição:**
```json
{
  "split_type": "equal",
  "parts": 3
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "table_id": "tbl_123458",
    "table_number": "03",
    "session_id": "ses_123456",
    "split_type": "equal",
    "parts": 3,
    "splits": [
      {
        "id": "spl_123456",
        "name": "Parte 1",
        "amount": 55.62,
        "paid": false
      },
      {
        "id": "spl_123457",
        "name": "Parte 2",
        "amount": 55.62,
        "paid": false
      },
      {
        "id": "spl_123458",
        "name": "Parte 3",
        "amount": 55.63,
        "paid": false
      }
    ],
    "total": 166.87
  },
  "message": "Conta dividida com sucesso",
  "errors": null
}
```

#### Registrar Pagamento

```
POST /tables/{table_id}/bill/payment
```

**Corpo da Requisição:**
```json
{
  "split_id": "spl_123456",
  "payment_method": "credit_card",
  "amount": 55.62,
  "notes": "Cartão final 1234"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_123456",
    "split_id": "spl_123456",
    "payment_method": "credit_card",
    "amount": 55.62,
    "paid_at": "2025-04-04T22:00:00Z",
    "received_by": {
      "id": "usr_123457",
      "name": "Maria Souza"
    },
    "remaining_balance": 111.25
  },
  "message": "Pagamento registrado com sucesso",
  "errors": null
}
```

#### Fechar Mesa

```
POST /tables/{table_id}/close
```

**Corpo da Requisição:**
```json
{
  "force_close": false
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "table_id": "tbl_123458",
    "table_number": "03",
    "session_id": "ses_123456",
    "status": "available",
    "closed_at": "2025-04-04T22:15:00Z",
    "total_amount": 166.87,
    "total_paid": 166.87,
    "invoice_id": "inv_123456",
    "invoice_url": "https://storage.restaurantesaas.com/invoices/inv_123456.pdf"
  },
  "message": "Mesa fechada com sucesso",
  "errors": null
}
```

### Fiscal

#### Emitir Nota Fiscal

```
POST /fiscal/invoice
```

**Corpo da Requisição:**
```json
{
  "order_id": "ord_123456",
  "customer": {
    "name": "Carlos Oliveira",
    "tax_id": "123.456.789-00",
    "email": "carlos@exemplo.com"
  },
  "payment_method": "credit_card"
}
```

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "invoice_id": "inv_123456",
    "fiscal_id": "12345678901234567890",
    "access_key": "12345678901234567890123456789012345678901234",
    "issue_date": "2025-04-04T22:20:00Z",
    "total_amount": 166.87,
    "status": "issued",
    "pdf_url": "https://storage.restaurantesaas.com/invoices/inv_123456.pdf",
    "xml_url": "https://storage.restaurantesaas.com/invoices/inv_123456.xml"
  },
  "message": "Nota fiscal emitida com sucesso",
  "errors": null
}
```

#### Listar Notas Fiscais

```
GET /fiscal/invoices
```

**Parâmetros de Consulta:**
- `?date_start=2025-04-01&date_end=2025-04-04` (opcional)
- `?status=issued` (opcional: issued, canceled)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "invoice_id": "inv_123456",
        "fiscal_id": "12345678901234567890",
        "order_id": "ord_123456",
        "customer_name": "Carlos Oliveira",
        "total_amount": 166.87,
        "issue_date": "2025-04-04T22:20:00Z",
        "status": "issued"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "pages": 1
    }
  },
  "message": "Notas fiscais listadas com sucesso",
  "errors": null
}
```

### Relatórios

#### Relatório de Vendas

```
GET /reports/sales
```

**Parâmetros de Consulta:**
- `?date_start=2025-04-01&date_end=2025-04-04` (obrigatório)
- `?group_by=day` (opcional: day, week, month)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-04-01",
      "end": "2025-04-04"
    },
    "total_sales": 1250.75,
    "total_orders": 15,
    "average_ticket": 83.38,
    "by_period": [
      {
        "date": "2025-04-01",
        "sales": 320.50,
        "orders": 4
      },
      {
        "date": "2025-04-02",
        "sales": 275.80,
        "orders": 3
      },
      {
        "date": "2025-04-03",
        "sales": 398.70,
        "orders": 5
      },
      {
        "date": "2025-04-04",
        "sales": 255.75,
        "orders": 3
      }
    ],
    "by_payment_method": [
      {
        "method": "credit_card",
        "amount": 750.45,
        "percentage": 60
      },
      {
        "method": "debit_card",
        "amount": 312.68,
        "percentage": 25
      },
      {
        "method": "cash",
        "amount": 187.62,
        "percentage": 15
      }
    ],
    "by_type": [
      {
        "type": "table",
        "amount": 875.52,
        "percentage": 70
      },
      {
        "type": "delivery",
        "amount": 375.23,
        "percentage": 30
      }
    ]
  },
  "message": "Relatório de vendas gerado com sucesso",
  "errors": null
}
```

#### Relatório de Produtos

```
GET /reports/products
```

**Parâmetros de Consulta:**
- `?date_start=2025-04-01&date_end=2025-04-04` (obrigatório)
- `?limit=10` (opcional, padrão: 20)

**Resposta (200):**
```json
{
  "success": true,
  "data": {
    "period": {
      "start": "2025-04-01",
      "end": "2025-04-04"
    },
    "top_products": [
      {
        "product_id": "prd_123457",
        "product_name": "Filé ao Molho Madeira",
        "quantity_sold": 25,
        "total_sales": 1497.50,
        "percentage": 18
      },
      {
        "product_id": "prd_123456",
        "product_name": "Risoto de Funghi",
        "quantity_sold": 22,
        "total_sales": 1009.80,
        "percentage": 15
      }
    ],
    "by_category": [
      {
        "category_id": "cat_123457",
        "category_name": "Pratos Principais",
        "quantity_sold": 78,
        "total_sales": 4250.30,
        "percentage": 65
      },
      {
        "category_id": "cat_123456",
        "category_name": "Entradas",
        "quantity_sold": 45,
        "total_sales": 1350.75,
        "percentage": 20
      },
      {
        "category_id": "cat_123458",
        "category_name": "Sobremesas",
        "quantity_sold": 30,
        "total_sales": 950.40,
        "percentage": 15
      }
    ]
  },
  "message": "Relatório de produtos gerado com sucesso",
  "errors": null
}
```

## Considerações para o MVP

Para o MVP, implementaremos um subconjunto dos endpoints acima, focando nas funcionalidades essenciais:

1. **Autenticação**: Login, registro e perfil de usuário
2. **Produtos e Categorias**: CRUD completo
3. **Mesas**: Gerenciamento básico e abertura/fechamento
4. **Pedidos**: Criação e listagem
5. **Contas**: Visualização e fechamento simples

Os endpoints mais complexos, como divisão de conta detalhada, relatórios avançados e integração fiscal completa, serão implementados após o MVP.

## Próximos Passos

1. Implementar documentação interativa com Swagger/OpenAPI
2. Desenvolver SDKs para facilitar a integração
3. Adicionar suporte a webhooks para notificações em tempo real
4. Expandir endpoints para funcionalidades avançadas
