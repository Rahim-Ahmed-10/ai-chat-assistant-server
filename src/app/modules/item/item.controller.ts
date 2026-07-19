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

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve items',
    });
  }
};

const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await ItemService.getAllItems();

    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve items',
    });
  }
};

export const ItemController = {
  createItem,
  getMyItems,
  getAllItems,
};
