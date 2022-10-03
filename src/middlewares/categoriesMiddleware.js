import { categoriesSchema } from "../models/categoriesModels.js";
import { categoryAlreadyExists } from "../controllers/categoriesController.js";
import { stripHtml } from 'string-strip-html';

export const validateCategories = async (req, res, next) => {
  const categoriesValidation = categoriesSchema.validate(req.body, {abortEarly: false});
  if (categoriesValidation.error) {
    const erros = categoriesValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }
  const { name } = {
    name: stripHtml(categoriesValidation.value.name).result,
  }
  res.locals.name = name;
  console.log("CATEGORIE MIDDLEWARE VALIDATION");
  next();
  return true;
};

export const CheckIfCategoryAlreadyExists = async (req, res, next) => {
  const { name } = res.locals.name;
  try {
    const categoryExists = await categoryAlreadyExists(name);
    if (categoryExists) {
      return res.status(409).json({status: 409, message: 'Category already exists'});
    }
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};