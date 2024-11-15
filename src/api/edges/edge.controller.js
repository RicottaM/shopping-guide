import { edgeService } from './edge.service.js';

export const edgeController = {
  getByStoreId: async (req, res, next) => {
    try {
      const storeId = req.params.storeId;
      const edges = await edgeService.getByStoreId(storeId);
      res.json(edges);
    } catch (error) {
      next(error);
    }
  },
};