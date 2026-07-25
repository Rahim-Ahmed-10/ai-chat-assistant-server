import express from 'express';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post('/register', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/demo-login', AuthController.demoLogin);
router.post('/google', AuthController.googleLogin);

export const AuthRoutes = router;
