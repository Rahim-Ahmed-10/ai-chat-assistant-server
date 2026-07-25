import { Item } from './item.model';
import { IItem } from './item.interface';
import { Types } from 'mongoose';

const createItem = async (payload: Omit<IItem, 'userId'>, userId: string) => {
  const item = await Item.create({
    ...payload,
    userId: new Types.ObjectId(userId),
  });
  return item;
};

const getItemsByUser = async (userId: string) => {
  const items = await Item.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 });
  return items;
};

const getAllItems = async () => {
  const items = await Item.find().sort({ createdAt: -1 }).populate('userId', 'name email');
  return items;
};

const deleteItem = async (id: string, userId: string) => {
  const item = await Item.findOneAndDelete({ _id: id, userId: new Types.ObjectId(userId) });
  return item;
};

const getItemById = async (id: string) => {
  const item = await Item.findById(id).populate('userId', 'name email');
  return item;
};

export const ItemService = {
  createItem,
  getItemsByUser,
  deleteItem,
  getAllItems,
  getItemById,
};
