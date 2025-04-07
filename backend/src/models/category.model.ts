// src/models/category.model.ts
import { Category } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateCategoryInput {
  restaurantId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  active?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  order?: number;
  active?: boolean;
}

export class CategoryModel {
  /**
   * Cria uma nova categoria
   */
  static async create(data: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({
      data
    });
  }

  /**
   * Busca uma categoria pelo ID
   */
  static async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id }
    });
  }

  /**
   * Lista todas as categorias de um restaurante
   */
  static async findByRestaurant(restaurantId: string, activeOnly: boolean = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: { 
        restaurantId,
        ...(activeOnly ? { active: true } : {})
      },
      orderBy: {
        order: 'asc'
      }
    });
  }

  /**
   * Atualiza uma categoria
   */
  static async update(id: string, data: UpdateCategoryInput): Promise<Category | null> {
    return prisma.category.update({
      where: { id },
      data
    });
  }

  /**
   * Remove uma categoria
   */
  static async delete(id: string): Promise<Category | null> {
    return prisma.category.delete({
      where: { id }
    });
  }

  /**
   * Reordena categorias
   */
  static async reorder(ids: string[]): Promise<boolean> {
    try {
      await prisma.$transaction(
        ids.map((id, index) => 
          prisma.category.update({
            where: { id },
            data: { order: index }
          })
        )
      );
      return true;
    } catch (error) {
      console.error('Erro ao reordenar categorias:', error);
      return false;
    }
  }
}
