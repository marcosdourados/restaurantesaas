import { PrismaClient } from '@prisma/client';

// Singleton para o cliente Prisma
class Database {
  private static instance: Database;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      console.log('Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
      console.error('Erro ao conectar com o banco de dados:', error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    console.log('Conexão com o banco de dados encerrada');
  }
}

// Exporta uma instância do cliente Prisma
export const db = Database.getInstance();
export const prisma = db.getClient();

export default db;
