import { useState } from "react";
import { AdminSidebar } from "@/components/Layout";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from "@/hooks/use-courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type InsertCourse } from "@shared/routes";

// Helper for managing modules state locally before save
type Module = { title: string; lessons: { title: string; content: string }[] };

export default function ManageCourses() {
  const { data: courses } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<(InsertCourse & { id?: number }) | null>(null);
  const [modules, setModules] = useState<Module[]>([]);

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setModules(course.modules || []);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingCourse({ title: "", description: "", price: 0, coverImage: "", modules: [] });
    setModules([]);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: parseInt(formData.get("price") as string) * 100, // Convert to cents
      coverImage: formData.get("coverImage") as string,
      modules: modules,
    };

    try {
      if (editingCourse?.id) {
        await updateCourse.mutateAsync({ id: editingCourse.id, ...data });
        toast({ title: "Updated", description: "Course updated successfully" });
      } else {
        await createCourse.mutateAsync(data);
        toast({ title: "Created", description: "Course created successfully" });
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const addModule = () => {
    setModules([...modules, { title: "New Module", lessons: [] }]);
  };

  const updateModuleTitle = (index: number, title: string) => {
    const newModules = [...modules];
    newModules[index].title = title;
    setModules(newModules);
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons.push({ title: "New Lesson", content: "" });
    setModules(newModules);
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: 'title' | 'content', value: string) => {
    const newModules = [...modules];
    newModules[moduleIndex].lessons[lessonIndex][field] = value;
    setModules(newModules);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="lg:pl-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-display">Manage Courses</h1>
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" /> New Course
          </Button>
        </div>

        <div className="bg-card rounded-xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses?.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell>${(course.price / 100).toFixed(2)}</TableCell>
                  <TableCell>{course.modules?.length || 0}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteCourse.mutate(course.id)}>
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
              <DialogTitle>{editingCourse?.id ? "Edit Course" : "New Course"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input id="title" name="title" defaultValue={editingCourse?.title} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number" 
                    min="0"
                    step="0.01"
                    defaultValue={editingCourse ? editingCourse.price / 100 : 0} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={editingCourse?.description} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input id="coverImage" name="coverImage" defaultValue={editingCourse?.coverImage || ""} />
              </div>

              <div className="space-y-4 border rounded-md p-4 bg-muted/10">
                <div className="flex justify-between items-center">
                   <h3 className="font-semibold">Curriculum</h3>
                   <Button type="button" size="sm" variant="outline" onClick={addModule}>Add Module</Button>
                </div>
                
                {modules.map((module, mIdx) => (
                  <div key={mIdx} className="border rounded bg-card p-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        value={module.title} 
                        onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                        placeholder="Module Title"
                        className="font-semibold"
                      />
                      <Button type="button" size="sm" variant="ghost" onClick={() => setModules(modules.filter((_, i) => i !== mIdx))}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    
                    <div className="pl-6 space-y-2">
                      {module.lessons.map((lesson, lIdx) => (
                         <div key={lIdx} className="flex gap-2">
                            <Input 
                              value={lesson.title}
                              onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                              placeholder="Lesson Title"
                              className="h-8 text-sm"
                            />
                            {/* In a real app, content would be a rich text editor or separate view */}
                         </div>
                      ))}
                      <Button type="button" size="sm" variant="link" className="h-auto p-0" onClick={() => addLesson(mIdx)}>
                        + Add Lesson
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Course</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
