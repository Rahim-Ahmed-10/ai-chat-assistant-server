import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { ChatRoutes } from '../modules/chat/chat.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/chat',
    route: ChatRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
