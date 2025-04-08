// src/routes/index.ts
import express from 'express';
import authRoutes from './auth.routes';
import restaurantRoutes from './restaurant.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import tableRoutes from './table.routes';
import areaRoutes from './area.routes';
import orderRoutes from './order.routes';
import deliveryRoutes from './delivery.routes';
import paymentRoutes from './payment.routes';
import fiscalRoutes from './fiscal.routes';
import messagingRoutes from './messaging.routes';
import reportRoutes from './report.routes';

const router = express.Router();

// Rota básica de verificação de saúde da API
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando corretamente' });
});

// Rotas de autenticação
router.use('/auth', authRoutes);

// Rotas de restaurantes
router.use('/restaurants', restaurantRoutes);

// Rotas de usuários
router.use('/users', userRoutes);

// Rotas de categorias
router.use('/categories', categoryRoutes);

// Rotas de produtos
router.use('/products', productRoutes);

// Rotas de mesas
router.use('/tables', tableRoutes);

// Rotas de áreas
router.use('/areas', areaRoutes);

// Rotas de pedidos
router.use('/orders', orderRoutes);

// Rotas de entregas
router.use('/deliveries', deliveryRoutes);

// Rotas de pagamentos
router.use('/payments', paymentRoutes);

// Rotas fiscais
router.use('/fiscal', fiscalRoutes);

// Rotas de mensageria
router.use('/messaging', messagingRoutes);

// Rotas de relatórios
router.use('/reports', reportRoutes);

export default router;
