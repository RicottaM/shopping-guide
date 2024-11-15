import { bleDeviceService } from './ble_device.service.js';

export const bleDeviceController = {
  getByStoreId: async (req, res, next) => {
    try {
      const storeId = req.params.storeId;
      const bleDevices = await bleDeviceService.getByStoreId(storeId);
      res.json(bleDevices);
    } catch (error) {
      next(error);
    }
  },
};