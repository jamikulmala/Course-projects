import Joi from 'joi';
import { idSchema } from './id.mjs';

const hashRegex = /^\$2(?:a|b)\$10\$[A-Za-z0-9$./]{53}$/;

export const encryptedPasswordSchema = Joi.string()
  .length(60)
  .pattern(hashRegex);

export const userSchema = {
  id: idSchema().alter({
    create: schema => schema.optional(),
    save: schema => schema.optional(),
    post: schema => schema.strip().optional(),
    put: schema => schema.strip().optional(),
    login: schema => schema.forbidden(),
    register: schema => schema.forbidden()
  }),
  name: Joi.string()
    .normalize()
    .trim()
    .min(1)
    .alter({
      create: schema => schema.optional(),
      save: schema => schema.required(),
      put: schema => schema.strip().optional(),
      login: schema => schema.forbidden(),
      register: schema => schema.required()
    }),
  email: Joi.string()
    .normalize()
    .trim()
    .email()
    .alter({
      create: schema => schema.optional(),
      save: schema => schema.required(),
      put: schema => schema.strip().optional(),
      login: schema => schema.required(),
      register: schema => schema.required()
    }),
  password: Joi.string()
    .normalize()
    .trim()
    .min(10)
    .alter({
      create: schema => schema.optional(),
      save: schema => {
        return schema
          .length(60)
          .pattern(hashRegex)
          .required();
      },
      put: schema => schema.strip().optional(),
      login: schema => schema.required(),
      register: schema => schema.required()
    }),
  role: Joi.string()
    .normalize()
    .trim()
    .lowercase()
    .valid('admin', 'customer')
    .alter({
      create: schema => schema.default('customer').optional(),
      save: schema => schema.default('customer').optional(),
      put: schema => schema.required(),
      login: schema => schema.forbidden(),
      register: schema => schema.strip().optional()
    })
};
