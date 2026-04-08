import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
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

  // ===== ARTICLES =====
  articles: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getPublishedArticles(input?.limit || 10, input?.offset || 0);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getArticleBySlug(input.slug);
      }),
    
    getByCategory: publicProcedure
      .input(z.object({ categoryId: z.number(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return db.getArticlesByCategoryId(input.categoryId, input.limit);
      }),
    
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAllArticles(input?.limit || 100, input?.offset || 0);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        thumbnailUrl: z.string().optional(),
        categoryId: z.number(),
        status: z.enum(['draft', 'published']).default('draft'),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createArticle({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.status === 'published' ? new Date() : null,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        categoryId: z.number().optional(),
        status: z.enum(['draft', 'published']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'published') {
          updateData.publishedAt = new Date();
        }
        return db.updateArticle(id, updateData);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteArticle(input.id);
      }),
  }),

  // ===== CATEGORIES =====
  categories: router({
    list: publicProcedure.query(() => db.getAllCategories()),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return db.createCategory(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateCategory(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteCategory(input.id);
      }),
  }),

  // ===== VIDEOS =====
  videos: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getPublishedVideos(input?.limit || 10, input?.offset || 0);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getVideoBySlug(input.slug);
      }),
    
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAllVideos(input?.limit || 100, input?.offset || 0);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        videoUrl: z.string(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().optional(),
        status: z.enum(['draft', 'published']).default('draft'),
      }))
      .mutation(async ({ input }) => {
        return db.createVideo({
          ...input,
          publishedAt: input.status === 'published' ? new Date() : null,
        });
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        videoUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        duration: z.number().optional(),
        status: z.enum(['draft', 'published']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        const updateData: any = { ...data };
        if (data.status === 'published') {
          updateData.publishedAt = new Date();
        }
        return db.updateVideo(id, updateData);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteVideo(input.id);
      }),
  }),

  // ===== OPPORTUNITIES =====
  opportunities: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getActiveOpportunities(input?.limit || 10, input?.offset || 0);
      }),
    
    getByType: publicProcedure
      .input(z.object({ type: z.string(), limit: z.number().default(10) }))
      .query(async ({ input }) => {
        return db.getOpportunitiesByType(input.type, input.limit);
      }),
    
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAllOpportunities(input?.limit || 100, input?.offset || 0);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        type: z.enum(['scholarship', 'event', 'announcement', 'other']),
        imageUrl: z.string().optional(),
        link: z.string().optional(),
        deadline: z.date().optional(),
        status: z.enum(['active', 'inactive']).default('active'),
      }))
      .mutation(async ({ input }) => {
        return db.createOpportunity(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        type: z.enum(['scholarship', 'event', 'announcement', 'other']).optional(),
        imageUrl: z.string().optional(),
        link: z.string().optional(),
        deadline: z.date().optional(),
        status: z.enum(['active', 'inactive']).optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateOpportunity(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteOpportunity(input.id);
      }),
  }),

  // ===== TEAM MEMBERS =====
  team: router({
    list: publicProcedure.query(() => db.getAllTeamMembers()),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        role: z.string(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        email: z.string().optional(),
        socialLinks: z.string().optional(),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return db.createTeamMember(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        email: z.string().optional(),
        socialLinks: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateTeamMember(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteTeamMember(input.id);
      }),
  }),

  // ===== CONTENT SQUEEZE =====
  contentSqueeze: router({
    list: publicProcedure.query(() => db.getActiveContentSqueeze()),
    
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(100), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return db.getAllContentSqueeze(input?.limit || 100, input?.offset || 0);
      }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        imageUrl: z.string().optional(),
        type: z.enum(['trending', 'highlight', 'featured']).default('trending'),
        status: z.enum(['active', 'inactive']).default('active'),
        displayOrder: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return db.createContentSqueeze(input);
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        type: z.enum(['trending', 'highlight', 'featured']).optional(),
        status: z.enum(['active', 'inactive']).optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return db.updateContentSqueeze(id, data);
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return db.deleteContentSqueeze(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
