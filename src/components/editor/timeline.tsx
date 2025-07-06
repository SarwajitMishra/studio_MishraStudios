"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Grab,
  Scissors,
  ZoomIn,
  ZoomOut,
  Undo,
  Redo,
  MousePointer2,
} from "lucide-react";
import { TimelineTrack } from "./timeline-track";
import type { SuggestedClip } from "@/app/page";

type Tool = "select" | "trim" | "pan";

interface TimelineProps {
  videoClips: SuggestedClip[];
  videoDuration: number | null;
  isProcessing: boolean;
}

export function Timeline({ videoClips, videoDuration, isProcessing }: TimelineProps) {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  const transformedVideoClips = (() => {
    const hasRealClips = videoClips.length > 0;
    
    if (isProcessing) {
      return []; // While uploading or analyzing, the track is empty
    }

    if (hasRealClips && videoDuration) {
      // If we have clips and the video duration, map them to percentages for display
      return videoClips.map((clip, index) => {
        const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];
        return {
          start: (clip.startTime / videoDuration) * 100,
          end: (clip.endTime / videoDuration) * 100,
          color: colors[index % colors.length],
        };
      });
    }

    if (hasRealClips && !videoDuration) {
      // Clips are ready, but we're waiting for video metadata. Show empty track.
      return [];
    }

    // Default state: show mock clips before any video is uploaded
    return [
      { start: 5, end: 25, color: "bg-purple-500" },
      { start: 30, end: 50, color: "bg-blue-500" },
      { start: 65, end: 90, color: "bg-green-500" },
    ];
  })();

  const imageClips = [
    { start: 28, end: 42, color: "bg-pink-500" },
    { start: 55, end: 70, color: "bg-indigo-500" },
  ];
  const audioClips = [{ start: 0, end: 100, color: "bg-teal-500" }];
  const voiceClips = [{ start: 10, end: 80, color: "bg-orange-500" }];

  return (
    <Card className="h-full shadow-md">
      <CardContent className="p-0 h-full flex flex-col">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === "select" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setActiveTool("select")}
                  >
                    <MousePointer2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select Tool</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === "trim" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setActiveTool("trim")}
                  >
                    <Scissors className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trim Tool</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={activeTool === "pan" ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setActiveTool("pan")}
                  >
                    <Grab className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Pan Tool</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button variant="ghost" size="icon">
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
            <Button variant="ghost" size="icon">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="relative">
            <TimelineTrack type="video" label="Video" clips={transformedVideoClips} />
            <TimelineTrack type="image" label="Images" clips={imageClips} />
            <TimelineTrack
              type="audio"
              label="Background Music"
              clips={audioClips}
            />
            <TimelineTrack type="voice" label="Voice-over" clips={voiceClips} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
