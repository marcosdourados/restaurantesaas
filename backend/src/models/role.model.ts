// src/models/role.model.ts
import { Role } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateRoleInput {
  name: string;
  description?: string;
  permissions?: any;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: any;
}

export class RoleModel {
  /**
   * Cria um novo papel de usuário
   */
  static async create(data: CreateRoleInput): Promise<Role> {
    return prisma.role.create({
      data: {
        ...data,
        // Converte objetos para JSON strings para SQLite
        permissions: typeof data.permissions === 'object' ? JSON.stringify(data.permissions) : data.permissions
      }
    });
  }

  /**
   * Busca um papel pelo ID
   */
  static async findById(id: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: { id }
    });

    if (!role) return null;

    // Converte strings JSON para objetos
    return this.parseJsonFields(role);
  }

  /**
   * Lista todos os papéis
   */
  static async findAll(): Promise<Role[]> {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    // Converte strings JSON para objetos em cada papel
    return roles.map(role => this.parseJsonFields(role));
  }

  /**
   * Atualiza um papel
   */
  static async update(id: string, data: UpdateRoleInput): Promise<Role | null> {
    const role = await prisma.role.update({
      where: { id },
      data: {
        ...data,
        // Converte objetos para JSON strings para SQLite
        permissions: typeof data.permissions === 'object' ? JSON.stringify(data.permissions) : data.permissions
      }
    });

    // Converte strings JSON para objetos
    return this.parseJsonFields(role);
  }

  /**
   * Remove um papel
   */
  static async delete(id: string): Promise<Role | null> {
    return prisma.role.delete({
      where: { id }
    });
  }

  /**
   * Verifica se um papel tem usuários associados
   */
  static async hasUsers(id: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { roleId: id }
    });
    
    return count > 0;
  }

  /**
   * Converte campos JSON armazenados como strings para objetos
   */
  private static parseJsonFields(role: Role): Role {
    try {
      // Converte permissions de string para objeto se for uma string válida
      if (typeof role.permissions === 'string') {
        role.permissions = JSON.parse(role.permissions);
      }
    } catch (error) {
      console.error('Erro ao converter campos JSON:', error);
    }
    
    return role;
  }
}
