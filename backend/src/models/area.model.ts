// src/models/area.model.ts
import { Area } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateAreaInput {
  restaurantId: string;
  name: string;
  description?: string;
}

export interface UpdateAreaInput {
  name?: string;
  description?: string;
}

export class AreaModel {
  /**
   * Cria uma nova área
   */
  static async create(data: CreateAreaInput): Promise<Area> {
    return prisma.area.create({
      data
    });
  }

  /**
   * Busca uma área pelo ID
   */
  static async findById(id: string): Promise<Area | null> {
    return prisma.area.findUnique({
      where: { id }
    });
  }

  /**
   * Lista todas as áreas de um restaurante
   */
  static async findByRestaurant(restaurantId: string): Promise<Area[]> {
    return prisma.area.findMany({
      where: { restaurantId },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Atualiza uma área
   */
  static async update(id: string, data: UpdateAreaInput): Promise<Area | null> {
    return prisma.area.update({
      where: { id },
      data
    });
  }

  /**
   * Remove uma área
   */
  static async delete(id: string): Promise<Area | null> {
    return prisma.area.delete({
      where: { id }
    });
  }

  /**
   * Verifica se uma área tem mesas
   */
  static async hasTables(id: string): Promise<boolean> {
    const count = await prisma.table.count({
      where: { areaId: id }
    });
    
    return count > 0;
  }
}
