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
  VolumeX,
  Loader2,
} from "lucide-react";

interface VideoPreviewProps {
  videoUrl: string | null;
  isLoading: boolean;
}

export function VideoPreview({ videoUrl, isLoading }: VideoPreviewProps) {
  const showPlaceholder = !videoUrl && !isLoading;
  const showLoadingState = isLoading;
  const showGeneratedVideo = videoUrl && !isLoading;

  return (
    <Card className="h-full shadow-md overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex-1 bg-black flex items-center justify-center">
          <AspectRatio ratio={16 / 9} className="max-w-full bg-muted">
            {showLoadingState && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-primary-foreground">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg font-medium text-foreground">
                  Generating your clip...
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a few moments.
                </p>
              </div>
            )}

            {showPlaceholder && (
              <>
                <Image
                  src="https://placehold.co/1280x720.png"
                  alt="Video preview"
                  data-ai-hint="video still"
                  fill
                  className="object-contain"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-20 w-20 text-white/80 hover:text-white hover:bg-white/20"
                  >
                    <Play className="h-12 w-12 fill-current" />
                  </Button>
                </div>
              </>
            )}

            {showGeneratedVideo && (
              <Image
                src={videoUrl}
                alt="Generated video"
                data-ai-hint="generated art"
                fill
                className="object-contain"
              />
            )}
          </AspectRatio>
        </div>
        <div className="p-3 border-t bg-card">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              {showGeneratedVideo ? "0:00" : "0:12"}
            </span>
            <Slider
              defaultValue={[showGeneratedVideo ? 0 : 12]}
              max={showGeneratedVideo ? 5 : 100}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground">
              {showGeneratedVideo ? "0:05" : "1:30"}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                {showGeneratedVideo ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Volume2 className="h-5 w-5" />
              </Button>
              <Slider
                defaultValue={[75]}
                max={100}
                step={1}
                className="w-24"
              />
              <Button variant="ghost" size="icon">
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
