import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Server, LayoutDashboard, FileText, 
  GraduationCap, Mail, LogOut, Settings
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blog" },
    { href: "/courses", label: "Courses" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="h-6 w-6 text-primary" />
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            NetEngPro
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="ghost" size="sm">Admin</Button>
                </Link>
              )}
              <Button onClick={() => logout.mutate()} variant="outline" size="sm">
                Log out
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button size="sm">Log In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background animate-in slide-in-from-top-5">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-sm font-medium py-2 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
           {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" onClick={() => setIsOpen(false)}>
                  <span className="block text-sm font-medium py-2 text-primary">Admin Dashboard</span>
                </Link>
              )}
              <Button onClick={() => logout.mutate()} className="w-full mt-2">
                Log out
              </Button>
            </>
          ) : (
            <Link href="/auth" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-2">Log In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12 mt-20">
      <div className="container grid md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-primary" />
            <span className="font-display font-bold">NetEngPro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Building the future of network engineering through rigorous education and practical guides.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Resources</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/blogs" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/courses" className="hover:text-primary">Courses</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex gap-4">
            {/* Social icons would go here */}
          </div>
        </div>
      </div>
      <div className="container mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NetEngPro. All rights reserved.
      </div>
    </footer>
  );
}

export function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path: string) => location === path;
  
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: FileText, label: "Manage Blogs", href: "/admin/blogs" },
    { icon: GraduationCap, label: "Manage Courses", href: "/admin/courses" },
    { icon: Mail, label: "Messages", href: "/admin/messages" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden lg:block">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Server className="h-6 w-6 text-primary" />
        <span className="font-display font-bold text-xl">Admin</span>
      </div>
      <div className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.href) 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute bottom-4 left-0 w-full px-4">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logout.mutate()}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
