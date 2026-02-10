import { Navbar, Footer } from "@/components/Layout";
import { useCourse } from "@/hooks/use-courses";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CourseDetail() {
  const [match, params] = useRoute("/courses/:id");
  const id = Number(params?.id);
  const { data: course, isLoading } = useCourse(id);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 space-y-8">
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid md:grid-cols-3 gap-8">
             <div className="md:col-span-2 space-y-4">
               <Skeleton className="h-12 w-3/4" />
               <Skeleton className="h-32 w-full" />
             </div>
             <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Course Header */}
      <div className="bg-primary/5 border-b py-12">
        <div className="container grid md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2 space-y-6">
            <Badge className="bg-primary text-primary-foreground">Professional Course</Badge>
            <h1 className="text-4xl font-bold font-display">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
            <div className="flex items-center gap-4 text-sm font-medium">
               <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Lifetime Access</span>
               <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> Completion Certificate</span>
            </div>
          </div>
          <div>
            <div className="bg-card p-6 rounded-xl border shadow-lg">
              {course.coverImage && (
                <img src={course.coverImage} alt="Cover" className="rounded-lg mb-6 w-full object-cover aspect-video" />
              )}
              <div className="text-3xl font-bold mb-6 text-center">
                {course.price === 0 ? 'Free' : `$${(course.price / 100).toFixed(2)}`}
              </div>
              <Button size="lg" className="w-full mb-3 text-base">
                {user ? "Enroll Now" : "Login to Enroll"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">30-day money-back guarantee</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Course Content</h2>
            <div className="border rounded-lg overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                {course.modules?.map((module, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="px-6 hover:bg-muted/50">
                      <span className="font-semibold text-left">Module {idx + 1}: {module.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col">
                        {module.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/30">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="h-4 w-4 text-primary" />
                              <span>{lesson.title}</span>
                            </div>
                            {/* In a real app, check if unlocked */}
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-xl">
             <h3 className="font-bold mb-4">Instructor</h3>
             <div className="flex items-center gap-3">
               <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center font-bold text-primary">NP</div>
               <div>
                 <p className="font-semibold">NetEngPro Team</p>
                 <p className="text-xs text-muted-foreground">Senior Network Architects</p>
               </div>
             </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
