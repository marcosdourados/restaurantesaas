import { LoginCredentials } from '@/types';

const API_URL = 'http://localhost:5000/api';

/**
 * Classe para comunicação com a API do backend
 */
export class ApiService {
  /**
   * URL base da API
   */
  static baseUrl = API_URL;

  /**
   * Headers padrão para requisições
   */
  static getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Faz uma requisição para a API
   */
  static async request<T>(
    endpoint: string,
    method: string = 'GET',
    data?: any,
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const options: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          (errorData as { message?: string }).message || 
          `Erro ${response.status}: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Verifica o status da API
   */
  static async checkHealth() {
    return this.request<{ status: string; message: string }>('/health', 'GET', null, false);
  }

  /**
   * Faz login do usuário
   */
  static async login(credentials: LoginCredentials) {
    // Implementação temporária para teste
    console.log('Login com credenciais:', credentials);
    return Promise.resolve({
      user: {
        id: '1',
        name: 'Usuário Teste',
        email: credentials.email,
        restaurantId: credentials.restaurantId,
        role: {
          id: '1',
          name: 'Administrador',
          permissions: { all: true }
        }
      },
      token: 'token-de-teste-123456'
    });
  }

  /**
   * Busca informações do usuário atual
   */
  static async getCurrentUser() {
    // Implementação temporária para teste
    return Promise.resolve({
      user: {
        id: '1',
        name: 'Usuário Teste',
        email: 'admin@exemplo.com',
        restaurantId: '1',
        role: {
          id: '1',
          name: 'Administrador',
          permissions: { all: true }
        }
      }
    });
  }

  /**
   * Busca produtos
   */
  static async getProducts() {
    // Implementação temporária para teste
    return Promise.resolve([
      {
        id: '1',
        name: 'Hambúrguer Clássico',
        description: 'Hambúrguer com queijo, alface e tomate',
        price: 25.90,
        categoryId: '1',
        active: true
      },
      {
        id: '2',
        name: 'Pizza Margherita',
        description: 'Pizza com molho de tomate, mussarela e manjericão',
        price: 45.90,
        categoryId: '2',
        active: true
      }
    ]);
  }

  /**
   * Busca categorias
   */
  static async getCategories() {
    // Implementação temporária para teste
    return Promise.resolve([
      {
        id: '1',
        name: 'Hambúrgueres',
        description: 'Hambúrgueres artesanais',
        active: true
      },
      {
        id: '2',
        name: 'Pizzas',
        description: 'Pizzas tradicionais',
        active: true
      }
    ]);
  }

  /**
   * Busca entregas
   */
  static async getDeliveries() {
    // Implementação temporária para teste
    return Promise.resolve([
      {
        id: '1',
        orderId: '1001',
        customerId: '5001',
        address: 'Rua das Flores, 123',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        orderId: '1002',
        customerId: '5002',
        address: 'Avenida Principal, 456',
        status: 'in_transit',
        courierId: '3001',
        estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(),
        createdAt: new Date().toISOString()
      }
    ]);
  }
} 