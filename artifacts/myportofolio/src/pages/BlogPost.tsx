import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { useGetBlogPost } from "@workspace/api-client-react";
import SEO from "@/components/SEO";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Eye } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-border/30">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX: progress / 100 }}
        transition={{ duration: 0.05 }}
      />
    </div>
  );
}

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = useGetBlogPost(params.slug ?? "");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 px-4 space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
        <div className="h-4 bg-muted rounded animate-pulse w-full" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
        <div className="h-[300px] bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="container max-w-3xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Artikel tidak ditemukan</h1>
        <p className="text-muted-foreground mb-8">Artikel yang kamu cari mungkin sudah dihapus atau tidak tersedia.</p>
        <Link href="/blog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Blog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={post.excerpt ?? `Baca artikel "${post.title}" di blog Fariz Jelang Ramadhan.`}
        image={post.coverImage ?? undefined}
        url={`/blog/${post.slug}`}
        type="article"
        publishedAt={post.publishedAt ?? undefined}
        updatedAt={post.updatedAt ?? undefined}
        author="Fariz Jelang Ramadhan"
        tags={post.tags ?? []}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt ?? "",
          image: post.coverImage ?? "https://farizjr.vercel.app/opengraph.jpg",
          datePublished: post.publishedAt ?? "",
          dateModified: post.updatedAt ?? post.publishedAt ?? "",
          author: {
            "@type": "Person",
            name: "Fariz Jelang Ramadhan",
            url: "https://farizjr.vercel.app",
          },
          publisher: {
            "@type": "Person",
            name: "Fariz Jelang Ramadhan",
            url: "https://farizjr.vercel.app",
          },
          keywords: (post.tags ?? []).join(", "),
          url: `https://farizjr.vercel.app/blog/${post.slug}`,
        }}
      />
      <ReadingProgress />
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-3xl mx-auto py-12 px-4"
      >
        <Link href="/blog" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Blog
        </Link>

        {post.coverImage && (
          <div className="w-full h-56 md:h-80 rounded-2xl overflow-hidden mb-8">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-8 pb-8 border-b border-border">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime} min read
            </span>
          )}
          {typeof post.views === "number" && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()} views
            </span>
          )}
        </div>

        {/* Rendered markdown content */}
        <div
          className="prose prose-invert prose-primary max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted/50 prose-blockquote:border-primary prose-blockquote:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
        />
      </motion.article>
    </>
  );
}

// Simple markdown renderer (no extra dependency needed)
function renderMarkdown(md: string): string {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[h|b|u|o|p|h])/gm, "<p>")
    .replace(/^(.+[^>])$/gm, (line) => line.startsWith("<") ? line : `<p>${line}</p>`);
}
