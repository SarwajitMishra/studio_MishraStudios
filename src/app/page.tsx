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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      resetState();
      
      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsLoading(true);
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        const mimeType = dataUri.split(":")[1].split(";")[0];
        
        let detectedMediaType: MediaType | null = null;
        if (mimeType.startsWith("image/")) {
          detectedMediaType = 'image';
        } else if (mimeType.startsWith("video/")) {
          detectedMediaType = 'video';
        } else if (mimeType.startsWith("audio/")) {
          detectedMediaType = 'audio';
        }

        if (detectedMediaType) {
          setMediaType(detectedMediaType);
          setVideoUrl(dataUri);
          
          if(detectedMediaType === 'video') {
            try {
              setIsAnalyzing(true);
              const result = await videoScanAnalysis({ videoDataUri: dataUri });
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
           toast({
            title: "Unsupported File Type",
            description: "Please upload an image, video, or audio file.",
            variant: "destructive",
          });
        }
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
    }
  };

  const loadingMessage = isAnalyzing 
    ? "Analyzing video for key moments..." 
    : `Reading your file... ${progress}%`;
  
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
