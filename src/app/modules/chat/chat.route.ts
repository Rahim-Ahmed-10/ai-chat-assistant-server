import express from 'express';
import { ChatController } from './chat.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/', auth(), ChatController.processChat);

export const ChatRoutes = router;
