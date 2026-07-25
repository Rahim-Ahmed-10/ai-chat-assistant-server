import { Request, Response, NextFunction } from 'express';
import { ItemService } from './item.service';

const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const item = await ItemService.createItem(req.body, userId);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create item',
    });
  }
};

const getMyItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const items = await ItemService.getItemsByUser(userId);

    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve items',
    });
  }
};

const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?._id?.toString();
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { id } = req.params;
    const item = await ItemService.deleteItem(id, userId);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found or not yours' });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete item',
    });
  }
};

const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await ItemService.getAllItems();

    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve items',
    });
  }
};

const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = await ItemService.getItemById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve item',
    });
  }
};

export const ItemController = {
  createItem,
  getMyItems,
  deleteItem,
  getAllItems,
  getItemById,
};
