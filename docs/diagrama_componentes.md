# Diagrama de Componentes - Sistema SaaS para Restaurantes

## Visão Geral

Este documento apresenta o diagrama detalhado de componentes para o sistema SaaS de restaurantes, mostrando a estrutura interna de cada módulo e as relações entre eles. O diagrama segue a arquitetura definida no documento de arquitetura geral, mas com maior detalhamento dos componentes internos.

## Diagrama de Componentes

```
+----------------------------------------------------------------------+
|                           FRONTEND                                   |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Aplicação Web        |        |   Aplicação Mobile (PWA)  |     |
|  |   (Next.js)            |        |   (Garçons)               |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Módulo de Admin  |  |        |  | Módulo de Pedidos |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Módulo de Salão  |  |        |  | Módulo de Mesas   |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Módulo de Delivery|  |        |  | Módulo de Status  |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |                           |     |
|  |  | Módulo de Cozinha |  |        |                           |     |
|  |  +------------------+  |        |                           |     |
|  +------------------------+        +---------------------------+     |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Componentes Comuns   |        |   Gerenciamento de Estado |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | UI Components    |  |        |  | Context API       |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Layout Components|  |        |  | React Query       |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Form Components  |  |        |  | Zustand           |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  +------------------------+        +---------------------------+     |
+----------------------------------------------------------------------+
                              |
                              | HTTP/WebSockets
                              |
+----------------------------------------------------------------------+
|                           BACKEND                                    |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   API Gateway          |        |   Serviços de Autenticação|     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Roteamento       |  |        |  | Login/Registro    |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Rate Limiting    |  |        |  | Gerenciamento     |    |     |
|  |  +------------------+  |        |  | de Usuários       |    |     |
|  |                        |        |  +-------------------+    |     |
|  |  +------------------+  |        |                           |     |
|  |  | Logging/Monitoring|  |        |  +-------------------+    |     |
|  |  +------------------+  |        |  | Controle de Acesso |    |     |
|  +------------------------+        +---------------------------+     |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Serviço de Salão     |        |   Serviço de Delivery     |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Gerenciamento    |  |        |  | Gerenciamento     |    |     |
|  |  | de Mesas         |  |        |  | de Pedidos        |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Gerenciamento    |  |        |  | Gerenciamento     |    |     |
|  |  | de Pedidos       |  |        |  | de Entregadores   |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Divisão de Conta |  |        |  | Rastreamento      |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  +------------------------+        +---------------------------+     |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Serviço Fiscal       |        |   Serviço de Administração|     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Emissão de NFC-e |  |        |  | Relatórios        |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Integração SAT   |  |        |  | Gerenciamento     |    |     |
|  |  +------------------+  |        |  | de Produtos       |    |     |
|  |                        |        |  +-------------------+    |     |
|  |  +------------------+  |        |                           |     |
|  |  | Geração de DANFE |  |        |  +-------------------+    |     |
|  |  +------------------+  |        |  | Controle de Caixa |    |     |
|  +------------------------+        +---------------------------+     |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Serviços de Suporte  |        |   Camada de Acesso a Dados|     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Notificações     |  |        |  | Repositórios      |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Agendamento      |  |        |  | ORM (Prisma)      |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Mensageria       |  |        |  | Migrations        |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  +------------------------+        +---------------------------+     |
+----------------------------------------------------------------------+
                              |
                              | Persistência
                              |
+----------------------------------------------------------------------+
|                           DADOS                                      |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   PostgreSQL           |        |   Armazenamento de Arquivos|     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Esquema Auth     |  |        |  | Imagens           |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Esquema Restaurant|  |        |  | Documentos        |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Esquema Orders   |  |        |  | Relatórios        |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |                           |     |
|  |  | Esquema Delivery |  |        |                           |     |
|  |  +------------------+  |        |                           |     |
|  +------------------------+        +---------------------------+     |
|                                                                      |
|  +------------------------+        +---------------------------+     |
|  |   Redis                |        |   Logs e Monitoramento    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Cache            |  |        |  | Logs de Aplicação |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Sessões          |  |        |  | Métricas          |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |                        |        |                           |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  |  | Filas            |  |        |  | Alertas           |    |     |
|  |  +------------------+  |        |  +-------------------+    |     |
|  +------------------------+        +---------------------------+     |
+----------------------------------------------------------------------+
```

## Detalhamento dos Componentes

### Frontend

#### Aplicação Web (Next.js)

1. **Módulo de Admin**
   - Dashboard administrativo
   - Gerenciamento de produtos e categorias
   - Relatórios e análises
   - Configurações do estabelecimento

2. **Módulo de Salão**
   - Visualização de mesas
   - Cardápio digital
   - Gerenciamento de pedidos
   - Divisão de conta

3. **Módulo de Delivery**
   - Cadastro de pedidos
   - Acompanhamento de entregas
   - Gerenciamento de entregadores
   - Histórico de pedidos

4. **Módulo de Cozinha**
   - Fila de pedidos
   - Atualização de status
   - Histórico de produção
   - Notificações

#### Aplicação Mobile (PWA para Garçons)

1. **Módulo de Pedidos**
   - Registro de pedidos
   - Adição de observações
   - Modificação de itens
   - Envio para cozinha

2. **Módulo de Mesas**
   - Visualização de mesas disponíveis
   - Abertura de comandas
   - Transferência de mesas
   - Fechamento de mesas

3. **Módulo de Status**
   - Acompanhamento de pedidos
   - Notificações de pedidos prontos
   - Histórico de atendimentos

#### Componentes Comuns

1. **UI Components**
   - Botões, inputs, cards
   - Modais e drawers
   - Tabelas e listas
   - Elementos de navegação

2. **Layout Components**
   - Headers e footers
   - Sidebars e menus
   - Grids e containers
   - Responsividade

3. **Form Components**
   - Validação de formulários
   - Campos customizados
   - Máscaras de entrada
   - Upload de arquivos

#### Gerenciamento de Estado

1. **Context API**
   - Estado global da aplicação
   - Temas e preferências
   - Autenticação e usuário atual

2. **React Query**
   - Gerenciamento de dados remotos
   - Cache e invalidação
   - Mutações e atualizações otimistas

3. **Zustand**
   - Estado local complexo
   - Persistência de estado
   - Ações e seletores

### Backend

#### API Gateway

1. **Roteamento**
   - Direcionamento de requisições
   - Versionamento de API
   - Proxy reverso

2. **Rate Limiting**
   - Controle de requisições por IP
   - Limites por usuário
   - Proteção contra abusos

3. **Logging/Monitoring**
   - Registro de requisições
   - Métricas de performance
   - Alertas de erros

#### Serviços de Autenticação

1. **Login/Registro**
   - Autenticação de usuários
   - Registro de novos usuários
   - Recuperação de senha

2. **Gerenciamento de Usuários**
   - CRUD de usuários
   - Perfis e informações
   - Histórico de atividades

3. **Controle de Acesso**
   - Definição de papéis e permissões
   - Verificação de autorização
   - Políticas de acesso

#### Serviço de Salão

1. **Gerenciamento de Mesas**
   - CRUD de mesas
   - Status de ocupação
   - Agrupamento por áreas

2. **Gerenciamento de Pedidos**
   - Criação e modificação de pedidos
   - Envio para cozinha
   - Acompanhamento de status

3. **Divisão de Conta**
   - Cálculo de divisões
   - Pagamentos parciais
   - Fechamento de conta

#### Serviço de Delivery

1. **Gerenciamento de Pedidos**
   - Registro de pedidos para entrega
   - Cálculo de taxas e tempos
   - Status de preparação

2. **Gerenciamento de Entregadores**
   - Cadastro de entregadores
   - Atribuição de entregas
   - Histórico de entregas

3. **Rastreamento**
   - Atualização de status
   - Geração de links de acompanhamento
   - Notificações automáticas

#### Serviço Fiscal

1. **Emissão de NFC-e**
   - Geração de notas fiscais
   - Comunicação com SEFAZ
   - Armazenamento de documentos

2. **Integração SAT**
   - Comunicação com equipamento SAT
   - Emissão de cupons fiscais
   - Tratamento de erros

3. **Geração de DANFE**
   - Criação de PDFs
   - Envio por email
   - Armazenamento de documentos

#### Serviço de Administração

1. **Relatórios**
   - Vendas por período
   - Produtos mais vendidos
   - Desempenho de entregadores
   - Análise financeira

2. **Gerenciamento de Produtos**
   - CRUD de produtos e categorias
   - Precificação e disponibilidade
   - Imagens e descrições

3. **Controle de Caixa**
   - Abertura e fechamento
   - Sangrias e suprimentos
   - Conciliação financeira

#### Serviços de Suporte

1. **Notificações**
   - Envio de notificações em tempo real
   - Integração com WhatsApp
   - Notificações push

2. **Agendamento**
   - Tarefas periódicas
   - Relatórios automáticos
   - Manutenção do sistema

3. **Mensageria**
   - Comunicação assíncrona entre serviços
   - Filas de processamento
   - Eventos do sistema

#### Camada de Acesso a Dados

1. **Repositórios**
   - Abstração de acesso a dados
   - Implementação de padrões
   - Lógica de negócios

2. **ORM (Prisma)**
   - Mapeamento objeto-relacional
   - Consultas tipadas
   - Transações

3. **Migrations**
   - Versionamento de esquema
   - Atualizações de banco de dados
   - Scripts de seed

### Dados

#### PostgreSQL

1. **Esquema Auth**
   - Usuários
   - Papéis e permissões
   - Tokens e sessões

2. **Esquema Restaurant**
   - Estabelecimentos
   - Configurações
   - Produtos e categorias
   - Mesas e áreas

3. **Esquema Orders**
   - Pedidos
   - Itens de pedido
   - Pagamentos
   - Histórico de status

4. **Esquema Delivery**
   - Entregas
   - Entregadores
   - Endereços
   - Rotas

#### Armazenamento de Arquivos

1. **Imagens**
   - Fotos de produtos
   - Logos de estabelecimentos
   - Imagens de perfil

2. **Documentos**
   - Notas fiscais
   - Recibos
   - Contratos

3. **Relatórios**
   - Exportações em PDF
   - Planilhas Excel
   - Backups

#### Redis

1. **Cache**
   - Dados frequentemente acessados
   - Resultados de consultas
   - Configurações

2. **Sessões**
   - Informações de sessão
   - Tokens temporários
   - Estado de autenticação

3. **Filas**
   - Filas de processamento
   - Tarefas em background
   - Comunicação entre serviços

#### Logs e Monitoramento

1. **Logs de Aplicação**
   - Registros de atividades
   - Erros e exceções
   - Auditoria de ações

2. **Métricas**
   - Performance do sistema
   - Utilização de recursos
   - Tempos de resposta

3. **Alertas**
   - Notificações de problemas
   - Thresholds de performance
   - Monitoramento proativo

## Interações entre Componentes

### Fluxo de Pedido no Salão

1. Cliente faz pedido via tablet → Módulo de Salão (Frontend)
2. Pedido é enviado → API Gateway → Serviço de Salão → Gerenciamento de Pedidos
3. Pedido é persistido → Camada de Acesso a Dados → PostgreSQL (Esquema Orders)
4. Notificação é enviada → Serviços de Suporte → Notificações → WebSockets
5. Cozinha recebe pedido → Módulo de Cozinha (Frontend)
6. Status é atualizado → Serviço de Salão → Gerenciamento de Pedidos
7. Cliente visualiza status → Módulo de Salão (Frontend)

### Fluxo de Autenticação

1. Usuário tenta login → Componentes Comuns → Form Components
2. Credenciais enviadas → API Gateway → Serviços de Autenticação → Login/Registro
3. Validação de credenciais → Camada de Acesso a Dados → PostgreSQL (Esquema Auth)
4. Token JWT gerado → Serviços de Autenticação
5. Token armazenado → Gerenciamento de Estado → Context API
6. Permissões carregadas → Serviços de Autenticação → Controle de Acesso
7. Interface adaptada baseada em permissões → Componentes Comuns → UI Components

### Fluxo de Emissão Fiscal

1. Fechamento de conta → Módulo de Salão → Divisão de Conta
2. Solicitação de emissão → API Gateway → Serviço Fiscal → Emissão de NFC-e
3. Geração de dados fiscais → Serviço Fiscal → Integração SAT/SEFAZ
4. Comunicação com órgão fiscal → Serviço Fiscal → APIs externas
5. Recebimento de autorização → Serviço Fiscal
6. Geração de DANFE → Serviço Fiscal → Geração de DANFE
7. Armazenamento de documentos → Armazenamento de Arquivos → Documentos
8. Envio para cliente → Serviços de Suporte → Notificações

## Considerações para o MVP

Para o MVP, manteremos a estrutura de componentes, mas com implementações simplificadas:

1. **Frontend**: Foco nos módulos essenciais (Salão, Comanda Digital, Admin básico)
2. **Backend**: Implementação monolítica modular em vez de microsserviços completos
3. **Dados**: Esquema simplificado focado nas entidades principais
4. **Integrações**: Apenas as essenciais para operação básica

Esta abordagem permite entregar valor rapidamente enquanto mantém a estrutura para expansão futura.
