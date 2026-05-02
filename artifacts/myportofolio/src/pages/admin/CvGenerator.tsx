import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useCreateCv, useGetCv, useGetProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 11, color: '#000', lineHeight: 1.5 },
  header: { marginBottom: 15, borderBottom: '1pt solid #000', paddingBottom: 10 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  contactInfo: { fontSize: 10, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1pt solid #000', marginTop: 15, marginBottom: 10, paddingBottom: 2 },
  summary: { marginBottom: 10, textAlign: 'justify' },
  expItem: { marginBottom: 10 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: 2 },
  expCompany: { fontSize: 12, fontWeight: 'bold' },
  expDate: { fontSize: 10 },
  expPosition: { fontStyle: 'italic', marginBottom: 4 },
  bulletList: { paddingLeft: 15 },
  bullet: { marginBottom: 2 },
  eduItem: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' },
  eduMain: { flex: 1 },
  eduInstitution: { fontWeight: 'bold' },
  skillsRow: { marginBottom: 3, flexDirection: 'row' },
  skillCategory: { fontWeight: 'bold', width: '25%' },
  skillList: { width: '75%' }
});

const ATSDocument = ({ data }: { data: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personal.fullName}</Text>
        <View style={styles.contactInfo}>
          {data.personal.email && <Text>{data.personal.email}</Text>}
          {data.personal.phone && <Text>{data.personal.phone}</Text>}
          {data.personal.location && <Text>{data.personal.location}</Text>}
          {data.personal.linkedin && <Text>{data.personal.linkedin}</Text>}
        </View>
      </View>

      {/* Summary */}
      {data.personal.summary && (
        <View>
          <Text style={styles.summary}>{data.personal.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp: any, i: number) => (
            <View key={i} style={styles.expItem}>
              <View style={styles.expHeader}>
                <Text style={styles.expCompany}>{exp.company}</Text>
                <Text style={styles.expDate}>{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</Text>
              </View>
              <Text style={styles.expPosition}>{exp.position}</Text>
              {exp.bullets && exp.bullets.length > 0 && (
                <View style={styles.bulletList}>
                  {exp.bullets.map((bullet: string, j: number) => (
                    <Text key={j} style={styles.bullet}>• {bullet}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu: any, i: number) => (
            <View key={i} style={styles.eduItem}>
              <View style={styles.eduMain}>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text>{edu.degree} in {edu.field}</Text>
              </View>
              <Text style={styles.expDate}>{edu.startDate} - {edu.endDate}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skillGroups && data.skillGroups.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          {data.skillGroups.map((group: any, i: number) => (
            <View key={i} style={styles.skillsRow}>
              <Text style={styles.skillCategory}>{group.category}:</Text>
              <Text style={styles.skillList}>{group.skills.join(', ')}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default function CvGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Extract ID from URL if exists
  const searchParams = new URLSearchParams(window.location.search);
  const cvId = searchParams.get("id");

  const { data: existingCv, isLoading: loadingCv } = useGetCv(cvId as string, { query: { enabled: !!cvId } });
  const { data: profile } = useGetProfile({ query: { enabled: !cvId } });

  const [formData, setFormData] = useState<any>({
    label: "My CV Version",
    personal: { fullName: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "", summary: "" },
    education: [],
    experience: [],
    skillGroups: []
  });

  // Pre-fill from existing CV or profile
  useEffect(() => {
    if (existingCv) {
      setFormData(existingCv);
    } else if (profile && !cvId) {
      setFormData({
        label: "My Base CV",
        personal: {
          fullName: profile.name || "", email: profile.email || "", phone: profile.phone || "",
          location: profile.location || "", linkedin: profile.linkedinUrl || "", github: profile.githubUrl || "",
          website: profile.websiteUrl || "", summary: profile.bio || ""
        },
        education: profile.education?.map((e: any) => ({
          id: uuidv4(), institution: e.institution, degree: e.degree, field: e.field, 
          startDate: e.startYear, endDate: e.endYear
        })) || [],
        experience: profile.experience?.map((e: any) => ({
          id: uuidv4(), company: e.company, position: e.position, 
          startDate: e.startDate, endDate: e.endDate, isCurrent: e.isCurrent,
          bullets: e.description ? e.description.split('\n').filter(Boolean) : []
        })) || [],
        skillGroups: profile.tools?.length ? [{ id: uuidv4(), category: "Technologies", skills: profile.tools }] : []
      });
    }
  }, [existingCv, profile, cvId]);

  const createMutation = useCreateCv({
    mutation: {
      onSuccess: () => {
        toast({ title: "CV Saved successfully" });
        setLocation("/admin/cv");
      }
    }
  });

  const handleSave = () => {
    createMutation.mutate({ data: formData });
  };

  const generatePDF = async () => {
    try {
      const blob = await pdf(<ATSDocument data={formData} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${formData.personal.fullName.replace(/\s+/g, '_')}_CV.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({ title: "PDF Downloaded successfully" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error generating PDF" });
    }
  };

  // Helper for deeply nested updates
  const updatePersonal = (field: string, value: string) => {
    setFormData({ ...formData, personal: { ...formData.personal, [field]: value } });
  };

  const handleArrayChange = (field: string, index: number, key: string, value: any) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  if (loadingCv) return <div>Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-120px)]">
      {/* Editor Panel */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <Input 
            value={formData.label} 
            onChange={(e) => setFormData({...formData, label: e.target.value})} 
            className="w-64 font-bold bg-transparent border-none px-0 focus-visible:ring-0" 
          />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleSave} disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Data
            </Button>
            <Button size="sm" onClick={generatePDF}>
              <Download className="h-4 w-4 mr-2" /> Download PDF
            </Button>
          </div>
        </div>

        <Tabs defaultValue="personal" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent h-auto p-0">
            <TabsTrigger value="personal" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">Personal</TabsTrigger>
            <TabsTrigger value="experience" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">Experience</TabsTrigger>
            <TabsTrigger value="education" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">Education</TabsTrigger>
            <TabsTrigger value="skills" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary py-3">Skills</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="personal" className="space-y-4 m-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={formData.personal.fullName} onChange={e => updatePersonal("fullName", e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input value={formData.personal.email} onChange={e => updatePersonal("email", e.target.value)} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={formData.personal.phone} onChange={e => updatePersonal("phone", e.target.value)} /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={formData.personal.location} onChange={e => updatePersonal("location", e.target.value)} /></div>
                <div className="space-y-2"><Label>LinkedIn</Label><Input value={formData.personal.linkedin} onChange={e => updatePersonal("linkedin", e.target.value)} /></div>
                <div className="space-y-2"><Label>GitHub</Label><Input value={formData.personal.github} onChange={e => updatePersonal("github", e.target.value)} /></div>
              </div>
              <div className="space-y-2">
                <Label>Professional Summary</Label>
                <Textarea className="min-h-[150px]" value={formData.personal.summary} onChange={e => updatePersonal("summary", e.target.value)} />
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6 m-0">
              {formData.experience.map((exp: any, i: number) => (
                <Card key={exp.id} className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => setFormData({ ...formData, experience: formData.experience.filter((_, idx: number) => idx !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                    <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => handleArrayChange("experience", i, "company", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Position</Label><Input value={exp.position} onChange={e => handleArrayChange("experience", i, "position", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Start Date</Label><Input value={exp.startDate} onChange={e => handleArrayChange("experience", i, "startDate", e.target.value)} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input value={exp.endDate} onChange={e => handleArrayChange("experience", i, "endDate", e.target.value)} /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Bullets (one per line)</Label>
                    <Textarea 
                      className="min-h-[100px]" 
                      value={exp.bullets.join("\n")} 
                      onChange={e => handleArrayChange("experience", i, "bullets", e.target.value.split("\n").filter(Boolean))} 
                    />
                  </div>
                </Card>
              ))}
              <Button onClick={() => setFormData({...formData, experience: [...formData.experience, { id: uuidv4(), company: "", position: "", startDate: "", endDate: "", isCurrent: false, bullets: [] }]})}>
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </TabsContent>

            <TabsContent value="education" className="space-y-6 m-0">
              {formData.education.map((edu: any, i: number) => (
                <Card key={edu.id} className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => setFormData({ ...formData, education: formData.education.filter((_, idx: number) => idx !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-4 pr-8">
                    <div className="space-y-2"><Label>Institution</Label><Input value={edu.institution} onChange={e => handleArrayChange("education", i, "institution", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Degree</Label><Input value={edu.degree} onChange={e => handleArrayChange("education", i, "degree", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Field</Label><Input value={edu.field} onChange={e => handleArrayChange("education", i, "field", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Start Date</Label><Input value={edu.startDate} onChange={e => handleArrayChange("education", i, "startDate", e.target.value)} /></div>
                    <div className="space-y-2"><Label>End Date</Label><Input value={edu.endDate} onChange={e => handleArrayChange("education", i, "endDate", e.target.value)} /></div>
                  </div>
                </Card>
              ))}
              <Button onClick={() => setFormData({...formData, education: [...formData.education, { id: uuidv4(), institution: "", degree: "", field: "", startDate: "", endDate: "" }]})}>
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6 m-0">
              {formData.skillGroups.map((group: any, i: number) => (
                <Card key={group.id} className="p-4 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => setFormData({ ...formData, skillGroups: formData.skillGroups.filter((_, idx: number) => idx !== i) })}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-4 pr-8">
                    <div className="space-y-2"><Label>Category (e.g. Languages, Frameworks)</Label><Input value={group.category} onChange={e => handleArrayChange("skillGroups", i, "category", e.target.value)} /></div>
                    <div className="space-y-2">
                      <Label>Skills (comma separated)</Label>
                      <Input value={group.skills.join(", ")} onChange={e => handleArrayChange("skillGroups", i, "skills", e.target.value.split(",").map((s:string) => s.trim()).filter(Boolean))} />
                    </div>
                  </div>
                </Card>
              ))}
              <Button onClick={() => setFormData({...formData, skillGroups: [...formData.skillGroups, { id: uuidv4(), category: "", skills: [] }]})}>
                <Plus className="h-4 w-4 mr-2" /> Add Skill Group
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* HTML Live Preview Panel (Visually mimics PDF) */}
      <div className="hidden lg:block lg:w-1/2 h-full bg-white rounded-xl overflow-y-auto shadow-inner text-black font-sans p-8">
        <div className="max-w-[21cm] mx-auto bg-white" style={{ minHeight: '29.7cm' }}>
          
          <div className="border-b-2 border-black pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase mb-2">{formData.personal.fullName || "YOUR NAME"}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {formData.personal.email && <span>{formData.personal.email}</span>}
              {formData.personal.phone && <span>{formData.personal.phone}</span>}
              {formData.personal.location && <span>{formData.personal.location}</span>}
            </div>
          </div>

          {formData.personal.summary && (
            <div className="mb-6 text-sm text-justify">
              {formData.personal.summary}
            </div>
          )}

          {formData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Professional Experience</h2>
              <div className="space-y-4">
                {formData.experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline font-bold text-[15px]">
                      <span>{exp.company}</span>
                      <span className="text-sm font-normal">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="italic text-sm mb-1">{exp.position}</div>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {exp.bullets.map((b: string, j: number) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Education</h2>
              <div className="space-y-3">
                {formData.education.map((edu: any, i: number) => (
                  <div key={i} className="flex justify-between items-start text-sm">
                    <div>
                      <div className="font-bold">{edu.institution}</div>
                      <div>{edu.degree} in {edu.field}</div>
                    </div>
                    <div>{edu.startDate} - {edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.skillGroups.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold uppercase border-b border-black mb-3">Technical Skills</h2>
              <div className="space-y-1 text-sm">
                {formData.skillGroups.map((group: any, i: number) => (
                  <div key={i} className="flex">
                    <span className="font-bold w-32 shrink-0">{group.category}:</span>
                    <span>{group.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
