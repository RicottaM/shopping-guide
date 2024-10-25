import { client } from '../../db/connect.js';
import { ErrorWithStatus } from '../../error/error-with-status.js';

export const storeService = {
    getAll: async () => {
        const stores = await client.query(`SELECT * FROM stores;`);

        if (!stores.rows.length) {
            throw new ErrorWithStatus(`Couldn't find any stores.`, 404);
        }

        return stores.rows;
    },
    getById: async (id) => {
        const store = await client.query(`SELECT * FROM stores WHERE store_id = $1;`, [id]);

        if (!store.rows.length) {
            throw new ErrorWithStatus(`Couldn't find any store with given id: ${id}.`, 404);
        }

        return store.rows[0];
    },
    create: async (newStore) => {
        const { store_name, latitude, longitude } = newStore;
        const store = await client.query(
            `INSERT INTO stores (store_name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *;`,
            [store_name, latitude, longitude]
        );

        if (!store.rows.length) {
            throw new ErrorWithStatus(`Couldn't create new store with given data.`, 400);
        }

        return {
            message: 'Store has been successfully created.',
            store: store.rows[0]
        };
    },
    update: async (updatedStore, id) => {
        const { store_name, latitude, longitude } = updatedStore;
        const store = await client.query(
            `UPDATE stores SET store_name = $1, latitude = $2, longitude = $3 WHERE store_id = $4 RETURNING *;`,
            [store_name, latitude, longitude, id]
        );

        if (!store.rows.length) {
            throw new ErrorWithStatus(`Couldn't find store with given id: ${id}.`, 404);
        }

        return {
            message: 'Store has been successfully updated.',
            store: store.rows[0]
        };
    },
    delete: async (id) => {
        const store = await client.query(`DELETE FROM stores WHERE store_id = $1 RETURNING *;`, [id]);

        if (!store.rows.length) {
            throw new ErrorWithStatus(`Couldn't find store with given id: ${id}.`, 404);
        }

        return {
            message: 'Store has been successfully deleted.',
            store: store.rows[0]
        };
    },
};