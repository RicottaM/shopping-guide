import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { DatabaseConnector } from './db/connect.js';
import { authRouter } from './api/auth/auth.router.js';
import { userRouter } from './api/users/user.router.js';
import { productRouter } from './api/products/product.router.js';
import { categoryRouter } from './api/categories/category.router.js';
import { sectionRouter } from './api/sections/section.router.js';
import { cartItemRouter } from './api/cartItems/cartItem.router.js';
import { unitRouter } from './api/units/unit.router.js';
import { cartRouter } from './api/carts/cart.router.js';
import { storeRouter } from './api/stores/store.router.js';
import { errorHandler } from './error/error-handler.js';

const app = express();
const port = process.env.SERVER_PORT || 3003;

await DatabaseConnector.connect();

app.use(express.json());
app.use(cookieParser());

// Use the new authRouter
app.use('/auth', authRouter);

// All other routers (which require authentication)
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/sections', sectionRouter);
app.use('/cart-items', cartItemRouter);
app.use('/carts', cartRouter);
app.use('/units', unitRouter);
app.use('/stores', storeRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('*', (req, res) => {
  res.sendStatus(404);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});