
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { audioToVideo } from "@/ai/flows/audio-to-video";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Mic, Upload, FileAudio, Video } from "lucide-react";

export default function AudioToVideoPage() {
  const [gcsUri, setGcsUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Generate a visualizer with geometric patterns that react to the beat");
  const [originalAudioUrl, setOriginalAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an audio file.",
        variant: "destructive",
      });
      return;
    }

    setGcsUri(null);
    setGeneratedVideoUrl(null);
    setMimeType(file.type);
    setIsLoading(true);
    setProgress(0);

    const objectUrl = URL.createObjectURL(file);
    setOriginalAudioUrl(objectUrl);
    setFileName(file.name);

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
            description: `${file.name} is ready.`,
          });
        } else {
          toast({
            title: "Upload Failed",
            description: `The server responded with status ${xhr.status}.`,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      };
      xhr.onerror = () => {
        setIsLoading(false);
        toast({
          title: "Upload Failed",
          description: "A network error occurred.",
          variant: "destructive",
        });
      };
      xhr.send(file);
    } catch (error) {
      setIsLoading(false);
      setOriginalAudioUrl(null);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload file.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!gcsUri || !mimeType) {
      toast({
        title: "No Audio Uploaded",
        description: "Please upload an audio file first.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setGeneratedVideoUrl(null);
    try {
      const result = await audioToVideo({ gcsUri, mimeType, prompt });
      setGeneratedVideoUrl(result.videoDataUri);
      toast({
        title: "Video Generated!",
        description: "Your new video is ready.",
      });
    } catch (error) {
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
            <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="space-y-8">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mic className="w-6 h-6" /> Audio to Video
                    </CardTitle>
                    <CardDescription>Upload an audio file and describe the visuals you want to create.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="audio-upload">1. Upload Audio</Label>
                      <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="audio-upload" />
                      <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isLoading || isGenerating}>
                        <Upload className="mr-2 h-4 w-4" />
                        {originalAudioUrl ? "Change Audio" : "Select Audio"}
                      </Button>
                      {isLoading && (
                         <div className="space-y-2 pt-2">
                          <Progress value={progress} className="w-full" />
                          <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prompt-input">2. Describe Visuals</Label>
                      <Input id="prompt-input" placeholder="e.g., Abstract liquid metal visuals" value={prompt} onChange={(e) => setPrompt(e.target.value)} disabled={isLoading || isGenerating} />
                    </div>
                    <Button className="w-full" size="lg" onClick={handleGenerate} disabled={isLoading || isGenerating || !gcsUri}>
                      {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Zap className="mr-2 h-5 w-5" />}
                      {isGenerating ? "Generating..." : "Generate Video"}
                    </Button>
                  </CardContent>
                </Card>
                {originalAudioUrl && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Audio Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground mb-2">{fileName}</p>
                       <audio controls src={originalAudioUrl} className="w-full">
                         Your browser does not support the audio element.
                       </audio>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label>Generated Video</Label>
                <Card className="aspect-video flex items-center justify-center bg-muted overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center text-muted-foreground p-4">
                      <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                      <p>Generating video...</p>
                    </div>
                  ) : generatedVideoUrl ? (
                    <Image src={generatedVideoUrl} alt="Generated Video" width={640} height={360} className="object-cover w-full h-full" />
                  ) : (
                      <div className="text-center text-muted-foreground p-4">
                        {originalAudioUrl ? (
                          <>
                            <Video className="mx-auto h-12 w-12" />
                            <p>Your generated video will appear here</p>
                          </>
                        ) : (
                          <>
                           <FileAudio className="mx-auto h-12 w-12" />
                           <p>Upload an audio file to start</p>
                          </>
                        )}
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
