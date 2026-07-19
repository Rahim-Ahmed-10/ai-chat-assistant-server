import dotenv from 'dotenv';
import path from 'path';

// Just in case it's not loaded in server.ts
dotenv.config({ path: path.join(process.cwd(), '.env') });

type Config = {
  port: number | string;
  database_url: string;
  jwt_secret: string;
  jwt_expires_in: string;
  bcrypt_salt_rounds: number;
  gemini_api_key: string;
};

const config: Config = {
  port: process.env.PORT || 5000,
  database_url: (process.env.MONGODB_URI || process.env.DATABASE_URL) as string,
  jwt_secret: process.env.JWT_SECRET as string || 'super_secret_default_key',
  jwt_expires_in: process.env.JWT_EXPIRES_IN as string || '7d',
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  gemini_api_key: process.env.GEMINI_API_KEY as string,
};

export default config;
