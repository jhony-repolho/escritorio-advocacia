import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, monthlyIndices, dailyIndices, type InsertMonthlyIndex, type InsertDailyIndex } from "../drizzle/schema";
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

// Índices de correção monetária
export async function getMonthlyIndex(indexType: "INCC" | "IPCA", date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(monthlyIndices)
    .where(
      eq(monthlyIndices.indexType, indexType) &&
      eq(monthlyIndices.date, date)
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getDailyIndex(indexType: "INCC" | "IPCA", date: string) {
  const db = await getDb();
  if (!db) return undefined;

  const { and } = await import('drizzle-orm');
  
  const result = await db
    .select()
    .from(dailyIndices)
    .where(
      and(
        eq(dailyIndices.indexType, indexType),
        eq(dailyIndices.date, date)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function importIndices(data: {
  incc: { monthly: any[]; daily: any[] };
  ipca: { monthly: any[]; daily: any[] };
}) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Import INCC monthly
  console.log("Importing INCC monthly data...");
  for (const record of data.incc.monthly) {
    await db.insert(monthlyIndices).values({
      indexType: "INCC",
      date: record.date,
      monthlyIndex: record.monthly_index.toString(),
      dailyIndex: record.daily_index.toString(),
    } as InsertMonthlyIndex).onDuplicateKeyUpdate({
      set: {
        monthlyIndex: record.monthly_index.toString(),
        dailyIndex: record.daily_index.toString(),
      }
    });
  }

  // Import INCC daily
  console.log("Importing INCC daily data...");
  for (const record of data.incc.daily) {
    await db.insert(dailyIndices).values({
      indexType: "INCC",
      date: record.date,
      dailyIndex: record.daily_index.toString(),
      accumulated: record.accumulated.toString(),
    } as InsertDailyIndex).onDuplicateKeyUpdate({
      set: {
        dailyIndex: record.daily_index.toString(),
        accumulated: record.accumulated.toString(),
      }
    });
  }

  // Import IPCA monthly
  console.log("Importing IPCA monthly data...");
  for (const record of data.ipca.monthly) {
    await db.insert(monthlyIndices).values({
      indexType: "IPCA",
      date: record.date,
      monthlyIndex: record.monthly_index.toString(),
      dailyIndex: record.daily_index.toString(),
    } as InsertMonthlyIndex).onDuplicateKeyUpdate({
      set: {
        monthlyIndex: record.monthly_index.toString(),
        dailyIndex: record.daily_index.toString(),
      }
    });
  }

  // Import IPCA daily
  console.log("Importing IPCA daily data...");
  for (const record of data.ipca.daily) {
    await db.insert(dailyIndices).values({
      indexType: "IPCA",
      date: record.date,
      dailyIndex: record.daily_index.toString(),
      accumulated: record.accumulated.toString(),
    } as InsertDailyIndex).onDuplicateKeyUpdate({
      set: {
        dailyIndex: record.daily_index.toString(),
        accumulated: record.accumulated.toString(),
      }
    });
  }

  console.log("Import completed!");
}

// TODO: add feature queries here as your schema grows.
