import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  status: z.string().min(1),
  source: z.string().min(1),
});

export const leadUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  status: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
});