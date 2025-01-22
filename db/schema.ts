import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default('user'),
  createdAt: timestamp("created_at").defaultNow()
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // pawn, consumer, retail
  amount: numeric("amount").notNull(),
  status: text("status").notNull().default('pending'),
  interestRate: numeric("interest_rate").notNull(),
  term: integer("term").notNull(), // in months
  purpose: text("purpose"),
  collateral: text("collateral"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id),
  amount: numeric("amount").notNull(),
  type: text("type").notNull(), // payment, disbursement
  date: timestamp("date").defaultNow(),
  notes: text("notes")
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow()
});

export type User = typeof users.$inferSelect;
export type Loan = typeof loans.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
