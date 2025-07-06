"use client";

import { useRef, useState } from "react";
import { clipSummarizer } from "@/ai/flows/clip-summarizer";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";
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

export default function SummarizerPage() {
  const [gcsUri, setGcsUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
        toast({
            title: "Invalid File Type",
            description: "Please upload a video file.",
            variant: "destructive",
        });
        return;
    }

    setFileName(file.name);
    setGcsUri(null);
    setSummary(null);
    setMimeType(file.type);
    setIsLoading(true);
    setProgress(0);

    try {
        const { uploadUrl, gcsUri } = await generateUploadUrl({
            fileName: file.name,
            mimeType: file.type,
        });

        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                setGcsUri(gcsUri);
                toast({
                    title: "Upload Complete",
                    description: `${file.name} is ready for summarization.`,
                });
                setIsLoading(false);
            } else {
                setIsLoading(false);
                console.error(`Upload failed with status: ${xhr.status}`);
                toast({
                    title: "Upload Failed",
                    description: `The server responded with status ${xhr.status}. Please check your bucket's CORS settings.`,
                    variant: "destructive",
                });
            }
        };
        
        xhr.onerror = (e) => {
            setIsLoading(false);
            setProgress(0);
            console.error("Network error during file upload.", {
                status: xhr.status,
                statusText: xhr.statusText,
            });
            toast({
                title: "Upload Failed",
                description: "A network error occurred. Please check your CORS configuration and network connection.",
                variant: "destructive",
            });
        };

        xhr.send(file);
    } catch (error) {
        setIsLoading(false);
        setProgress(0);
        setFileName(null);
        console.error("File upload failed:", error);
        toast({
            title: "Upload Failed",
            description: error instanceof Error ? error.message : "Could not upload file. Is your GCS bucket configured?",
            variant: "destructive",
        });
    }
  };

  const handleGenerateSummary = async () => {
    if (!gcsUri || !mimeType) {
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
      const result = await clipSummarizer({ gcsUri, mimeType });
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
                  {fileName && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2 pt-2">
                      <FileVideo className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                  {isLoading && (
                     <div className="space-y-2 pt-2">
                      <Progress value={progress} className="w-full" />
                      <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerateSummary}
                  disabled={isLoading || isGenerating || !gcsUri}
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
