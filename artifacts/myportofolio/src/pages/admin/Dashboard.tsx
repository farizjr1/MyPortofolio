import { Link } from "wouter";
import {
  useGetPortfolioStats,
  useListPortfolio,
  useListContent,
  useListBlogPostsAdmin,
  useGetAnalyticsSummary,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Star, BookOpen, Eye, TrendingUp, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GOLD2 = "#F59E0B";
const GOLD = "#FDE68A";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  href,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  href?: string;
  delay?: number;
}) {
  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <Card className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors group">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className="p-1.5 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetPortfolioStats();
  const { data: projects, isLoading: projectsLoading } = useListPortfolio();
  const { data: content, isLoading: contentLoading } = useListContent();
  const { data: blogPosts, isLoading: blogLoading } = useListBlogPostsAdmin();
  const { data: analytics, isLoading: analyticsLoading } = useGetAnalyticsSummary();

  const isLoading = statsLoading || projectsLoading || contentLoading || blogLoading || analyticsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      </div>
    );
  }

  const publishedContent = content?.filter((c) => c.published).length ?? 0;
  const publishedPosts = (blogPosts as { published?: boolean }[] | undefined)?.filter((p) => p.published).length ?? 0;

  const dailyData = (analytics?.dailyViews ?? []).slice(-14).map((d) => ({
    date: d.date.slice(5),
    views: d.count,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview portfolio, blog, dan pengunjung website kamu.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Projects"
          value={stats?.total ?? 0}
          sub={`${stats?.featured ?? 0} featured`}
          icon={Briefcase}
          href="/admin/portfolio"
          delay={0}
        />
        <StatCard
          label="Blog Posts"
          value={blogPosts?.length ?? 0}
          sub={`${publishedPosts} published`}
          icon={BookOpen}
          href="/admin/blog"
          delay={0.05}
        />
        <StatCard
          label="Content Items"
          value={content?.length ?? 0}
          sub={`${publishedContent} published`}
          icon={FileText}
          href="/admin/content"
          delay={0.1}
        />
        <StatCard
          label="Views (30 hari)"
          value={analytics?.views30d ?? 0}
          sub={`${analytics?.views24h ?? 0} hari ini`}
          icon={Eye}
          href="/admin/analytics"
          delay={0.15}
        />
      </div>

      {/* Analytics mini chart */}
      {dailyData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Page Views (14 Hari Terakhir)
                </CardTitle>
              </div>
              <Link href="/admin/analytics">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                  Lihat Detail <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), "Views"]} />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke={GOLD2}
                    strokeWidth={2}
                    fill="url(#dashGradient)"
                    dot={false}
                    activeDot={{ r: 4, fill: GOLD2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Projects</CardTitle>
              <Link href="/admin/portfolio">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                  Lihat Semua <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {projects?.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    </div>
                    {project.featured && <Star className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />}
                  </div>
                ))}
                {(!projects || projects.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada project.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Blog Posts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="bg-card/50 border-border/50 h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Blog Posts</CardTitle>
              <Link href="/admin/blog">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-7">
                  Kelola <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(blogPosts as { id: string; title: string; published?: boolean }[] | undefined)
                  ?.slice(0, 5)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
                    >
                      <p className="font-medium truncate min-w-0 mr-2">{post.title}</p>
                      <Badge
                        variant={post.published ? "default" : "secondary"}
                        className="shrink-0 text-[10px] px-1.5"
                      >
                        {post.published ? "Publik" : "Draft"}
                      </Badge>
                    </div>
                  ))}
                {(!blogPosts || blogPosts.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Belum ada artikel.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
