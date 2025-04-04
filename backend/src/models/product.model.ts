// src/models/product.model.ts
import { Product } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateProductInput {
  restaurantId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  cost?: number;
  imageUrl?: string;
  available?: boolean;
}

export interface UpdateProductInput {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  cost?: number;
  imageUrl?: string;
  available?: boolean;
}

export class ProductModel {
  /**
   * Cria um novo produto
   */
  static async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data
    });
  }

  /**
   * Busca um produto pelo ID
   */
  static async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        productImages: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    });
  }

  /**
   * Lista todos os produtos de um restaurante
   */
  static async findByRestaurant(
    restaurantId: string, 
    options: {
      categoryId?: string;
      available?: boolean;
      search?: string;
    } = {}
  ): Promise<Product[]> {
    const { categoryId, available, search } = options;
    
    return prisma.product.findMany({
      where: { 
        restaurantId,
        ...(categoryId ? { categoryId } : {}),
        ...(available !== undefined ? { available } : {}),
        ...(search ? { 
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Lista produtos por categoria
   */
  static async findByCategory(categoryId: string, availableOnly: boolean = false): Promise<Product[]> {
    return prisma.product.findMany({
      where: { 
        categoryId,
        ...(availableOnly ? { available: true } : {})
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Atualiza um produto
   */
  static async update(id: string, data: UpdateProductInput): Promise<Product | null> {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: true
      }
    });
  }

  /**
   * Remove um produto
   */
  static async delete(id: string): Promise<Product | null> {
    return prisma.product.delete({
      where: { id }
    });
  }

  /**
   * Atualiza a disponibilidade de um produto
   */
  static async updateAvailability(id: string, available: boolean): Promise<Product | null> {
    return prisma.product.update({
      where: { id },
      data: { available }
    });
  }

  /**
   * Adiciona uma imagem ao produto
   */
  static async addImage(productId: string, url: string, order: number = 0): Promise<any> {
    return prisma.productImage.create({
      data: {
        productId,
        url,
        order
      }
    });
  }

  /**
   * Remove uma imagem do produto
   */
  static async removeImage(imageId: string): Promise<any> {
    return prisma.productImage.delete({
      where: { id: imageId }
    });
  }
}
