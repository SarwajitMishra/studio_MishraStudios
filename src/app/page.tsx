"use client";

import { useRef, useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Timeline } from "@/components/editor/timeline";
import { VideoPreview } from "@/components/editor/video-preview";
import { GenerateClipModal } from "@/components/editor/generate-clip-modal";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { videoScanAnalysis } from "@/ai/flows/video-scan-analysis";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";

export type MediaType = "image" | "video" | "audio";
export type SuggestedClip = {
  description: string;
  startTime: number;
  endTime: number;
};

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [suggestedClips, setSuggestedClips] = useState<SuggestedClip[]>([]);
  const [activeClip, setActiveClip] = useState<SuggestedClip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let analysisProgressInterval: NodeJS.Timeout | undefined;

    if (isAnalyzing) {
      analysisProgressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(analysisProgressInterval!);
            return 95;
          }
          return prev + 5;
        });
      }, 500);
    }

    return () => {
      if (analysisProgressInterval) {
        clearInterval(analysisProgressInterval);
      }
    };
  }, [isAnalyzing]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setVideoUrl(null);
    setMediaType(null);
    setSuggestedClips([]);
    setActiveClip(null);
    setProgress(0);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetState();
    
    const objectUrl = URL.createObjectURL(file);
    const mimeType = file.type;

    let detectedMediaType: MediaType | null = null;
    if (mimeType.startsWith("image/")) detectedMediaType = 'image';
    else if (mimeType.startsWith("video/")) detectedMediaType = 'video';
    else if (mimeType.startsWith("audio/")) detectedMediaType = 'audio';
    else {
      toast({
        title: "Unsupported File Type",
        description: "Please upload an image, video, or audio file.",
        variant: "destructive",
      });
      return;
    }
    
    setMediaType(detectedMediaType);
    setVideoUrl(objectUrl);
    
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

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setIsLoading(false);
          if (detectedMediaType === 'video') {
            try {
              setIsAnalyzing(true);
              setProgress(0);
              
              const analysisInput = { gcsUri, mimeType };
              const result = await videoScanAnalysis(analysisInput);
              
              setSuggestedClips(result.suggestedClips);
               toast({
                title: "Analysis Complete!",
                description: "We've suggested some clips for you below.",
              });
            } catch (error) {
              console.error("Failed to analyze video:", error);
              toast({
                title: "Analysis Failed",
                description: error instanceof Error ? error.message : "We couldn't generate clip suggestions.",
                variant: "destructive",
              });
            } finally {
              setIsAnalyzing(false);
            }
          }
        } else {
            setIsLoading(false);
            console.error(`Upload failed with status: ${xhr.status}`);
            toast({
                title: "Upload Failed",
                description: `The server responded with status ${xhr.status}. Check your CORS settings.`,
                variant: "destructive",
            });
        }
      };
      
      xhr.onerror = () => {
        setIsLoading(false);
        setProgress(0);
        console.error("Network error during file upload.");
        toast({
            title: "Upload Failed",
            description: "A network error occurred. Check your CORS configuration.",
            variant: "destructive",
        });
      };

      xhr.send(file);

    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      console.error("File upload process failed:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload file.",
        variant: "destructive",
      });
    }
  };

  const showLoadingState = isLoading || isAnalyzing;
  const loadingMessage = isAnalyzing 
    ? `Analyzing for key moments... ${progress}%` 
    : `Uploading your file... ${progress}%`;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 flex flex-col gap-4 p-4 lg:p-6 overflow-hidden">
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex-1 min-h-0">
                <VideoPreview
                  videoUrl={videoUrl}
                  mediaType={mediaType}
                  isLoading={showLoadingState}
                  progress={showLoadingState ? progress : undefined}
                  loadingMessage={loadingMessage}
                  onUploadClick={handleUploadClick}
                  clip={activeClip}
                  onClipEnd={() => setActiveClip(null)}
                />
            </div>
            
            {videoUrl && mediaType === 'video' && suggestedClips.length > 0 && !showLoadingState && (
              <Timeline
                clips={suggestedClips}
                videoUrl={videoUrl}
                onClipSelect={setActiveClip}
              />
            )}
          </main>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-accent z-20"
            >
              <Zap className="h-8 w-8 text-primary-foreground fill-current" />
              <span className="sr-only">Generate Clip</span>
            </Button>
          </DialogTrigger>
          <GenerateClipModal setVideoUrl={setVideoUrl} setMediaType={setMediaType} />
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
