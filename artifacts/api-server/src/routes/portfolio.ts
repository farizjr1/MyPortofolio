import { Router, Request, Response } from "express";
import { Portfolio } from "../models/Portfolio";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/stats", async (req: Request, res: Response) => {
  try {
    const total = await Portfolio.countDocuments();
    const featured = await Portfolio.countDocuments({ featured: true });
    const byCategoryRaw = await Portfolio.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const byCategory = byCategoryRaw.map((c) => ({
      category: c["_id"] as string,
      count: c["count"] as number,
    }));
    res.json({ total, featured, byCategory });
  } catch (err) {
    req.log.error({ err }, "Portfolio stats error");
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query["category"]) filter["category"] = req.query["category"];
    if (req.query["featured"] !== undefined) {
      filter["featured"] = req.query["featured"] === "true";
    }
    const projects = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects.map((p) => p.toJSON()));
  } catch (err) {
    req.log.error({ err }, "List portfolio error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await Portfolio.create(req.body);
    res.status(201).json(project.toJSON());
  } catch (err) {
    req.log.error({ err }, "Create portfolio error");
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const project = await Portfolio.findById(req.params["id"]);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project.toJSON());
  } catch (err) {
    req.log.error({ err }, "Get portfolio error");
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await Portfolio.findByIdAndUpdate(
      req.params["id"],
      req.body,
      { new: true, runValidators: true },
    );
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json(project.toJSON());
  } catch (err) {
    req.log.error({ err }, "Update portfolio error");
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const project = await Portfolio.findByIdAndDelete(req.params["id"]);
    if (!project) {
      res.status(404).json({ message: "Project not found" });
      return;
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete portfolio error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
