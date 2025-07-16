"use client";

import { useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import type { MediaType } from "@/lib/types";

export function EditorLayout() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-4 lg:gap-6 h-full min-h-0">
      <div className="flex-1 min-h-0">
        <VideoPreview
          videoUrl={videoUrl}
          mediaType={mediaType}
          isLoading={isLoading}
          progress={progress}
          loadingMessage={loadingMessage}
          onUploadClick={handleUploadClick}
          clip={null}
          onClipEnd={() => {}}
          onDurationChange={() => {}}
        />
      </div>
      {/* Hidden file input is needed for the upload button in VideoPreview to function */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={() => {
          /* This would be handled by a new upload flow */
        }}
        className="hidden"
      />
    </div>
  );
}
