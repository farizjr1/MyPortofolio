import { useEffect, useRef } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Download, Printer, ArrowLeft, Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { Link } from "wouter";
import { pdf, Document, Page, Text, View, StyleSheet, Link as PdfLink } from "@react-pdf/renderer";

// ─── PDF Styles (ATS-Optimized) ──────────────────────────────────────────────
const pdfStyles = StyleSheet.create({
  page: {
    padding: "18mm 16mm",
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111",
    lineHeight: 1.45,
    backgroundColor: "#fff",
  },
  // Header
  headerName: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 4, letterSpacing: 0.5 },
  headerTitle: { fontSize: 11, color: "#444", marginBottom: 6 },
  headerContact: { flexDirection: "row", flexWrap: "wrap", gap: 10, fontSize: 9, color: "#333" },
  headerContactItem: { flexDirection: "row", alignItems: "center", gap: 3 },
  divider: { height: 1.5, backgroundColor: "#111", marginTop: 8, marginBottom: 12 },
  // Section
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    borderBottomWidth: 1,
    borderBottomColor: "#111",
    paddingBottom: 2,
    marginBottom: 7,
    marginTop: 12,
  },
  // Summary
  summary: { fontSize: 9.5, lineHeight: 1.5, color: "#222", textAlign: "justify" },
  // Experience
  expRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 1 },
  expCompany: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  expDate: { fontSize: 9, color: "#444" },
  expPosition: { fontSize: 9.5, fontFamily: "Helvetica-Oblique", color: "#333", marginBottom: 3 },
  bullet: { fontSize: 9.5, marginBottom: 1.5, paddingLeft: 12 },
  expBlock: { marginBottom: 9 },
  // Education
  eduRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  eduLeft: { flex: 1 },
  eduInstitution: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  eduDegree: { fontSize: 9.5, color: "#333" },
  eduDate: { fontSize: 9, color: "#444" },
  // Skills
  skillRow: { flexDirection: "row", marginBottom: 3 },
  skillLabel: { fontFamily: "Helvetica-Bold", width: "22%", fontSize: 9.5 },
  skillValue: { width: "78%", fontSize: 9.5, color: "#222" },
});

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

// ─── PDF Document ─────────────────────────────────────────────────────────────
function ATSPdfDocument({ profile }: { profile: any }) {
  const d = buildCvData(profile);
  const skillsByCategory = d.skills.reduce((acc: any, s: any) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document title={`${d.name} — CV`} author={d.name} subject="Curriculum Vitae">
      <Page size="A4" style={pdfStyles.page}>
        {/* Header */}
        <Text style={pdfStyles.headerName}>{d.name.toUpperCase()}</Text>
        {d.title && <Text style={pdfStyles.headerTitle}>{d.title}</Text>}
        <View style={pdfStyles.headerContact}>
          {d.email && <Text>{d.email}</Text>}
          {d.phone && <Text>{d.phone}</Text>}
          {d.location && <Text>{d.location}</Text>}
          {d.linkedin && <Text>{d.linkedin.replace("https://", "")}</Text>}
          {d.github && <Text>{d.github.replace("https://", "")}</Text>}
        </View>
        <View style={pdfStyles.divider} />

        {/* Summary */}
        {d.summary && (
          <View>
            <Text style={pdfStyles.sectionTitle}>Profil Singkat</Text>
            <Text style={pdfStyles.summary}>{d.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {d.experience.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>Pengalaman Kerja</Text>
            {d.experience.map((exp: any, i: number) => (
              <View key={i} style={pdfStyles.expBlock} wrap={false}>
                <View style={pdfStyles.expRow}>
                  <Text style={pdfStyles.expCompany}>{exp.company}</Text>
                  <Text style={pdfStyles.expDate}>
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                  </Text>
                </View>
                <Text style={pdfStyles.expPosition}>{exp.position}</Text>
                {exp.description && (
                  <Text style={pdfStyles.bullet}>• {exp.description}</Text>
                )}
                {exp.technologies?.length > 0 && (
                  <Text style={[pdfStyles.bullet, { color: "#555" }]}>
                    Teknologi: {exp.technologies.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {d.education.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>Pendidikan</Text>
            {d.education.map((edu: any, i: number) => (
              <View key={i} style={pdfStyles.eduRow} wrap={false}>
                <View style={pdfStyles.eduLeft}>
                  <Text style={pdfStyles.eduInstitution}>{edu.institution}</Text>
                  <Text style={pdfStyles.eduDegree}>
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </Text>
                  {edu.description && (
                    <Text style={[pdfStyles.eduDegree, { marginTop: 2 }]}>{edu.description}</Text>
                  )}
                </View>
                <Text style={pdfStyles.eduDate}>{edu.startYear} – {edu.endYear}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>Keahlian</Text>
            {Object.entries(skillsByCategory).map(([cat, names]: [string, any], i) => (
              <View key={i} style={pdfStyles.skillRow}>
                <Text style={pdfStyles.skillLabel}>{cat}</Text>
                <Text style={pdfStyles.skillValue}>{(names as string[]).join(" • ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Tools */}
        {d.tools.length > 0 && (
          <View>
            <Text style={pdfStyles.sectionTitle}>Tools & Teknologi</Text>
            <View style={pdfStyles.skillRow}>
              <Text style={pdfStyles.skillValue}>{d.tools.join(" • ")}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mt-7 mb-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 whitespace-nowrap">
        {children}
      </h2>
      <div className="flex-1 h-[1.5px] bg-gray-900" />
    </div>
  );
}

// ─── HTML Live Preview (mirrors PDF layout) ───────────────────────────────────
function CvPreview({ profile }: { profile: any }) {
  const d = buildCvData(profile);
  const skillsByCategory = d.skills.reduce((acc: any, s: any) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s.name);
    return acc;
  }, {} as Record<string, string[]>);

  const contactItems = [
    d.email && { icon: <Mail className="h-3 w-3" />, text: d.email, href: `mailto:${d.email}` },
    d.phone && { icon: <Phone className="h-3 w-3" />, text: d.phone },
    d.location && { icon: <MapPin className="h-3 w-3" />, text: d.location },
    d.linkedin && { icon: <Linkedin className="h-3 w-3" />, text: d.linkedin.replace("https://www.", "").replace("https://", ""), href: d.linkedin },
    d.github && { icon: <Github className="h-3 w-3" />, text: d.github.replace("https://", ""), href: d.github },
    d.website && { icon: <Globe className="h-3 w-3" />, text: d.website.replace("https://", ""), href: d.website },
  ].filter(Boolean) as any[];

  return (
    <div
      id="cv-preview"
      className="bg-white text-gray-900 font-sans"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "18mm 16mm",
        fontSize: "10pt",
        lineHeight: 1.45,
        boxSizing: "border-box",
      }}
    >
      {/* ── Header ── */}
      <div className="mb-0.5">
        <h1 className="text-[22pt] font-bold tracking-wide uppercase leading-tight">
          {d.name}
        </h1>
        {d.title && (
          <p className="text-[11pt] text-gray-500 mt-0.5">{d.title}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[9pt] text-gray-600">
        {contactItems.map((item, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-gray-500">{item.icon}</span>
            {item.href ? (
              <a href={item.href} className="hover:text-blue-700 transition-colors">{item.text}</a>
            ) : (
              <span>{item.text}</span>
            )}
          </div>
        ))}
      </div>

      <div className="h-[1.5px] bg-gray-900 mt-2 mb-0" />

      {/* ── Summary ── */}
      {d.summary && (
        <div>
          <SectionTitle>Profil Singkat</SectionTitle>
          <p className="text-[9.5pt] text-justify leading-relaxed text-gray-700">{d.summary}</p>
        </div>
      )}

      {/* ── Experience ── */}
      {d.experience.length > 0 && (
        <div>
          <SectionTitle>Pengalaman Kerja</SectionTitle>
          <div className="space-y-4">
            {d.experience.map((exp: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="text-[10.5pt] font-bold">{exp.company}</span>
                  <span className="text-[9pt] text-gray-500 shrink-0 ml-2">
                    {exp.startDate} – {exp.isCurrent ? "Sekarang" : exp.endDate || ""}
                  </span>
                </div>
                <div className="text-[9.5pt] italic text-gray-500 mb-1">{exp.position}</div>
                {exp.description && (
                  <p className="text-[9.5pt] text-gray-700 leading-relaxed pl-3 border-l-2 border-gray-200">
                    {exp.description}
                  </p>
                )}
                {exp.technologies?.length > 0 && (
                  <p className="text-[8.5pt] text-gray-400 mt-1 pl-3">
                    <span className="font-semibold text-gray-500">Tech:</span> {exp.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Education ── */}
      {d.education.length > 0 && (
        <div>
          <SectionTitle>Pendidikan</SectionTitle>
          <div className="space-y-3">
            {d.education.map((edu: any, i: number) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="text-[10.5pt] font-bold">{edu.institution}</div>
                  <div className="text-[9.5pt] text-gray-600">
                    {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                  </div>
                  {edu.description && (
                    <div className="text-[9pt] text-gray-500 mt-0.5">{edu.description}</div>
                  )}
                </div>
                <span className="text-[9pt] text-gray-500 shrink-0 ml-2">
                  {edu.startYear} – {edu.endYear}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Skills by Category ── */}
      {Object.keys(skillsByCategory).length > 0 && (
        <div>
          <SectionTitle>Keahlian</SectionTitle>
          <div className="space-y-1.5">
            {Object.entries(skillsByCategory).map(([cat, names]: [string, any]) => (
              <div key={cat} className="flex items-baseline gap-2 text-[9.5pt]">
                <span className="font-bold text-gray-800 w-28 shrink-0">{cat}</span>
                <span className="text-gray-600">{(names as string[]).join(" • ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tools ── */}
      {d.tools.length > 0 && (
        <div>
          <SectionTitle>Tools & Teknologi</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {d.tools.map((tool: string) => (
              <span
                key={tool}
                className="text-[8.5pt] px-2 py-0.5 border border-gray-300 rounded text-gray-600"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Expertise ── */}
      {d.expertiseAreas.length > 0 && (
        <div>
          <SectionTitle>Area Keahlian</SectionTitle>
          <p className="text-[9.5pt] text-gray-600">{d.expertiseAreas.join(" • ")}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CvPage() {
  const { data: profile, isLoading } = useGetProfile();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleDownload = async () => {
    if (!profile) return;
    try {
      const blob = await pdf(<ATSPdfDocument profile={profile} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${(profile.name || "CV").replace(/\s+/g, "_")}_ATS_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF generation error", e);
    }
  };

  const handlePrint = () => {
    const el = document.getElementById("cv-preview");
    if (!el) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(`
      <html><head><title>CV — ${profile?.name || ""}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, Helvetica, sans-serif; }
        @media print { @page { size: A4; margin: 0; } }
      </style></head>
      <body>${el.outerHTML}</body></html>
    `);
    w.document.close();
    w.onload = () => { w.print(); };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Action Bar ── */}
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
              disabled={isLoading}
              className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CV Preview ── */}
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

        {/* ATS Tips */}
        <div className="max-w-[210mm] mx-auto mt-6 p-4 rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm">
          <p className="text-xs text-muted-foreground/70 text-center">
            ✅ <strong className="text-muted-foreground">ATS-Friendly:</strong> Format single-column, teks murni, tanpa tabel, tanpa gambar — dioptimalkan untuk sistem pelacakan pelamar kerja.
            &nbsp;·&nbsp; Edit data di <Link href="/about"><span className="text-primary underline decoration-dotted cursor-pointer hover:text-primary/80">halaman About</span></Link> untuk memperbarui CV secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
