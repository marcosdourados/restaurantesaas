import { expect, describe, it, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../index';
import { db } from '../config/database';

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.disconnect();
});

describe('API Server', () => {
  it('should return welcome message on root endpoint', async () => {
    const response = await request(app).get('/');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('API do Sistema SaaS para Restaurantes');
  });
});
