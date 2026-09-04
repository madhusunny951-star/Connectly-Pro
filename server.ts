import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { apiRouter } from "./server/routes.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads up to 10MB for base64 photo uploads
  app.use(express.json({ limit: "10mb" }));

  // API routes mounted FIRST
  app.use("/api", apiRouter);

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ 
      status: "ok", 
      app: "Connectly", 
      version: "1.0.0",
      connected: true,
      timestamp: new Date().toISOString(),
      database: "data_connectly_db.json",
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Vite development middleware or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connectly server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
