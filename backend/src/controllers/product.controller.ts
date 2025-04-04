// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductModel } from '../models/product.model';
import { CategoryModel } from '../models/category.model';

export class ProductController {
  /**
   * Cria um novo produto
   */
  static async create(req: Request, res: Response) {
    try {
      const { categoryId, name, description, price, cost, imageUrl, available } = req.body;
      
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Valida os dados de entrada
      if (!categoryId || !name || price === undefined) {
        return res.status(400).json({ 
          success: false,
          message: 'Categoria, nome e preço são obrigatórios' 
        });
      }

      // Verifica se a categoria existe e pertence ao restaurante
      const category = await CategoryModel.findById(categoryId);
      if (!category || category.restaurantId !== restaurantId) {
        return res.status(404).json({ 
          success: false,
          message: 'Categoria não encontrada ou não pertence a este restaurante' 
        });
      }

      // Cria o produto
      const product = await ProductModel.create({
        restaurantId,
        categoryId,
        name,
        description,
        price: Number(price),
        cost: cost ? Number(cost) : undefined,
        imageUrl,
        available
      });

      return res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Busca um produto pelo ID
   */
  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o produto
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== product.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para acessar este produto' 
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Lista produtos com filtros
   */
  static async findByFilters(req: Request, res: Response) {
    try {
      // Obtém o ID do restaurante do usuário autenticado
      const restaurantId = req.user?.restaurantId;
      
      if (!restaurantId) {
        return res.status(400).json({ 
          success: false,
          message: 'ID do restaurante não fornecido' 
        });
      }

      // Extrai os filtros da query
      const categoryId = req.query.categoryId as string | undefined;
      const available = req.query.available === 'true' ? true : 
                       req.query.available === 'false' ? false : undefined;
      const search = req.query.search as string | undefined;

      // Busca os produtos com os filtros
      const products = await ProductModel.findByRestaurant(restaurantId, {
        categoryId,
        available,
        search
      });

      return res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza um produto
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { categoryId, name, description, price, cost, imageUrl, available } = req.body;

      // Busca o produto
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingProduct.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este produto' 
        });
      }

      // Se a categoria foi fornecida, verifica se existe e pertence ao restaurante
      if (categoryId) {
        const category = await CategoryModel.findById(categoryId);
        if (!category || category.restaurantId !== req.user?.restaurantId) {
          return res.status(404).json({ 
            success: false,
            message: 'Categoria não encontrada ou não pertence a este restaurante' 
          });
        }
      }

      // Prepara os dados para atualização
      const updateData: any = {};
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = Number(price);
      if (cost !== undefined) updateData.cost = Number(cost);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (available !== undefined) updateData.available = available;

      // Atualiza o produto
      const product = await ProductModel.update(id, updateData);

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove um produto
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Busca o produto
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingProduct.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para remover este produto' 
        });
      }

      // Remove o produto
      await ProductModel.delete(id);

      return res.status(200).json({
        success: true,
        message: 'Produto removido com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Atualiza a disponibilidade de um produto
   */
  static async updateAvailability(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { available } = req.body;

      // Valida os dados de entrada
      if (available === undefined) {
        return res.status(400).json({ 
          success: false,
          message: 'Disponibilidade é obrigatória' 
        });
      }

      // Busca o produto
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingProduct.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este produto' 
        });
      }

      // Atualiza a disponibilidade
      const product = await ProductModel.updateAvailability(id, available);

      return res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Adiciona uma imagem ao produto
   */
  static async addImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { url, order } = req.body;

      // Valida os dados de entrada
      if (!url) {
        return res.status(400).json({ 
          success: false,
          message: 'URL da imagem é obrigatória' 
        });
      }

      // Busca o produto
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingProduct.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este produto' 
        });
      }

      // Adiciona a imagem
      const image = await ProductModel.addImage(id, url, order || 0);

      return res.status(201).json({
        success: true,
        data: image
      });
    } catch (error) {
      console.error('Erro ao adicionar imagem:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }

  /**
   * Remove uma imagem do produto
   */
  static async removeImage(req: Request, res: Response) {
    try {
      const { productId, imageId } = req.params;

      // Busca o produto
      const existingProduct = await ProductModel.findById(productId);
      if (!existingProduct) {
        return res.status(404).json({ 
          success: false,
          message: 'Produto não encontrado' 
        });
      }

      // Verifica se o produto pertence ao mesmo restaurante do usuário autenticado
      if (req.user && req.user.restaurantId !== existingProduct.restaurantId) {
        return res.status(403).json({ 
          success: false,
          message: 'Acesso negado: você não tem permissão para atualizar este produto' 
        });
      }

      // Remove a imagem
      await ProductModel.removeImage(imageId);

      return res.status(200).json({
        success: true,
        message: 'Imagem removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      return res.status(500).json({ 
        success: false,
        message: 'Erro interno do servidor' 
      });
    }
  }
}
