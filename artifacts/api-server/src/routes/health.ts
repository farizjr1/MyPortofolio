import { Router, type IRouter } from "express";
import mongoose from "mongoose";

const router: IRouter = Router();

const DB_STATES: Record<number, string> = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [d && `${d}d`, h && `${h}h`, m && `${m}m`, `${s}s`].filter(Boolean).join(" ");
}

// GET /healthz — basic ping (used by Railway health check)
router.get("/healthz", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const status = dbState === 1 ? "ok" : "degraded";
  res.status(dbState === 1 ? 200 : 503).json({ status });
});

// GET /healthz/details — full system status (uptime, db, memory, version)
router.get("/healthz/details", (_req, res) => {
  const dbState = mongoose.connection.readyState;
  const mem = process.memoryUsage();
  const uptimeSec = process.uptime();

  res.json({
    status: dbState === 1 ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptimeSec),
      human: formatUptime(uptimeSec),
    },
    database: {
      status: DB_STATES[dbState] ?? "unknown",
      name: mongoose.connection.name || null,
    },
    memory: {
      rss: `${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
      heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
      heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`,
    },
    node: {
      version: process.version,
      env: process.env.NODE_ENV ?? "development",
    },
  });
});

export default router;
