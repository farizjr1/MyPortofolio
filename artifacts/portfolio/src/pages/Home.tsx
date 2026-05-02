import { useEffect } from "react";
import { Link } from "wouter";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  const { data: profile } = useGetProfile();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col justify-center items-center relative px-4 text-center">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.03)_0%,rgba(0,0,0,0)_50%)] pointer-events-none"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 max-w-4xl mx-auto flex flex-col items-center"
        >
          {profile?.avatarUrl && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 rounded-full p-1 border border-border bg-card/50 overflow-hidden h-32 w-32 md:h-40 md:w-40"
            >
              <img 
                src={profile.avatarUrl} 
                alt={profile.name || "Fariz"} 
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-500"
              />
            </motion.div>
          )}
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground">
            Hi, I'm <span className="text-primary inline-block">{profile?.name || "Fariz Jelang Ramadhan"}</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-2xl mx-auto leading-relaxed">
            {profile?.title || "Professional Developer & Accounting Specialist"}
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link href="/portfolio">
              <Button size="lg" className="h-12 px-8 text-base group">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Get in Touch
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center gap-6">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </a>
            )}
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </a>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </section>

      {/* Brief Intro Section */}
      <section className="w-full py-24 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold mb-6 text-primary">About Me</h3>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              {profile?.bio || "I bridge the gap between complex technical requirements and elegant business solutions. With a unique background in both development and accounting, I build systems that are not only performant but also perfectly aligned with business objectives."}
            </p>
            <Link href="/about">
              <Button variant="link" className="text-primary hover:text-primary/80">
                Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
