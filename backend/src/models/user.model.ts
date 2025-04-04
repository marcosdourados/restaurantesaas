// src/models/user.model.ts
import { User } from '@prisma/client';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';

export interface CreateUserInput {
  restaurantId: string;
  roleId: string;
  name: string;
  email: string;
  password: string;
  active?: boolean;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
  active?: boolean;
}

export class UserModel {
  /**
   * Cria um novo usuário
   */
  static async create(data: CreateUserInput): Promise<User> {
    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    });
  }

  /**
   * Busca um usuário pelo ID
   */
  static async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });
  }

  /**
   * Busca um usuário pelo email e restaurante
   */
  static async findByEmail(email: string, restaurantId: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        restaurantId
      },
      include: {
        role: true
      }
    });
  }

  /**
   * Lista todos os usuários de um restaurante
   */
  static async findByRestaurant(restaurantId: string): Promise<User[]> {
    return prisma.user.findMany({
      where: { restaurantId },
      include: {
        role: true
      }
    });
  }

  /**
   * Atualiza um usuário
   */
  static async update(id: string, data: UpdateUserInput): Promise<User | null> {
    // Se a senha foi fornecida, faz o hash
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    return prisma.user.update({
      where: { id },
      data,
      include: {
        role: true
      }
    });
  }

  /**
   * Remove um usuário
   */
  static async delete(id: string): Promise<User | null> {
    return prisma.user.delete({
      where: { id }
    });
  }

  /**
   * Verifica se a senha está correta
   */
  static async verifyPassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  /**
   * Atualiza a data do último login
   */
  static async updateLastLogin(id: string): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        lastLogin: new Date()
      }
    });
  }
}
