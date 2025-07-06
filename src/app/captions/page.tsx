"use client";

import { useRef, useState } from "react";
import { autoCaption } from "@/ai/flows/auto-caption";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Captions, Upload, FileVideo } from "lucide-react";

const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function CaptionsPage() {
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [captions, setCaptions] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "File Too Large",
          description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
      if (file.type.startsWith("video/")) {
        const reader = new FileReader();
        reader.onloadstart = () => setIsLoading(true);
        reader.onload = (e) => {
          setVideoDataUri(e.target?.result as string);
          setFileName(file.name);
          setCaptions(null);
          setIsLoading(false);
        };
        reader.onerror = () => {
          setIsLoading(false);
          toast({
            title: "File Read Error",
            description: "There was an issue reading your file.",
            variant: "destructive",
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a video file.",
          variant: "destructive",
        });
      }
    }
  };

  const handleGenerateCaptions = async () => {
    if (!videoDataUri) {
      toast({
        title: "No Video Uploaded",
        description: "Please upload a video to generate captions.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setCaptions(null);
    try {
      const result = await autoCaption({ videoDataUri });
      setCaptions(result.captions);
      toast({
        title: "Captions Generated!",
        description: "Your video captions are ready.",
      });
    } catch (error) {
      console.error("Failed to generate captions:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <main className="flex-1 p-4 lg:p-6 overflow-auto flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Captions className="w-6 h-6" /> Auto-Caption Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="video-upload">Video File</Label>
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    id="video-upload"
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {fileName ? "Change Video" : "Upload Video"}
                  </Button>
                  {fileName && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                      <FileVideo className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerateCaptions}
                  disabled={isLoading || !videoDataUri}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Processing..." : "Generate Captions"}
                </Button>
                {captions && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="captions-output">Generated Captions</Label>
                    <Textarea
                      id="captions-output"
                      readOnly
                      rows={8}
                      value={captions}
                      className="bg-muted"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
