import { Schema, model } from 'mongoose';
import { IChatMessage } from './chat.interface';

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'model'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatMessage = model<IChatMessage>('ChatMessage', chatMessageSchema);
