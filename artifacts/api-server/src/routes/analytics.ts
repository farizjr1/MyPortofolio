import { Router, Request, Response } from "express";
import { PageView } from "../models/PageView";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

// POST /api/analytics/track — public tracking (no auth required)
router.post("/track", async (req: Request, res: Response) => {
  try {
    const { path, referrer, sessionId } = req.body as {
      path: string;
      referrer?: string;
      sessionId: string;
    };
    if (!path || !sessionId) {
      res.status(400).json({ message: "path and sessionId required" });
      return;
    }
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
      ?? req.socket.remoteAddress
      ?? "unknown";
    await PageView.create({
      path,
      referrer: referrer || req.headers["referer"],
      userAgent: req.headers["user-agent"],
      ip,
      sessionId,
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Track pageview error");
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/analytics/summary — admin summary
router.get("/summary", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const d30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const d7  = new Date(now.getTime() - 7  * 24 * 60 * 60 * 1000);
    const d1  = new Date(now.getTime() - 1  * 24 * 60 * 60 * 1000);

    const [
      totalViews,
      views30d,
      views7d,
      views24h,
      uniqueVisitors30d,
      topPages,
      dailyViews,
      topReferrers,
    ] = await Promise.all([
      PageView.countDocuments(),
      PageView.countDocuments({ createdAt: { $gte: d30 } }),
      PageView.countDocuments({ createdAt: { $gte: d7 } }),
      PageView.countDocuments({ createdAt: { $gte: d1 } }),
      PageView.distinct("sessionId", { createdAt: { $gte: d30 } }).then((r) => r.length),
      PageView.aggregate([
        { $match: { createdAt: { $gte: d30 } } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, path: "$_id", count: 1 } },
      ]),
      PageView.aggregate([
        { $match: { createdAt: { $gte: d30 } } },
        {
          $group: {
            _id: {
              y: { $year: "$createdAt" },
              m: { $month: "$createdAt" },
              d: { $dayOfMonth: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
        {
          $project: {
            _id: 0,
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $dateFromParts: {
                    year: "$_id.y",
                    month: "$_id.m",
                    day: "$_id.d",
                  },
                },
              },
            },
            count: 1,
          },
        },
      ]),
      PageView.aggregate([
        {
          $match: {
            createdAt: { $gte: d30 },
            referrer: { $exists: true, $nin: [null, ""] },
          },
        },
        { $group: { _id: "$referrer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        { $project: { _id: 0, referrer: "$_id", count: 1 } },
      ]),
    ]);

    res.json({
      totalViews,
      views30d,
      views7d,
      views24h,
      uniqueVisitors30d,
      topPages,
      dailyViews,
      topReferrers,
    });
  } catch (err) {
    (_req as Request).log.error({ err }, "Analytics summary error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
