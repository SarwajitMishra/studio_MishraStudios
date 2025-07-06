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

const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function GenerateClipModal({
  setVideoUrl,
  setMediaType,
}: GenerateClipModalProps) {
  const [prompt, setPrompt] = useState(
    "A majestic lion in the savanna at sunrise."
  );
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "File Too Large",
          description: `Please upload a file smaller than ${MAX_FILE_SIZE_MB}MB.`,
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadstart = () => {
        setIsReadingFile(true);
        setProgress(0);
      };
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
      reader.onload = (e) => {
        setFileDataUri(e.target?.result as string);
        setFileName(file.name);
        setIsReadingFile(false);
      };
      reader.onerror = () => {
        setIsReadingFile(false);
        setProgress(0);
        toast({
          title: "File Read Error",
          description: "There was an issue reading your file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearUpload = () => {
    setFileDataUri(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleApplyPrompt = async () => {
    if (!prompt && !fileDataUri) {
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
      let fileType = "";
      if (fileDataUri) {
        const mimeType = fileDataUri.split(":")[1].split(";")[0];
        if (mimeType.startsWith("image/")) {
          fileType = "image";
        } else if (mimeType.startsWith("video/")) {
          fileType = "video";
        } else if (mimeType.startsWith("audio/")) {
          fileType = "audio";
        }
      }

      switch (fileType) {
        case "image":
          result = await imageToVideo({ prompt, imageDataUri: fileDataUri! });
          break;
        case "video":
          result = await promptToVideo({ prompt, videoDataUri: fileDataUri! });
          break;
        case "audio":
          result = await audioToVideo({ prompt, audioDataUri: fileDataUri! });
          break;
        default:
          if (!fileDataUri) {
            result = await textToVideo({ prompt });
          } else {
            throw new Error("Unsupported file type provided.");
          }
          break;
      }

      const newVideoUrl = result.videoDataUri || result.videoClipDataUri;

      if (newVideoUrl) {
        setVideoUrl(newVideoUrl);
        // All current AI flows generate images that represent video clips
        setMediaType("image");
        toast({
          title: "Clip Generated!",
          description: "Your new clip is ready in the preview window.",
        });
      } else {
        throw new Error("No video data URI returned from the flow.");
      }
    } catch (error) {
      console.error(`Failed to generate video:`, error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
        {fileName ? (
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span>Attached:</span>
                <span className="font-medium text-foreground truncate">
                  {fileName}
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
                <p className="text-xs text-muted-foreground text-center">Reading file... {progress}%</p>
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
          disabled={isLoading || (!prompt && !fileDataUri)}
        >
          {isGenerating ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          <span>{isGenerating ? "Generating..." : "Generate"}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
