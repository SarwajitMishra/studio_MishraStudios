"use client";

import { useState } from "react";
import { PromptSection } from "./prompt-section";
import { VideoPreview } from "./video-preview";

export function EditorLayout() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col gap-4 lg:gap-6 h-full min-h-0">
      <div className="flex-1 min-h-0">
        <VideoPreview videoUrl={videoUrl} isLoading={isLoading} />
      </div>
      <PromptSection
        setVideoUrl={setVideoUrl}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
      />
    </div>
  );
}
