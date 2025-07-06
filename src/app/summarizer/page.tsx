"use client";

import { useRef, useState } from "react";
import { clipSummarizer } from "@/ai/flows/clip-summarizer";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, FileText, Upload, FileVideo } from "lucide-react";

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function SummarizerPage() {
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
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
        reader.onloadstart = () => {
          setIsLoading(true);
          setProgress(0);
        };
        reader.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };
        reader.onload = (e) => {
          setVideoDataUri(e.target?.result as string);
          setFileName(file.name);
          setSummary(null);
          setIsLoading(false);
        };
        reader.onerror = () => {
          setIsLoading(false);
          setProgress(0);
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

  const handleGenerateSummary = async () => {
    if (!videoDataUri) {
      toast({
        title: "No Video Uploaded",
        description: "Please upload a video to generate a summary.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setSummary(null);
    try {
      const result = await clipSummarizer({ videoDataUri });
      setSummary(result.summary);
      toast({
        title: "Summary Generated!",
        description: "Your video summary is ready.",
      });
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
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
          <main className="flex-1 p-4 lg:p-6 overflow-auto flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6" /> Clip Summarizer
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
                    disabled={isLoading || isGenerating}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {fileName ? "Change Video" : "Upload Video"}
                  </Button>
                  {fileName && !isLoading && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                      <FileVideo className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                  {isLoading && (
                     <div className="space-y-2 pt-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-xs text-muted-foreground text-center">Loading... {progress}%</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerateSummary}
                  disabled={isLoading || isGenerating || !videoDataUri}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  {isGenerating ? "Processing..." : "Generate Summary"}
                </Button>
                {summary && (
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="summary-output">Generated Summary</Label>
                    <Textarea
                      id="summary-output"
                      readOnly
                      rows={8}
                      value={summary}
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
