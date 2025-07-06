"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";
import { textToVideo } from "@/ai/flows/text-to-video";
import { imageToVideo } from "@/ai/flows/image-to-video";
import { promptToVideo } from "@/ai/flows/prompt-to-video";
import { audioToVideo } from "@/ai/flows/audio-to-video";
import { useToast } from "@/hooks/use-toast";
import type { MediaType } from "@/app/page";

interface GenerateClipModalProps {
  setVideoUrl: (url: string | null) => void;
  setMediaType: (type: MediaType | null) => void;
}

export function GenerateClipModal({
  setVideoUrl,
  setMediaType,
}: GenerateClipModalProps) {
  const [prompt, setPrompt] = useState(
    "A majestic lion in the savanna at sunrise."
  );
  const [file, setFile] = useState<File | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
    }
  };

  const clearUpload = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyPrompt = async () => {
    if (!prompt && !file) {
      toast({
        title: "Nothing to generate",
        description: "Please enter a prompt or upload a file.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setMediaType(null);

    try {
      let result: { videoDataUri?: string; videoClipDataUri?: string } = {};
      let fileType: MediaType | null = null;
      let gcsUri: string | null = null;

      if (file) {
        const mimeType = file.type;
        if (mimeType.startsWith("image/")) fileType = "image";
        else if (mimeType.startsWith("video/")) fileType = "video";
        else if (mimeType.startsWith("audio/")) fileType = "audio";

        // Upload the file to GCS
        setIsReadingFile(true);
        setProgress(0);
        const uploadData = await generateUploadUrl({
          fileName: file.name,
          mimeType: file.type,
        });
        gcsUri = uploadData.gcsUri;
        
        await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("PUT", uploadData.uploadUrl, true);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.upload.onprogress = (e) => {
              if (e.lengthComputable) {
                  setProgress(Math.round((e.loaded / e.total) * 100));
              }
          };
          xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                  resolve(xhr.response);
              } else {
                  console.error(`Upload failed with status: ${xhr.status}`);
                  toast({
                      title: "Upload Failed",
                      description: `The server responded with status ${xhr.status}. Please check your bucket's CORS settings.`,
                      variant: "destructive",
                  });
                  reject(new Error(`Upload failed with status ${xhr.status}`));
              }
          };
          xhr.onerror = (e) => {
              console.error("Network error during upload.", {
                status: xhr.status,
                statusText: xhr.statusText,
              });
              toast({
                  title: "Upload Failed",
                  description: "A network error occurred. Please check your CORS configuration and network connection.",
                  variant: "destructive",
              });
              reject(new Error("Network error during upload."));
          };
          xhr.send(file);
        });

        setIsReadingFile(false);
      }

      switch (fileType) {
        case "image":
          result = await imageToVideo({ prompt, gcsUri: gcsUri!, mimeType: file!.type });
          break;
        case "video":
          result = await promptToVideo({ prompt, gcsUri: gcsUri!, mimeType: file!.type });
          break;
        case "audio":
          result = await audioToVideo({ prompt, gcsUri: gcsUri!, mimeType: file!.type });
          break;
        default:
          if (!file) {
            result = await textToVideo({ prompt });
          } else {
            throw new Error("Unsupported file type provided.");
          }
          break;
      }

      const newVideoUrl = result.videoDataUri || result.videoClipDataUri;

      if (newVideoUrl) {
        setVideoUrl(newVideoUrl);
        setMediaType("image"); // All current AI flows generate images that represent video clips
        toast({
          title: "Clip Generated!",
          description: "Your new clip is ready in the preview window.",
        });
      } else {
        throw new Error("No video data URI returned from the flow.");
      }
    } catch (error) {
      // The toast is already handled in the promise, so we just log here.
      console.error(`Failed to generate video:`, error);
    } finally {
      setIsGenerating(false);
      setIsReadingFile(false);
    }
  };
  
  const isLoading = isReadingFile || isGenerating;

  return (
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>Generate Clip with AI</DialogTitle>
        <DialogDescription>
          Describe what you want to create, or upload a file for the AI to work
          with.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <Textarea
          placeholder="e.g., A cinematic shot of a car driving on a mountain road at sunset."
          className="text-base resize-none"
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {file ? (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span>Attached:</span>
                <span className="font-medium text-foreground truncate">
                  {file.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={clearUpload}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
            {isReadingFile && (
              <div className="space-y-1 pt-2">
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground text-center">Uploading file... {progress}%</p>
              </div>
            )}
          </div>
        ) : (
          <Button variant="outline" onClick={handleUploadClick} disabled={isLoading}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media (Optional)
          </Button>
        )}
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" disabled={isLoading}>Cancel</Button>
        </DialogClose>
        <Button
          className="font-semibold text-base"
          onClick={handleApplyPrompt}
          disabled={isLoading || (!prompt && !file)}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          <span>{isReadingFile ? "Uploading..." : isGenerating ? "Generating..." : "Generate"}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
