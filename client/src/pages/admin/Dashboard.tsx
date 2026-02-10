import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/Layout";
import { useBlogs } from "@/hooks/use-blogs";
import { useCourses } from "@/hooks/use-courses";
import { useMessages } from "@/hooks/use-messages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, GraduationCap, Mail, Users } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { data: blogs } = useBlogs();
  const { data: courses } = useCourses();
  const { data: messages } = useMessages();

  if (isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/auth");
    return null;
  }

  const stats = [
    { label: "Total Articles", value: blogs?.length || 0, icon: FileText, color: "text-blue-500" },
    { label: "Total Courses", value: courses?.length || 0, icon: GraduationCap, color: "text-green-500" },
    { label: "Messages", value: messages?.length || 0, icon: Mail, color: "text-orange-500" },
    { label: "Students", value: "154", icon: Users, color: "text-purple-500" }, // Static for demo
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="lg:pl-64 p-8">
        <h1 className="text-3xl font-bold font-display mb-8">Dashboard Overview</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
             <CardHeader>
               <CardTitle>Recent Messages</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {messages?.slice(0, 5).map((msg) => (
                   <div key={msg.id} className="flex flex-col border-b last:border-0 pb-3 last:pb-0">
                     <div className="flex justify-between items-start mb-1">
                       <span className="font-semibold">{msg.name}</span>
                       <span className="text-xs text-muted-foreground">
                         {new Date(msg.createdAt!).toLocaleDateString()}
                       </span>
                     </div>
                     <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                   </div>
                 ))}
                 {(!messages || messages.length === 0) && (
                   <p className="text-muted-foreground text-sm">No messages yet.</p>
                 )}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
