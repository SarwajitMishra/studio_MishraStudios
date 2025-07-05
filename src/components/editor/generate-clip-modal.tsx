
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
} from "@/components/ui/dialog";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
import { imageToVideo } from "@/ai/flows/image-to-video";
import { promptToVideo } from "@/ai/flows/prompt-to-video";
import { audioToVideo } from "@/ai/flows/audio-to-video";
import { useToast } from "@/hooks/use-toast";

interface GenerateClipModalProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setVideoUrl: (url: string | null) => void;
}

export function GenerateClipModal({
  isLoading,
  setIsLoading,
  setVideoUrl,
}: GenerateClipModalProps) {
  const [prompt, setPrompt] = useState(
    "A majestic lion in the savanna at sunrise."
  );
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFileDataUri(e.target?.result as string);
        setFileName(file.name);
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

    setIsLoading(true);
    setVideoUrl(null);

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
      setIsLoading(false);
    }
  };

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
        />
        <input
          type="file"
          accept="image/*,video/*,audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        {fileName ? (
          <div className="text-sm text-muted-foreground flex items-center justify-between">
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
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove file</span>
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Media (Optional)
          </Button>
        )}
      </div>
      <DialogFooter>
        <Button
          className="w-full font-semibold text-base"
          onClick={handleApplyPrompt}
          disabled={isLoading || (!prompt && !fileDataUri)}
          size="lg"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-5 w-5" />
          )}
          <span>{isLoading ? "Generating..." : "Generate"}</span>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
