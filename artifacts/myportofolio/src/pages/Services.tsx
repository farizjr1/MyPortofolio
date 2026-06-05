import { useEffect } from "react";
import { useListContent } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Layers, CheckCircle2 } from "lucide-react";

const SECTION_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  services: { label: "Layanan", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  home: { label: "Tentang", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  about: { label: "Tentang Saya", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  testimonials: { label: "Testimoni", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  custom: { label: "Lainnya", color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-400/20" },
};

function ContentCard({
  item,
  index,
}: {
  item: { id: string; title: string; body: string; section: string };
  index: number;
}) {
  const meta = SECTION_META[item.section] ?? SECTION_META.custom;
  const lines = item.body.split("\n").filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative flex flex-col rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-7 hover:border-primary/30 hover:bg-card/60 hover:shadow-xl hover:shadow-black/20 transition-all duration-300"
    >
      {/* Subtle top gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${meta.bg} border ${meta.border}`}>
          <Layers className={`h-5 w-5 ${meta.color}`} />
        </div>
        <Badge variant="outline" className={`text-[11px] ${meta.color} ${meta.bg} border ${meta.border}`}>
          {meta.label}
        </Badge>
      </div>

      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-200">
        {item.title}
      </h3>

      {/* If body has bullet-like lines (starting with -), render as checklist */}
      {lines.every((l) => l.startsWith("-") || l.startsWith("•") || l.startsWith("*")) ? (
        <ul className="space-y-2 flex-1">
          {lines.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary/60 mt-0.5 shrink-0" />
              <span>{line.replace(/^[-•*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 whitespace-pre-line">
          {item.body}
        </p>
      )}
    </motion.div>
  );
}

export default function Services() {
  const { data: contents, isLoading } = useListContent({
    published: "true",
  } as Parameters<typeof useListContent>[0]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const items = (contents ?? []).filter((c) => c.published);

  return (
    <div className="container max-w-6xl mx-auto py-12 md:py-20 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-14 max-w-3xl"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3">
          Apa yang saya tawarkan
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
          Layanan & <span className="text-primary">Keahlian</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Saya menawarkan berbagai layanan profesional di bidang teknologi, keuangan, dan pengembangan digital.
          Setiap proyek dikerjakan dengan standar kualitas tinggi dan pendekatan yang terstruktur.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-24 rounded-2xl border border-dashed border-border/60"
        >
          <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-lg font-semibold mb-2">Belum ada konten tersedia</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Konten akan muncul setelah dipublikasikan melalui admin panel.
          </p>
          <Link href="/contact">
            <span className="inline-flex items-center gap-2 text-sm text-primary hover:underline cursor-pointer">
              Hubungi saya langsung <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-20 rounded-2xl border border-primary/20 bg-primary/5 p-10 text-center"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Tertarik bekerja sama?
        </h2>
        <p className="text-muted-foreground mb-7 max-w-lg mx-auto">
          Mari diskusikan kebutuhan Anda. Saya siap membantu mewujudkan ide Anda menjadi solusi nyata.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 active:scale-95">
              Hubungi Sekarang
            </button>
          </Link>
          <Link href="/portfolio">
            <button className="h-12 px-8 rounded-full border border-white/15 bg-white/5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:bg-primary/8 active:scale-95">
              Lihat Portfolio
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
