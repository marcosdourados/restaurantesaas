// src/models/table.model.ts
import { Table, Area } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateTableInput {
  restaurantId: string;
  areaId: string;
  number: string;
  seats: number;
  qrCodeUrl?: string;
}

export interface UpdateTableInput {
  areaId?: string;
  number?: string;
  seats?: number;
  status?: string;
  qrCodeUrl?: string;
}

export interface TableWithArea extends Table {
  area: Area;
}

export class TableModel {
  /**
   * Cria uma nova mesa
   */
  static async create(data: CreateTableInput): Promise<Table> {
    return prisma.table.create({
      data
    });
  }

  /**
   * Busca uma mesa pelo ID
   */
  static async findById(id: string): Promise<TableWithArea | null> {
    return prisma.table.findUnique({
      where: { id },
      include: {
        area: true
      }
    });
  }

  /**
   * Lista todas as mesas de um restaurante
   */
  static async findByRestaurant(
    restaurantId: string,
    options: {
      areaId?: string;
      status?: string;
    } = {}
  ): Promise<TableWithArea[]> {
    const { areaId, status } = options;
    
    return prisma.table.findMany({
      where: { 
        restaurantId,
        ...(areaId ? { areaId } : {}),
        ...(status ? { status } : {})
      },
      include: {
        area: true
      },
      orderBy: [
        { area: { name: 'asc' } },
        { number: 'asc' }
      ]
    });
  }

  /**
   * Lista mesas por área
   */
  static async findByArea(areaId: string): Promise<Table[]> {
    return prisma.table.findMany({
      where: { areaId },
      orderBy: {
        number: 'asc'
      }
    });
  }

  /**
   * Atualiza uma mesa
   */
  static async update(id: string, data: UpdateTableInput): Promise<Table | null> {
    return prisma.table.update({
      where: { id },
      data,
      include: {
        area: true
      }
    });
  }

  /**
   * Remove uma mesa
   */
  static async delete(id: string): Promise<Table | null> {
    return prisma.table.delete({
      where: { id }
    });
  }

  /**
   * Atualiza o status de uma mesa
   */
  static async updateStatus(id: string, status: string): Promise<Table | null> {
    return prisma.table.update({
      where: { id },
      data: { status }
    });
  }

  /**
   * Verifica se uma mesa está disponível
   */
  static async isAvailable(id: string): Promise<boolean> {
    const table = await prisma.table.findUnique({
      where: { id },
      select: { status: true }
    });
    
    return table?.status === 'available';
  }
}
