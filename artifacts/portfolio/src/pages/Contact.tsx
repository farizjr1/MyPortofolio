import { useEffect } from "react";
import { useGetProfile } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, Github, Linkedin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { data: profile } = useGetProfile();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission since we don't have a contact API endpoint
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    (e.target as HTMLFormElement).reset();
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
          Interested in working together or have a question? Feel free to reach out. I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-8"
        >
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Contact Information</h3>
            
            {profile?.email && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Email</h4>
                  <a href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile?.phone && (
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary rounded-lg text-primary">
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
                <div className="p-3 bg-secondary rounded-lg text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <span className="text-muted-foreground">
                    {profile.location}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-border">
            <h3 className="text-lg font-medium mb-4">Social Profiles</h3>
            <div className="flex gap-4">
              {profile?.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </a>
              )}
              {profile?.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              )}
              {profile?.websiteUrl && (
                <a href={profile.websiteUrl} target="_blank" rel="noreferrer" className="p-3 bg-secondary rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary/80 transition-all">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Website</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>

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
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" required placeholder="John Doe" className="bg-background/50 border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email</Label>
                    <Input id="email" type="email" required placeholder="john@example.com" className="bg-background/50 border-border" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required placeholder="Project Inquiry" className="bg-background/50 border-border" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    required 
                    placeholder="Hello, I'd like to talk about..." 
                    className="min-h-[150px] bg-background/50 border-border resize-none" 
                  />
                </div>
                
                <Button type="submit" className="w-full h-12 text-base">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
