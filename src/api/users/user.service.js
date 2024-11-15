import { client } from '../../db/connect.js';
import { ErrorWithStatus } from '../../error/error-with-status.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userService = {
  getAll: async () => {
    const users = await client.query(`SELECT * FROM users;`);

    if (!users.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any user.`, 404);
    }

    return users.rows;
  },
  getById: async (id) => {
    const user = await client.query(`SELECT * FROM users WHERE user_id = ${id};`);

    if (!user.rows.length) {
      throw new ErrorWithStatus(`Couldn't find any user with given id: ${id}.`, 404);
    }

    return user.rows;
  },
  create: async (newUser) => {
    const user = await client.query(
      `INSERT INTO users (email, password, first_name, last_name) VALUES ('${newUser.email}', '${newUser.password}', '${newUser.name}', '${newUser.last_name}') returning *;`
    );

    if (!user.rows.length) {
      throw new ErrorWithStatus(`Couldn't create new user with given data:\n${newUser}`, 400);
    }

    return {
      message: 'User has been successfully created.',
    };
  },
  update: async (updatedUser, id) => {
    const { email, password, first_name, last_name } = updatedUser;
    let updatedFields = [];

    if (email) updatedFields.push(`email = '${email}'`);
    if (password) updatedFields.push(`password = '${password}'`);
    if (first_name) updatedFields.push(`first_name = '${first_name}'`);
    if (last_name) updatedFields.push(`last_name = '${last_name}'`);

    const updateQuery = `UPDATE users SET ${updatedFields.join(', ')} WHERE user_id = ${id};`;

    const user = await client.query(updateQuery);

    if (!user.rows.length) {
      throw new ErrorWithStatus(`Couldn't find user with given id: ${id}.`, 404);
    }

    return {
      message: 'User has been successfully updated.',
    };
  },
  delete: async (id) => {
    const user = await client.query(`DELETE FROM users WHERE user_id = ${id} returning *;`);

    if (!user.rows.length) {
      throw new ErrorWithStatus(`Couldn't find user with given id: ${id}.`, 404);
    }

    return {
      message: 'User has been successfully deleted.',
    };
  },

  register: async (userData) => {
    const { email, password, first_name, last_name } = userData;

    if (!email || !password || !first_name || !last_name) {
      throw new ErrorWithStatus('All fields are required', 400);
    }

    // Check if user already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      throw new ErrorWithStatus('User already exists', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const newUser = await client.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING user_id, email, first_name, last_name',
      [email, hashedPassword, first_name, last_name]
    );

    // Insert new cart for the user
    const newCart = await client.query(
      'INSERT INTO carts (user_id, creation_date) VALUES ($1, NOW()) RETURNING cart_id',
      [newUser.rows[0].user_id]
    );

    return newUser.rows[0];
  },

  login: async (email, password) => {
    // Find user
    const user = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      throw new ErrorWithStatus('Invalid mail', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!isValidPassword) {
      throw new ErrorWithStatus('Invalid password', 401);
    }

    // Generate token
    const token = jwt.sign(
      { id: user.rows[0].user_id, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return { user: user.rows[0], token };
  },

  logout: async (userId) => {
    // In a real-world scenario, you might want to invalidate the token server-side
    // For now, we'll just return a success message
    return { message: 'Logged out successfully' };
  },
};
