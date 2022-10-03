import connection from '../models/index.js';

//Basics
export const getCustomer = async (req, res) => {
  const { cpf } = res.locals;
  try {
    const customers = await actuallyGetCustomer(cpf);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500);
  }
};

export const postCustomer = async (req, res) => {
  try {
    const { name, phone, cpf, birthday } = res.locals.customer;
    await actuallyPostCustomer(name, phone, cpf, birthday);
    res.status(201).json({status: 201, message: 'Customer created'});
  } catch (error) {
    res.status(500);
  }
};

export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await actuallyGetCustomerById(id);
    if (customer.length === 0) return res.status(404).json({status: 404, message: 'Customer not found'});
    const formatCustomer = {
      ...customer[0],
      birthday: customer[0].birthday.toISOString().split('T')[0]
    };
    res.status(200).json(formatCustomer);
  } catch (error) {
    res.status(500);
  }
};

export const putCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = res.locals.customer;
  try {
    const update = await actuallyPutCustomer(id, name, phone, cpf, birthday);
    if (update) return res.status(200).json({status: 200, message: 'Customer updated'});
  } catch (error) {
    res.status(500);
  }
};


//Checks
export const cpfAlreadyExists = async (cpf) => {
  const sql = `SELECT * FROM customers WHERE cpf = $1`;
  const { rows: cpfExists } = await connection.query(sql, [cpf]);
  if (cpfExists && cpfExists.length !== 0) {
    return true;
  }
  return false;
};


//Actual execution of HTTP Methods
export const actuallyGetCustomer = async (cpf) => {
  console.log(cpf);
  const sql = `SELECT * FROM customers WHERE cpf LIKE $1`;
  const res = await connection.query(sql, [`${cpf}%`]);
  return res.rows;
};

export const actuallyPostCustomer = async (name, phone, cpf, birthday) => {
  const sql = `INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)`;
  const res = await connection.query(sql, [name, phone, cpf, birthday]);
};

export const actuallyGetCustomerById = async (id) => {
  const sql = `SELECT * FROM customers WHERE id = $1`;
  const res = await connection.query(sql, [id]);
  return res.rows;
};

export const actuallyPutCustomer = async (id, name, phone, cpf, birthday) => {
  console.log(id, name, phone, cpf, birthday);
  const sql = `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`;
  const res = await connection.query(sql, [name, phone, cpf, birthday, id]);
  return res.rows;
};