import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { loans, users, transactions, auditLog } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Loans endpoints
  app.get("/api/loans", async (_req, res) => {
    try {
      const allLoans = await db.query.loans.findMany({
        orderBy: (loans, { desc }) => [desc(loans.createdAt)],
      });
      res.json(allLoans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loans" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const loan = await db.insert(loans).values({
        ...req.body,
        status: "pending",
      }).returning();
      res.json(loan[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create loan" });
    }
  });

  app.put("/api/loans/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      const updatedLoan = await db.update(loans)
        .set({ status, updatedAt: new Date() })
        .where(eq(loans.id, parseInt(id)))
        .returning();

      await db.insert(auditLog).values({
        userId: 1, // TODO: Get from auth
        action: `Loan status updated to ${status}`,
        details: `Loan ID: ${id}`,
      });

      res.json(updatedLoan[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update loan status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
