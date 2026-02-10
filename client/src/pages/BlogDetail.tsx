import { Navbar, Footer } from "@/components/Layout";
import { useBlog } from "@/hooks/use-blogs";
import { useRoute } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";

export default function BlogDetail() {
  const [match, params] = useRoute("/blogs/:slug");
  const slug = params?.slug || "";
  const { data: blog, isLoading, error } = useBlog(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container max-w-3xl py-12 space-y-8">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <Link href="/blogs" className="text-primary hover:underline">Return to Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <article className="flex-1">
        {/* Header */}
        <div className="bg-muted/30 border-b py-12 lg:py-20">
          <div className="container max-w-3xl">
            <Link href="/blogs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Articles
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <Badge>Engineering</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {blog.createdAt ? format(new Date(blog.createdAt), 'MMMM d, yyyy') : 'Recently'}
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-6">
              {blog.title}
            </h1>
          </div>
        </div>

        {/* Cover Image */}
        {blog.coverImage && (
          <div className="container max-w-4xl -mt-12 lg:-mt-16 mb-12">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full rounded-xl shadow-2xl border aspect-video object-cover bg-background"
            />
          </div>
        )}

        {/* Content */}
        <div className="container max-w-3xl pb-24">
          <div 
            className="prose prose-slate dark:prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }} 
          />
        </div>
      </article>
      <Footer />
    </div>
  );
}
