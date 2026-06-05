import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useGetProfile, useListBlogPosts, useListPortfolio } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, Code2, Calculator, TrendingUp, Sparkles, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DEFAULT_TITLES = ["Accountant", "Tech Enthusiast", "Finance Enthusiast", "Full-Stack Developer"];
const PERIOD = 2200;

function useTypewriter(toRotate: string[], period: number) {
  const [txt, setTxt] = useState("");
  const state = useRef({ loopNum: 0, isDeleting: false, txt: "" });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const s = state.current;
      const i = s.loopNum % toRotate.length;
      const fullTxt = toRotate[i];
      s.txt = s.isDeleting
        ? fullTxt.substring(0, s.txt.length - 1)
        : fullTxt.substring(0, s.txt.length + 1);
      setTxt(s.txt);
      let delta = 200 - Math.random() * 100;
      if (s.isDeleting) delta /= 2;
      if (!s.isDeleting && s.txt === fullTxt) { s.isDeleting = true; delta = period; }
      else if (s.isDeleting && s.txt === "") { s.isDeleting = false; s.loopNum++; delta = 500; }
      timeoutRef.current = setTimeout(tick, delta);
    }
    timeoutRef.current = setTimeout(tick, 600);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [toRotate, period]);

  return txt;
}

function AvatarRing({ src, name }: { src?: string; name?: string }) {
  const initials = name ? name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase() : "FJ";
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className="absolute rounded-full"
        style={{ width: "calc(100% + 28px)", height: "calc(100% + 28px)", background: "radial-gradient(circle, rgba(253,230,138,0.15) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.07, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative rounded-full p-[3px]" style={{ background: "linear-gradient(135deg, #FDE68A 0%, #F59E0B 40%, #FDE68A 70%, #FBBF24 100%)", boxShadow: "0 0 28px rgba(253,230,138,0.4), 0 0 56px rgba(253,230,138,0.15)" }}>
        <div className="rounded-full p-[3px] bg-[#121212]">
          <div className="h-40 w-40 md:h-52 md:w-52 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
            {src ? <img src={src} alt={name || "Fariz"} className="w-full h-full object-cover" /> : <span className="text-4xl font-bold text-primary select-none">{initials}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

const EXPERTISE = [
  { icon: Code2, label: "Full-Stack Development", desc: "Web apps modern dengan React & Node.js", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  { icon: Calculator, label: "Akuntansi & Keuangan", desc: "Laporan keuangan, audit, dan analisis", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
  { icon: TrendingUp, label: "Data Analysis", desc: "Visualisasi data dan business intelligence", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/20" },
];

function formatDate(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function Home() {
  const { data: profile } = useGetProfile();
  const { data: blogData } = useListBlogPosts({ limit: 3 } as Parameters<typeof useListBlogPosts>[0]);
  const { data: projects } = useListPortfolio();

  const titles = profile?.typewriterTitles?.length ? profile.typewriterTitles : DEFAULT_TITLES;
  const txt = useTypewriter(titles, PERIOD);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const displayName = profile?.name || "Fariz Jelang Ramadhan";
  const recentPosts = (blogData as { posts?: { id: string; title: string; slug: string; excerpt: string; tags?: string[]; publishedAt?: string }[] } | undefined)?.posts ?? [];
  const featuredProjects = (projects ?? []).filter((p) => p.featured).slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(253,230,138,0.05) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-40 h-80 w-80 rounded-full bg-primary/3 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-5"
        >
          <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}>
            <AvatarRing src={profile?.avatarUrl || "/avatar-placeholder.svg"} name={displayName} />
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-sm md:text-base text-primary font-medium tracking-widest uppercase">
            Hello World, I'm
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-2xl">
            {displayName}
          </motion.h1>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="h-10 flex items-center justify-center">
            <span className="text-xl md:text-2xl font-semibold text-primary">
              {txt}
              <span className="inline-block w-[2px] h-6 bg-primary ml-[2px] align-middle animate-[blink_0.8s_step-end_infinite]" style={{ verticalAlign: "middle" }} />
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">
            {profile?.bio ? profile.bio.split("\n")[0] : "Profesional di bidang akuntansi dan teknologi. Membangun solusi digital yang efisien dan elegan. 👋"}
          </motion.p>

          {/* Social links */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }} className="flex items-center gap-3 mt-1">
            {[
              profile?.githubUrl && { href: profile.githubUrl, icon: <Github className="h-4 w-4" />, label: "GitHub" },
              profile?.linkedinUrl && { href: profile.linkedinUrl, icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
              profile?.email && { href: `mailto:${profile.email}`, icon: <Mail className="h-4 w-4" />, label: "Email" },
            ].filter(Boolean).map((s: any) => (
              <a key={s.label} href={s.href} target={s.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" aria-label={s.label} className="flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary hover:scale-110">
                {s.icon}
              </a>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }} className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/portfolio">
              <button className="h-12 px-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-95">
                Lihat Portfolio
              </button>
            </Link>
            <Link href="/contact">
              <button className="h-12 px-8 rounded-full border border-white/12 bg-white/5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:bg-primary/8 active:scale-95">
                Hubungi Saya
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1 text-muted-foreground/40"
          >
            <div className="h-8 w-5 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
              <div className="h-2 w-1 rounded-full bg-primary/50" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats strip ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full border-y border-border/30 bg-white/[0.015]"
      >
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-3 divide-x divide-border/30">
            {[
              { value: `${(projects ?? []).length}+`, label: "Proyek Selesai" },
              { value: "3+", label: "Tahun Pengalaman" },
              { value: "100%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="px-6 py-2 text-center"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Expertise ── */}
      <section className="w-full py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3">Keahlian</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Apa yang <span className="text-primary">Saya Lakukan</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kombinasi unik antara keahlian teknologi dan keuangan untuk solusi bisnis yang komprehensif.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {EXPERTISE.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border/50 bg-card/30 p-7 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <div className={`inline-flex p-3 rounded-xl border ${item.bg} mb-5`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{item.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8">
            <Link href="/services">
              <span className="inline-flex items-center gap-2 text-sm text-primary/80 hover:text-primary transition-colors cursor-pointer group">
                Lihat semua layanan
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      {featuredProjects.length > 0 && (
        <section className="w-full py-16 px-4 bg-white/[0.02] border-t border-border/30">
          <div className="container max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Portfolio</p>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Featured <span className="text-primary">Projects</span>
                </h2>
              </div>
              <Link href="/portfolio">
                <span className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                  Lihat Semua <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-xl border border-border/50 bg-card/30 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                >
                  {project.imageUrl && (
                    <div className="h-36 overflow-hidden">
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                      <Sparkles className="h-3.5 w-3.5 text-primary/60 shrink-0 mt-0.5" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {(project.technologies ?? []).slice(0, 3).map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px] px-1.5">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Blog Posts ── */}
      {recentPosts.length > 0 && (
        <section className="w-full py-16 px-4 border-t border-border/30">
          <div className="container max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-2">Tulisan Terbaru</p>
                <h2 className="text-2xl md:text-3xl font-bold">
                  Blog & <span className="text-primary">Artikel</span>
                </h2>
              </div>
              <Link href="/blog">
                <span className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                  Lihat Semua <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {recentPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group rounded-xl border border-border/50 bg-card/30 p-5 hover:border-primary/30 hover:bg-card/50 transition-all duration-300 hover:shadow-md cursor-pointer h-full">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map((t) => (
                            <Badge key={t} variant="secondary" className="text-[10px] bg-primary/10 text-primary border-primary/20">{t}</Badge>
                          ))}
                        </div>
                      )}
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground/60">{formatDate(post.publishedAt)}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-primary/40 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About snippet ── */}
      <section className="w-full py-20 bg-white/[0.02] border-t border-border/30">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3">Tentang Saya</p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {profile?.bio ? profile.bio.split("\n")[0] : "Saya profesional muda dengan keahlian di bidang akuntansi dan pengembangan teknologi. Saya percaya kombinasi keduanya adalah kunci solusi bisnis yang efektif di era digital."}
            </p>
            <Link href="/about">
              <button className="mt-7 inline-flex items-center gap-2 text-sm text-primary/70 hover:text-primary transition-colors group">
                Selengkapnya
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
