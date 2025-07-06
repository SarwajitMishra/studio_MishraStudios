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
import type { SuggestedClip, MediaType } from "@/app/page";

type Tool = "select" | "trim" | "pan";

interface TimelineProps {
  videoClips: SuggestedClip[];
  videoDuration: number | null;
  isProcessing: boolean;
  mediaType: MediaType | null;
}

export function Timeline({ videoClips, videoDuration, isProcessing, mediaType }: TimelineProps) {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  const transformedVideoClips = (() => {
    if (isProcessing || !videoDuration || !videoClips.length) {
      return [];
    }
    
    return videoClips.map((clip, index) => {
      const colors = ["bg-purple-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-red-500"];
      return {
        description: clip.description,
        start: (clip.startTime / videoDuration) * 100,
        end: (clip.endTime / videoDuration) * 100,
        color: colors[index % colors.length],
      };
    });
  })();

  const renderTracks = () => {
    if (isProcessing) {
      return null;
    }

    switch (mediaType) {
      case 'video':
        return (
          <>
            <TimelineTrack type="video" label="Video" clips={transformedVideoClips} />
            <TimelineTrack type="audio" label="Audio" clips={[{ start: 0, end: 100, color: "bg-teal-500", description: "Original Audio" }]} />
          </>
        );
      case 'image':
        return <TimelineTrack type="image" label="Image" clips={[{ start: 0, end: 100, color: "bg-pink-500", description: "Uploaded Image" }]} />;
      case 'audio':
        return <TimelineTrack type="audio" label="Audio" clips={[{ start: 0, end: 100, color: "bg-teal-500", description: "Uploaded Audio" }]} />;
      default:
        return null;
    }
  };

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
            {renderTracks()}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
