import { Request, Response, NextFunction } from 'express';

export const validate = (schema: { parse: (data: unknown) => unknown }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errors' in error) {
        res.status(400).json({ success: false, message: 'Validation failed', errors: (error as any).format?.() || error });
      } else {
        res.status(400).json({ success: false, message: 'Validation failed' });
      }
    }
  };
};