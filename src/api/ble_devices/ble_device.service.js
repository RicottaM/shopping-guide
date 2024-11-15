import { client } from '../../db/connect.js';
import { ErrorWithStatus } from '../../error/error-with-status.js';

export const bleDeviceService = {
  getByStoreId: async (storeId) => {
    const bleDevices = await client.query(`SELECT * FROM ble_devices WHERE store_id = $1;`, [storeId]);

    if (!bleDevices.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any BLE devices for store with given id: ${storeId}.`, 404);
    }

    return bleDevices.rows;
  },
};