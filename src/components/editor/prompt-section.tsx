"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
import { imageToVideo } from "@/ai/flows/image-to-video";
import { promptToVideo } from "@/ai/flows/prompt-to-video";
import { audioToVideo } from "@/ai/flows/audio-to-video";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

interface PromptSectionProps {
  setIsLoading: (isLoading: boolean) => void;
  setVideoUrl: (url: string | null) => void;
  isLoading: boolean;
}

export function PromptSection({
  setIsLoading,
  setVideoUrl,
  isLoading,
}: PromptSectionProps) {
  const [prompt, setPrompt] = useState(
    "A majestic lion in the savanna at sunrise."
  );
  const [fileDataUri, setFileDataUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleApplyPrompt = async () => {
    if (!prompt) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setVideoUrl(null);

    try {
      let result: { videoDataUri?: string; videoClipDataUri?: string } = {};
      let fileType = '';
      if (fileDataUri) {
          const mimeType = fileDataUri.split(':')[1].split(';')[0];
          if (mimeType.startsWith('image/')) {
              fileType = 'image';
          } else if (mimeType.startsWith('video/')) {
              fileType = 'video';
          } else if (mimeType.startsWith('audio/')) {
              fileType = 'audio';
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
    <Card className="p-2 shadow-md">
       <div className="flex items-center gap-2">
         <input 
            type="file" 
            accept="image/*,video/*,audio/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
         />
         <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className="shrink-0">
            <Upload className="h-5 w-5"/>
            <span className="sr-only">Upload media</span>
         </Button>

          <Textarea
            placeholder="e.g., 'Make the lion look like it's on the moon.'"
            className="text-base resize-none flex-1"
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleApplyPrompt();
              }
            }}
          />
          <Button
            className="font-semibold text-base"
            onClick={handleApplyPrompt}
            disabled={isLoading || (!prompt && !fileDataUri)}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            <span className="hidden sm:inline-flex">{isLoading ? "Applying..." : "Apply Prompt"}</span>
            <span className="sm:hidden">Apply</span>
          </Button>
        </div>
        {fileName && (
            <div className="mt-2 pl-1 text-sm text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                    <span>Attached:</span>
                    <span className="font-medium text-foreground truncate">{fileName}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={clearUpload}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove file</span>
                </Button>
            </div>
        )}
        {!fileName && (
            <p className="text-sm text-muted-foreground text-center mt-2">
                Type a prompt and/or upload a file (image, video, audio) to get started.
            </p>
        )}
    </Card>
  );
}
