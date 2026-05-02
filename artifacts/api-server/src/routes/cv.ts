import { Router, Request, Response } from "express";
import { CvData } from "../models/CvData";
import { verifyToken } from "../middlewares/auth";

const router = Router();

router.use(verifyToken);

router.get("/", async (req: Request, res: Response) => {
  try {
    const cvs = await CvData.find().sort({ updatedAt: -1 });
    res.json(cvs.map((c) => c.toJSON()));
  } catch (err) {
    req.log.error({ err }, "List CV error");
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const cv = await CvData.create(req.body);
    res.status(201).json(cv.toJSON());
  } catch (err) {
    req.log.error({ err }, "Create CV error");
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const cv = await CvData.findById(req.params["id"]);
    if (!cv) {
      res.status(404).json({ message: "CV not found" });
      return;
    }
    res.json(cv.toJSON());
  } catch (err) {
    req.log.error({ err }, "Get CV error");
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const cv = await CvData.findByIdAndUpdate(
      req.params["id"],
      req.body,
      { new: true, runValidators: true },
    );
    if (!cv) {
      res.status(404).json({ message: "CV not found" });
      return;
    }
    res.json(cv.toJSON());
  } catch (err) {
    req.log.error({ err }, "Update CV error");
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const cv = await CvData.findByIdAndDelete(req.params["id"]);
    if (!cv) {
      res.status(404).json({ message: "CV not found" });
      return;
    }
    res.json({ message: "CV deleted successfully" });
  } catch (err) {
    req.log.error({ err }, "Delete CV error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
