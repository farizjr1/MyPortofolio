import { useGetAnalyticsSummary } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Users, TrendingUp, Clock, Globe, ExternalLink } from "lucide-react";

const GOLD = "#FDE68A";
const GOLD2 = "#F59E0B";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="text-3xl font-bold tabular-nums">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: {value: number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-primary">{payload[0]?.value?.toLocaleString()} views</p>
    </div>
  );
}

export default function Analytics() {
  const { data, isLoading } = useGetAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <div className="grid md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const dailyData = (data.dailyViews ?? []).map((d) => ({
    date: d.date.slice(5),
    views: d.count,
  }));

  const topPages = (data.topPages ?? []).slice(0, 8);
  const topReferrers = (data.topReferrers ?? []).slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Statistik pengunjung website kamu</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Views" value={data.totalViews} icon={Eye} delay={0} />
        <StatCard label="Views 30 Hari" value={data.views30d} sub="bulan ini" icon={TrendingUp} delay={0.05} />
        <StatCard label="Views 24 Jam" value={data.views24h} sub="hari ini" icon={Clock} delay={0.1} />
        <StatCard label="Pengunjung Unik" value={data.uniqueVisitors30d} sub="30 hari terakhir" icon={Users} delay={0.15} />
      </div>

      {/* Daily chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl border border-border/50 bg-card/40 p-6"
      >
        <h2 className="font-semibold mb-1">Page Views (30 Hari)</h2>
        <p className="text-xs text-muted-foreground mb-5">Tren harian pengunjung website</p>
        {dailyData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
            Belum ada data kunjungan
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                stroke={GOLD2}
                strokeWidth={2}
                fill="url(#viewGradient)"
                dot={false}
                activeDot={{ r: 5, fill: GOLD2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top pages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="rounded-xl border border-border/50 bg-card/40 p-6"
        >
          <h2 className="font-semibold mb-1 flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            Halaman Terpopuler
          </h2>
          <p className="text-xs text-muted-foreground mb-5">30 hari terakhir</p>
          {topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada data</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topPages} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: "#888" }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="path"
                  width={90}
                  tick={{ fontSize: 10, fill: "#888" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip formatter={(v: number) => [v.toLocaleString(), "Views"]} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {topPages.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === 0 ? GOLD2 : `rgba(253,230,138,${0.5 - i * 0.05})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Top referrers */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="rounded-xl border border-border/50 bg-card/40 p-6"
        >
          <h2 className="font-semibold mb-1 flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-primary" />
            Top Referrers
          </h2>
          <p className="text-xs text-muted-foreground mb-5">30 hari terakhir</p>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Belum ada data referrer</p>
          ) : (
            <div className="space-y-3">
              {topReferrers.map((r, i) => {
                const max = topReferrers[0]?.count ?? 1;
                const pct = Math.round((r.count / max) * 100);
                let domain = r.referrer;
                try { domain = new URL(r.referrer).hostname; } catch { /* keep as-is */ }
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="truncate text-muted-foreground max-w-[70%]">{domain}</span>
                      <span className="font-medium tabular-nums">{r.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
