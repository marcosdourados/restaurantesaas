// src/models/bill.model.ts
import { Bill, BillSplit, Payment } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateBillInput {
  sessionId: string;
  restaurantId: string;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export interface CreateBillSplitInput {
  billId: string;
  name: string;
  amount: number;
}

export interface CreatePaymentInput {
  billId: string;
  splitId?: string;
  method: string;
  amount: number;
  notes?: string;
  userId: string;
}

export interface BillWithDetails extends Bill {
  billSplits: BillSplit[];
  payments: Payment[];
}

export class BillModel {
  /**
   * Cria uma nova conta
   */
  static async create(data: CreateBillInput): Promise<Bill> {
    return prisma.bill.create({
      data
    });
  }

  /**
   * Busca uma conta pelo ID
   */
  static async findById(id: string): Promise<BillWithDetails | null> {
    return prisma.bill.findUnique({
      where: { id },
      include: {
        tableSession: {
          include: {
            table: true,
            orders: {
              include: {
                orderItems: true
              }
            }
          }
        },
        billSplits: true,
        payments: {
          include: {
            user: true
          }
        }
      }
    });
  }

  /**
   * Busca uma conta pela sessão da mesa
   */
  static async findBySession(sessionId: string): Promise<BillWithDetails | null> {
    return prisma.bill.findFirst({
      where: { sessionId },
      include: {
        tableSession: {
          include: {
            table: true,
            orders: {
              include: {
                orderItems: true
              }
            }
          }
        },
        billSplits: true,
        payments: {
          include: {
            user: true
          }
        }
      }
    });
  }

  /**
   * Divide a conta em partes iguais
   */
  static async splitEqual(billId: string, parts: number): Promise<BillSplit[]> {
    // Busca a conta
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      select: { total: true }
    });

    if (!bill) throw new Error('Conta não encontrada');

    // Calcula o valor de cada parte
    const valuePerPart = bill.total / parts;
    
    // Arredonda para 2 casas decimais
    const roundedValue = Math.floor(valuePerPart * 100) / 100;
    
    // Calcula o ajuste para a última parte (para compensar arredondamentos)
    const lastPartAdjustment = bill.total - (roundedValue * (parts - 1));

    // Cria as divisões em uma transação
    return prisma.$transaction(async (tx) => {
      // Remove divisões existentes
      await tx.billSplit.deleteMany({
        where: { billId }
      });

      // Cria as novas divisões
      const splits = [];
      for (let i = 0; i < parts; i++) {
        const amount = i === parts - 1 ? lastPartAdjustment : roundedValue;
        const split = await tx.billSplit.create({
          data: {
            billId,
            name: `Parte ${i + 1}`,
            amount,
            paid: false
          }
        });
        splits.push(split);
      }

      return splits;
    });
  }

  /**
   * Divide a conta por itens
   */
  static async splitByItems(billId: string, itemSplits: { itemId: string, splitName: string }[]): Promise<BillSplit[]> {
    // Implementação mais complexa que requer acesso aos itens dos pedidos
    // Esta é uma versão simplificada
    throw new Error('Não implementado');
  }

  /**
   * Registra um pagamento
   */
  static async addPayment(data: CreatePaymentInput): Promise<Payment> {
    return prisma.$transaction(async (tx) => {
      // Cria o pagamento
      const payment = await tx.payment.create({
        data
      });

      // Se for um pagamento de uma divisão, atualiza o status da divisão
      if (data.splitId) {
        const split = await tx.billSplit.findUnique({
          where: { id: data.splitId },
          select: { amount: true }
        });

        if (split && data.amount >= split.amount) {
          await tx.billSplit.update({
            where: { id: data.splitId },
            data: { paid: true }
          });
        }
      }

      // Verifica se a conta está totalmente paga
      const bill = await tx.bill.findUnique({
        where: { id: data.billId },
        select: { total: true }
      });

      const totalPaid = await tx.payment.aggregate({
        where: { billId: data.billId },
        _sum: { amount: true }
      });

      // Se o total pago for igual ou maior que o total da conta, atualiza o status
      if (bill && totalPaid._sum.amount && totalPaid._sum.amount >= bill.total) {
        await tx.bill.update({
          where: { id: data.billId },
          data: { status: 'paid' }
        });
      } else if (bill && totalPaid._sum.amount && totalPaid._sum.amount > 0) {
        // Se houver algum pagamento mas não estiver totalmente pago
        await tx.bill.update({
          where: { id: data.billId },
          data: { status: 'partially_paid' }
        });
      }

      return payment;
    });
  }

  /**
   * Fecha a conta
   */
  static async close(id: string): Promise<Bill | null> {
    return prisma.bill.update({
      where: { id },
      data: { status: 'closed' }
    });
  }
}
