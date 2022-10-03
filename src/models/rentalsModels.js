import joi from 'joi';

export const rentalSchema = joi.object({
  customerId: joi.number().required().integer().min(1),
  gameId: joi.number().required().integer().min(1),
  daysRented: joi.number().required().integer().min(1)
});

export const gameRentalQuerySchema = joi.object({
  gameId: joi.number().required().integer().min(1)
});

export const customerRentalQuerySchema = joi.object({
  customerId: joi.number().required().integer().min(1)
});