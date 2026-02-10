import { Navbar, Footer } from "@/components/Layout";
import { useCourses } from "@/hooks/use-courses";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle } from "lucide-react";

export default function CourseList() {
  const { data: courses, isLoading } = useCourses();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container py-12">
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-bold font-display tracking-tight mb-4">Professional Courses</h1>
          <p className="text-xl text-muted-foreground">
            Structured learning paths designed to take you from novice to expert.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-[400px] rounded-xl" />
            ))}
          </div>
        ) : courses?.length === 0 ? (
          <div className="text-center py-24 bg-muted/30 rounded-xl">
            <h3 className="text-xl font-medium">No courses available</h3>
            <p className="text-muted-foreground">New courses are being developed.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course) => (
              <Card key={course.id} className="flex flex-col h-full hover:shadow-lg transition-all border-t-4 border-t-primary">
                {course.coverImage && (
                  <div className="h-48 overflow-hidden bg-muted border-b">
                    <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="mb-2">Course</Badge>
                    <span className="font-bold text-lg text-primary">
                      {course.price === 0 ? 'Free' : `$${(course.price / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {course.modules?.length || 0} Modules
                    </div>
                    {/* Placeholder for duration if we had it in schema */}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Self-paced
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/courses/${course.id}`} className="w-full">
                    <Button className="w-full">View Course</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
