"use client";

import { useRef, useState } from "react";
import { autoCaption } from "@/ai/flows/auto-caption";
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
import { Loader2, Zap, Captions, Upload, FileVideo } from "lucide-react";

export default function CaptionsPage() {
  const [gcsUri, setGcsUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string | null>(null);
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
    setCaptions(null);
    setIsLoading(true);
    setProgress(0);

    try {
      const { uploadUrl, gcsUri } = await generateUploadUrl({
        fileName: file.name,
        contentType: file.type,
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
            description: `${file.name} is ready for captioning.`,
          });
        } else {
          throw new Error(`Upload failed with status: ${xhr.status}`);
        }
        setIsLoading(false);
      };

      xhr.onerror = () => {
        setIsLoading(false);
        throw new Error("Network error during file upload.");
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

  const handleGenerateCaptions = async () => {
    if (!gcsUri) {
      toast({
        title: "No Video Uploaded",
        description: "Please upload a video to generate captions.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setCaptions(null);
    try {
      const result = await autoCaption({ gcsUri });
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
                  onClick={handleGenerateCaptions}
                  disabled={isLoading || isGenerating || !gcsUri}
                >
                  {isGenerating ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  {isGenerating ? "Generating..." : "Generate Captions"}
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
