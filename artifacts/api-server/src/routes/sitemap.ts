import { Router, Request, Response } from "express";
import { Post } from "../models/Post";

const router = Router();

const FRONTEND_URL = (process.env.FRONTEND_URL ?? "https://farizjr.vercel.app").replace(/\/$/, "");

const STATIC_ROUTES: { url: string; priority: string; changefreq: string }[] = [
  { url: "/",          priority: "1.0", changefreq: "weekly"  },
  { url: "/about",     priority: "0.8", changefreq: "monthly" },
  { url: "/portfolio", priority: "0.8", changefreq: "weekly"  },
  { url: "/services",  priority: "0.7", changefreq: "monthly" },
  { url: "/blog",      priority: "0.8", changefreq: "daily"   },
  { url: "/contact",   priority: "0.6", changefreq: "yearly"  },
  { url: "/cv",        priority: "0.5", changefreq: "monthly" },
];

function toW3CDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function buildUrl(entry: { url: string; lastmod?: string; priority: string; changefreq: string }): string {
  return `  <url>
    <loc>${FRONTEND_URL}${entry.url}</loc>
    <lastmod>${entry.lastmod ?? toW3CDate(new Date())}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`;
}

// GET /sitemap.xml
router.get("/sitemap.xml", async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find({ published: true })
      .select("slug updatedAt publishedAt")
      .sort({ publishedAt: -1 })
      .lean();

    const staticEntries = STATIC_ROUTES.map(buildUrl);

    const blogEntries = posts.map((post) =>
      buildUrl({
        url: `/blog/${post.slug}`,
        lastmod: toW3CDate(new Date((post.updatedAt as Date) ?? (post.publishedAt as Date) ?? new Date())),
        priority: "0.7",
        changefreq: "monthly",
      })
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...blogEntries].join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
    res.send(xml);
  } catch (err) {
    res.status(500).send("<?xml version=\"1.0\"?><error>Failed to generate sitemap</error>");
  }
});

export default router;
