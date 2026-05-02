import { useEffect } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const { data: profile, isLoading } = useGetProfile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-12 px-4 space-y-12">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <Skeleton className="h-[400px] rounded-xl" />
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 md:py-20 px-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-20"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            About <span className="text-primary">Me</span>
          </h1>
          <div className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
            {profile?.bio || "No bio available."}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Experience */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-semibold border-b border-border pb-4">Experience</h2>
            <div className="space-y-8">
              {profile?.experience?.length ? (
                profile.experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative pl-6 border-l border-border/50 before:absolute before:left-[-5px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                    <div className="mb-1 flex flex-wrap items-baseline gap-2">
                      <h3 className="font-semibold text-foreground">{exp.position}</h3>
                      <span className="text-sm text-primary">@ {exp.company}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-3 font-mono">
                      {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mb-3">{exp.description}</p>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {exp.technologies.map(tech => (
                          <Badge key={tech} variant="secondary" className="text-xs bg-secondary/50">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No experience listed.</p>
              )}
            </div>
          </motion.div>

          {/* Education */}
          <motion.div variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-semibold border-b border-border pb-4">Education</h2>
            <div className="space-y-8">
              {profile?.education?.length ? (
                profile.education.map((edu, idx) => (
                  <div key={edu.id || idx} className="relative pl-6 border-l border-border/50 before:absolute before:left-[-5px] before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary">
                    <h3 className="font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                    <div className="text-primary text-sm mb-1">{edu.institution}</div>
                    <div className="text-xs text-muted-foreground mb-2 font-mono">
                      {edu.startYear} — {edu.endYear}
                    </div>
                    {edu.description && (
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No education listed.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Skills & Expertise */}
        <motion.div variants={itemVariants} className="space-y-8">
          <h2 className="text-2xl font-semibold border-b border-border pb-4">Skills & Expertise</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-medium mb-6 text-muted-foreground">Technical Proficiency</h3>
              <div className="space-y-6">
                {profile?.skills?.length ? (
                  profile.skills.map((skill, idx) => (
                    <div key={skill.id || idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm">No skills listed.</p>
                )}
              </div>
            </div>

            <div className="space-y-8">
              {profile?.expertiseAreas && profile.expertiseAreas.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-muted-foreground">Areas of Focus</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.expertiseAreas.map(area => (
                      <Badge key={area} variant="outline" className="px-3 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {profile?.tools && profile.tools.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 text-muted-foreground">Tools & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tools.map(tool => (
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
