import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const monthlyIndices = mysqlTable("monthly_indices", {
  id: int("id").autoincrement().primaryKey(),
  indexType: mysqlEnum("indexType", ["INCC", "IPCA"]).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  monthlyIndex: decimal("monthlyIndex", { precision: 10, scale: 8 }).notNull(),
  dailyIndex: decimal("dailyIndex", { precision: 15, scale: 12 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MonthlyIndex = typeof monthlyIndices.$inferSelect;
export type InsertMonthlyIndex = typeof monthlyIndices.$inferInsert;

export const dailyIndices = mysqlTable("daily_indices", {
  id: int("id").autoincrement().primaryKey(),
  indexType: mysqlEnum("indexType", ["INCC", "IPCA"]).notNull(),
  date: varchar("date", { length: 10 }).notNull(),
  dailyIndex: decimal("dailyIndex", { precision: 15, scale: 12 }).notNull(),
  accumulated: decimal("accumulated", { precision: 15, scale: 12 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyIndex = typeof dailyIndices.$inferSelect;
export type InsertDailyIndex = typeof dailyIndices.$inferInsert;
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  // Informações Pessoais
  nomeCompleto: varchar("nomeCompleto", { length: 255 }).notNull(),
  nacionalidade: varchar("nacionalidade", { length: 100 }),
  profissao: varchar("profissao", { length: 100 }),
  estadoCivil: varchar("estadoCivil", { length: 50 }),
  rg: varchar("rg", { length: 20 }).notNull(),
  cpf: varchar("cpf", { length: 20 }).notNull().unique(),
  endereco: varchar("endereco", { length: 255 }).notNull(),
  numero: varchar("numero", { length: 20 }).notNull(),
  complemento: varchar("complemento", { length: 100 }),
  bairro: varchar("bairro", { length: 100 }).notNull(),
  municipio: varchar("municipio", { length: 100 }).notNull(),
  estado: varchar("estado", { length: 2 }).notNull(),
  telefone: varchar("telefone", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export const generatedDocuments = mysqlTable("generated_documents", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  documentType: mysqlEnum("documentType", ["procuracao", "contrato"]).notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  s3Key: varchar("s3Key", { length: 500 }).notNull(),
  s3Url: text("s3Url").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = typeof generatedDocuments.$inferInsert;
