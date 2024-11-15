import { Router } from 'express';
import { edgeController } from './edge.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const edgeRouter = Router();

edgeRouter.use(authMiddleware);

edgeRouter.get('/:storeId', edgeController.getByStoreId);