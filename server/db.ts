import { eq, desc, and, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, articles, categories, videos, opportunities, teamMembers, contentSqueeze, Article, Video, Opportunity, TeamMember, ContentSqueeze, Category } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== ARTICLES =====
export async function getPublishedArticles(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getArticlesByCategoryId(categoryId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(articles)
    .where(and(eq(articles.categoryId, categoryId), eq(articles.status, "published")))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getAllArticles(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(articles)
    .orderBy(desc(articles.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createArticle(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(articles).values(data);
  return result;
}

export async function updateArticle(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(articles).set(data).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(articles).where(eq(articles.id, id));
}

// ===== CATEGORIES =====
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(categories);
}

export async function createCategory(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(categories).values(data);
}

export async function updateCategory(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(categories).set(data).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(categories).where(eq(categories.id, id));
}

// ===== VIDEOS =====
export async function getPublishedVideos(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(videos)
    .where(eq(videos.status, "published"))
    .orderBy(desc(videos.publishedAt))
    .limit(limit)
    .offset(offset);
}

export async function getVideoBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select()
    .from(videos)
    .where(and(eq(videos.slug, slug), eq(videos.status, "published")))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllVideos(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createVideo(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(videos).values(data);
}

export async function updateVideo(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(videos).set(data).where(eq(videos.id, id));
}

export async function deleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(videos).where(eq(videos.id, id));
}

// ===== OPPORTUNITIES =====
export async function getActiveOpportunities(limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(opportunities)
    .where(eq(opportunities.status, "active"))
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getOpportunitiesByType(type: string, limit = 10) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(opportunities)
    .where(and(eq(opportunities.type, type as any), eq(opportunities.status, "active")))
    .orderBy(desc(opportunities.createdAt))
    .limit(limit);
}

export async function getAllOpportunities(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(opportunities)
    .orderBy(desc(opportunities.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createOpportunity(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(opportunities).values(data);
}

export async function updateOpportunity(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(opportunities).set(data).where(eq(opportunities.id, id));
}

export async function deleteOpportunity(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(opportunities).where(eq(opportunities.id, id));
}

// ===== TEAM MEMBERS =====
export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.displayOrder));
}

export async function createTeamMember(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(teamMembers).values(data);
}

export async function updateTeamMember(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(teamMembers).where(eq(teamMembers.id, id));
}

// ===== CONTENT SQUEEZE =====
export async function getActiveContentSqueeze() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(contentSqueeze)
    .where(eq(contentSqueeze.status, "active"))
    .orderBy(asc(contentSqueeze.displayOrder));
}

export async function getAllContentSqueeze(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select()
    .from(contentSqueeze)
    .orderBy(desc(contentSqueeze.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function createContentSqueeze(data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(contentSqueeze).values(data);
}

export async function updateContentSqueeze(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.update(contentSqueeze).set(data).where(eq(contentSqueeze.id, id));
}

export async function deleteContentSqueeze(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.delete(contentSqueeze).where(eq(contentSqueeze.id, id));
}
