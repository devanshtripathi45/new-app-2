import { AdminSidebar } from "@/components/Layout";
import { useMessages } from "@/hooks/use-messages";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Mail, User } from "lucide-react";

export default function Messages() {
  const { data: messages, isLoading } = useMessages();

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="lg:pl-64 p-8">
        <h1 className="text-3xl font-bold font-display mb-8">Messages</h1>
        
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-6">
            {messages?.map((msg) => (
              <Card key={msg.id}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                   <div className="space-y-1">
                     <CardTitle className="text-lg flex items-center gap-2">
                       <User className="h-4 w-4 text-primary" /> {msg.name}
                     </CardTitle>
                     <CardDescription className="flex items-center gap-2">
                       <Mail className="h-3 w-3" /> {msg.email}
                     </CardDescription>
                   </div>
                   <div className="text-sm text-muted-foreground">
                     {msg.createdAt && format(new Date(msg.createdAt), 'PP p')}
                   </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                </CardContent>
              </Card>
            ))}
            {messages?.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">No messages received yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
