import connection from '../models/index.js';
import dayjs from 'dayjs';

//Basics
export const getRentalsByGameId = async (gameId) => {
  const sql = `SELECT * FROM rentals WHERE "gameId" = $1`;
  const rentals = await connection.query(sql, [gameId]);
  return rentals.rows;
};

export const getRentals = async (req, res) => {
  const { customerId, gameId } = res.locals;
  try {
    //if (customerId) {
      const rentals = await actuallyGetRentalsByCustomerId(customerId, gameId);
      res.status(200).json(rentals);
    /*} else if (gameId && !customerId) {
      const rentals = await getRentalsByGameId(gameId);
      res.status(200).json(rentals);
    } else {
      const rentals = await getRentalsAll();
      res.status(200).json(rentals);
    }*/
    res.status(200).json({status: 200, message: rentals})
  } catch (error) {
    res.status(500);
  }
};

export const postRental = async (req, res) => {
  const { rental } = res.locals;
  const { pricePerDay } = res.locals.game;
  const rentDate = dayjs().format("YYYY-MM-DD");

  const theRental = {
    ...rental,
    rentDate,
    originalPrice: pricePerDay,
    returnDate: null,
    delayFee: null,
  }
  try {
  //const rentalPosted = await actuallyPostRental( ...rental, rentDate, returnDate:null, originalPrice, delayFee: null);
  const rentalPosted = await actuallyPostRental(theRental);
  if (!rentalPosted) {
    return res.status(500);
  }

  res.status(201).json({status: 201, message: 'Rental created'});
  } catch (error) {
   res.status(500); 
  }
};

//Checks
export const gameAlreadyExists = async (gameId) => {
  const sql = `SELECT * FROM games WHERE id = $1`;
  const game = await connection.query(sql, [gameId]);
  return game.rows;
};

export const customerAlreadyExists= async (customerId) => {
  const sql = `SELECT * FROM customers WHERE id = $1`;
  const customer = await connection.query(sql, [customerId]);
  return customer.rows;
};

export const rentalAlreadyReturned = async (id) => {
  const sql = `SELECT returnDate FROM rentals WHERE id = $1`;
  const rental = await connection.query(sql, [id]);
  return rental.rows;
};

//Actual execution of HTTP Methods
export const actuallyGetRentalsByCustomerId = async (customerId, gameId) => {
  const customerIdIncoming = customerId === 0 ? `>` : `=`;
  const gameIdIncoming = gameId === 0 ? `>` : `=`;
  const sql = `SELECT rentals.*, row_to_json(customer) AS customer, row_to_json(game) AS game
    FROM rentals
    JOIN (SELECT "id", "name" FROM customers ) AS customer
    ON rentals."customerId" = customer."id"
    JOIN ( SELECT games."id", games."name", games."categoryId", categories."name" AS "categoryName"
    FROM games JOIN categories ON categories."id" = games."categoryId" ) AS game
    ON rentals."gameId" = game."id"
    WHERE rentals."customerId" ${customerIdIncoming} $1
    AND rentals."gameId" ${gameIdIncoming} $2`;

  const { rows: rentalsList } = await connection.query(sql, [customerId, gameId,]);
  return rentalsList;
};

export const actuallyPostRental = async (rental) => {
  const sql = `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7)`;
  const res = await connection.query(sql, [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.returnDate, rental.originalPrice, rental.delayFee]);
  return res.rows;
};