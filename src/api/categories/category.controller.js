import { categoryService } from './category.service.js';
import { productService } from '../products/product.service.js';

export const categoryController = {
    getAll: async (req, res, next) => {
        try {
            const categories = await categoryService.getAll();

            res.json(categories);
        } catch (error) {
            next(error);
        }
    },
    getById: async (req, res, next) => {
        try {
            const id = req.params.id;

            const category = await categoryService.getById(id);

            res.json(category);
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const message = await categoryService.create(req.body);

            res.json(message);
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const id = req.params.id;

            const message = await categoryService.update(req.body, id);

            res.json(message);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;

            const message = await categoryService.delete(id);

            res.json(message);
        } catch (error) {
            next(error);
        }
    },
    getProductsByCategoryId: async (req, res, next) => {
        try {
            const categoryId = req.params.categoryId;

            const products = await productService.getByCategoryId(categoryId);

            res.json(products);
        } catch (error) {
            next(error);
        }
    },
};
