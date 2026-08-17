import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { getTrainingProgress, upsertTrainingProgress } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  progress: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const saved = await getTrainingProgress(ctx.user.id);
      if (!saved) return null;
      try {
        return JSON.parse(saved.profileJson) as unknown;
      } catch {
        return null;
      }
    }),
    save: protectedProcedure
      .input(z.object({ profileJson: z.string().max(200_000) }))
      .mutation(async ({ ctx, input }) => {
        await upsertTrainingProgress(ctx.user.id, input.profileJson);
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;
