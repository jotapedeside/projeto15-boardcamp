import joi from 'joi';
import joiDate from '@joi/date';
const Joi = joi.extend(joiDate);

export const customersSchema = joi.object({
  name: joi.string().required().trim(),
  phone: joi.string().required().trim().pattern(/^[0-9]{10,11}$/),
  cpf: joi.string().required().trim().pattern(/[0-9]{11}$/),
  birthday: Joi.date().format('YYYY-MM-DD').raw().required()
});

export const cpfSchema = joi.object({
  cpf: joi.string().required().trim()
});

export const idSchema = joi.object({
  id: joi.number().integer().positive().required()
});
