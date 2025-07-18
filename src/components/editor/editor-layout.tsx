
"use client";

import { useRef, useState } from "react";
import { VideoPreview } from "./video-preview";
import type { MediaType, SuggestedClip } from "@/lib/types";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";
import { videoScanAnalysis } from "@/ai/flows/video-scan-analysis";
import { useToast } from "@/hooks/use-toast";
import { Timeline } from "./timeline";

export function EditorLayout() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const [suggestedClips, setSuggestedClips] = useState<SuggestedClip[]>([]);
  const [activeClip, setActiveClip] = useState<SuggestedClip | null>(null);
  const [fullVideoDuration, setFullVideoDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }

    setVideoUrl(null);
    setMediaType(null);
    setSuggestedClips([]);
    setActiveClip(null);
    setIsLoading(true);
    setProgress(0);
    setLoadingMessage("Uploading video...");

    try {
      const { uploadUrl, gcsUri } = await generateUploadUrl({
        fileName: file.name,
        mimeType: file.type,
      });

      const publicUrl = `https://storage.googleapis.com/${gcsUri.replace(/^gs:\/\//, '')}`;

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          toast({
            title: "Upload Complete",
            description: "Analyzing video for key moments...",
          });
          setVideoUrl(publicUrl);
          setMediaType('video');
          setProgress(0);
          setLoadingMessage("Analyzing video...");

          try {
            console.log(`[EditorLayout] Calling videoScanAnalysis with gcsUri: ${gcsUri}, mimeType: ${file.type}`);
            const { suggestedClips } = await videoScanAnalysis({
              gcsUri,
              mimeType: file.type,
            });
            setSuggestedClips(suggestedClips);
            if (suggestedClips.length > 0) {
                setActiveClip(suggestedClips[0]);
            }
            toast({
              title: "Analysis Complete",
              description: "Suggested clips are ready below.",
            });
          } catch (analysisError) {
             console.error("[EditorLayout] Video analysis failed:", analysisError);
             toast({
              title: "Analysis Failed",
              description: analysisError instanceof Error ? analysisError.message : "Could not analyze video.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        } else {
          console.error(`Upload failed with status: ${xhr.status}`);
          toast({
            title: "Upload Failed",
            description: `The server responded with status ${xhr.status}. Check CORS settings.`,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      };

      xhr.onerror = () => {
        setIsLoading(false);
        setProgress(0);
        console.error("Network error during file upload.");
        toast({
          title: "Upload Failed",
          description: "A network error occurred. Check CORS configuration.",
          variant: "destructive",
        });
      };

      xhr.send(file);
    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      setVideoUrl(null);
      console.error("File upload failed:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload file.",
        variant: "destructive",
      });
    }
  };

  const handleClipSelect = (clip: SuggestedClip) => {
    setActiveClip(clip);
  }

  const handleClipEnd = () => {
    // This could be used for auto-playing the next clip in the future.
    console.log("Clip ended:", activeClip?.description);
  }
  
  const handleDurationChange = (duration: number) => {
    if (!isNaN(duration) && duration > 0) {
      setFullVideoDuration(duration);
    }
  }

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
          clip={activeClip}
          onClipEnd={handleClipEnd}
          onDurationChange={handleDurationChange}
        />
      </div>
      
      {videoUrl && suggestedClips.length > 0 && (
         <Timeline 
            clips={suggestedClips}
            videoUrl={videoUrl}
            onClipSelect={handleClipSelect}
            activeClip={activeClip}
          />
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="video/*"
      />
    </div>
  );
}
