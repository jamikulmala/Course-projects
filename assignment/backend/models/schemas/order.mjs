import Joi from 'joi';
import { idSchema } from './id.mjs';

const productSchema = Joi.object({
  id: idSchema().required(),
  name: Joi.string()
    .normalize()
    .trim()
    .min(1)
    .required(),
  price: Joi.number()
    .greater(0)
    .precision(2)
    .required(),
  description: Joi.string()
    .normalize()
    .trim()
    .min(1)
    .optional()
});

const orderItemSchema = Joi.object({
  product: productSchema.required(),
  quantity: Joi.number()
    .integer()
    .greater(0)
    .required()
});

export const orderSchema = {
  id: idSchema().alter({
    create: schema => schema.optional(),
    save: schema => schema.optional(),
    post: schema => schema.strip().optional()
  }),
  customerId: idSchema().alter({
    create: schema => schema.optional(),
    save: schema => schema.required(),
    post: schema => schema.strip().optional()
  }),
  items: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .unique((a, b) => a.product.id === b.product.id)
    .alter({
      create: schema => schema.optional(),
      save: schema => schema.required(),
      post: schema => schema.required()
    })
};
