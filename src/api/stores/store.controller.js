import { storeService } from './store.service.js';

export const storeController = {
    getAll: async (req, res, next) => {
        try {
            const stores = await storeService.getAll();
            res.json(stores);
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.id;
            const store = await storeService.getById(id);
            res.json(store);
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const result = await storeService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await storeService.update(req.body, id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            const result = await storeService.delete(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};