import { Router, Request, Response } from "express";
import { Post } from "../models/Post";
import { requireAdmin, verifyToken } from "../middlewares/auth";

const router = Router();

// GET /api/blog — public list (published only, unless admin)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { tag, search, limit = "20", page = "1" } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = { published: true };
    if (tag) filter["tags"] = tag;
    if (search) filter["$or"] = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
    ];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ publishedAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    req.log.error({ err }, "List blog error");
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/blog/admin — admin list (all posts)
router.get("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (err) {
    req.log.error({ err }, "Admin list blog error");
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/blog/:slug — public post detail
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const post = await Post.findOneAndUpdate(
      { slug: req.params["slug"], published: true },
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post.toJSON());
  } catch (err) {
    req.log.error({ err }, "Get blog post error");
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/blog — admin create
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);
    res.status(201).json(post.toJSON());
  } catch (err) {
    req.log.error({ err }, "Create blog post error");
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/blog/:id — admin update
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params["id"], req.body, {
      new: true,
      runValidators: true,
    });
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post.toJSON());
  } catch (err) {
    req.log.error({ err }, "Update blog post error");
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/blog/:id — admin delete
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params["id"]);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    req.log.error({ err }, "Delete blog post error");
    res.status(500).json({ message: "Server error" });
  }
});

// Suppress unused import warning
void verifyToken;

export default router;
