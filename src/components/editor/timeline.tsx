"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { SuggestedClip } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TimelineProps {
  clips: SuggestedClip[];
  videoUrl: string;
  onClipSelect: (clip: SuggestedClip) => void;
  activeClip: SuggestedClip | null;
}

export function Timeline({
  clips,
  videoUrl,
  onClipSelect,
  activeClip,
}: TimelineProps) {
  if (!clips.length) {
    return null;
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2 px-1">Suggested Clips</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {clips.map((clip, index) => (
            <Card
              key={index}
              className={cn(
                "w-64 cursor-pointer hover:border-primary transition-all",
                activeClip === clip && "border-2 border-primary ring-2 ring-primary/50"
              )}
              onClick={() => onClipSelect(clip)}
            >
              <CardContent className="p-0">
                <video
                  src={`${videoUrl}#t=${clip.startTime},${clip.endTime}`}
                  className="aspect-video w-full rounded-t-lg bg-muted object-cover"
                  muted
                  onMouseOver={e => (e.target as HTMLVideoElement).play()}
                  onMouseOut={e => (e.target as HTMLVideoElement).pause()}
                  preload="metadata"
                />
              </CardContent>
              <CardHeader className="p-3">
                <CardTitle className="text-sm truncate">
                  {clip.description}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
