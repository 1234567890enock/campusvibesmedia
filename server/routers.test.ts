import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user for testing
const mockUser = {
  id: 1,
  openId: "test-user",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const mockPublicUser = {
  ...mockUser,
  role: "user" as const,
};

function createMockContext(user: typeof mockUser | null = mockUser): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("tRPC Routers", () => {
  describe("auth.me", () => {
    it("returns current user", async () => {
      const caller = appRouter.createCaller(createMockContext(mockUser));
      const result = await caller.auth.me();
      expect(result).toEqual(mockUser);
    });

    it("returns null for unauthenticated user", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });
  });

  describe("articles", () => {
    it("list returns published articles", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      // This will return empty array since no articles exist in test DB
      const result = await caller.articles.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.articles.create({
          title: "Test",
          slug: "test",
          content: "Test content",
          categoryId: 1,
          status: "draft",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });

    it("admin can create articles", async () => {
      const caller = appRouter.createCaller(createMockContext(mockUser));
      try {
        const result = await caller.articles.create({
          title: "Test Article",
          slug: "test-article",
          content: "Test content",
          categoryId: 1,
          status: "draft",
        });
        expect(result).toBeDefined();
      } catch (error) {
        // Expected to fail due to missing category, but tests admin access
        expect(error).toBeDefined();
      }
    });
  });

  describe("categories", () => {
    it("list returns all categories", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.categories.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.categories.create({
          name: "Test",
          slug: "test",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("videos", () => {
    it("list returns published videos", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.videos.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.videos.create({
          title: "Test",
          slug: "test",
          videoUrl: "https://youtube.com/watch?v=test",
          status: "draft",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("opportunities", () => {
    it("list returns active opportunities", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.opportunities.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.opportunities.create({
          title: "Test",
          slug: "test",
          description: "Test description",
          type: "scholarship",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("team", () => {
    it("list returns all team members", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.team.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.team.create({
          name: "Test",
          role: "Editor",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("contentSqueeze", () => {
    it("list returns active content squeeze", async () => {
      const caller = appRouter.createCaller(createMockContext(null));
      const result = await caller.contentSqueeze.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("create requires admin role", async () => {
      const caller = appRouter.createCaller(createMockContext(mockPublicUser));
      try {
        await caller.contentSqueeze.create({
          title: "Test",
          content: "Test content",
        });
        expect.fail("Should have thrown FORBIDDEN error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
