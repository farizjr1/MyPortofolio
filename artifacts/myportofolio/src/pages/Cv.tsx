import { useEffect, useState } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Download, Printer, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useToast } from "@/hooks/use-toast";

// ─── Data Builder ─────────────────────────────────────────────────────────────
function buildCvData(profile: any) {
  return {
    name: profile?.name || "Nama Lengkap",
    title: profile?.title || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    location: profile?.location || "",
    linkedin: profile?.linkedinUrl || "",
    github: profile?.githubUrl || "",
    website: profile?.websiteUrl || "",
    summary: profile?.bio ? profile.bio.split("\n")[0] : "",
    experience: (profile?.experience || []) as any[],
    education: (profile?.education || []) as any[],
    skills: (profile?.skills || []) as any[],
    tools: (profile?.tools || []) as string[],
    expertiseAreas: (profile?.expertiseAreas || []) as string[],
  };
}

// ─── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "24px", marginBottom: "10px" }}>
      <h2 style={{
        fontSize: "10.5pt", fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.14em", color: "#111", whiteSpace: "nowrap", margin: 0,
      }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: "1.5px", backgroundColor: "#111" }} />
    </div>
  );
}

// ─── CV Preview ───────────────────────────────────────────────────────────────
// Uses ONLY inline styles + plain Unicode symbols — no SVG icons, no Tailwind classes
// so html2canvas can capture it perfectly.
export function CvPreview({ profile }: { profile: any }) {
  const d = buildCvData(profile);

  const skillsByCategory = d.skills.reduce((acc: Record<string, string[]>, s: any) => {
    const cat = s.category || "Lainnya";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  // Contact row items — plain text symbols instead of SVG icons
  const contactItems = [
    d.email    && { symbol: "✉",  text: d.email },
    d.phone    && { symbol: "☏",  text: d.phone },
    d.location && { symbol: "⊙",  text: d.location },
    d.linkedin && { symbol: "in", text: d.linkedin.replace("https://www.", "").replace("https://", "") },
    d.github   && { symbol: "⎇",  text: d.github.replace("https://", "") },
    d.website  && { symbol: "⊕",  text: d.website.replace("https://", "") },
  ].filter(Boolean) as { symbol: string; text: string }[];

  return (
    <div
      id="cv-preview"
      style={{
        width: "794px",
        padding: "68px 60px 80px 60px",
        fontSize: "10pt",
        lineHeight: 1.5,
        fontFamily: "Arial, Helvetica, sans-serif",
        backgroundColor: "#ffffff",
        color: "#111111",
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <h1 style={{ fontSize: "22pt", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.1, margin: 0, color: "#111" }}>
        {d.name}
      </h1>
      {d.title && (
        <p style={{ fontSize: "11pt", color: "#555", margin: "4px 0 0 0" }}>{d.title}</p>
      )}

      {/* Contact row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", marginTop: "8px", fontSize: "8.5pt", color: "#444" }}>
        {contactItems.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontWeight: 700, color: "#666", fontSize: "9pt" }}>{item.symbol}</span>
            <span>{item.text}</span>
          </span>
        ))}
      </div>

      <div style={{ height: "1.5px", backgroundColor: "#111", marginTop: "10px" }} />

      {/* ── Summary ── */}
      {d.summary && (
        <>
          <SectionTitle>Profil Singkat</SectionTitle>
          <p style={{ fontSize: "9.5pt", textAlign: "justify", lineHeight: 1.6, color: "#333", margin: 0 }}>{d.summary}</p>
        </>
      )}

      {/* ── Experience ── */}
      {d.experience.length > 0 && (
        <>
          <SectionTitle>Pengalaman Kerja</SectionTitle>
          {d.experience.map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "10.5pt", fontWeight: 700, color: "#111" }}>{exp.company}</span>
                <span style={{ fontSize: "8.5pt", color: "#666", flexShrink: 0, marginLeft: "8px" }}>
                  {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                </span>
              </div>
              <div style={{ fontSize: "9.5pt", fontStyle: "italic", color: "#555", marginTop: "1px", marginBottom: "4px" }}>{exp.position}</div>
              {exp.description && (
                <div style={{ borderLeft: "2px solid #ddd", paddingLeft: "10px" }}>
                  <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.55, margin: 0 }}>• {exp.description}</p>
                </div>
              )}
              {exp.technologies?.length > 0 && (
                <p style={{ fontSize: "8.5pt", color: "#777", marginTop: "3px", paddingLeft: "12px", margin: "3px 0 0 12px" }}>
                  <strong style={{ color: "#555" }}>Teknologi:</strong> {exp.technologies.join(", ")}
                </p>
              )}
            </div>
          ))}
        </>
      )}

      {/* ── Education ── */}
      {d.education.length > 0 && (
        <>
          <SectionTitle>Pendidikan</SectionTitle>
          {d.education.map((edu: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "10.5pt", fontWeight: 700, color: "#111" }}>{edu.institution}</div>
                <div style={{ fontSize: "9.5pt", color: "#555", marginTop: "1px" }}>
                  {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                </div>
                {edu.description && (
                  <div style={{ fontSize: "9pt", color: "#666", marginTop: "2px" }}>{edu.description}</div>
                )}
              </div>
              <span style={{ fontSize: "8.5pt", color: "#666", flexShrink: 0, marginLeft: "8px" }}>
                {edu.startYear} – {edu.endYear}
              </span>
            </div>
          ))}
        </>
      )}

      {/* ── Skills ── */}
      {Object.keys(skillsByCategory).length > 0 && (
        <>
          <SectionTitle>Keahlian</SectionTitle>
          {Object.entries(skillsByCategory).map(([cat, names]) => (
            <div key={cat} style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "5px", fontSize: "9.5pt" }}>
              <span style={{ fontWeight: 700, color: "#222", minWidth: "110px", flexShrink: 0 }}>{cat}</span>
              <span style={{ color: "#444" }}>{(names as string[]).join(" • ")}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Tools ── */}
      {d.tools.length > 0 && (
        <>
          <SectionTitle>Tools &amp; Teknologi</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 8px" }}>
            {d.tools.map((tool) => (
              <span key={tool} style={{
                display: "inline-block",
                fontSize: "8pt",
                lineHeight: "1",
                padding: "4px 9px 4px 9px",
                verticalAlign: "middle",
                border: "1px solid #bbb",
                borderRadius: "3px",
                color: "#444",
                backgroundColor: "#f5f5f5",
              }}>
                {tool}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── Expertise ── */}
      {d.expertiseAreas.length > 0 && (
        <>
          <SectionTitle>Area Keahlian</SectionTitle>
          <p style={{ fontSize: "9.5pt", color: "#444", margin: 0 }}>{d.expertiseAreas.join(" • ")}</p>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CvPage() {
  const { data: profile, isLoading } = useGetProfile();
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDownload = async () => {
    if (!profile) return;
    setDownloading(true);

    try {
      const el = document.getElementById("cv-preview");
      if (!el) throw new Error("CV element not found");

      // Wait a frame to ensure all styles are applied
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
      });

      // Map canvas pixels → PDF points using A4 width as anchor
      const A4_W = 595.28;
      const ratio = A4_W / canvas.width;
      // Page height = exact content height — no slicing, no cutting
      const pageH = canvas.height * ratio;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [A4_W, pageH],   // custom tall page — fits all content
      });
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.97),
        "JPEG", 0, 0, A4_W, pageH,
      );

      // Create blob URL and trigger download
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(profile.name || "CV").replace(/\s+/g, "_")}_ATS_CV.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast({ title: "CV berhasil didownload!" });
    } catch (err) {
      console.error("PDF error:", err);
      toast({ variant: "destructive", title: "Gagal generate PDF", description: "Coba lagi atau gunakan tombol Lihat CV untuk print manual." });
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("cv-preview");
    if (!el) return;
    const w = window.open("", "_blank", "width=900,height=750");
    if (!w) {
      toast({ variant: "destructive", title: "Popup diblokir", description: "Izinkan popup di browser untuk membuka halaman print." });
      return;
    }
    w.document.write(`<!DOCTYPE html><html><head>
      <title>CV — ${profile?.name || ""}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Arial,Helvetica,sans-serif;background:#fff;color:#111}
        @media print{@page{size:A4;margin:0}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
      </style>
    </head><body>${el.outerHTML}</body></html>`);
    w.document.close();
    w.onload = () => { w.focus(); w.print(); };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Sticky Action Bar ── */}
      <div className="sticky top-16 z-40 w-full border-b border-border/30 bg-background/90 backdrop-blur-md">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/about">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div>
              <h1 className="text-base font-semibold">Curriculum Vitae</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">ATS-Optimized · Auto-generated dari data profil</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 h-9 px-4 rounded-lg border border-border/50 bg-secondary/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Lihat CV</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={isLoading || downloading}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-60"
            >
              {downloading
                ? <><Loader2 className="h-4 w-4 animate-spin" /><span className="hidden sm:inline">Generating…</span></>
                : <><Download className="h-4 w-4" /><span className="hidden sm:inline">Download PDF</span></>
              }
            </button>
          </div>
        </div>
      </div>

      {/* ── CV Preview ── */}
      <div className="py-10 px-4">
        {isLoading ? (
          <div
            className="mx-auto bg-white rounded-xl shadow-2xl flex items-center justify-center"
            style={{ width: "210mm", height: "297mm" }}
          >
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
              <span className="text-sm">Memuat data profil…</span>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto shadow-2xl rounded-sm overflow-hidden"
            style={{ width: "fit-content" }}
          >
            <CvPreview profile={profile} />
          </motion.div>
        )}

        {/* ATS Note */}
        {!isLoading && (
          <div
            className="mx-auto mt-6 p-4 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm"
            style={{ maxWidth: "210mm" }}
          >
            <p className="text-xs text-muted-foreground/70 text-center">
              ✅ <strong className="text-muted-foreground">ATS-Friendly</strong> · PDF yang didownload identik dengan tampilan di atas ·{" "}
              Edit data di{" "}
              <Link href="/admin/profile">
                <span className="text-primary underline decoration-dotted cursor-pointer hover:text-primary/80">Profile Editor</span>
              </Link>{" "}
              untuk update CV otomatis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
