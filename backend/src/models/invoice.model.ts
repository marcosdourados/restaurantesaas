// src/models/invoice.model.ts
import { Invoice } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateInvoiceInput {
  restaurantId: string;
  orderId: string;
  fiscalId?: string;
  accessKey?: string;
  customerName?: string;
  customerTaxId?: string;
  totalAmount: number;
  issueDate: Date;
  status?: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

export interface UpdateInvoiceInput {
  fiscalId?: string;
  accessKey?: string;
  status?: string;
  pdfUrl?: string;
  xmlUrl?: string;
}

export class InvoiceModel {
  /**
   * Cria uma nova nota fiscal
   */
  static async create(data: CreateInvoiceInput): Promise<Invoice> {
    return prisma.invoice.create({
      data
    });
  }

  /**
   * Busca uma nota fiscal pelo ID
   */
  static async findById(id: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        order: true
      }
    });
  }

  /**
   * Busca uma nota fiscal pelo ID do pedido
   */
  static async findByOrderId(orderId: string): Promise<Invoice | null> {
    return prisma.invoice.findUnique({
      where: { orderId },
      include: {
        order: true
      }
    });
  }

  /**
   * Lista notas fiscais de um restaurante
   */
  static async findByRestaurant(
    restaurantId: string,
    options: {
      status?: string;
      dateStart?: Date;
      dateEnd?: Date;
    } = {}
  ): Promise<Invoice[]> {
    const { status, dateStart, dateEnd } = options;
    
    return prisma.invoice.findMany({
      where: { 
        restaurantId,
        ...(status ? { status } : {}),
        ...(dateStart || dateEnd ? {
          issueDate: {
            ...(dateStart ? { gte: dateStart } : {}),
            ...(dateEnd ? { lte: dateEnd } : {})
          }
        } : {})
      },
      include: {
        order: true
      },
      orderBy: {
        issueDate: 'desc'
      }
    });
  }

  /**
   * Atualiza uma nota fiscal
   */
  static async update(id: string, data: UpdateInvoiceInput): Promise<Invoice | null> {
    return prisma.invoice.update({
      where: { id },
      data
    });
  }

  /**
   * Cancela uma nota fiscal
   */
  static async cancel(id: string): Promise<Invoice | null> {
    return prisma.invoice.update({
      where: { id },
      data: { status: 'canceled' }
    });
  }
}
