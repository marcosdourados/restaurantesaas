// src/models/table-session.model.ts
import { TableSession } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateTableSessionInput {
  tableId: string;
  userId: string;
  customerName?: string;
  peopleCount?: number;
}

export interface UpdateTableSessionInput {
  customerName?: string;
  peopleCount?: number;
  status?: string;
}

export class TableSessionModel {
  /**
   * Cria uma nova sessão de mesa (abre uma mesa)
   */
  static async create(data: CreateTableSessionInput): Promise<TableSession> {
    return prisma.$transaction(async (tx) => {
      // Verifica se a mesa está disponível
      const table = await tx.table.findUnique({
        where: { id: data.tableId },
        select: { id: true, status: true }
      });

      if (!table || table.status !== 'available') {
        throw new Error('Mesa não está disponível');
      }

      // Atualiza o status da mesa para ocupada
      await tx.table.update({
        where: { id: data.tableId },
        data: { status: 'occupied' }
      });

      // Cria a sessão
      return tx.tableSession.create({
        data: {
          ...data,
          status: 'open',
          openedAt: new Date()
        }
      });
    });
  }

  /**
   * Busca uma sessão pelo ID
   */
  static async findById(id: string): Promise<TableSession | null> {
    return prisma.tableSession.findUnique({
      where: { id },
      include: {
        table: {
          include: {
            area: true
          }
        },
        user: true,
        orders: {
          include: {
            orderItems: true
          }
        }
      }
    });
  }

  /**
   * Busca sessões ativas de um restaurante
   */
  static async findActiveByRestaurant(restaurantId: string): Promise<TableSession[]> {
    return prisma.tableSession.findMany({
      where: {
        status: 'open',
        table: {
          restaurantId
        }
      },
      include: {
        table: {
          include: {
            area: true
          }
        },
        user: true
      },
      orderBy: {
        openedAt: 'asc'
      }
    });
  }

  /**
   * Busca a sessão ativa de uma mesa
   */
  static async findActiveByTable(tableId: string): Promise<TableSession | null> {
    return prisma.tableSession.findFirst({
      where: {
        tableId,
        status: 'open'
      },
      include: {
        table: true,
        user: true,
        orders: {
          include: {
            orderItems: true
          }
        }
      }
    });
  }

  /**
   * Atualiza uma sessão
   */
  static async update(id: string, data: UpdateTableSessionInput): Promise<TableSession | null> {
    return prisma.tableSession.update({
      where: { id },
      data
    });
  }

  /**
   * Fecha uma sessão
   */
  static async close(id: string): Promise<TableSession | null> {
    return prisma.$transaction(async (tx) => {
      // Busca a sessão
      const session = await tx.tableSession.findUnique({
        where: { id },
        include: {
          table: true
        }
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Verifica se há conta aberta
      const bill = await tx.bill.findFirst({
        where: {
          sessionId: id,
          status: { in: ['open', 'partially_paid'] }
        }
      });

      if (bill) {
        throw new Error('Há uma conta aberta para esta sessão');
      }

      // Atualiza a sessão
      const updatedSession = await tx.tableSession.update({
        where: { id },
        data: {
          status: 'closed',
          closedAt: new Date()
        }
      });

      // Libera a mesa
      await tx.table.update({
        where: { id: session.tableId },
        data: { status: 'available' }
      });

      return updatedSession;
    });
  }

  /**
   * Transfere uma sessão para outra mesa
   */
  static async transfer(sessionId: string, newTableId: string): Promise<TableSession | null> {
    return prisma.$transaction(async (tx) => {
      // Busca a sessão
      const session = await tx.tableSession.findUnique({
        where: { id: sessionId },
        include: {
          table: true
        }
      });

      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Verifica se a nova mesa está disponível
      const newTable = await tx.table.findUnique({
        where: { id: newTableId },
        select: { id: true, status: true }
      });

      if (!newTable || newTable.status !== 'available') {
        throw new Error('Nova mesa não está disponível');
      }

      // Libera a mesa atual
      await tx.table.update({
        where: { id: session.tableId },
        data: { status: 'available' }
      });

      // Ocupa a nova mesa
      await tx.table.update({
        where: { id: newTableId },
        data: { status: 'occupied' }
      });

      // Atualiza a sessão
      return tx.tableSession.update({
        where: { id: sessionId },
        data: {
          tableId: newTableId
        }
      });
    });
  }
}
