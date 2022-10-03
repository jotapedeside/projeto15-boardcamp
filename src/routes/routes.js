import { Router } from 'express';

//Categories
import { validateCategories, checkIfCategoryAlreadyExists } from '../middlewares/categoriesMiddleware.js';
import { getCategories, postCategories } from '../controllers/categoriesController.js';

//Games
import { validateGame, validateGameQuery, checkIfNameAlreadyExists, checkIfCategoryIdAlreadyExists } from '../middlewares/gamesMiddleware.js';
import { getGames, postGame } from '../controllers/gamesController.js';

//Customers
import { validateCustomer, checkIfCpfAlreadyExists, ValidateCpfQuery, ValidateIdQuery } from '../middlewares/customerMiddleware.js';
import { getCustomer, postCustomer, getCustomerById, putCustomer } from '../controllers/customerController.js';

//Rentals
import { validateRental, checkIfGameIdAlreadyExists, checkIfCustomerIdAlreadyExists, checkIfGameIsRentaled, validateRentalQuery} from '../middlewares/rentalsMiddleware.js';
import { getRentals, postRental } from '../controllers/rentalsController.js';

const router = Router();


//Categories
router.get('/categories', getCategories);
router.post('/categories', validateCategories, checkIfCategoryAlreadyExists, postCategories);

//Games
router.get('/games', validateGameQuery, getGames);
router.post('/games', validateGame, checkIfNameAlreadyExists, checkIfCategoryIdAlreadyExists, postGame);

//Customers
router.get('/customers', ValidateCpfQuery, getCustomer);
router.post('/customers', validateCustomer, checkIfCpfAlreadyExists, postCustomer);
router.get('/customers/:id', ValidateIdQuery, getCustomerById);
router.put('/customers/:id', ValidateIdQuery, validateCustomer, checkIfCpfAlreadyExists, putCustomer);

//Rentals
router.get('/rentals', validateRentalQuery, getRentals);
router.post('/rentals', validateRental, checkIfGameIdAlreadyExists, checkIfCustomerIdAlreadyExists, checkIfGameIsRentaled, postRental);

export default router;