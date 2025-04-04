// src/tests/integration/api.test.ts
import request from 'supertest';
import { app } from '../../index';
import { prisma } from '../../config/database';

describe('API Integration Tests', () => {
  let authToken: string;
  let testRestaurantId: string;
  let testUserId: string;
  let testCategoryId: string;
  let testProductId: string;
  let testTableId: string;
  let testOrderId: string;

  // Antes de todos os testes, criar dados de teste e fazer login
  beforeAll(async () => {
    // Limpar dados de teste anteriores
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Restaurant" CASCADE;`;

    // Criar restaurante de teste
    const restaurant = await prisma.restaurant.create({
      data: {
        name: 'Restaurante Teste',
        address: 'Endereço Teste',
        phone: '11999999999',
        email: 'teste@restaurante.com',
        active: true
      }
    });
    testRestaurantId = restaurant.id;

    // Criar usuário de teste
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        password: '$2b$10$5QvzXvS3.lqQXP1W.1c5Q.YtKbvUVJi.KcmYVGCCaGjt1xQMtWsHy', // senha: teste123
        restaurantId: testRestaurantId,
        role: 'ADMIN',
        active: true
      }
    });
    testUserId = user.id;

    // Fazer login para obter token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'usuario@teste.com',
        password: 'teste123'
      });

    authToken = loginResponse.body.data.token;
  });

  // Após todos os testes, limpar dados de teste
  afterAll(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
    await prisma.$executeRaw`TRUNCATE TABLE "Restaurant" CASCADE;`;
    await prisma.$disconnect();
  });

  describe('Autenticação', () => {
    test('Deve fazer login com sucesso', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'usuario@teste.com',
          password: 'teste123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
    });

    test('Deve falhar ao fazer login com credenciais inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'usuario@teste.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Gerenciamento de Categorias', () => {
    test('Deve criar uma categoria com sucesso', async () => {
      const response = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Categoria Teste',
          description: 'Descrição da categoria de teste'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Categoria Teste');

      testCategoryId = response.body.data.id;
    });

    test('Deve listar categorias com sucesso', async () => {
      const response = await request(app)
        .get('/api/categories')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Gerenciamento de Produtos', () => {
    test('Deve criar um produto com sucesso', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          categoryId: testCategoryId,
          name: 'Produto Teste',
          description: 'Descrição do produto de teste',
          price: 19.90,
          available: true
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Produto Teste');

      testProductId = response.body.data.id;
    });

    test('Deve listar produtos com sucesso', async () => {
      const response = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Gerenciamento de Mesas', () => {
    test('Deve criar uma área com sucesso', async () => {
      const response = await request(app)
        .post('/api/areas')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Área Teste',
          description: 'Descrição da área de teste'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe('Área Teste');

      const areaId = response.body.data.id;

      // Criar mesa na área
      const tableResponse = await request(app)
        .post('/api/tables')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          areaId: areaId,
          number: 1,
          seats: 4,
          status: 'available'
        });

      expect(tableResponse.status).toBe(201);
      expect(tableResponse.body.success).toBe(true);
      expect(tableResponse.body.data).toHaveProperty('id');
      expect(tableResponse.body.data.number).toBe(1);

      testTableId = tableResponse.body.data.id;
    });

    test('Deve listar mesas com sucesso', async () => {
      const response = await request(app)
        .get('/api/tables')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('Gerenciamento de Pedidos', () => {
    test('Deve criar um pedido com sucesso', async () => {
      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          tableId: testTableId,
          type: 'local',
          items: [
            {
              productId: testProductId,
              quantity: 2,
              notes: 'Sem cebola'
            }
          ],
          notes: 'Pedido de teste'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.type).toBe('local');

      testOrderId = response.body.data.id;
    });

    test('Deve atualizar o status de um pedido com sucesso', async () => {
      const response = await request(app)
        .patch(`/api/orders/${testOrderId}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'preparing'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('preparing');
    });
  });

  describe('Integrações', () => {
    test('Deve gerar um QR Code PIX para pagamento', async () => {
      const response = await request(app)
        .get(`/api/payments/orders/${testOrderId}/pix`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('qrCodeText');
      expect(response.body.data).toHaveProperty('qrCodeImage');
    });

    test('Deve enviar uma notificação de status de pedido', async () => {
      const response = await request(app)
        .post(`/api/messaging/orders/${testOrderId}/notification`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          trackingUrl: 'https://restaurantesaas.com/tracking/123456'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('messageId');
      expect(response.body.data).toHaveProperty('status');
    });
  });
});
