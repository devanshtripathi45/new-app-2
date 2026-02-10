import { useState } from "react";
import { AdminSidebar } from "@/components/Layout";
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog } from "@/hooks/use-blogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertBlog } from "@shared/routes";

export default function ManageBlogs() {
  const { data: blogs } = useBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<(InsertBlog & { id?: number }) | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Manual controlled rich text content handling
    // Assuming content is set in state if we were doing controlled input, 
    // but here we might need to grab it differently or just rely on react-hook-form in a real app.
    // For simplicity, let's assume content is passed via the RichTextEditor onChange
    // This simple form implementation relies on the state `editingBlog` being updated.

    if (!editingBlog?.content) {
      toast({ variant: "destructive", title: "Error", description: "Content is required" });
      return;
    }

    const data: any = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      coverImage: formData.get("coverImage") as string,
      content: editingBlog.content,
      isPublished: editingBlog.isPublished || false,
    };

    try {
      if (editingBlog.id) {
        await updateBlog.mutateAsync({ id: editingBlog.id, ...data });
        toast({ title: "Updated", description: "Blog updated successfully" });
      } else {
        await createBlog.mutateAsync(data);
        toast({ title: "Created", description: "Blog created successfully" });
      }
      setIsDialogOpen(false);
      setEditingBlog(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      await deleteBlog.mutateAsync(id);
      toast({ title: "Deleted", description: "Blog deleted successfully" });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="lg:pl-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-display">Manage Blogs</h1>
          <Button onClick={() => { setEditingBlog({ title: "", slug: "", content: "", isPublished: false }); setIsDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> New Article
          </Button>
        </div>

        <div className="bg-card rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>{blog.slug}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(blog.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog?.id ? "Edit Article" : "New Article"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    defaultValue={editingBlog?.title} 
                    onChange={(e) => {
                      // Auto-generate slug from title if new
                      if (!editingBlog?.id) {
                         const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                         const slugInput = document.getElementById('slug') as HTMLInputElement;
                         if (slugInput) slugInput.value = slug;
                      }
                    }}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" defaultValue={editingBlog?.slug} required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" name="coverImage" defaultValue={editingBlog?.coverImage || ""} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor 
                  content={editingBlog?.content || ""} 
                  onChange={(html) => setEditingBlog(prev => ({ ...prev!, content: html }))} 
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={editingBlog?.isPublished || false}
                  onCheckedChange={(checked) => setEditingBlog(prev => ({ ...prev!, isPublished: checked }))}
                />
                <Label htmlFor="published">Publish Article</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Article</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
