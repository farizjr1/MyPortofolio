import { Router, Request, Response } from "express";
import { Content } from "../models/Content";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query["section"]) filter["section"] = req.query["section"];
    if (req.query["published"] !== undefined) {
      filter["published"] = req.query["published"] === "true";
    }
    const items = await Content.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(items.map((i) => i.toJSON()));
  } catch (err) {
    req.log.error({ err }, "List content error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const item = await Content.create(req.body);
    res.status(201).json(item.toJSON());
  } catch (err) {
    req.log.error({ err }, "Create content error");
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const item = await Content.findByIdAndUpdate(
      req.params["id"],
      req.body,
      { new: true, runValidators: true },
    );
    if (!item) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json(item.toJSON());
  } catch (err) {
    req.log.error({ err }, "Update content error");
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const item = await Content.findByIdAndDelete(req.params["id"]);
    if (!item) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    res.json({ message: "Content deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete content error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
