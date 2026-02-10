import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLoginPage() {
  const { adminLogin, user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (user) {
    if (user.role === "admin") {
      setLocation("/admin");
    } else {
      setLocation("/");
    }
    return null;
  }

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await adminLogin.mutateAsync({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });
      toast({ title: "Welcome Admin!", description: "Successfully logged in to admin dashboard." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Admin Login Failed", description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="p-3 bg-red-600 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-sm text-gray-600">Administrator access only</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>Enter your admin credentials to access the management dashboard</CardDescription>
          </CardHeader>
          <form onSubmit={handleAdminLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-username" className="text-gray-700">Username</Label>
                <Input 
                  id="admin-username" 
                  name="username" 
                  required 
                  placeholder="Enter admin username"
                  className="border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-700">Password</Label>
                <Input 
                  id="admin-password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Enter admin password"
                  className="border-gray-300"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white" 
                disabled={adminLogin.isPending}
              >
                {adminLogin.isPending ? "Logging in...:" : "Login to Admin"}
              </Button>
            </CardFooter>
          </form>
          <div className="px-6 pb-4 text-center">
            <p className="text-sm text-gray-600">Student? <a href="/auth" className="text-red-600 hover:underline font-semibold">Student Login</a></p>
          </div>
        </Card>

        <div className="bg-white rounded-lg p-4 shadow text-center text-xs text-gray-600 border border-gray-200">
          <p className="font-semibold mb-2">Demo Admin Credentials:</p>
          <p>Username: <code className="bg-gray-100 px-1">devansh</code></p>
          <p>Password: <code className="bg-gray-100 px-1">devansh123</code></p>
        </div>
      </div>
    </div>
  );
}
