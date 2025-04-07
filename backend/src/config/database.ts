import { PrismaClient } from '@prisma/client';
import winston from 'winston';

// Configuração de logging para o banco de dados
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'database' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: 'logs/database-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/database.log' })
  ]
});

// Definindo os tipos de eventos do Prisma
type PrismaEventType = 'query' | 'info' | 'warn' | 'error';

// Singleton para o cliente Prisma
class Database {
  private static instance: Database;
  private prisma: PrismaClient;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_INTERVAL_MS = 5000;

  private constructor() {
    this.prisma = new PrismaClient();

    // Log de queries para ambiente de desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      // @ts-ignore - Ignorando erros de tipagem para o evento 'query'
      this.prisma.$on('query', (e: any) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Params: ${e.params}`);
        logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Log de erros sempre
    // @ts-ignore - Ignorando erros de tipagem para o evento 'error'
    this.prisma.$on('error', (e: any) => {
      logger.error('Erro Prisma:', e);
    });

    // Log de avisos
    // @ts-ignore - Ignorando erros de tipagem para o evento 'warn'
    this.prisma.$on('warn', (e: any) => {
      logger.warn('Aviso Prisma:', e);
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
      this.isConnected = true;
      this.reconnectAttempts = 0;
      logger.info('Conexão com o banco de dados estabelecida com sucesso');
    } catch (error) {
      logger.error('Erro ao conectar com o banco de dados:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts <= this.MAX_RECONNECT_ATTEMPTS) {
        logger.info(`Tentativa de reconexão ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS} em ${this.RECONNECT_INTERVAL_MS/1000} segundos`);
        setTimeout(() => {
          this.connect();
        }, this.RECONNECT_INTERVAL_MS);
      } else {
        logger.error(`Falha após ${this.MAX_RECONNECT_ATTEMPTS} tentativas de reconexão`);
        process.exit(1);
      }
    }
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
    this.isConnected = false;
    logger.info('Conexão com o banco de dados encerrada');
  }

  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      // Executa uma query simples para verificar a conexão
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Erro durante health check do banco de dados:', error);
      return false;
    }
  }
}

// Exporta uma instância do cliente Prisma
export const db = Database.getInstance();
export const prisma = db.getClient();

export default db;
