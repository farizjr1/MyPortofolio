import { useState } from "react";
import {
  useListBlogPostsAdmin,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Calendar,
  Loader2,
  BookOpen,
} from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: string;
  readingTime?: number;
  views?: number;
  createdAt?: string;
};

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  tags: "",
  published: false,
};

function formatDate(d?: string) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogManager() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [preview, setPreview] = useState(false);

  const { data: posts = [], isLoading, refetch } = useListBlogPostsAdmin();

  const queryKey = ["listBlogPostsAdmin"];

  const createMutation = useCreateBlogPost({
    mutation: {
      onSuccess: () => {
        toast({ title: "Artikel berhasil dibuat" });
        setIsOpen(false);
        refetch();
      },
      onError: () => toast({ variant: "destructive", title: "Gagal membuat artikel" }),
    },
  });

  const updateMutation = useUpdateBlogPost({
    mutation: {
      onSuccess: () => {
        toast({ title: "Artikel berhasil diupdate" });
        setIsOpen(false);
        refetch();
      },
      onError: () => toast({ variant: "destructive", title: "Gagal mengupdate artikel" }),
    },
  });

  const deleteMutation = useDeleteBlogPost({
    mutation: {
      onSuccess: () => { toast({ title: "Artikel dihapus" }); refetch(); },
      onError: () => toast({ variant: "destructive", title: "Gagal menghapus artikel" }),
    },
  });

  void queryKey;

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setPreview(false);
    setIsOpen(true);
  }

  function openEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? "",
      tags: (post.tags ?? []).join(", "),
      published: post.published ?? false,
    });
    setPreview(false);
    setIsOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      published: form.published,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate({ data });
    }
  }

  function handleDelete(post: BlogPost) {
    if (!confirm(`Hapus artikel "${post.title}"?`)) return;
    deleteMutation.mutate({ id: post.id });
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola artikel dan postingan blog</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Artikel Baru
        </Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: posts.length, icon: BookOpen },
          { label: "Publikasi", value: posts.filter((p) => p.published).length, icon: Eye },
          { label: "Draft", value: posts.filter((p) => !p.published).length, icon: EyeOff },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border/50 bg-card/40 p-4 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-md">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <div className="text-xl font-bold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Post list */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
          <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-40" />
          <p>Belum ada artikel. Buat artikel pertama kamu!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {(posts as BlogPost[]).map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 rounded-lg border border-border/50 bg-card/40 p-4 hover:border-border transition-colors"
            >
              {post.coverImage && (
                <img src={post.coverImage} alt={post.title} className="h-16 w-24 object-cover rounded-md flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{post.title}</h3>
                  <Badge variant={post.published ? "default" : "secondary"} className="shrink-0 text-xs">
                    {post.published ? "Publikasi" : "Draft"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.createdAt)}
                  </span>
                  {post.readingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readingTime} min
                    </span>
                  )}
                  {(post.tags ?? []).length > 0 && (
                    <span className="flex items-center gap-1 flex-wrap">
                      {(post.tags ?? []).slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-[10px] px-1 py-0">{t}</Badge>
                      ))}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => openEdit(post)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(post)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Artikel" : "Artikel Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  required
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Judul artikel..."
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverImage">URL Cover Image</Label>
                <Input
                  id="coverImage"
                  value={form.coverImage}
                  onChange={(e) => setForm((f) => ({ ...f, coverImage: e.target.value }))}
                  placeholder="https://..."
                  className="bg-background/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                required
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="Ringkasan singkat artikel..."
                className="bg-background/50 resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Konten * (Markdown)</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setPreview((v) => !v)}
                  className="text-xs h-7"
                >
                  {preview ? <><Pencil className="h-3 w-3 mr-1" />Edit</> : <><Eye className="h-3 w-3 mr-1" />Preview</>}
                </Button>
              </div>
              {preview ? (
                <div
                  className="min-h-[300px] rounded-md border border-border bg-background/30 p-4 prose prose-invert prose-sm max-w-none overflow-auto"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdown(form.content) }}
                />
              ) : (
                <Textarea
                  id="content"
                  required
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="# Judul&#10;&#10;Tulis konten artikel dalam format **Markdown**..."
                  className="bg-background/50 font-mono text-sm resize-none"
                  rows={16}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (pisah dengan koma)</Label>
                <Input
                  id="tags"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="teknologi, keuangan, tips"
                  className="bg-background/50"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <Switch
                  id="published"
                  checked={form.published}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, published: v }))}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  {form.published ? "Publikasi" : "Simpan sebagai Draft"}
                </Label>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</> : editing ? "Update Artikel" : "Buat Artikel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function simpleMarkdown(md: string) {
  return md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "<br><br>");
}
