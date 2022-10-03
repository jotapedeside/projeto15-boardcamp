import joi from 'joi';

export const gamesSchema = joi.object({
  name: joi.string().required().trim(),
  image: joi.string().required().pattern(/(?:(?:https?)+\:\/\/+[a-zA-Z0-9\/\._-]{1,})+(?:(?:jpe?g|png|gif))/ims),
  stockTotal: joi.number().required().integer().min(1),
  categoryId: joi.number().required().integer().min(1),
  pricePerDay: joi.number().required().integer().min(1),
});

export const gameQuerySchema = joi.object({
  name: joi.string().required().trim()
})