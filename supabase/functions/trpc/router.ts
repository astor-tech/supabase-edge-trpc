import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { Context } from './context.ts';

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getVillains: t.procedure.query(async ({ ctx }) => {
    // @ts-ignore CDN does not provide proper types
    const { data: villains, error } = await ctx.supabase.from('villains').select('*');

    if (error) {
      console.error(error);
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return villains;
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
