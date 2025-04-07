// src/models/delivery.model.ts
import { Delivery } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateDeliveryInput {
  orderId: string;
  courierId?: string;
  trackingCode?: string;
  estimatedTime?: number;
  notes?: string;
}

export interface UpdateDeliveryInput {
  courierId?: string;
  status?: string;
  trackingCode?: string;
  estimatedTime?: number;
  startedAt?: Date;
  deliveredAt?: Date;
  notes?: string;
}

export class DeliveryModel {
  /**
   * Cria um novo registro de entrega
   */
  static async create(data: CreateDeliveryInput): Promise<Delivery> {
    return prisma.delivery.create({
      data
    });
  }

  /**
   * Busca uma entrega pelo ID
   */
  static async findById(id: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            orderItems: true
          }
        },
        courier: true
      }
    });
  }

  /**
   * Busca uma entrega pelo ID do pedido
   */
  static async findByOrderId(orderId: string): Promise<Delivery | null> {
    return prisma.delivery.findUnique({
      where: { orderId },
      include: {
        order: true,
        courier: true
      }
    });
  }

  /**
   * Lista entregas por status
   */
  static async findByStatus(
    status: string,
    restaurantId: string
  ): Promise<Delivery[]> {
    return prisma.delivery.findMany({
      where: { 
        status,
        order: {
          restaurantId
        }
      },
      include: {
        order: true,
        courier: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Lista entregas por entregador
   */
  static async findByCourier(courierId: string): Promise<Delivery[]> {
    return prisma.delivery.findMany({
      where: { courierId },
      include: {
        order: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  /**
   * Atualiza uma entrega
   */
  static async update(id: string, data: UpdateDeliveryInput): Promise<Delivery | null> {
    return prisma.delivery.update({
      where: { id },
      data
    });
  }

  /**
   * Atribui um entregador à entrega
   */
  static async assignCourier(id: string, courierId: string): Promise<Delivery | null> {
    return prisma.delivery.update({
      where: { id },
      data: { 
        courierId,
        status: 'assigned'
      }
    });
  }

  /**
   * Inicia uma entrega
   */
  static async start(id: string): Promise<Delivery | null> {
    return prisma.delivery.update({
      where: { id },
      data: { 
        status: 'in_progress',
        startedAt: new Date()
      }
    });
  }

  /**
   * Finaliza uma entrega
   */
  static async complete(id: string): Promise<Delivery | null> {
    return prisma.$transaction(async (tx) => {
      // Atualiza a entrega
      const delivery = await tx.delivery.update({
        where: { id },
        data: { 
          status: 'delivered',
          deliveredAt: new Date()
        },
        include: {
          order: true
        }
      });

      // Atualiza o status do pedido
      if (delivery.order) {
        await tx.order.update({
          where: { id: delivery.order.id },
          data: { status: 'delivered' }
        });
      }

      return delivery;
    });
  }

  /**
   * Cancela uma entrega
   */
  static async cancel(id: string, reason?: string): Promise<Delivery | null> {
    return prisma.$transaction(async (tx) => {
      // Atualiza a entrega
      const delivery = await tx.delivery.update({
        where: { id },
        data: { 
          status: 'canceled',
          notes: reason
        },
        include: {
          order: true
        }
      });

      // Atualiza o status do pedido
      if (delivery.order) {
        await tx.order.update({
          where: { id: delivery.order.id },
          data: { status: 'canceled' }
        });
      }

      return delivery;
    });
  }
}
