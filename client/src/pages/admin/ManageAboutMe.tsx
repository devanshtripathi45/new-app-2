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
import { Plus, Save, Trash2, User, Code2, Briefcase, Award } from "lucide-react";

// Simple UUID generator
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface AboutMeSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'skills' | 'experience' | 'certifications';
}

interface AboutMeData {
  id?: number;
  bio: string;
  profilePhoto?: string;
  sections: AboutMeSection[];
}

export default function AdminAboutMe() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [aboutData, setAboutData] = useState<AboutMeData>({
    bio: "",
    profilePhoto: "",
    sections: [],
  });

  const [loading, setLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (isLoading) return null;
  if (!user || user.role !== "admin") {
    setLocation("/auth");
    return null;
  }

  // Fetch about me data
  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await fetch("/api/about-me");
        const data = await response.json();
        setAboutData(data);
        if (data.profilePhoto) setPhotoPreview(data.profilePhoto);
      } catch (error) {
        console.error("Failed to fetch about me data:", error);
      }
    };

    fetchAboutMe();
  }, []);

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview(base64);
      setPhotoFile(file);
      setAboutData({ ...aboutData, profilePhoto: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleAddSection = () => {
    const newSection: AboutMeSection = {
      id: generateId(),
      title: "New Section",
      content: "",
      type: "text",
    };
    setAboutData({
      ...aboutData,
      sections: [...aboutData.sections, newSection],
    });
    setExpandedSection(newSection.id);
  };

  const handleUpdateSection = (id: string, updates: Partial<AboutMeSection>) => {
    setAboutData({
      ...aboutData,
      sections: aboutData.sections.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const handleDeleteSection = (id: string) => {
    setAboutData({
      ...aboutData,
      sections: aboutData.sections.filter(s => s.id !== id),
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/about-me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: aboutData.bio,
          profilePhoto: aboutData.profilePhoto,
          sections: aboutData.sections,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast({
        title: "Success",
        description: "About Me content updated successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'skills':
        return <Code2 className="h-5 w-5" />;
      case 'experience':
        return <Briefcase className="h-5 w-5" />;
      case 'certifications':
        return <Award className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
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
              <User className="h-8 w-8" />
              <h1 className="text-3xl font-bold font-display">About Me</h1>
            </div>
            <p className="text-muted-foreground">
              Manage your profile information and professional sections
            </p>
          </div>

          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Upload a professional photo for your about me page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {photoPreview && (
                <div className="w-48 h-48 border rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="photo">Upload Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handlePhotoUpload(e.target.files[0])}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
              <CardDescription>Write a compelling introduction about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="bio">Your Bio</Label>
                <Textarea
                  id="bio"
                  value={aboutData.bio}
                  onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                  placeholder="Write about yourself, your expertise, and what you're passionate about..."
                  rows={4}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  This bio will appear on your about me page
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sections */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-display font-bold">Professional Sections</h2>
              <Button onClick={handleAddSection} disabled={loading} className="gap-2">
                <Plus className="h-5 w-5" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {aboutData.sections.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="pt-6 text-center text-muted-foreground">
                    <p>No sections yet. Click "Add Section" to create one.</p>
                  </CardContent>
                </Card>
              ) : (
                aboutData.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setExpandedSection(
                        expandedSection === section.id ? null : section.id
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getSectionIcon(section.type)}
                          <div>
                            <CardTitle>{section.title}</CardTitle>
                            <CardDescription className="capitalize">
                              {section.type} Section
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>

                    {expandedSection === section.id && (
                      <CardContent className="space-y-4 border-t pt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`title-${section.id}`}>Section Title</Label>
                          <Input
                            id={`title-${section.id}`}
                            value={section.title}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { title: e.target.value })
                            }
                            disabled={loading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`type-${section.id}`}>Section Type</Label>
                          <select
                            id={`type-${section.id}`}
                            value={section.type}
                            onChange={(e) =>
                              handleUpdateSection(section.id, {
                                type: e.target.value as any,
                              })
                            }
                            disabled={loading}
                            className="w-full px-3 py-2 border rounded-md bg-background text-foreground"
                          >
                            <option value="text">Text</option>
                            <option value="skills">Skills</option>
                            <option value="experience">Experience</option>
                            <option value="certifications">Certifications</option>
                          </select>
                          <p className="text-xs text-muted-foreground">
                            {section.type === 'skills' && 'Format: Use • bullets, one per line'}
                            {section.type === 'experience' && 'Format: Separate experiences with blank lines'}
                            {section.type === 'certifications' && 'Format: Use • bullets, one per line'}
                            {section.type === 'text' && 'Regular text content'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`content-${section.id}`}>Content</Label>
                          <Textarea
                            id={`content-${section.id}`}
                            value={section.content}
                            onChange={(e) =>
                              handleUpdateSection(section.id, { content: e.target.value })
                            }
                            placeholder={
                              section.type === 'skills'
                                ? '• Skill 1\n• Skill 2\n• Skill 3'
                                : section.type === 'experience'
                                ? 'Job Title at Company\nDescription here\n\nJob Title at Another Company\nDescription'
                                : section.type === 'certifications'
                                ? '• Certification Name - Year\n• Another Cert - Year'
                                : 'Your content here...'
                            }
                            rows={5}
                            disabled={loading}
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              size="lg"
              className="gap-2"
            >
              <Save className="h-5 w-5" />
              {loading ? "Saving..." : "Save About Me"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
