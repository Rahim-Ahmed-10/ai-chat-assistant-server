import { Types } from 'mongoose';

export interface IItem {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  price: number;
  imageUrl?: string;
  userId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
