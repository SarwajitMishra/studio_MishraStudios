"use client";

import { useRef, useState } from "react";
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
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [suggestedClips, setSuggestedClips] = useState<SuggestedClip[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const resetState = () => {
    setVideoUrl(null);
    setMediaType(null);
    setVideoDuration(null);
    setSuggestedClips([]);
    setProgress(0);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    resetState();
    
    // For local preview
    const objectUrl = URL.createObjectURL(file);
    const mimeType = file.type;
    let detectedMediaType: MediaType | null = null;
    if (mimeType.startsWith("image/")) detectedMediaType = 'image';
    else if (mimeType.startsWith("video/")) detectedMediaType = 'video';
    else if (mimeType.startsWith("audio/")) detectedMediaType = 'audio';
    
    if (detectedMediaType) {
        setMediaType(detectedMediaType);
        setVideoUrl(objectUrl);
    } else {
        toast({
            title: "Unsupported File Type",
            description: "Please upload an image, video, or audio file.",
            variant: "destructive",
        });
        return;
    }
    
    setIsLoading(true);
    setProgress(0);

    try {
      // 1. Get signed URL from our server
      const { uploadUrl, gcsUri } = await generateUploadUrl({
        fileName: file.name,
        contentType: file.type,
      });

      // 2. Upload the file to GCS
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setIsLoading(false);
          if (detectedMediaType === 'video') {
            try {
              setIsAnalyzing(true); // Set loading state specifically for analysis

              // Pass the file.type directly as the contentType

              const result = await videoScanAnalysis({ gcsUri, contentType: file.type });
              setSuggestedClips(result.suggestedClips);
               toast({
                title: "Analysis Complete!",
                description: "We've suggested some clips for you on the timeline.",
              });
            } catch (error) {
              console.error("Failed to analyze video:", error);
              toast({
                title: "Analysis Failed",
                description: "We couldn't generate clip suggestions for this video.",
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
      console.error("File upload process failed:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload file. Is your GCS bucket configured?",
        variant: "destructive",
      });
    }
  };

  const loadingMessage = isAnalyzing 
    ? "Analyzing video for key moments..." 
    : `Uploading your file... ${progress}%`;
  
  const showLoadingState = isLoading || isAnalyzing;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 grid grid-rows-[1fr_auto] gap-4 p-4 lg:p-6 overflow-hidden">
            <input
              type="file"
              accept="image/*,video/*,audio/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <VideoPreview
              videoUrl={videoUrl}
              mediaType={mediaType}
              isLoading={showLoadingState}
              progress={isLoading ? progress : undefined}
              loadingMessage={loadingMessage}
              onUploadClick={handleUploadClick}
              setVideoDuration={setVideoDuration}
            />
            <div className="h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px]">
              <Timeline 
                videoClips={suggestedClips}
                videoDuration={videoDuration}
                isProcessing={showLoadingState}
              />
            </div>
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
