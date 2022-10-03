import { gamesSchema, gameQuerySchema } from '../models/gamesModels.js';
import { nameAlreadyExists, categoryAlreadyExists } from '../controllers/gamesController.js';
import { stripHtml } from 'string-strip-html';

export const validateGame = async (req, res, next) => {
  const gameValidation = gamesSchema.validate(req.body, {abortEarly: false});

  if (req.body.name == "") {
    const erros = categoriesValidation.error.details.map((error) => error.message);
    return res.status(400).json({status: 400, message: erros});
  }
  if (gameValidation.error) {
    const erros = gameValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }

  const game = {
    name: stripHtml(gameValidation.value.name).result,
    image: stripHtml(gameValidation.value.image).result,
    stockTotal: gameValidation.value.stockTotal,
    categoryId: gameValidation.value.categoryId,
    pricePerDay: gameValidation.value.pricePerDay,
  }
  
  res.locals.game = game;
  next();
  return true;
};

export const checkIfNameAlreadyExists = async (req, res, next) => {
  const { name } = res.locals.game;
  try {
    const nameExists = await nameAlreadyExists(name);
    if (nameExists) {
      return res.status(409).json({status: 409, message: "Game already exists"});
    }
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const checkIfCategoryIdAlreadyExists = async (req, res, next) => {
  const { categoryId } = res.locals.game;
  try {
    const categoryExists = await categoryAlreadyExists(categoryId);
    if (!categoryExists) {
      return res.status(400).json({status: 400, message: "Category does not exist"});
    }
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const validateGameQuery = async (req, res, next) => {
  const queriedName = req.query.name;
  if (!queriedName) {
    res.locals.name = "";
    next();
  } else {
    const gameQueryValidation = gameQuerySchema.validate({name: queriedName}, {abortEarly: false});
    if (gameQueryValidation.error) {
      const erros = gameQueryValidation.error.details.map((error) => error.message);
      return res.status(422).json({status: 422, message: erros});
    }
    const name = stripHtml(gameQueryValidation.value.name).result;
    res.locals.name = name;
    next();
  }
  return true;
};