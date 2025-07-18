
"use client";

import { useState } from "react";
import Image from "next/image";
import { textToVideo } from "@/ai/flows/text-to-video";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Sparkles, Type } from "lucide-react";

export default function TextToVideoPage() {
  const [prompt, setPrompt] = useState("A majestic lion in the savanna at sunrise");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Prompt is empty",
        description: "Please describe the video you want to create.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedVideo(null);
    try {
      const result = await textToVideo({ prompt });
      setGeneratedVideo(result.videoDataUri);
      toast({
        title: "Video Generated!",
        description: "Your new video is ready.",
      });
    } catch (error) {
      console.error("Failed to generate video:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="w-6 h-6" /> Text to Video
                  </CardTitle>
                  <CardDescription>Describe the video you want to generate using a text prompt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="prompt-input">Prompt</Label>
                    <Input
                      id="prompt-input"
                      placeholder="e.g., A futuristic city skyline at night"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-5 w-5" />
                    )}
                    {isGenerating ? "Generating..." : "Generate Video"}
                  </Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label>Generated Video</Label>
                <Card className="aspect-video flex items-center justify-center bg-muted overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center text-muted-foreground p-4">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                      <p>Generating video...</p>
                    </div>
                  ) : generatedVideo ? (
                    <Image src={generatedVideo} alt="Generated video" width={1280} height={720} data-ai-hint="lion savanna sunrise" className="object-cover w-full h-full" />
                  ) : (
                     <div className="text-center text-muted-foreground p-4">
                      <Sparkles className="mx-auto h-12 w-12" />
                      <p>Your generated video will appear here</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
