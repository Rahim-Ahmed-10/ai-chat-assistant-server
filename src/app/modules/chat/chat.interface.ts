import { Document, Types } from 'mongoose';

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  role: 'user' | 'model';
  message: string;
  createdAt: Date;
  updatedAt: Date;
}
