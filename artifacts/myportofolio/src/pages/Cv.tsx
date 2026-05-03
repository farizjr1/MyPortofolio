import { useEffect, useRef, useState } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Download, Printer, ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, Globe, Loader2 } from "lucide-react";
import { Link } from "wouter";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
    experience: profile?.experience || [],
    education: profile?.education || [],
    skills: profile?.skills || [],
    tools: profile?.tools || [],
    expertiseAreas: profile?.expertiseAreas || [],
  };
}

// ─── Section Title ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-7 mb-3">
      <h2 className="cv-section-title text-[10.5pt] font-bold uppercase tracking-[0.14em] text-gray-900 whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-[1.5px] bg-gray-900" />
    </div>
  );
}

// ─── CV Preview (HTML — used both on screen and captured for PDF) ──────────────
export function CvPreview({ profile, forExport = false }: { profile: any; forExport?: boolean }) {
  const d = buildCvData(profile);

  const skillsByCategory = (d.skills as any[]).reduce((acc: Record<string, string[]>, s: any) => {
    const cat = s.category || "Lainnya";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s.name);
    return acc;
  }, {});

  const contactItems = [
    d.email    && { icon: <Mail    className="h-[10px] w-[10px]" />, text: d.email,    href: `mailto:${d.email}` },
    d.phone    && { icon: <Phone   className="h-[10px] w-[10px]" />, text: d.phone },
    d.location && { icon: <MapPin  className="h-[10px] w-[10px]" />, text: d.location },
    d.linkedin && { icon: <Linkedin className="h-[10px] w-[10px]" />, text: d.linkedin.replace("https://www.", "").replace("https://", ""), href: d.linkedin },
    d.github   && { icon: <Github  className="h-[10px] w-[10px]" />, text: d.github.replace("https://", ""), href: d.github },
    d.website  && { icon: <Globe   className="h-[10px] w-[10px]" />, text: d.website.replace("https://", ""), href: d.website },
  ].filter(Boolean) as any[];

  const base: React.CSSProperties = forExport
    ? { width: "794px", minHeight: "1123px", padding: "68px 60px", fontSize: "10pt", lineHeight: 1.5, fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#fff", color: "#111", boxSizing: "border-box" }
    : { width: "210mm", minHeight: "297mm", padding: "18mm 16mm", fontSize: "10pt", lineHeight: 1.45, boxSizing: "border-box" };

  return (
    <div id="cv-preview" className="bg-white text-gray-900" style={base}>
      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: "22pt", fontWeight: 800, letterSpacing: "0.03em", textTransform: "uppercase", lineHeight: 1.15, marginBottom: "4px", color: "#111" }}>
          {d.name}
        </h1>
        {d.title && (
          <p style={{ fontSize: "11pt", color: "#555", marginTop: "2px", marginBottom: "4px" }}>{d.title}</p>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px 20px", marginTop: "8px", fontSize: "8.5pt", color: "#444" }}>
        {contactItems.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ color: "#666" }}>{item.icon}</span>
            {item.href ? (
              <a href={item.href} style={{ color: "#333", textDecoration: "none" }}>{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>

      <div style={{ height: "1.5px", backgroundColor: "#111", marginTop: "10px", marginBottom: "2px" }} />

      {/* ── Summary ── */}
      {d.summary && (
        <div>
          <SectionTitle>Profil Singkat</SectionTitle>
          <p style={{ fontSize: "9.5pt", textAlign: "justify", lineHeight: 1.6, color: "#333" }}>{d.summary}</p>
        </div>
      )}

      {/* ── Experience ── */}
      {(d.experience as any[]).length > 0 && (
        <div>
          <SectionTitle>Pengalaman Kerja</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {(d.experience as any[]).map((exp: any, i: number) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: "10.5pt", fontWeight: 700, color: "#111" }}>{exp.company}</span>
                  <span style={{ fontSize: "8.5pt", color: "#666", flexShrink: 0, marginLeft: "8px" }}>
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                  </span>
                </div>
                <div style={{ fontSize: "9.5pt", fontStyle: "italic", color: "#555", marginBottom: "4px", marginTop: "1px" }}>{exp.position}</div>
                {exp.description && (
                  <div style={{ borderLeft: "2px solid #ddd", paddingLeft: "10px", marginTop: "4px" }}>
                    <p style={{ fontSize: "9.5pt", color: "#333", lineHeight: 1.55 }}>• {exp.description}</p>
                  </div>
                )}
                {exp.technologies?.length > 0 && (
                  <p style={{ fontSize: "8.5pt", color: "#777", marginTop: "4px", paddingLeft: "12px" }}>
                    <strong style={{ color: "#555" }}>Teknologi:</strong> {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Education ── */}
      {(d.education as any[]).length > 0 && (
        <div>
          <SectionTitle>Pendidikan</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(d.education as any[]).map((edu: any, i: number) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
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
          </div>
        </div>
      )}

      {/* ── Skills ── */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div>
          <SectionTitle>Keahlian</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {Object.entries(skillsByCategory).map(([cat, names]) => (
              <div key={cat} style={{ display: "flex", alignItems: "baseline", gap: "8px", fontSize: "9.5pt" }}>
                <span style={{ fontWeight: 700, color: "#222", minWidth: "110px", flexShrink: 0 }}>{cat}</span>
                <span style={{ color: "#444" }}>{(names as string[]).join(" • ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tools ── */}
      {(d.tools as string[]).length > 0 && (
        <div>
          <SectionTitle>Tools &amp; Teknologi</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 8px" }}>
            {(d.tools as string[]).map((tool) => (
              <span
                key={tool}
                style={{
                  fontSize: "8.5pt",
                  padding: "2px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "3px",
                  color: "#444",
                  backgroundColor: "#fafafa",
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Expertise ── */}
      {(d.expertiseAreas as string[]).length > 0 && (
        <div>
          <SectionTitle>Area Keahlian</SectionTitle>
          <p style={{ fontSize: "9.5pt", color: "#444" }}>{(d.expertiseAreas as string[]).join(" • ")}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CvPage() {
  const { data: profile, isLoading } = useGetProfile();
  const exportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDownload = async () => {
    if (!profile || !exportRef.current) return;
    setDownloading(true);
    try {
      // Briefly show the hidden export node so html2canvas can capture it
      exportRef.current.style.display = "block";
      await new Promise(r => setTimeout(r, 120)); // let browser paint

      const canvas = await html2canvas(exportRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 794,
        windowWidth: 794,
      });

      exportRef.current.style.display = "none";

      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();   // 595.28 pt
      const pageH = pdf.internal.pageSize.getHeight();  // 841.89 pt

      const imgW = canvas.width;
      const imgH = canvas.height;
      const ratio = pageW / imgW;
      const scaledH = imgH * ratio;

      const imgData = canvas.toDataURL("image/jpeg", 0.97);

      if (scaledH <= pageH) {
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, scaledH);
      } else {
        // Multi-page: slice canvas per A4 page
        let yOffset = 0;
        while (yOffset < imgH) {
          const sliceH = Math.min(imgH - yOffset, Math.floor(pageH / ratio));
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = imgW;
          sliceCanvas.height = sliceH;
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, imgW, sliceH);
          ctx.drawImage(canvas, 0, -yOffset);
          const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.97);
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(sliceData, "JPEG", 0, 0, pageW, sliceH * ratio);
          yOffset += sliceH;
        }
      }

      pdf.save(`${(profile.name || "CV").replace(/\s+/g, "_")}_ATS_CV.pdf`);
    } catch (e) {
      console.error("PDF error", e);
    } finally {
      if (exportRef.current) exportRef.current.style.display = "none";
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("cv-preview");
    if (!el) return;
    const w = window.open("", "_blank", "width=900,height=750");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>CV — ${profile?.name || ""}</title>
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

      {/* ── Visible CV Preview ── */}
      <div className="py-10 px-4">
        {isLoading ? (
          <div className="max-w-[210mm] mx-auto bg-white rounded-xl shadow-2xl h-[297mm] flex items-center justify-center">
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
            className="max-w-[210mm] mx-auto shadow-2xl rounded-sm overflow-hidden"
          >
            <CvPreview profile={profile} />
          </motion.div>
        )}

        {/* ATS Note */}
        <div className="max-w-[210mm] mx-auto mt-6 p-4 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground/70 text-center">
            ✅ <strong className="text-muted-foreground">ATS-Friendly</strong> · PDF yang didownload identik dengan tampilan di atas ·{" "}
            Edit data di{" "}
            <Link href="/admin/profile">
              <span className="text-primary underline decoration-dotted cursor-pointer hover:text-primary/80">Profile Editor</span>
            </Link>{" "}
            untuk update CV secara otomatis.
          </p>
        </div>
      </div>

      {/* ── Hidden Export Node (794px wide = A4 at 96dpi) ── */}
      <div
        ref={exportRef}
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: "-9999px",
          zIndex: -1,
          backgroundColor: "#fff",
        }}
      >
        {!isLoading && <CvPreview profile={profile} forExport />}
      </div>
    </div>
  );
}
