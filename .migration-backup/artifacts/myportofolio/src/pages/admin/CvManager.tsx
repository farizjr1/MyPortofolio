import { useListCv, useDeleteCv, getListCvQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileBadge, Plus, Trash2, Calendar, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CvManager() {
  const { data: cvs, isLoading } = useListCv();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useDeleteCv({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCvQueryKey() });
        toast({ title: "CV deleted successfully" });
      }
    }
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this CV?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CV Manager</h1>
          <p className="text-muted-foreground mt-2">Manage and generate ATS-friendly resumes.</p>
        </div>
        <Button asChild>
          <Link href="/admin/cv/new">
            <Plus className="mr-2 h-4 w-4" /> Create New CV
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-[200px] w-full rounded-xl" />)}
        </div>
      ) : cvs?.length === 0 ? (
        <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-border">
          <FileBadge className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No CVs created yet</h3>
          <p className="text-muted-foreground mb-4">Generate your first ATS-optimized CV to use for job applications.</p>
          <Button asChild>
            <Link href="/admin/cv/new">
              <Plus className="mr-2 h-4 w-4" /> Create CV
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cvs?.map(cv => (
            <Card key={cv.id} className="flex flex-col bg-card/50 border-border/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{cv.label}</CardTitle>
                  <FileBadge className="h-5 w-5 text-primary opacity-50" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" /> 
                    Created: {new Date(cv.createdAt || "").toLocaleDateString()}
                  </div>
                  <div className="text-sm">
                    <strong>Profile:</strong> {cv.personal.fullName}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t border-border/50 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/cv/new?id=${cv.id}`}>
                    <Download className="h-4 w-4 mr-1" /> View / PDF
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(cv.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
