import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const TITLES = [
  "Web Developer",
  "Full-stack Engineer",
  "Accounting Professional",
  "Tech Enthusiast",
];
const PERIOD = 2000;

function useTypewriter(toRotate: string[], period: number) {
  const [txt, setTxt] = useState("");
  const state = useRef({
    loopNum: 0,
    isDeleting: false,
    txt: "",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function tick() {
      const s = state.current;
      const i = s.loopNum % toRotate.length;
      const fullTxt = toRotate[i];

      if (s.isDeleting) {
        s.txt = fullTxt.substring(0, s.txt.length - 1);
      } else {
        s.txt = fullTxt.substring(0, s.txt.length + 1);
      }
      setTxt(s.txt);

      let delta = 200 - Math.random() * 100;
      if (s.isDeleting) delta /= 2;

      if (!s.isDeleting && s.txt === fullTxt) {
        s.isDeleting = true;
        delta = period;
      } else if (s.isDeleting && s.txt === "") {
        s.isDeleting = false;
        s.loopNum++;
        delta = 500;
      }

      timeoutRef.current = setTimeout(tick, delta);
    }

    timeoutRef.current = setTimeout(tick, 600);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [toRotate, period]);

  return txt;
}

function AvatarRing({ src, name }: { src?: string; name?: string }) {
  const initials = name
    ? name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : "FJ";

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer glow pulse */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "calc(100% + 24px)",
          height: "calc(100% + 24px)",
          background:
            "radial-gradient(circle, rgba(253,230,138,0.18) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Yellow ring border */}
      <div
        className="relative rounded-full p-[3px]"
        style={{
          background:
            "linear-gradient(135deg, #FDE68A 0%, #F59E0B 40%, #FDE68A 70%, #FBBF24 100%)",
          boxShadow:
            "0 0 24px rgba(253,230,138,0.45), 0 0 48px rgba(253,230,138,0.2), inset 0 0 12px rgba(253,230,138,0.1)",
        }}
      >
        {/* Inner dark ring gap */}
        <div className="rounded-full p-[3px] bg-[#121212]">
          {/* Avatar */}
          <div className="h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
            {src ? (
              <img
                src={src}
                alt={name || "Fariz"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-primary select-none">
                {initials}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: profile } = useGetProfile();
  const txt = useTypewriter(TITLES, PERIOD);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const displayName = profile?.name || "Fariz Jelang Ramadhan";

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        {/* Background radial glow */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(253,230,138,0.06) 0%, transparent 70%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center gap-5"
        >
          {/* Avatar with glowing ring */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
          >
            <AvatarRing
              src={profile?.avatarUrl || undefined}
              name={displayName}
            />
          </motion.div>

          {/* Hello World line */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-sm md:text-base text-primary font-medium tracking-wide"
          >
            Hello World, I'm
          </motion.p>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight max-w-xl"
          >
            {displayName}
          </motion.h1>

          {/* Typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="h-9 flex items-center justify-center"
          >
            <span className="text-xl md:text-2xl font-semibold text-primary">
              {txt}
              <span
                className="inline-block w-[2px] h-6 bg-primary ml-[2px] align-middle animate-[blink_0.8s_step-end_infinite]"
                style={{ verticalAlign: "middle" }}
              />
            </span>
          </motion.div>

          {/* Welcome line */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="text-sm md:text-base text-muted-foreground max-w-sm"
          >
            Welcome to my personal website.{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="flex items-center gap-4 mt-2"
          >
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center justify-center h-10 w-10 rounded-full border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mt-3"
          >
            <Link href="/portfolio">
              <button className="h-11 px-7 rounded-full bg-primary text-primary-foreground text-sm font-semibold transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:scale-95">
                Lihat Portfolio
              </button>
            </Link>
            <Link href="/contact">
              <button className="h-11 px-7 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:text-primary hover:bg-primary/8 active:scale-95">
                Hubungi Saya
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── About snippet ─────────────────────────────────── */}
      <section className="w-full py-20 bg-white/[0.02] border-t border-border/30">
        <div className="container max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary/70 mb-3">
              About Me
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {profile?.bio
                ? profile.bio.split("\n")[0]
                : "Saya profesional muda dengan keahlian di bidang akuntansi dan pengembangan teknologi. Saya percaya kombinasi keduanya adalah kunci solusi bisnis yang efektif di era digital."}
            </p>
            <Link href="/about">
              <button className="mt-6 text-sm text-primary/70 hover:text-primary transition-colors underline underline-offset-4 decoration-dotted">
                Selengkapnya →
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
