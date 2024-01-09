import dotenv from 'dotenv';

dotenv.config()

export const PORT = process.env.port;
export const DB_URL = process.env.DB_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const USER = process.env.user;
export const PASS = process.env.PASS;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
export const REDIRECT_URI = process.env.REDIRECT_URI;