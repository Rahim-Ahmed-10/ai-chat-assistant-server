import { User } from '../user/user.model';
import { IUser } from '../user/user.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config';
import crypto from 'crypto';

export interface ILoginData {
  email: string;
  password?: string;
}

const signup = async (payload: Partial<IUser>) => {
  // Check if user exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const result = await User.create(payload);
  
  // Strip password before returning
  const userObject = result.toObject();
  delete userObject.password;

  // Generate Token
  const token = jwt.sign(
    { _id: userObject._id, email: userObject.email },
    config.jwt_secret,
    { expiresIn: config.jwt_expires_in }
  );

  return {
    user: userObject,
    token,
  };
};

const login = async (payload: ILoginData) => {
  const user = await User.findOne({ email: payload.email }).select('+password');
  if (!user) {
    throw new Error('User does not exist');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password as string, user.password as string);
  if (!isPasswordMatch) {
    throw new Error('Invalid password');
  }

  // Strip password
  const userObject = user.toObject();
  delete userObject.password;

  // Generate Token
  const token = jwt.sign(
    { _id: userObject._id, email: userObject.email },
    config.jwt_secret,
    { expiresIn: config.jwt_expires_in }
  );

  return {
    user: userObject,
    token,
  };
};

const demoLogin = async () => {
  const demoEmail = 'demo@example.com';
  let user = await User.findOne({ email: demoEmail });
  
  if (!user) {
    user = await User.create({
      name: 'Demo User',
      email: demoEmail,
      password: 'DemoPassword123!',
    });
  }

  const userObject = user.toObject();
  delete userObject.password;

  const token = jwt.sign(
    { _id: userObject._id, email: userObject.email },
    config.jwt_secret,
    { expiresIn: config.jwt_expires_in }
  );

  return {
    user: userObject,
    token,
  };
};

const googleLogin = async (payload: { email: string; name: string }) => {
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const randomPassword = crypto.randomBytes(16).toString('hex');
    user = await User.create({
      name: payload.name || 'Google User',
      email: payload.email,
      password: randomPassword,
    });
  }

  const userObject = user.toObject();
  delete userObject.password;

  const token = jwt.sign(
    { _id: userObject._id, email: userObject.email },
    config.jwt_secret,
    { expiresIn: config.jwt_expires_in }
  );

  return {
    user: userObject,
    token,
  };
};

export const AuthService = {
  signup,
  login,
  demoLogin,
  googleLogin,
};
