import { customersSchema, cpfSchema, idSchema } from "../models/customerModels.js";
import { cpfAlreadyExists } from "../controllers/customerController.js";
import { stripHtml } from "string-strip-html";

export const validateCustomer = async (req, res, next) => {
  const customerValidation = customersSchema.validate(req.body, { abortEarly: false });
  if (customerValidation.error) {
    const erros = customerValidation.error.details.map((error) => error.message);
    return res.status(400).json({status: 400, message: erros});
  }
  const customer = {
    name: stripHtml(customerValidation.value.name).result,
    phone: customerValidation.value.phone,
    cpf: customerValidation.value.cpf,
    birthday: customerValidation.value.birthday,
  }

  res.locals.customer = customer;
  next();
  return true;
};

export const checkIfCpfAlreadyExists = async (req, res, next) => {
  const { cpf } = res.locals.customer;
  try {
    const cpfExists = await cpfAlreadyExists(cpf);
    if (cpfExists) {
      return res.status(409).json({status: 409, message: "Cpf already exists"});
    }
  } catch (error) {
    res.status(500);
  }
  next();
  return true;
};

export const ValidateCpfQuery = async (req, res, next) => {
  const queriedCpf = req.query.cpf;
  if (!queriedCpf) {
    res.locals.cpf = "";
    next();
  } else {
    const cpfValidation = cpfSchema.validate(req.query, { abortEarly: false });
    if (cpfValidation.error) {
      const erros = cpfValidation.error.details.map((error) => error.message);
      return res.status(400).json({status: 400, message: erros});
    }
    const cpf = cpfValidation.value.cpf;
    res.locals.cpf = cpf;
    next();
    return true;
  }
};

export const ValidateIdQuery = async (req, res, next) => {
  const queriedId = req.params.id;
  if (!queriedId) res.status(400).json({status: 400, message: "Id is required"});

  const idValidation = idSchema.validate({id: queriedId}, {abortEarly: false});
  if (idValidation.error) {
    const erros = idValidation.error.details.map((error) => error.message);
    return res.status(422).json({status: 422, message: erros});
  }
  const id = idValidation.value.id;
  res.locals.id = id;
  next();
  return true;
};