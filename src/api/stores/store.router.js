import { Router } from 'express';
import { storeController } from './store.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';


export const storeRouter = Router();

storeRouter.use(authMiddleware);

storeRouter.get('/', storeController.getAll);
storeRouter.get('/:id', storeController.getById);
storeRouter.post('/', storeController.create);
storeRouter.put('/:id', storeController.update);
storeRouter.delete('/:id', storeController.delete);