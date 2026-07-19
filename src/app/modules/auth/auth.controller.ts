import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.signup(req.body);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (error: any) {
    // Handle MongoDB duplicate key error (e11000)
    const isDuplicate = error?.code === 11000 || error?.name === 'MongoServerError';
    const message = isDuplicate
      ? 'An account with this email already exists.'
      : error?.message || 'Failed to create user. Please try again.';

    return res.status(400).json({
      success: false,
      message,
    });
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.login(req.body);

    return res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error?.message || 'Invalid email or password.',
    });
  }
};

export const AuthController = {
  signup,
  login,
};
