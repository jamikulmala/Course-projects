import express from 'express';
import { createOrder, getAllOrders, getOrder } from '../controllers/order.mjs';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct
} from '../controllers/product.mjs';
import {
  checkStatus,
  deleteUser,
  getAllUsers,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser
} from '../controllers/user.mjs';
import {
  requireAdmin,
  requireAuthenticated,
  requireCustomer,
  requireNotAuthenticated,
  requireNotSelf
} from '../middleware/auth.mjs';
import requireJson from '../middleware/requireJson.mjs';

const router = express.Router();

router.route('/check-status').get(checkStatus);

router.route('/login').post(requireJson, requireNotAuthenticated, loginUser);

router.route('/logout').get(logoutUser);

router.route('/register').post(requireJson, requireNotAuthenticated, registerUser);

router
  .route('/products/:id([0-9a-fA-F]+)')
  .all(requireJson)
  .get(getProduct)
  .put(requireAuthenticated, requireAdmin, updateProduct)
  .delete(requireAuthenticated, requireAdmin, deleteProduct);

router
  .route('/products')
  .all(requireJson)
  .get(getAllProducts)
  .post(requireAuthenticated, requireAdmin, createProduct);

router
  .route('/users/:id([0-9a-fA-F]+)')
  .all(requireJson, requireAuthenticated, requireAdmin)
  .get(getUser)
  .put(requireNotSelf, updateUser)
  .delete(requireNotSelf, deleteUser);

router
  .route('/users')
  .all(requireJson, requireAuthenticated, requireAdmin)
  .get(getAllUsers);

router
  .route('/orders/:id([0-9a-fA-F]+)')
  .all(requireJson, requireAuthenticated)
  .get(getOrder);

router
  .route('/orders')
  .all(requireJson, requireAuthenticated)
  .get(getAllOrders)
  .post(requireCustomer, createOrder);

export default router;
