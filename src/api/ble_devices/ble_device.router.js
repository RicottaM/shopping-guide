import { Router } from 'express';
import { bleDeviceController } from './ble_device.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

export const bleDeviceRouter = Router();

bleDeviceRouter.use(authMiddleware);

bleDeviceRouter.get('/:storeId', bleDeviceController.getByStoreId);