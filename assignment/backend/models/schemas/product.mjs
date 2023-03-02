import Joi from 'joi';
import { idSchema } from './id.mjs';

export const productSchema = {
  id: idSchema().alter({
    create: schema => schema.optional(),
    save: schema => schema.optional(),
    post: schema => schema.strip().optional(),
    put: schema => schema.strip().optional()
  }),
  name: Joi.string()
    .normalize()
    .trim()
    .min(1)
    .alter({
      create: schema => schema.optional(),
      save: schema => schema.required(),
      post: schema => schema.required(),
      put: schema => schema.optional()
    }),
  price: Joi.number()
    .greater(0)
    .precision(2)
    .alter({
      create: schema => schema.optional(),
      save: schema => schema.required(),
      post: schema => schema.required(),
      put: schema => schema.optional()
    }),
  image: Joi.string()
    .uri({ scheme: ['http', 'https'], allowRelative: false })
    .optional(),
  description: Joi.string()
    .normalize()
    .trim()
    .min(1)
    .optional()
};
