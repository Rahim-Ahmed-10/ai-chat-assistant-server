import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/user/user.model';

// Extend Express Request object to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt_secret) as { _id: string; email: string };
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }

    // Find the user
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

export default auth;
