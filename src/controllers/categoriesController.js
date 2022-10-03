import connection from '../models/index.js';

export const getCategories = async (req, res) => {
  try {
    const categoriesName = await actuallyGetCategories();
    res.status(200).json(categoriesName);
  } catch (error) {
    res.status(500);
  }
};

export const postCategories = async (req, res) => {
  try {
    const name = res.locals.name;
    await actuallyPostCategories(name);
    res.status(201).json({status: 201, message: 'Category created'});
  } catch (error) {
    res.status(500);
  }
};

//Actual execution of HTTP Methods
export const actuallyGetCategories = async () => {
  const sql = 'SELECT * FROM categories';
  const res = await connection.query(sql);
  return res.rows;
};

export const actuallyPostCategories = async (name) => {
  const sql = `INSERT INTO categories (name) VALUES ($1)`;
  const res = await connection.query(sql, [name]);
};

export const categoryAlreadyExists = async (name) => {
  const sql = `SELECT (name) FROM categories WHERE name = $1`;
  const { rows: categoryExists } = await connection.query(sql, [name]);
  if (categoryExists && categoryExists.length !== 0) {
    return true;
  }
  return false;
};