import { Router } from 'express';
import { cartController } from './cart.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const cartRouter = Router();

cartRouter.use(authMiddleware);

cartRouter.get('/', cartController.getAll);
cartRouter.get('/:id', cartController.getById);
cartRouter.post('/', cartController.create);
cartRouter.put('/:id', cartController.update);
cartRouter.delete('/:id', cartController.delete);
cartRouter.get('/:id/sections', cartController.getCartSections);
cartRouter.get('/user/:userId/products', cartController.getProductsByUserId);