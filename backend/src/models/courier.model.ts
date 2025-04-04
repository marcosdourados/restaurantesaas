// src/models/courier.model.ts
import { Courier } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateCourierInput {
  restaurantId: string;
  name: string;
  phone: string;
  email?: string;
  vehicle?: string;
  licensePlate?: string;
  active?: boolean;
}

export interface UpdateCourierInput {
  name?: string;
  phone?: string;
  email?: string;
  vehicle?: string;
  licensePlate?: string;
  active?: boolean;
}

export class CourierModel {
  /**
   * Cria um novo entregador
   */
  static async create(data: CreateCourierInput): Promise<Courier> {
    return prisma.courier.create({
      data
    });
  }

  /**
   * Busca um entregador pelo ID
   */
  static async findById(id: string): Promise<Courier | null> {
    return prisma.courier.findUnique({
      where: { id },
      include: {
        deliveries: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        }
      }
    });
  }

  /**
   * Lista entregadores de um restaurante
   */
  static async findByRestaurant(
    restaurantId: string,
    activeOnly: boolean = false
  ): Promise<Courier[]> {
    return prisma.courier.findMany({
      where: { 
        restaurantId,
        ...(activeOnly ? { active: true } : {})
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Atualiza um entregador
   */
  static async update(id: string, data: UpdateCourierInput): Promise<Courier | null> {
    return prisma.courier.update({
      where: { id },
      data
    });
  }

  /**
   * Remove um entregador
   */
  static async delete(id: string): Promise<Courier | null> {
    return prisma.courier.delete({
      where: { id }
    });
  }

  /**
   * Ativa ou desativa um entregador
   */
  static async setActive(id: string, active: boolean): Promise<Courier | null> {
    return prisma.courier.update({
      where: { id },
      data: { active }
    });
  }

  /**
   * Busca entregadores disponíveis
   */
  static async findAvailable(restaurantId: string): Promise<Courier[]> {
    // Entregadores ativos que não estão em entregas em andamento
    const busyCourierIds = await prisma.delivery.findMany({
      where: {
        status: { in: ['assigned', 'in_progress'] }
      },
      select: {
        courierId: true
      }
    });

    const busyIds = busyCourierIds
      .map(d => d.courierId)
      .filter((id): id is string => id !== null);

    return prisma.courier.findMany({
      where: {
        restaurantId,
        active: true,
        id: {
          notIn: busyIds
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }
}
