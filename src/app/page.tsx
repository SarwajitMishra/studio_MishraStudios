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

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export type MediaType = "image" | "video" | "audio";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

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

      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsLoading(true);
        setProgress(0);
        setVideoUrl(null);
        setMediaType(null);
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onload = (e) => {
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
              isLoading={isLoading}
              progress={progress}
              onUploadClick={handleUploadClick}
            />
            <div className="h-[180px] sm:h-[220px] md:h-[260px] lg:h-[320px]">
              <Timeline />
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
