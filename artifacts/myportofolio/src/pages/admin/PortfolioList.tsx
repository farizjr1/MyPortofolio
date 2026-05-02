import { useState } from "react";
import { useListPortfolio, useCreatePortfolioProject, useUpdatePortfolioProject, useDeletePortfolioProject, getListPortfolioQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Plus, Pencil, Trash2, Folder, ExternalLink, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PortfolioList() {
  const { data: projects, isLoading } = useListPortfolio();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setTechnologies("");
    setImageUrl("");
    setDemoUrl("");
    setGithubUrl("");
    setFeatured(false);
  };

  const setFormFromProject = (project: any) => {
    setCurrentProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setCategory(project.category);
    setTechnologies(project.technologies.join(", "));
    setImageUrl(project.imageUrl || "");
    setDemoUrl(project.demoUrl || "");
    setGithubUrl(project.githubUrl || "");
    setFeatured(project.featured);
  };

  const createMutation = useCreatePortfolioProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
        toast({ title: "Project created" });
        setIsCreateOpen(false);
        resetForm();
      },
    }
  });

  const updateMutation = useUpdatePortfolioProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
        toast({ title: "Project updated" });
        setIsEditOpen(false);
      }
    }
  });

  const deleteMutation = useDeletePortfolioProject({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListPortfolioQueryKey() });
        toast({ title: "Project deleted" });
      }
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        title,
        description,
        category,
        technologies: technologies.split(",").map(t => t.trim()).filter(Boolean),
        imageUrl: imageUrl || undefined,
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        featured,
      }
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;
    updateMutation.mutate({
      id: currentProject.id,
      data: {
        title,
        description,
        category,
        technologies: technologies.split(",").map(t => t.trim()).filter(Boolean),
        imageUrl: imageUrl || undefined,
        demoUrl: demoUrl || undefined,
        githubUrl: githubUrl || undefined,
        featured,
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate({ id });
    }
  };

  const ProjectForm = ({ onSubmit, isPending, buttonText }: any) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input required value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea required value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Input required value={category} onChange={e => setCategory(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Technologies (comma separated)</Label>
          <Input required value={technologies} onChange={e => setTechnologies(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Demo URL</Label>
          <Input value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
        <Label htmlFor="featured">Featured Project</Label>
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>{buttonText}</Button>
    </form>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-muted-foreground mt-2">Manage your projects here.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={(open) => { setIsCreateOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreate} isPending={createMutation.isPending} buttonText="Create Project" />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
        </div>
      ) : projects?.length === 0 ? (
        <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-border">
          <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Get started by creating your first portfolio project.</p>
          <Button onClick={() => setIsCreateOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects?.map(project => (
            <Card key={project.id} className="flex flex-col bg-card/50 border-border/50 overflow-hidden">
              {project.imageUrl && (
                <div className="h-40 bg-muted relative">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  {project.featured && <Star className="absolute top-2 right-2 h-5 w-5 text-primary fill-primary" />}
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 uppercase">{project.category}</p>
                  </div>
                  {!project.imageUrl && project.featured && <Star className="h-5 w-5 text-primary fill-primary" />}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4">
                <Button variant="outline" size="sm" onClick={() => { setFormFromProject(project); setIsEditOpen(true); }}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
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
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSubmit={handleUpdate} isPending={updateMutation.isPending} buttonText="Save Changes" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
