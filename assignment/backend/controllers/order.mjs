import debug from 'debug';
import Joi from 'joi';
import { ValidationError } from '../models/base.mjs';
import { Order } from '../models/order.mjs';
import { orderSchema } from '../models/schemas/order.mjs';

// Create logger for debugging
// (Better console.log with colours and does not show any output in production)
const log = debug('assignment-backend:product-controller');

const validationSchema = Joi.object(orderSchema);

const respondWithErrorMessages = (req, res, err) => {
  log(err.message);

  if (err instanceof ValidationError) {
    log('%O', err.details);
    res.status(400);
    return res.json({ error: err.details, message: err.message });
  }

  const error = err.details.reduce((messages, d) => {
    messages[d.path] = d.message;
    log('%O', messages);
    return messages;
  }, {});

  log('%O', error);
  res.status(400);
  return res.json({ error });
};

export const createOrder = async (req, res) => {
  const { value, error } = validationSchema.tailor('post').validate(req.body);
  if (error) return respondWithErrorMessages(req, res, error);

  try {
    value.customerId = req.user.id;
    const order = new Order(value);
    await order.save();

    res.status(201);
    return res.json(order);
  } catch (err) {
    if (err instanceof ValidationError) return respondWithErrorMessages(req, res, error);
    log('Order creation failed');
    return res.sendStatus(500);
  }
};

export const getAllOrders = (req, res) => {
  if (req.user.isAdmin()) {
    const orders = Order.findAll();
    return res.json(orders);
  }

  const orders = Order.findAll({ customerId: req.user.id });
  return res.json(orders);
};

export const getOrder = (req, res) => {
  const order = Order.findById(req.params.id);
  if (!order) return res.sendStatus(404);
  if (order.customerId !== req.user.id && !req.user.isAdmin()) return res.sendStatus(404);
  return res.json(order);
};
