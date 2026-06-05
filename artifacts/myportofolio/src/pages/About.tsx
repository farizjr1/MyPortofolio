import { useEffect } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Wrench, Target, MapPin, Calendar } from "lucide-react";

export default function About() {
  const { data: profile, isLoading } = useGetProfile();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4 space-y-10">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="container max-w-5xl mx-auto py-12 md:py-20 px-4">
      <motion.div variants={container} initial="hidden" animate="visible" className="space-y-20">

        {/* ── Header + Bio ── */}
        <motion.div variants={item} className="grid md:grid-cols-5 gap-10 items-start">
          <div className="md:col-span-3 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3">Tentang Saya</p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5">
                About <span className="text-primary">Me</span>
              </h1>
            </div>
            <div className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {profile?.bio || "Belum ada bio tersedia."}
            </div>
          </div>

          {/* Quick Info card */}
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/70">Info</h3>
              {profile?.location && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-primary/10 rounded-lg"><MapPin className="h-4 w-4 text-primary" /></div>
                  <span className="text-muted-foreground">{profile.location}</span>
                </div>
              )}
              {profile?.title && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-primary/10 rounded-lg"><Target className="h-4 w-4 text-primary" /></div>
                  <span className="text-muted-foreground">{profile.title}</span>
                </div>
              )}
              {profile?.availableForWork !== undefined && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-emerald-400/10 rounded-lg"><Briefcase className="h-4 w-4 text-emerald-400" /></div>
                  <span className={profile.availableForWork ? "text-emerald-400 font-medium" : "text-muted-foreground"}>
                    {profile.availableForWork ? "Tersedia untuk proyek" : "Saat ini tidak tersedia"}
                  </span>
                </div>
              )}
              {profile?.tools && profile.tools.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs text-muted-foreground/60 mb-2">Stack Utama</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.tools.slice(0, 6).map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Experience + Education ── */}
        <div className="grid md:grid-cols-2 gap-14">
          {/* Experience */}
          <motion.div variants={item} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg"><Briefcase className="h-5 w-5 text-primary" /></div>
              <h2 className="text-xl font-bold">Pengalaman</h2>
            </div>
            <div className="space-y-7">
              {profile?.experience?.length ? (
                profile.experience.map((exp, idx) => (
                  <motion.div
                    key={exp.id || idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                    className="relative pl-6 border-l-2 border-border/40 before:absolute before:left-[-5px] before:top-2.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-primary before:ring-4 before:ring-background"
                  >
                    <div className="mb-1">
                      <h3 className="font-semibold text-foreground">{exp.position}</h3>
                      <span className="text-sm text-primary font-medium">@ {exp.company}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-mono">
                      <Calendar className="h-3 w-3" />
                      {exp.startDate} — {exp.isCurrent ? "Sekarang" : exp.endDate}
                    </div>
                    {exp.description && <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{exp.description}</p>}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-secondary/50">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Belum ada pengalaman tersedia.</p>
              )}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div variants={item} className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-5 w-5 text-primary" /></div>
              <h2 className="text-xl font-bold">Pendidikan</h2>
            </div>
            <div className="space-y-7">
              {profile?.education?.length ? (
                profile.education.map((edu, idx) => (
                  <motion.div
                    key={edu.id || idx}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.06 }}
                    className="relative pl-6 border-l-2 border-border/40 before:absolute before:left-[-5px] before:top-2.5 before:h-2.5 before:w-2.5 before:rounded-full before:bg-primary before:ring-4 before:ring-background"
                  >
                    <h3 className="font-semibold text-foreground">{edu.degree} — {edu.field}</h3>
                    <div className="text-primary text-sm font-medium mb-1">{edu.institution}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 font-mono">
                      <Calendar className="h-3 w-3" />
                      {edu.startYear} — {edu.endYear}
                    </div>
                    {edu.description && <p className="text-sm text-muted-foreground leading-relaxed">{edu.description}</p>}
                  </motion.div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Belum ada pendidikan tersedia.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Skills ── */}
        <motion.div variants={item} className="space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-border/50">
            <div className="p-2 bg-primary/10 rounded-lg"><Wrench className="h-5 w-5 text-primary" /></div>
            <h2 className="text-xl font-bold">Keahlian & Teknologi</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Skill bars */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-6">Tingkat Kemahiran</h3>
              <div className="space-y-5">
                {profile?.skills?.length ? (
                  profile.skills.map((skill, idx) => (
                    <motion.div
                      key={skill.id || idx}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="space-y-1.5"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground tabular-nums">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.05, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">Belum ada skill tersedia.</p>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {profile?.expertiseAreas && profile.expertiseAreas.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Area Fokus</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertiseAreas.map((area) => (
                      <Badge key={area} variant="outline" className="px-3 py-1 text-sm border-primary/25 bg-primary/8 text-primary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.tools && profile.tools.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/60 mb-4">Tools & Teknologi</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="px-3 py-1 text-sm">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
