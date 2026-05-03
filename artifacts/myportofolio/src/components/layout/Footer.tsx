import { Link } from "wouter";
import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react";
import { useGetProfile } from "@workspace/api-client-react";

export default function Footer() {
  const { data: profile } = useGetProfile();
  const year = new Date().getFullYear();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/cv", label: "CV" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    {
      href: profile?.githubUrl || "https://github.com/farizjr1",
      label: "GitHub",
      icon: <Github className="h-4 w-4" />,
    },
    {
      href: profile?.linkedinUrl || "https://linkedin.com/in/farizjr",
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
    },
    {
      href: `mailto:${profile?.email || "fariz@example.com"}`,
      label: "Email",
      icon: <Mail className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <span className="text-2xl font-bold tracking-tight text-primary cursor-pointer">
                Fariz.
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Full-Stack Developer & Accounting Professional. Membangun solusi digital yang efisien dan elegan.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Navigasi
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:text-primary cursor-pointer">
                      <span className="h-px w-0 bg-primary transition-all duration-200 group-hover:w-3" />
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / CTA */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Kontak
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tertarik bekerja sama? Saya terbuka untuk proyek baru dan peluang kolaborasi.
            </p>
            <a
              href={`mailto:${profile?.email || "fariz@example.com"}`}
              className="group inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-200 hover:gap-3"
            >
              Kirim pesan
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            {profile?.location && (
              <p className="text-xs text-muted-foreground/60 pt-1">
                📍 {profile.location}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground/50 text-center sm:text-left">
            &copy; {year} Fariz Jelang Ramadhan. All Rights Reserved.
          </p>
          <p className="text-xs text-muted-foreground/40 flex items-center gap-1.5">
            Made with
            <span className="text-primary/70">♥</span>
            by{" "}
            <a
              href="https://flutce.app"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground/60 hover:text-primary transition-colors duration-200 underline underline-offset-2 decoration-dotted"
            >
              Flutce
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
