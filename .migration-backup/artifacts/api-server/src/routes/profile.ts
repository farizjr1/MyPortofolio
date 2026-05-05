import { Router, Request, Response } from "express";
import { Profile } from "../models/Profile";
import { requireAdmin } from "../middlewares/auth";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({
        name: "Fariz Jelang Ramadhan",
        title: "Full-Stack Developer & Accounting Professional",
        bio: "Passionate developer with expertise in building modern web applications and financial systems.",
        email: "fariz@example.com",
        location: "Indonesia",
        githubUrl: "https://github.com/farizjelang",
        education: [],
        experience: [],
        skills: [],
        tools: ["VS Code", "Git", "Docker", "Figma"],
        expertiseAreas: ["Web Development", "Accounting Systems", "API Design"],
      });
    }
    res.json(profile.toJSON());
  } catch (err) {
    req.log.error({ err }, "Get profile error");
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create(req.body);
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    res.json(profile.toJSON());
  } catch (err) {
    req.log.error({ err }, "Update profile error");
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
