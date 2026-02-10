import { useEffect, useState } from "react";
import { Navbar, Footer } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { Mail, Linkedin, Github, Twitter, Award, Briefcase, Code2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface AboutMeData {
  id?: number;
  bio: string;
  profilePhoto?: string;
  sections?: Array<{
    id: string;
    title: string;
    content: string;
    type: 'text' | 'skills' | 'experience' | 'certifications';
  }>;
}

interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  github?: string;
}

interface Settings {
  socialLinks?: SocialLinks;
}

export default function AboutMe() {
  const [aboutData, setAboutData] = useState<AboutMeData | null>(null);
  const [social, setSocial] = useState<SocialLinks>({});

  // Fetch about me data
  useEffect(() => {
    const fetchAboutMe = async () => {
      try {
        const response = await fetch("/api/about-me");
        const data = await response.json();
        setAboutData(data);
      } catch (error) {
        console.error("Failed to fetch about me data:", error);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings/socialLinks");
        if (response.ok) {
          const data = await response.json();
          setSocial(data);
        }
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };

    fetchAboutMe();
    fetchSettings();
  }, []);

  const getIconForSection = (type: string) => {
    switch (type) {
      case 'skills':
        return <Code2 className="h-5 w-5" />;
      case 'experience':
        return <Briefcase className="h-5 w-5" />;
      case 'certifications':
        return <Award className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Profile */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/5 border-b">
          <div className="container">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              {/* Profile Photo */}
              <div className="flex justify-center lg:justify-start">
                {aboutData?.profilePhoto ? (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-50"></div>
                    <img
                      src={aboutData.profilePhoto}
                      alt="Profile"
                      className="relative w-64 h-64 rounded-full border-4 border-primary/20 object-cover shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl opacity-50"></div>
                    <div className="relative w-64 h-64 rounded-full border-4 border-primary/20 bg-muted flex items-center justify-center shadow-2xl">
                      <Code2 className="h-32 w-32 text-muted-foreground/30" />
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-primary/10 border-primary/20">
                    <Award className="h-3 w-3 mr-2" />
                    SENIOR NETWORK ENGINEER
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-display font-extrabold tracking-tight">
                    Network Infrastructure <span className="text-primary">Expert</span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl">
                    {aboutData?.bio || "Building robust and scalable network solutions for enterprises worldwide."}
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3">
                  {social?.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </Button>
                    </a>
                  )}
                  {social?.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Github className="h-4 w-4" />
                        GitHub
                      </Button>
                    </a>
                  )}
                  {social?.twitter && (
                    <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                    </a>
                  )}
                  <Link href="/contact">
                    <Button size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sections Container */}
        <section className="py-20 lg:py-28">
          <div className="container max-w-4xl">
            <div className="space-y-16">
              {aboutData?.sections && aboutData.sections.length > 0 ? (
                aboutData.sections.map((section) => (
                  <div key={section.id} className="space-y-6">
                    {/* Section Title */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        {getIconForSection(section.type)}
                        <h2 className="text-3xl font-display font-bold">{section.title}</h2>
                      </div>
                      <div className="h-1 w-20 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>

                    {/* Section Content */}
                    {section.type === 'skills' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.content.split('\n').map(
                          (skill, idx) =>
                            skill.trim() && (
                              <Badge key={idx} variant="secondary" className="text-sm py-2 px-4">
                                {skill.replace(/^•\s*/, '')}
                              </Badge>
                            )
                        )}
                      </div>
                    ) : section.type === 'experience' ? (
                      <div className="space-y-6">
                        {section.content.split('\n\n').map(
                          (exp, idx) =>
                            exp.trim() && (
                              <Card key={idx}>
                                <CardContent className="pt-6">
                                  <p className="whitespace-pre-wrap text-mutated-foreground leading-relaxed">
                                    {exp}
                                  </p>
                                </CardContent>
                              </Card>
                            )
                        )}
                      </div>
                    ) : section.type === 'certifications' ? (
                      <div className="space-y-3">
                        {section.content.split('\n').map(
                          (cert, idx) =>
                            cert.trim() && (
                              <Card key={idx} className="border-l-4 border-l-primary">
                                <CardContent className="pt-6">
                                  <p className="font-medium">{cert.replace(/^•\s*/, '')}</p>
                                </CardContent>
                              </Card>
                            )
                        )}
                      </div>
                    ) : (
                      <div className="prose prose-invert max-w-none">
                        <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">About Me content coming soon...</p>
                </div>
              )}
            </div>

            <Separator className="my-16" />

            {/* Call to Action */}
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold">Interested in Working Together?</h3>
                <p className="text-muted-foreground">
                  Have a project or opportunity? I'd love to hear from you.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  Start a Conversation
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
