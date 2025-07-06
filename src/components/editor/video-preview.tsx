import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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
} from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
  onUploadClick: () => void;
}

export function VideoPreview({
  videoUrl,
  isLoading,
  onUploadClick,
}: VideoPreviewProps) {
  const showPlaceholder = !videoUrl && !isLoading;
  const showLoadingState = isLoading;
  const showGeneratedVideo = videoUrl && !isLoading;

  return (
    <Card className="h-full shadow-md overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col bg-background">
        <div className="flex-1 relative flex items-center justify-center overflow-hidden p-2 sm:p-4">
          <AspectRatio
            ratio={16 / 9}
            className="w-full rounded-lg bg-muted flex items-center justify-center"
          >
            {showLoadingState && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-primary-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-foreground">
                  Processing your file...
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments.
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
                  Upload a video or enter a prompt to begin editing magic.
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

            {showGeneratedVideo && (
              <Image
                src={videoUrl}
                alt="Generated video"
                data-ai-hint="generated art"
                fill
                className="object-contain rounded-lg"
              />
            )}
          </AspectRatio>

          {/* Controls Overlay */}
          {!showPlaceholder && (
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-primary-foreground">
              <div className="flex items-center gap-4">
                <span className="text-xs">
                  {showGeneratedVideo ? "0:00" : "0:12"}
                </span>
                <Slider
                  defaultValue={[showGeneratedVideo ? 0 : 12]}
                  max={showGeneratedVideo ? 5 : 100}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs">
                  {showGeneratedVideo ? "0:05" : "1:30"}
                </span>
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
                    {showGeneratedVideo ? (
                      <Play className="h-6 w-6" />
                    ) : (
                      <Pause className="h-6 w-6" />
                    )}
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
