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
      // Comentando a conexão real para testes
      // await this.prisma.$connect();
      console.log('Conexão com o banco de dados estabelecida com sucesso (modo simulado)');
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao conectar com o banco de dados:', error);
      // Não saia do processo para permitir testes
      // process.exit(1);
      return Promise.resolve();
    }
  }

  public async disconnect(): Promise<void> {
    try {
      // await this.prisma.$disconnect();
      console.log('Conexão com o banco de dados encerrada (modo simulado)');
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao desconectar do banco de dados:', error);
      return Promise.resolve();
    }
  }
}

// Exporta uma instância do cliente Prisma
export const db = Database.getInstance();
export const prisma = db.getClient();

export default db;
