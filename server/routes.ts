import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Loans endpoints
  app.get("/api/loans", (_req, res) => {
    try {
      // The actual data will be handled by the frontend localStorage
      res.json({ message: "Use client-side localStorage for loan data" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/loans", (req, res) => {
    try {
      // The actual data will be handled by the frontend localStorage
      res.json({ message: "Use client-side localStorage for loan data" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.put("/api/loans/:id/status", (req, res) => {
    try {
      // The actual data will be handled by the frontend localStorage
      res.json({ message: "Use client-side localStorage for loan data" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}