import { useState, useEffect } from "react";
import { useGetProfile, useUpdateProfile, getGetProfileQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export default function ProfileEditor() {
  const { data: profile, isLoading } = useGetProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<any>({
    name: "", title: "", bio: "", email: "", phone: "", location: "",
    avatarUrl: "", githubUrl: "", linkedinUrl: "", websiteUrl: "",
    education: [], experience: [], skills: [], tools: [], expertiseAreas: []
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: profile.location || "",
        avatarUrl: profile.avatarUrl || "",
        githubUrl: profile.githubUrl || "",
        linkedinUrl: profile.linkedinUrl || "",
        websiteUrl: profile.websiteUrl || "",
        education: profile.education || [],
        experience: profile.experience || [],
        skills: profile.skills || [],
        tools: profile.tools?.join(", ") || "",
        expertiseAreas: profile.expertiseAreas?.join(", ") || ""
      });
    }
  }, [profile]);

  const updateMutation = useUpdateProfile({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        toast({ title: "Profile updated successfully" });
      }
    }
  });

  const handleSave = () => {
    const payload = {
      ...formData,
      tools: typeof formData.tools === "string" ? formData.tools.split(",").map((t: string) => t.trim()).filter(Boolean) : formData.tools,
      expertiseAreas: typeof formData.expertiseAreas === "string" ? formData.expertiseAreas.split(",").map((t: string) => t.trim()).filter(Boolean) : formData.expertiseAreas,
    };
    updateMutation.mutate({ data: payload });
  };

  const handleArrayChange = (field: string, index: number, key: string, value: any) => {
    const newArray = [...formData[field]];
    newArray[index] = { ...newArray[index], [key]: value };
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    setFormData({ ...formData, [field]: [...formData[field], { ...defaultItem, id: uuidv4() }] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile Editor</h1>
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Editor</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and portfolio details.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills & Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Title / Headline</Label>
                  <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea className="min-h-[150px]" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Avatar URL</Label>
                <Input value={formData.avatarUrl} onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact & Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Website URL</Label>
                  <Input value={formData.websiteUrl} onChange={e => setFormData({ ...formData, websiteUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>GitHub URL</Label>
                  <Input value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Work Experience</CardTitle>
              <Button size="sm" onClick={() => addArrayItem("experience", { company: "", position: "", startDate: "", isCurrent: false, description: "" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.experience.map((exp: any, index: number) => (
                <div key={exp.id || index} className="p-4 border border-border rounded-lg space-y-4 bg-secondary/20">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Experience #{index + 1}</h4>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeArrayItem("experience", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={e => handleArrayChange("experience", index, "company", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Position</Label>
                      <Input value={exp.position} onChange={e => handleArrayChange("experience", index, "position", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Start Date (e.g. Jan 2020)</Label>
                      <Input value={exp.startDate} onChange={e => handleArrayChange("experience", index, "startDate", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input disabled={exp.isCurrent} value={exp.endDate || ""} onChange={e => handleArrayChange("experience", index, "endDate", e.target.value)} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`current-${index}`} 
                      checked={exp.isCurrent} 
                      onChange={e => handleArrayChange("experience", index, "isCurrent", e.target.checked)} 
                    />
                    <Label htmlFor={`current-${index}`}>I currently work here</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={exp.description || ""} onChange={e => handleArrayChange("experience", index, "description", e.target.value)} />
                  </div>
                </div>
              ))}
              {formData.experience.length === 0 && <p className="text-muted-foreground text-center py-4">No experience entries added.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Education</CardTitle>
              <Button size="sm" onClick={() => addArrayItem("education", { institution: "", degree: "", field: "", startYear: "", endYear: "" })}>
                <Plus className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.education.map((edu: any, index: number) => (
                <div key={edu.id || index} className="p-4 border border-border rounded-lg space-y-4 bg-secondary/20">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">Education #{index + 1}</h4>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeArrayItem("education", index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Institution</Label>
                      <Input value={edu.institution} onChange={e => handleArrayChange("education", index, "institution", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Degree (e.g. Bachelor)</Label>
                      <Input value={edu.degree} onChange={e => handleArrayChange("education", index, "degree", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Field of Study</Label>
                      <Input value={edu.field} onChange={e => handleArrayChange("education", index, "field", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Start Year</Label>
                          <Input value={edu.startYear} onChange={e => handleArrayChange("education", index, "startYear", e.target.value)} />
                        </div>
                        <div>
                          <Label>End Year</Label>
                          <Input value={edu.endYear} onChange={e => handleArrayChange("education", index, "endYear", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={edu.description || ""} onChange={e => handleArrayChange("education", index, "description", e.target.value)} />
                  </div>
                </div>
              ))}
              {formData.education.length === 0 && <p className="text-muted-foreground text-center py-4">No education entries added.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Skills with Proficiency Level</CardTitle>
              <Button size="sm" onClick={() => addArrayItem("skills", { name: "", category: "", level: 50 })}>
                <Plus className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.skills.map((skill: any, index: number) => (
                <div key={skill.id || index} className="flex items-center gap-4 p-2">
                  <Input placeholder="Skill Name" className="flex-1" value={skill.name} onChange={e => handleArrayChange("skills", index, "name", e.target.value)} />
                  <Input placeholder="Category" className="flex-1" value={skill.category} onChange={e => handleArrayChange("skills", index, "category", e.target.value)} />
                  <Input type="number" placeholder="Level (1-100)" className="w-24" value={skill.level} onChange={e => handleArrayChange("skills", index, "level", parseInt(e.target.value) || 0)} />
                  <Button variant="ghost" size="icon" className="text-destructive shrink-0" onClick={() => removeArrayItem("skills", index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tools & Expertise</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Tools (comma separated)</Label>
                <Textarea placeholder="React, Node.js, MongoDB..." value={formData.tools} onChange={e => setFormData({ ...formData, tools: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Expertise Areas (comma separated)</Label>
                <Textarea placeholder="Frontend Development, Backend Architecture..." value={formData.expertiseAreas} onChange={e => setFormData({ ...formData, expertiseAreas: e.target.value })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
