"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

export function Timeline() {
  const clips = [
    { start: 5, end: 25, color: "bg-purple-500" },
    { start: 30, end: 50, color: "bg-blue-500" },
    { start: 65, end: 90, color: "bg-green-500" },
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
                  <Button variant="ghost" size="icon">
                    <MousePointer2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select Tool</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Scissors className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trim Tool</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
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
            {/* A range slider for zoom would go here */}
            <Button variant="ghost" size="icon">
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="relative">
            <TimelineTrack type="video" label="Video" clips={clips} />
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
