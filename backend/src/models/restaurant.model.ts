// src/models/restaurant.model.ts
import { Restaurant } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateRestaurantInput {
  name: string;
  logoUrl?: string;
  address?: any;
  phone?: string;
  email?: string;
  taxId?: string;
  settings?: any;
}

export interface UpdateRestaurantInput {
  name?: string;
  logoUrl?: string;
  address?: any;
  phone?: string;
  email?: string;
  taxId?: string;
  settings?: any;
}

export class RestaurantModel {
  /**
   * Cria um novo restaurante
   */
  static async create(data: CreateRestaurantInput): Promise<Restaurant> {
    return prisma.restaurant.create({
      data: {
        ...data,
        // Converte objetos para JSON strings para SQLite
        address: typeof data.address === 'object' ? JSON.stringify(data.address) : data.address,
        settings: typeof data.settings === 'object' ? JSON.stringify(data.settings) : data.settings
      }
    });
  }

  /**
   * Busca um restaurante pelo ID
   */
  static async findById(id: string): Promise<Restaurant | null> {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id }
    });

    if (!restaurant) return null;

    // Converte strings JSON para objetos
    return this.parseJsonFields(restaurant);
  }

  /**
   * Lista todos os restaurantes
   */
  static async findAll(): Promise<Restaurant[]> {
    const restaurants = await prisma.restaurant.findMany();
    
    // Converte strings JSON para objetos em cada restaurante
    return restaurants.map(restaurant => this.parseJsonFields(restaurant));
  }

  /**
   * Atualiza um restaurante
   */
  static async update(id: string, data: UpdateRestaurantInput): Promise<Restaurant | null> {
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: {
        ...data,
        // Converte objetos para JSON strings para SQLite
        address: typeof data.address === 'object' ? JSON.stringify(data.address) : data.address,
        settings: typeof data.settings === 'object' ? JSON.stringify(data.settings) : data.settings
      }
    });

    // Converte strings JSON para objetos
    return this.parseJsonFields(restaurant);
  }

  /**
   * Remove um restaurante
   */
  static async delete(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.delete({
      where: { id }
    });
  }

  /**
   * Converte campos JSON armazenados como strings para objetos
   */
  private static parseJsonFields(restaurant: Restaurant): Restaurant {
    try {
      // Converte address de string para objeto se for uma string válida
      if (typeof restaurant.address === 'string') {
        restaurant.address = JSON.parse(restaurant.address);
      }
      
      // Converte settings de string para objeto se for uma string válida
      if (typeof restaurant.settings === 'string') {
        restaurant.settings = JSON.parse(restaurant.settings);
      }
    } catch (error) {
      console.error('Erro ao converter campos JSON:', error);
    }
    
    return restaurant;
  }
}
