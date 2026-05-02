import { useEffect, useState } from "react";
import { useListPortfolio } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ExternalLink,
  Github,
  Folder,
  BarChart2,
  Calculator,
  Bot,
  Globe,
  Code2,
  Database,
} from "lucide-react";
import { PortfolioProject } from "@workspace/api-client-react";

const CATEGORY_META: Record<
  string,
  { gradient: string; accent: string; icon: React.ReactNode; pattern: string }
> = {
  "Web App": {
    gradient: "from-blue-950/80 via-indigo-900/60 to-blue-950/80",
    accent: "border-blue-500/20",
    icon: <Globe className="h-10 w-10 text-blue-400/60" />,
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.1) 0%, transparent 50%)",
  },
  "Data Analysis": {
    gradient: "from-violet-950/80 via-purple-900/60 to-violet-950/80",
    accent: "border-violet-500/20",
    icon: <BarChart2 className="h-10 w-10 text-violet-400/60" />,
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(139,92,246,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(109,40,217,0.1) 0%, transparent 50%)",
  },
  "Accounting Tool": {
    gradient: "from-emerald-950/80 via-teal-900/60 to-emerald-950/80",
    accent: "border-emerald-500/20",
    icon: <Calculator className="h-10 w-10 text-emerald-400/60" />,
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(52,211,153,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.1) 0%, transparent 50%)",
  },
  Automation: {
    gradient: "from-amber-950/80 via-orange-900/60 to-amber-950/80",
    accent: "border-amber-500/20",
    icon: <Bot className="h-10 w-10 text-amber-400/60" />,
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(251,191,36,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(245,158,11,0.1) 0%, transparent 50%)",
  },
  Backend: {
    gradient: "from-slate-900/80 via-zinc-800/60 to-slate-900/80",
    accent: "border-zinc-500/20",
    icon: <Database className="h-10 w-10 text-zinc-400/60" />,
    pattern:
      "radial-gradient(circle at 20% 80%, rgba(148,163,184,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(100,116,139,0.1) 0%, transparent 50%)",
  },
};

const DEFAULT_META = {
  gradient: "from-zinc-900/80 via-neutral-800/60 to-zinc-900/80",
  accent: "border-zinc-500/20",
  icon: <Code2 className="h-10 w-10 text-zinc-400/60" />,
  pattern:
    "radial-gradient(circle at 20% 80%, rgba(161,161,170,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(113,113,122,0.1) 0%, transparent 50%)",
};

function ProjectImage({
  project,
}: {
  project: PortfolioProject;
}) {
  const [imgError, setImgError] = useState(false);
  const meta = CATEGORY_META[project.category] ?? DEFAULT_META;
  const hasImage = !!project.imageUrl && !imgError;

  return (
    <div className="relative h-48 overflow-hidden">
      {hasImage ? (
        <>
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </>
      ) : (
        <div
          className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${meta.gradient} relative`}
          style={{ backgroundImage: meta.pattern }}
        >
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Glowing center orb */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 rounded-full blur-2xl opacity-20 bg-primary" />
          </div>

          {/* Category icon */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`p-3 rounded-2xl border ${meta.accent} bg-white/5 backdrop-blur-sm`}>
              {meta.icon}
            </div>
            {/* Tech pills */}
            <div className="flex flex-wrap justify-center gap-1.5 max-w-[220px]">
              {project.technologies?.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/8 border border-white/10 text-white/50"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-2.5 right-2.5 z-20">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-semibold tracking-wide shadow-lg shadow-primary/20">
            Featured
          </Badge>
        </div>
      )}
    </div>
  );
}

function PortfolioCard({ project }: { project: PortfolioProject }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div
        className={`h-full flex flex-col overflow-hidden rounded-xl border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30 group ${
          project.featured
            ? "border-primary/20 hover:border-primary/40"
            : "border-border/40 hover:border-border/80"
        }`}
      >
        <ProjectImage project={project} />

        <div className="flex-1 p-5 flex flex-col">
          <div className="text-[11px] font-semibold text-primary mb-1.5 uppercase tracking-widest">
            {project.category}
          </div>
          <h3 className="text-base font-semibold mb-2 leading-snug group-hover:text-primary transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.technologies?.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono text-muted-foreground/70 bg-secondary/40 border border-border/30 px-2 py-0.5 rounded-md"
              >
                {tech}
              </span>
            ))}
            {(project.technologies?.length || 0) > 4 && (
              <span className="text-[11px] font-mono text-muted-foreground/50 bg-secondary/30 px-2 py-0.5 rounded-md">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-border/20">
            {project.githubUrl && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs border-border/40 hover:border-border"
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noreferrer">
                  <Github className="mr-1.5 h-3.5 w-3.5" />
                  Source
                </a>
              </Button>
            )}
            {project.demoUrl && (
              <Button
                size="sm"
                className="flex-1 h-8 text-xs"
                asChild
              >
                <a href={project.demoUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Live Demo
                </a>
              </Button>
            )}
            {!project.githubUrl && !project.demoUrl && (
              <span className="text-[11px] text-muted-foreground/40 italic">
                Link tidak tersedia
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [filter, setFilter] = useState<string>("All");
  const { data: projects, isLoading } = useListPortfolio();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set((projects || []).map((p) => p.category))),
  ];

  const filteredProjects =
    projects
      ?.filter((p) => filter === "All" || p.category === filter)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.order || 0) - (b.order || 0);
      }) || [];

  return (
    <div className="container max-w-6xl mx-auto py-12 md:py-20 px-4">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Selected <span className="text-primary">Works</span>
        </h1>
        <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
          A showcase of my recent projects, demonstrating my approach to solving
          complex problems with clean, maintainable code.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-border/40 overflow-hidden"
            >
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === cat
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "bg-secondary/60 text-secondary-foreground border border-border/40 hover:border-border hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-border">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Tidak ada proyek
              </h3>
              <p className="text-muted-foreground text-sm">
                Belum ada proyek dalam kategori ini.
              </p>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project: PortfolioProject) => (
                  <PortfolioCard key={project.id} project={project} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
