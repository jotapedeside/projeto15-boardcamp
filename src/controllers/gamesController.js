import connection from '../models/index.js';

//Basics
export const getGames = async (req, res) => {
  const { name } = res.locals;
  try {
    const games = await actuallyGetGames(name);
    res.status(200).json(games);
  } catch (error) {
    res.status(500);
  }
};

export const postGame = async (req, res) => {
  try {
    const { name, image, stockTotal, categoryId, pricePerDay } = res.locals.game;
    await actuallyPostGame(name, image, stockTotal, categoryId, pricePerDay);
    res.status(201).json({status: 201, message: 'Game created'});
  } catch (error) {
    res.status(500);
  }
};


//Checks
export const nameAlreadyExists = async (name) => {
  //const sql = `SELECT (name) FROM games WHERE name = $1`;
  const sql = `SELECT (name) FROM games WHERE LOWER (name) = LOWER ($1)`;
  const { rows: gameExists } = await connection.query(sql, [name]);
  if (gameExists && gameExists.length !== 0) {
    return true;
  }
  return false;
};

export const categoryAlreadyExists = async (id) => {
  const sql = `SELECT * FROM games JOIN categories ON games."categoryId" = categories.id AND games."categoryId" = $1`;
  const { rows: categoryExists } = await connection.query(sql, [id]);
  if (categoryExists && categoryExists.length !== 0) {
    return true;
  }
  return false;
};


//Actual execution of HTTP Methods
export const actuallyGetGames = async (name) => {
  const sql = `SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories."id" WHERE LOWER(games."name") LIKE LOWER($1)`;
  const res = await connection.query(sql, [`%${name}%`]);
  return res.rows;
};

export const actuallyPostGame = async (name, image, stockTotal, categoryId, pricePerDay) => {
  const sql = `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)`;
  const res = await connection.query(sql, [name, image, stockTotal, categoryId, pricePerDay]);
};