// src/models/order.model.ts
import { Order, OrderItem } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateOrderInput {
  restaurantId: string;
  userId: string;
  tableId?: string;
  sessionId?: string;
  type: string; // 'table' ou 'delivery'
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  address?: any;
  subtotal: number;
  serviceFee?: number;
  deliveryFee?: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }[];
}

export interface UpdateOrderInput {
  status?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export class OrderModel {
  /**
   * Cria um novo pedido
   */
  static async create(data: CreateOrderInput): Promise<OrderWithItems> {
    // Prepara os dados para SQLite se necessário
    const orderData = {
      ...data,
      address: typeof data.address === 'object' ? JSON.stringify(data.address) : data.address,
      items: undefined // Removemos os itens para criar separadamente
    };

    // Cria o pedido e os itens em uma transação
    return prisma.$transaction(async (tx) => {
      // Cria o pedido
      const order = await tx.order.create({
        data: orderData
      });

      // Cria os itens do pedido
      const items = await Promise.all(
        data.items.map(item => 
          tx.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              notes: item.notes
            }
          })
        )
      );

      // Registra o status inicial
      await tx.orderStatus.create({
        data: {
          orderId: order.id,
          status: 'pending',
          userId: data.userId
        }
      });

      // Retorna o pedido com os itens
      return {
        ...order,
        items
      };
    });
  }

  /**
   * Busca um pedido pelo ID
   */
  static async findById(id: string): Promise<OrderWithItems | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        orderStatus: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: true
          }
        },
        user: true,
        table: true,
        tableSession: true
      }
    });

    if (!order) return null;

    // Converte strings JSON para objetos
    return this.parseJsonFields(order);
  }

  /**
   * Lista pedidos de um restaurante
   */
  static async findByRestaurant(
    restaurantId: string,
    options: {
      type?: string;
      status?: string;
      tableId?: string;
      dateStart?: Date;
      dateEnd?: Date;
    } = {}
  ): Promise<Order[]> {
    const { type, status, tableId, dateStart, dateEnd } = options;
    
    const orders = await prisma.order.findMany({
      where: { 
        restaurantId,
        ...(type ? { type } : {}),
        ...(status ? { status } : {}),
        ...(tableId ? { tableId } : {}),
        ...(dateStart || dateEnd ? {
          createdAt: {
            ...(dateStart ? { gte: dateStart } : {}),
            ...(dateEnd ? { lte: dateEnd } : {})
          }
        } : {})
      },
      include: {
        orderItems: true,
        user: true,
        table: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Converte strings JSON para objetos em cada pedido
    return orders.map(order => this.parseJsonFields(order));
  }

  /**
   * Atualiza um pedido
   */
  static async update(id: string, data: UpdateOrderInput, userId: string): Promise<Order | null> {
    return prisma.$transaction(async (tx) => {
      // Atualiza o pedido
      const order = await tx.order.update({
        where: { id },
        data
      });

      // Se o status foi atualizado, registra no histórico
      if (data.status) {
        await tx.orderStatus.create({
          data: {
            orderId: id,
            status: data.status,
            userId,
            notes: data.notes
          }
        });
      }

      return order;
    });
  }

  /**
   * Atualiza o status de um pedido
   */
  static async updateStatus(id: string, status: string, userId: string, notes?: string): Promise<Order | null> {
    return this.update(id, { status, notes }, userId);
  }

  /**
   * Cancela um pedido
   */
  static async cancel(id: string, userId: string, reason?: string): Promise<Order | null> {
    return this.updateStatus(id, 'canceled', userId, reason);
  }

  /**
   * Converte campos JSON armazenados como strings para objetos
   */
  private static parseJsonFields(order: any): any {
    try {
      // Converte address de string para objeto se for uma string válida
      if (typeof order.address === 'string') {
        order.address = JSON.parse(order.address);
      }
    } catch (error) {
      console.error('Erro ao converter campos JSON:', error);
    }
    
    return order;
  }
}
