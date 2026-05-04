import { useEffect, useState } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Globe, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function Contact() {
  const { data: profile } = useGetProfile();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const form = e.target as HTMLFormElement;
    const body = {
      name:    (form.elements.namedItem("name")    as HTMLInputElement).value.trim(),
      email:   (form.elements.namedItem("email")   as HTMLInputElement).value.trim(),
      subject: (form.elements.namedItem("subject") as HTMLInputElement).value.trim(),
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengirim pesan.");

      toast({
        title: "Pesan terkirim! 🎉",
        description: "Terima kasih telah menghubungi saya. Saya akan segera merespons.",
      });
      form.reset();
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Gagal mengirim",
        description: err.message || "Terjadi kesalahan. Coba lagi atau hubungi langsung via email.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 md:py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 md:text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Let's <span className="text-primary">Connect</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl md:mx-auto">
          Tertarik bekerja sama atau punya pertanyaan? Jangan ragu untuk menghubungi saya.
          Saya selalu terbuka untuk mendiskusikan proyek baru, ide kreatif, atau peluang kolaborasi.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-12">
        {/* ── Left: Contact Info ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-8"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Informasi Kontak</h3>

            {profile?.email && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors break-all">
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile?.phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg text-primary shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Phone</h4>
                  <a href={`tel:${profile.phone}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}

            {profile?.location && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <span className="text-muted-foreground">{profile.location}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Social Profiles</h3>
            <div className="flex gap-4">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer"
                  className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer"
                  className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {profile?.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer"
                  className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Website</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Right: Contact Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-3"
        >
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama</Label>
                    <Input
                      id="name" name="name" required
                      placeholder="John Doe"
                      className="bg-background/50 border-border"
                      disabled={sending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email" name="email" type="email" required
                      placeholder="john@example.com"
                      className="bg-background/50 border-border"
                      disabled={sending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject" name="subject" required
                    placeholder="Kerja Sama Proyek"
                    className="bg-background/50 border-border"
                    disabled={sending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message" name="message" required
                    placeholder="Halo, saya ingin mendiskusikan..."
                    className="min-h-[150px] bg-background/50 border-border resize-none"
                    disabled={sending}
                  />
                </div>

                <Button type="submit" className="w-full h-12 text-base" disabled={sending}>
                  {sending
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim…</>
                    : <><Send className="mr-2 h-4 w-4" /> Kirim Pesan</>
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
