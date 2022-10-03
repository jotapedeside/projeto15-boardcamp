import { Router } from 'express';

//Categories
import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { validateCategories, checkIfCategoryAlreadyExists } from '../middlewares/categoriesMiddleware.js';

//Games
import { getGames, postGame } from '../controllers/gamesController.js';
import { validateGame, validateGameQuery, checkIfNameAlreadyExists, checkIfCategoryIdAlreadyExists } from '../middlewares/gamesMiddleware.js';



const router = Router();

//Categories
router.get('/categories', getCategories);
router.post('/categories', validateCategories, checkIfCategoryAlreadyExists, postCategories);

//Games
router.get('/games', validateGameQuery, getGames);
router.post('/games', validateGame, checkIfNameAlreadyExists, checkIfCategoryIdAlreadyExists, postGame);

export default router;