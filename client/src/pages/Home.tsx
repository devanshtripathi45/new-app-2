import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blogs";
import { useCourses } from "@/hooks/use-courses";
import { ArrowRight, Server, ShieldCheck, Terminal } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: blogs, isLoading: blogsLoading } = useBlogs();
  const { data: courses, isLoading: coursesLoading } = useCourses();

  // Get latest 3 published
  const latestBlogs = blogs?.filter(b => b.isPublished).slice(0, 3) || [];
  const latestCourses = courses?.slice(0, 3) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 bg-background">
        <div className="absolute inset-0 z-0 opacity-30">
           {/* Abstract grid pattern background */}
           <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/10"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
           </svg>
        </div>

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              CCIE #12345
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-extrabold tracking-tight">
              Mastering the <span className="text-primary">Network</span> Infrastructure
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Advanced tutorials, configuration guides, and professional courses for the modern network engineer. From BGP to Python automation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="h-12 px-8 text-base">
                  View Courses
                </Button>
              </Link>
              <Link href="/blogs">
                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                  Read Articles
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            {/* tech illustration placeholder */}
            <div className="bg-card border rounded-xl p-8 shadow-2xl shadow-primary/10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
               <div className="font-mono text-sm space-y-2 text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary">user@cisco-lab:~$</span>
                    <span>configure terminal</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary">user@cisco-lab(config):~$</span>
                    <span>router bgp 65000</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary">user@cisco-lab(config-router):~$</span>
                    <span>neighbor 192.0.2.1 remote-as 65001</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary">user@cisco-lab(config-router):~$</span>
                    <span className="animate-pulse">_</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Infrastructure Design</h3>
              <p className="text-muted-foreground">Architect robust, scalable networks using industry best practices and modern protocols.</p>
            </div>
            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Terminal className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Automation & DevOps</h3>
              <p className="text-muted-foreground">Transition from CLI to API. Learn Python, Ansible, and Terraform for network automation.</p>
            </div>
            <div className="bg-card p-8 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Network Security</h3>
              <p className="text-muted-foreground">Secure your perimeter and internal traffic. Firewalls, VPNs, and Zero Trust architecture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Content */}
      <section className="py-24">
        <div className="container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold font-display mb-2">Latest Articles</h2>
              <p className="text-muted-foreground">Technical deep-dives and tutorials.</p>
            </div>
            <Link href="/blogs">
              <Button variant="ghost" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {blogsLoading ? (
               Array(3).fill(0).map((_, i) => (
                 <div key={i} className="space-y-4">
                   <Skeleton className="h-48 w-full rounded-xl" />
                   <Skeleton className="h-6 w-3/4" />
                   <Skeleton className="h-4 w-full" />
                 </div>
               ))
            ) : latestBlogs.map((blog) => (
              <Link key={blog.id} href={`/blogs/${blog.slug}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden rounded-xl mb-4 bg-muted border">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm">{blog.content.replace(/<[^>]*>?/gm, '')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
