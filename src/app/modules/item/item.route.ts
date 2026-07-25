import express from 'express';
import { ItemController } from './item.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// POST /api/items — protected, creates a new item
router.post('/', auth(), ItemController.createItem);

// GET /api/items/mine — protected, returns items by the logged-in user
router.get('/mine', auth(), ItemController.getMyItems);

// GET /api/items — public, returns all items
router.get('/', ItemController.getAllItems);

// GET /api/items/:id — public, returns single item by id
router.get('/:id', ItemController.getItemById);

// DELETE /api/items/:id — protected, deletes an item by the logged-in user
router.delete('/:id', auth(), ItemController.deleteItem);

export const ItemRoutes = router;
