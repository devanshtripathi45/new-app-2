import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AdminSidebar } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Settings, Save, RotateCcw } from "lucide-react";

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface SiteSettings {
  siteName: string;
  homeHeroTitle: string;
  homeHeroSub: string;
  logoUrl?: string;
  socialLinks: SocialLinks;
}

export default function AdminSettings() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "LearnWithShivam",
    homeHeroTitle: "Mastering the Network Infrastructure",
    homeHeroSub: "Advanced tutorials, configuration guides, and professional courses for the modern network engineer.",
    logoUrl: "",
    socialLinks: {
      linkedin: "",
      twitter: "",
      github: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  if (isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/auth");
    return null;
  }

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [siteName, title, sub, logo, social] = await Promise.all([
          fetch("/api/settings/siteName").then(r => r.json().catch(() => null)),
          fetch("/api/settings/homeHeroTitle").then(r => r.json().catch(() => null)),
          fetch("/api/settings/homeHeroSub").then(r => r.json().catch(() => null)),
          fetch("/api/settings/logoUrl").then(r => r.json().catch(() => null)),
          fetch("/api/settings/socialLinks").then(r => r.json().catch(() => null)),
        ]);

        setSettings(prev => ({
          ...prev,
          siteName: siteName || prev.siteName,
          homeHeroTitle: title || prev.homeHeroTitle,
          homeHeroSub: sub || prev.homeHeroSub,
          logoUrl: logo || "",
          socialLinks: social || prev.socialLinks,
        }));

        if (logo) setLogoPreview(logo);
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setLogoPreview(base64);
      setLogoFile(file);
      setSettings(prev => ({ ...prev, logoUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setSettings(prev => ({ ...prev, logoUrl: "" }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates = [
        fetch("/api/settings/siteName", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: settings.siteName }),
        }),
        fetch("/api/settings/homeHeroTitle", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: settings.homeHeroTitle }),
        }),
        fetch("/api/settings/homeHeroSub", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: settings.homeHeroSub }),
        }),
        fetch("/api/settings/logoUrl", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: settings.logoUrl }),
        }),
        fetch("/api/settings/socialLinks", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ value: settings.socialLinks }),
        }),
      ];

      await Promise.all(updates);
      toast({ title: "Success", description: "Settings updated successfully" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <AdminSidebar />
      <div className="lg:pl-64 p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="h-8 w-8" />
              <h1 className="text-3xl font-bold font-display">Site Settings</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your website's branding, logo, and social media links
            </p>
          </div>

          {/* Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Website Logo</CardTitle>
              <CardDescription>Upload or manage your site's logo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {logoPreview && (
                <div className="relative w-40 h-40 border rounded-lg overflow-hidden bg-white/10 flex items-center justify-center">
                  <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="logo">Upload Logo</Label>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: PNG or SVG, square or wide format
                </p>
              </div>
              {logoPreview && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveLogo}
                  disabled={loading}
                >
                  Remove Logo
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Site Name */}
          <Card>
            <CardHeader>
              <CardTitle>Site Name</CardTitle>
              <CardDescription>Your website's primary name/branding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  placeholder="LearnWithShivam"
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Home Page Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Home Page Hero Section</CardTitle>
              <CardDescription>Update the main heading and subtitle on your home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input
                  id="heroTitle"
                  value={settings.homeHeroTitle}
                  onChange={(e) => setSettings({ ...settings, homeHeroTitle: e.target.value })}
                  placeholder="Your main heading"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  This appears as the large heading on your home page
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="heroSub">Hero Subtitle</Label>
                <Textarea
                  id="heroSub"
                  value={settings.homeHeroSub}
                  onChange={(e) => setSettings({ ...settings, homeHeroSub: e.target.value })}
                  placeholder="Your subtitle/description"
                  rows={3}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  This appears below the main heading
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Add links to your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={settings.socialLinks.linkedin || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/yourname"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile URL</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={settings.socialLinks.twitter || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                    })
                  }
                  placeholder="https://twitter.com/yourname"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile URL</Label>
                <Input
                  id="github"
                  type="url"
                  value={settings.socialLinks.github || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/yourname"
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
              className="gap-2"
            >
              <Save className="h-5 w-5" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.reload()}
              disabled={loading}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
