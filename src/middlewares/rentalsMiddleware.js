import { customerAlreadyExists, gameAlreadyExists } from '../controllers/rentalsController.js';
import { rentalSchema, gameRentalQuerySchema, customerRentalQuerySchema } from '../models/rentalsModels.js';

export const validateRental = async (req, res, next) => {
  const rentalValidation = rentalSchema.validate(req.body, { abortEarly: false });
  if (rentalValidation.error) {
    const erros = rentalValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }
  const rental = {
    customerId: rentalValidation.value.customerId,
    gameId: rentalValidation.value.gameId,
    daysRented: rentalValidation.value.daysRented
  }

  res.locals.rental = rental;
  next();
  return true;
};

export const checkIfGameIdAlreadyExists = async (req, res, next) => {
  /*const gameRentalQueryValidation = gameRentalQuerySchema.validate(res.locals.rental.gameId, { abortEarly: false });
  if (gameRentalQueryValidation.error) {
    const erros = gameRentalQueryValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }
  const gameRentalQuery = gameRentalQueryValidation.value.gameId;
  res.locals.gameRentalQuery = gameRentalQuery;*/
  const { gameId } = res.locals.rental;
  
  console.log(gameId);
  try {
    const game = await gameAlreadyExists(gameId);
    if (game && game.length !== 0) {
      res.locals.game = game[0];
      next();
      return true;
    } else if (!game) return res.status(401).json({status: 401, message: "Game does not exist"});
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const checkIfCustomerIdAlreadyExists = async (req, res, next) => {
  /*console.log('checkIfCustomerIdAlreadyExists', req.query);
  const customerRentalQueryValidation = customerRentalQuerySchema.validate(req.query, { abortEarly: false });
  if (customerRentalQueryValidation.error) {
    const erros = customerRentalQueryValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }
  const customerRentalQuery = customerRentalQueryValidation.value.customerId;
  res.locals.customerRentalQuery = customerRentalQuery;*/
  const { customerId } = res.locals.rental;
  try {
    const customer = await customerAlreadyExists(customerId);
    if (customer && customer.length !== 0){
      next();
      return true;
    } else if (!customer) return res.status(401).json({status: 401, message: "Customer does not exist"});
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const checkIfGameIsRentaled = async (req, res, next) => {
  const { gameId } = res.locals.rental;
  const { stockTotal } = res.locals.game;
  try {
    const games = await gameAlreadyExists(gameId);
    if (stockTotal <= 0) {
      return res.status(400).json({status: 400, message: "Not enough games to rent"});
    }
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const validateRentalQuery = async (req, res, next) => {
  const customerId = req.query?.customerId;
  const gameId = req.query?.gameId;

  if (customerId == undefined) res.locals.customerId = 0;
  else {
    try {
      const customerExists = await customerAlreadyExists(customerId);
      console.log(customerExists, 'tem mesmo?');
      if (customerExists.length === 0) {
        return res.status(400).json({status: 400, message: "User does not exist"});
      }
      res.locals.customerId = customerId;
    } catch (error) {
      res.status(500);
    }
  }

  if (gameId == undefined) res.locals.gameId = 0;
  else {
    try {
      const gameExists = await gameAlreadyExists(gameId);
      if (gameExists.length === 0) {
        return res.status(400).json({status: 400, message: "Game does not exist"});
      }
      res.locals.gameId = gameId;
    } catch (error) {
      res.status(500);
    }
  }
  next();
  return true;
};

export const checkIfRentalComplete = async (req, res, next) => {
  const { id } = res.locals;
  try {
    const rental = await rentalAlreadyReturned(id);
    if (!rental) return res.status(400).json({status: 400, message: "Rental already complete"});
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
}
