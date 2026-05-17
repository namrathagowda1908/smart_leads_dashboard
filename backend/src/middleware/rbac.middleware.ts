import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const rbac = (allowed: Array<'admin' | 'sales'>) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const role = req.user?.role as 'admin' | 'sales' | undefined;

    if (!role || !allowed.includes(role)) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    next();
  };
};