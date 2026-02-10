import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Public Pages
import Home from "@/pages/Home";
import AuthPage from "@/pages/Auth";
import BlogList from "@/pages/BlogList";
import BlogDetail from "@/pages/BlogDetail";
import CourseList from "@/pages/CourseList";
import CourseDetail from "@/pages/CourseDetail";
import Contact from "@/pages/Contact";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageBlogs from "@/pages/admin/ManageBlogs";
import ManageCourses from "@/pages/admin/ManageCourses";
import Messages from "@/pages/admin/Messages";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/blogs" component={BlogList} />
      <Route path="/blogs/:slug" component={BlogDetail} />
      <Route path="/courses" component={CourseList} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/contact" component={Contact} />

      {/* Admin Routes - Protected (Auth check inside components) */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/blogs" component={ManageBlogs} />
      <Route path="/admin/courses" component={ManageCourses} />
      <Route path="/admin/messages" component={Messages} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
