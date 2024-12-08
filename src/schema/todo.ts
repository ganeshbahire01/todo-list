import { z } from 'zod';

export const todoSchema = z.object({
  id: z.string().cuid().optional(),
  title: z.string().min(1, "Title is required"),
  completed: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const createTodoSchema = todoSchema.omit({ id: true, createdAt: true });
export const updateTodoSchema = todoSchema.partial().required({ id: true });