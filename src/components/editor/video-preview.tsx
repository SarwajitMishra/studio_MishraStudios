import { useRef } from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  Loader2,
  Film,
  Sparkles,
  Upload,
  Music,
} from "lucide-react";
import type { MediaType } from "@/app/page";

interface VideoPreviewProps {
  videoUrl: string | null;
  mediaType: MediaType | null;
  isLoading: boolean;
  progress?: number;
  loadingMessage?: string;
  onUploadClick: () => void;
  setVideoDuration: (duration: number | null) => void;
}

export function VideoPreview({
  videoUrl,
  mediaType,
  isLoading,
  progress,
  loadingMessage,
  onUploadClick,
  setVideoDuration,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const showPlaceholder = !videoUrl && !isLoading;
  const showLoadingState = isLoading;
  const showMedia = videoUrl && !isLoading;

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

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
        return (
          <video
            ref={videoRef}
            src={videoUrl!}
            onLoadedMetadata={handleLoadedMetadata}
            controls
            autoPlay
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

          {/* Controls Overlay - only show for images, which represent AI-generated clips */}
          {showMedia && mediaType === "image" && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-primary-foreground">
              <div className="flex items-center gap-4">
                <span className="text-xs">0:00</span>
                <Slider defaultValue={[0]} max={5} step={0.1} className="flex-1" />
                <span className="text-xs">0:05</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <Volume2 className="h-5 w-5" />
                  </Button>
                  <Slider
                    defaultValue={[75]}
                    max={100}
                    step={1}
                    className="w-24"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-white hover:bg-white/10"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
