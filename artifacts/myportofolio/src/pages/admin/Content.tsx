import { useState } from "react";
import { useListContent, useCreateContent, useUpdateContent, useDeleteContent, getListContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Pencil, Trash2, LayoutTemplate } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContentManager() {
  const { data: contents, isLoading } = useListContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [section, setSection] = useState<"home" | "about" | "contact" | "services" | "testimonials" | "custom">("home");
  const [published, setPublished] = useState(false);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setSection("home");
    setPublished(false);
  };

  const setFormFromContent = (content: any) => {
    setCurrentContent(content);
    setTitle(content.title);
    setBody(content.body);
    setSection(content.section);
    setPublished(content.published);
  };

  const createMutation = useCreateContent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContentQueryKey() });
        toast({ title: "Content created" });
        setIsCreateOpen(false);
        resetForm();
      },
    }
  });

  const updateMutation = useUpdateContent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContentQueryKey() });
        toast({ title: "Content updated" });
        setIsEditOpen(false);
      }
    }
  });

  const deleteMutation = useDeleteContent({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContentQueryKey() });
        toast({ title: "Content deleted" });
      }
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        title,
        body,
        section,
        published,
      }
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentContent) return;
    updateMutation.mutate({
      id: currentContent.id,
      data: {
        title,
        body,
        section,
        published,
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this content block?")) {
      deleteMutation.mutate({ id });
    }
  };

  const ContentForm = ({ onSubmit, isPending, buttonText }: any) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input required value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Section</Label>
        <Select value={section} onValueChange={(val: any) => setSection(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="about">About</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="testimonials">Testimonials</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Body</Label>
        <Textarea required className="min-h-[200px]" value={body} onChange={e => setBody(e.target.value)} />
      </div>
      <div className="flex items-center space-x-2 pt-2">
        <Switch id="published" checked={published} onCheckedChange={setPublished} />
        <Label htmlFor="published">Published</Label>
      </div>
      <Button type="submit" className="w-full mt-4" disabled={isPending}>{buttonText}</Button>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content CMS</h1>
          <p className="text-muted-foreground mt-2">Manage text blocks for your website.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Content</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Content Block</DialogTitle>
            </DialogHeader>
            <ContentForm onSubmit={handleCreate} isPending={createMutation.isPending} buttonText="Create Content" />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[250px] w-full rounded-xl" />)}
        </div>
      ) : contents?.length === 0 ? (
        <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-border">
          <LayoutTemplate className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No content yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first content block.</p>
          <Button onClick={() => setIsCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Content</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {contents?.map((content) => (
            <Card key={content.id} className={`flex flex-col bg-card/50 border-border/50 ${!content.published && 'opacity-60 grayscale'}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{content.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">{content.section}</p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${content.published ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {content.published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-4 whitespace-pre-line">{content.body}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4">
                <Button variant="outline" size="sm" onClick={() => { setFormFromContent(content); setIsEditOpen(true); }}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(content.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if(!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content Block</DialogTitle>
          </DialogHeader>
          <ContentForm onSubmit={handleUpdate} isPending={updateMutation.isPending} buttonText="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
