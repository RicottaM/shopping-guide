import { Router } from 'express';
import { cartItemController } from './cartItem.controller.js';

export const cartItemRouter = Router();

cartItemRouter.get('/', cartItemController.getAll);
cartItemRouter.get('/:id', cartItemController.getById);
cartItemRouter.post('/', cartItemController.create);
cartItemRouter.put('/:id', cartItemController.update);
cartItemRouter.delete('/:id', cartItemController.delete);

