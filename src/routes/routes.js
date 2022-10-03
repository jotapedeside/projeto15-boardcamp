import { Router } from 'express';

//Categories
import { getCategories, postCategories } from '../controllers/categoriesController.js';
import { validateCategories, CheckIfCategoryAlreadyExists } from '../middlewares/categoriesMiddleware.js';



const router = Router();

//Categories
router.get('/categories', getCategories);
router.post('/categories', validateCategories, CheckIfCategoryAlreadyExists, postCategories);

export default router;