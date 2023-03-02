import debug from 'debug';
import Joi from 'joi';
import { ValidationError } from '../models/base.mjs';
import { Product } from '../models/product.mjs';
import { productSchema } from '../models/schemas/product.mjs';

// Create logger for debugging
// (Better console.log with colours and does not show any output in production)
const log = debug('assignment-backend:product-controller');

const validationSchema = Joi.object(productSchema);

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

export const createProduct = async (req, res) => {
  const { value, error } = validationSchema.tailor('post').validate(req.body);
  if (error) return respondWithErrorMessages(req, res, error);

  try {
    const product = new Product(value);
    await product.save();

    res.status(201);
    return res.json(product);
  } catch (err) {
    if (err instanceof ValidationError) return respondWithErrorMessages(req, res, error);
    log('Product creation failed');
    return res.sendStatus(500);
  }
};

export const deleteProduct = async (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) return res.sendStatus(404);
  await product.delete();
  return res.json(product);
};

export const getAllProducts = (req, res) => {
  const products = Product.findAll();
  return res.json(products);
};

export const getProduct = (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) return res.sendStatus(404);
  return res.json(product);
};

export const updateProduct = async (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) return res.sendStatus(404);

  const { value, error } = validationSchema.tailor('put').validate(req.body);
  if (error) return respondWithErrorMessages(req, res, error);

  try {
    product.setData(value);
    await product.save();
    return res.json(product);
  } catch (err) {
    if (err instanceof ValidationError) return respondWithErrorMessages(req, res, error);
    log('Product update failed');
    return res.sendStatus(500);
  }
};
