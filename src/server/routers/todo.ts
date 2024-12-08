import { router, publicProcedure } from '../trpc';
import { prisma } from '../db';
import { createTodoSchema, updateTodoSchema } from '@/schema/todo';
import { z } from 'zod';

export const todoRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }),

  create: publicProcedure
    .input(createTodoSchema)
    .mutation(async ({ input }) => {
      return await prisma.todo.create({ data: input });
    }),

  update: publicProcedure
    .input(updateTodoSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      return await prisma.todo.update({
        where: { id },
        data: updateData
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.todo.delete({
        where: { id: input.id }
      });
    })
});