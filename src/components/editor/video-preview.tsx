import { useRef, useEffect } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Film,
  Sparkles,
  Upload,
  Music,
} from "lucide-react";
import type { MediaType, SuggestedClip } from "@/lib/types";

interface VideoPreviewProps {
  videoUrl: string | null;
  mediaType: MediaType | null;
  isLoading: boolean;
  progress?: number;
  loadingMessage?: string;
  onUploadClick: () => void;
  clip: SuggestedClip | null;
  onClipEnd: () => void;
}

export function VideoPreview({
  videoUrl,
  mediaType,
  isLoading,
  progress,
  loadingMessage,
  onUploadClick,
  clip,
  onClipEnd,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showPlaceholder = !videoUrl && !isLoading;
  const showLoadingState = isLoading;
  const showMedia = videoUrl && !isLoading;

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && videoUrl && mediaType === 'video') {
      const newSrc = clip 
        ? `${videoUrl}#t=${clip.startTime},${clip.endTime}` 
        // When clip is null, revert to original blob URL if it exists, otherwise the base videoUrl
        : videoElement.src.startsWith('blob:') ? videoElement.src.split('#')[0] : videoUrl;

      // Only update src if it has actually changed to avoid reloads
      if (videoElement.currentSrc !== newSrc) {
        videoElement.src = newSrc;
      }
      
      const playPromise = videoElement.play();
      if (playPromise !== undefined) {
          playPromise.catch(e => console.error("Autoplay was prevented:", e));
      }
      
      const handleTimeUpdate = () => {
        if (clip && videoElement.currentTime >= clip.endTime) {
          videoElement.pause();
          onClipEnd(); // Signal that the clip has finished
        }
      };

      const handleLoadedData = () => {
        videoElement.play().catch(e => console.error("Autoplay after load was prevented:", e));
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadeddata', handleLoadedData);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [clip, videoUrl, mediaType, onClipEnd]);

  const renderMedia = () => {
    if (!showMedia) return null;

    switch (mediaType) {
      case "image":
        return (
          <Image
            src={videoUrl!}
            alt="Uploaded content"
            data-ai-hint="uploaded content"
            fill
            className="object-contain rounded-lg"
          />
        );
      case "video":
        // The video src is now primarily controlled via the useEffect hook
        return (
          <video
            ref={videoRef}
            src={videoUrl!}
            controls
            className="w-full h-full object-contain rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <div className="flex flex-col items-center justify-center text-center gap-4 p-8 text-foreground">
            <Music className="w-24 h-24 text-primary" />
            <h3 className="text-2xl font-bold">Audio Content</h3>
            <p className="text-muted-foreground max-w-sm">
              Your audio file is loaded. Use the player below to preview it.
            </p>
            <audio src={videoUrl!} controls className="w-full max-w-sm mt-4">
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full shadow-md overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col bg-background">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
          <AspectRatio
            ratio={16 / 9}
            className="w-full rounded-lg bg-muted flex items-center justify-center"
          >
            {showLoadingState && (
              <div className="w-full max-w-sm flex flex-col items-center justify-center gap-4 text-center p-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-foreground mt-4">
                  {loadingMessage || "Processing..."}
                </p>
                {progress !== undefined && <Progress value={progress} className="w-full mt-2" />}
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a moment for larger files.
                </p>
              </div>
            )}

            {showPlaceholder && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center gap-4 p-8 bg-card text-card-foreground rounded-lg">
                <div className="relative">
                  <Film className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
                  <Sparkles className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  <Sparkles className="absolute bottom-12 -left-2 w-4 h-4 sm:w-6 sm:h-6 text-primary opacity-70" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mt-2">
                  Start Creating with Mishra Studios
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-md">
                  Upload a video or use AI to begin your masterpiece.
                </p>
                <Button
                  size="lg"
                  className="mt-2"
                  onClick={onUploadClick}
                  disabled={isLoading}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Upload a Video
                </Button>
              </div>
            )}

            {renderMedia()}
          </AspectRatio>
        </div>
      </CardContent>
    </Card>
  );
}
