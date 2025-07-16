
"use client";

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Film, Sparkles, Type } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Mishra Studios</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started - It's Free</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container mx-auto px-4 md:px-6 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            AI-Powered Video Editing, Reimagined
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Mishra Studios leverages cutting-edge AI to help you create stunning videos from text, images, or your own footage in minutes. No experience required.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Start Creating for Free</Link>
          </Button>
        </section>

        <section className="container mx-auto px-4 md:px-6">
           <div className="relative w-full max-w-5xl mx-auto">
             <Image
                src="https://placehold.co/1200x600.png"
                data-ai-hint="video editor interface"
                alt="Mishra Studios editor interface"
                width={1200}
                height={600}
                className="rounded-xl border shadow-2xl"
              />
           </div>
        </section>

        <section className="bg-muted py-20 mt-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">How AI Supercharges Your Workflow</h2>
              <p className="mt-2 text-muted-foreground">From ideas to final cut, let AI be your creative partner.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden">
                 <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="data analysis abstract"
                    alt="AI Clip Suggestions"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">AI Clip Suggestions</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload your long-form video and our AI will instantly find and suggest the most engaging moments, ready to be turned into shorts.
                    </p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="text document creation"
                    alt="Text-to-Video Generation"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Type className="h-6 w-6 text-primary" />
                  </div>
                   <div>
                    <CardTitle className="text-lg">Text-to-Video Generation</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Have a script or an idea? Describe it in a prompt and watch as our AI generates a video clip to match your vision.
                    </p>
                  </div>
                </CardHeader>
              </Card>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src="https://placehold.co/600x400.png"
                    data-ai-hint="video editing timeline"
                    alt="Prompt-Based Editing"
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </CardContent>
                <CardHeader className="flex flex-row items-start gap-4 p-4">
                  <div className="bg-primary/10 p-3 rounded-full mt-1">
                    <Film className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Prompt-Based Editing</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Simply tell the AI what you want. "Make this clip black and white and add cinematic music." Done. It's that easy.
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <h2 className="text-3xl font-bold">Ready to Create?</h2>
             <p className="mt-2 text-muted-foreground">Join thousands of creators and start your first project today.</p>
             <Button size="lg" className="mt-8" asChild>
                <Link href="/signup">Sign Up Now</Link>
             </Button>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-4 md:px-6 text-sm text-muted-foreground">
          <p>Made with ❤️ by Shravya Foundation.</p>
          <div className="flex gap-4">
             <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
             <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}


export default function HomeRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) {
      router.push('/editor');
    }
  }, [user, loading, router]);
  
  if (loading) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
          <div className="text-center">
            <p className="text-lg">Loading Mishra Studios...</p>
          </div>
        </div>
      );
  }
  
  if (!user) {
    return <LandingPage />;
  }

  // Fallback for when user is loaded but redirect hasn't happened yet
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <p className="text-lg">Redirecting to your editor...</p>
      </div>
    </div>
  );
}
