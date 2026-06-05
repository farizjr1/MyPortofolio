import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { User, Menu, X, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/cv", label: "CV" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const { data: user } = useGetMe({ query: { retry: false } });
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-[#0d0d0d]/85 backdrop-blur-2xl shadow-[0_4px_32px_rgba(0,0,0,0.5)]"
            : "border-b border-transparent bg-transparent backdrop-blur-md"
        }`}
      >
        {/* Top shimmer line */}
        <div
          className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="container flex h-16 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group z-10">
            <span className="text-xl font-bold tracking-tight text-primary transition-all duration-200 group-hover:drop-shadow-[0_0_10px_rgba(253,230,138,0.6)]">
              Fariz.
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 rounded-full border border-white/8 bg-white/4 px-2 py-1.5 backdrop-blur-sm">
              {NAV_LINKS.map((link) => {
                const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                return (
                  <Link key={link.href} href={link.href}>
                    <span
                      className={`relative px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer select-none ${
                        isActive
                          ? "text-background bg-primary shadow-[0_0_12px_rgba(253,230,138,0.3)]"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/6"
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {user && (
              <Link href="/admin">
                <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-muted-foreground backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/10 hover:text-primary cursor-pointer">
                  <User className="h-3.5 w-3.5" />
                  Dashboard
                </span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden relative z-50 flex items-center justify-center h-10 w-10 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus:outline-none"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[#0d0d0d] border-l border-white/8 flex flex-col md:hidden shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/8">
                <span className="text-lg font-bold text-primary">Fariz.</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-white/10 bg-white/5 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto py-4 px-3">
                {NAV_LINKS.map((link, i) => {
                  const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.2 }}
                    >
                      <Link href={link.href}>
                        <span
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 mb-1 cursor-pointer ${
                            isActive
                              ? "bg-primary/15 text-primary border border-primary/25"
                              : "text-muted-foreground hover:bg-white/6 hover:text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />}
                            {link.label}
                          </span>
                          <ChevronRight className="h-4 w-4 opacity-40" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Bottom section */}
              <div className="px-4 py-5 border-t border-white/8 space-y-3">
                {user && (
                  <Link href="/admin">
                    <span className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground border border-white/10 bg-white/5 hover:border-primary/30 hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer">
                      <User className="h-4 w-4" />
                      Dashboard Admin
                    </span>
                  </Link>
                )}
                <p className="text-[11px] text-muted-foreground/40 text-center">
                  © {new Date().getFullYear()} Fariz Jelang Ramadhan
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
