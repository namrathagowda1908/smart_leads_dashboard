import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { User, IUser } from '../models/User';

export const createToken = (user: IUser): string => {
  const options = { expiresIn: env.JWT_EXPIRES_IN } as unknown as Record<string, unknown>;
  return jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, env.JWT_SECRET as unknown as jwt.Secret, options);
};

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, 10);

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => bcrypt.compare(plain, hashed);

export const findUserByEmail = async (email: string): Promise<IUser | null> => User.findOne({ email });