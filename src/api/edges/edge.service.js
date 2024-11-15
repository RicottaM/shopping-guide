import { client } from '../../db/connect.js';
import { ErrorWithStatus } from '../../error/error-with-status.js';

export const edgeService = {
  getByStoreId: async (storeId) => {
    const edges = await client.query(`SELECT * FROM edges WHERE store_id = $1;`, [storeId]);

    if (!edges.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any edges for store with given id: ${storeId}.`, 404);
    }

    return edges.rows;
  },
};