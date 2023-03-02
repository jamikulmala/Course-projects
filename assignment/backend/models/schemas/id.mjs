import Joi from 'joi';

export const idSchema = () => {
  return Joi.string()
    .normalize()
    .trim()
    .guid({ version: 'uuidv1', separator: false });
};
