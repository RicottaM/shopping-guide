import { client } from '../../db/connect.js';
import { ErrorWithStatus } from '../../error/error-with-status.js';

export const cartService = {
  getAll: async () => {
    const carts = await client.query(`SELECT * FROM carts;`);

    if (!carts.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any cart.`, 404);
    }

    return carts.rows;
  },
  getById: async (id) => {
    const cart = await client.query(`SELECT * FROM carts WHERE cart_id = ${id};`);

    if (!cart.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any cart with given id: ${id}.`, 404);
    }

    return cart.rows;
  },
  create: async (newCart) => {
    const cart = await client.query(
      `INSERT INTO carts (user_id, creation_date) VALUES (${newCart.user_id}, CURRENT_TIMESTAMP) returning *;`
    );

    if (!cart.rows.length) {
      throw new ErrorWithStatus(`Couldn't create new cart with given data:\n${newCart}`, 400);
    }

    return {
      message: 'Cart has been successfully created.',
    };
  },
  update: async (updatedCart, id) => {
    const { user_id, creation_date } = updatedCart;
    let updatedFields = [];

    if (user_id) updatedFields.push(`user_id = ${user_id}`);
    if (creation_date) updatedFields.push(`creation_date = '${creation_date}'`);

    const updateQuery = `UPDATE carts SET ${updatedFields.join(', ')} WHERE cart_id = ${id};`;

    const cart = await client.query(updateQuery);

    if (!cart.rows.length) {
      throw new ErrorWithStatus(`Couldn't find cart with given id: ${id}.`, 404);
    }

    return {
      message: 'Cart has been successfully updated.',
    };
  },
  delete: async (id) => {
    const cart = await client.query(`DELETE FROM carts WHERE cart_id = ${id} returning *;`);

    if (!cart.rows.length) {
      throw new ErrorWithStatus(`Couldn't find cart with given id: ${id}.`, 404);
    }

    return {
      message: 'Cart has been successfully deleted.',
    };
  },
  getCartSections: async (cartId) => {
    const cartItems = await client.query(`SELECT product_id FROM cart_items WHERE cart_id = ${cartId};`);
    if (!cartItems.rows.length) {
        throw new ErrorWithStatus(`Couldn't find any cart item in cart with given id: ${cartId}.`, 404);
    }
    
    const productIds = cartItems.rows.map((item) => item.product_id);
    
    const categoryIds = await client.query(`SELECT category_id FROM products WHERE product_id IN (${productIds.join(',')});`);
    if (!categoryIds.rows.length) {
        throw new ErrorWithStatus(`Couldn't find any category for the products in the cart.`, 404);
    }
    
    const categoryIdsArray = categoryIds.rows.map((item) => item.category_id);
    
    const sectionIds = await client.query(`SELECT section_id FROM categories WHERE category_id IN (${categoryIdsArray.join(',')});`);
    if (!sectionIds.rows.length) {
        throw new ErrorWithStatus(`Couldn't find any section for the categories of the products in the cart.`, 404);
    }
    
    return sectionIds.rows;
  },
  getProductsByUserId: async (userId) => {
    const cart = await client.query(`SELECT cart_id FROM carts WHERE user_id = ${userId};`);
    if (!cart.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any cart for user with given id: ${userId}.`, 404);
    }
    const cartId = cart.rows[0].cart_id;
    const cartItems = await client.query(`SELECT * FROM cart_items WHERE cart_id = ${cartId};`);
    if (!cartItems.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any cart item in cart with given id: ${cartId}.`, 404);
    }
    const productIds = cartItems.rows.map((item) => item.product_id);
    const products = await client.query(`SELECT * FROM products WHERE product_id IN (${productIds.join(',')});`);
    if (!products.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any products for the given cart id: ${cartId}.`, 404);
    }
    return products.rows;
  },
};
