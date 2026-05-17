import { Request, Response } from 'express';
import { hashPassword, comparePassword, createToken, findUserByEmail } from '../services/auth.service';
import { User } from '../models/User';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res.status(409).json({ success: false, message: 'Email already registered' });
    return;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ name, email, password: hashed, role });
  const token = createToken(user);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }, token },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
    return;
  }

  const token = createToken(user);
  res.json({
    success: true,
    message: 'Login successful',
    data: { user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role }, token },
  });
};