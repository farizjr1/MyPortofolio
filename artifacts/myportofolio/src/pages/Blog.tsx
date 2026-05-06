import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useListBlogPosts } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, Eye, Search, Tag } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | undefined>(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useListBlogPosts({
    tag: activeTag,
    search: debouncedSearch || undefined,
  });

  const posts = data?.posts ?? [];

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags ?? [])));

  return (
    <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Blog & <span className="text-primary">Artikel</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Tulisan tentang teknologi, keuangan, dan hal-hal yang saya pelajari.
        </p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8 flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari artikel..."
            className="pl-9 bg-background/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {allTags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={!activeTag ? "default" : "outline"}
              onClick={() => setActiveTag(undefined)}
              className="h-9"
            >
              Semua
            </Button>
            {allTags.slice(0, 5).map((tag) => (
              <Button
                key={tag}
                size="sm"
                variant={activeTag === tag ? "default" : "outline"}
                onClick={() => setActiveTag(activeTag === tag ? undefined : tag)}
                className="h-9"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Post list */}
      <div className="space-y-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border/50 p-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-muted-foreground"
          >
            <p className="text-lg">Belum ada artikel yang dipublikasikan.</p>
            {(search || activeTag) && (
              <Button variant="link" onClick={() => { setSearch(""); setActiveTag(undefined); }}>
                Reset filter
              </Button>
            )}
          </motion.div>
        ) : (
          posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 transition-all duration-200 hover:border-primary/30 hover:bg-card/70 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                  {post.coverImage && (
                    <div className="w-full h-40 rounded-lg overflow-hidden mb-4">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
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
                </div>
              </Link>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}
