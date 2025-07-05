"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Sparkles, Upload, FileImage, FileVideo, FileAudio } from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
import { imageToVideo } from "@/ai/flows/image-to-video";
import { promptToVideo } from "@/ai/flows/prompt-to-video";
import { audioToVideo } from "@/ai/flows/audio-to-video";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
  const [activeTab, setActiveTab] = useState("text");
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
  
  const onTabChange = (value: string) => {
    setActiveTab(value);
    setFileDataUri(null);
    setFileName(null);
  };

  const handleApplyPrompt = async () => {
    if (!prompt) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a prompt.",
        variant: "destructive",
      });
      return;
    }
    if (activeTab !== "text" && !fileDataUri) {
       toast({
        title: "File not selected",
        description: `Please select an ${activeTab} file to proceed.`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setVideoUrl(null);

    try {
      let result: { videoDataUri?: string; videoClipDataUri?: string } = {};

      switch (activeTab) {
        case "text":
          result = await textToVideo({ prompt });
          break;
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
          throw new Error("Invalid tab selected");
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
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <div className="flex items-center gap-2">
           <TabsList className="grid grid-cols-4 w-auto h-auto p-1">
            <TabsTrigger value="text" className="px-3 py-1.5"><Wand2 className="h-4 w-4 mr-2 hidden sm:inline-flex"/>Text</TabsTrigger>
            <TabsTrigger value="image" className="px-3 py-1.5"><FileImage className="h-4 w-4 mr-2 hidden sm:inline-flex"/>Image</TabsTrigger>
            <TabsTrigger value="video" className="px-3 py-1.5"><FileVideo className="h-4 w-4 mr-2 hidden sm:inline-flex"/>Video</TabsTrigger>
            <TabsTrigger value="audio" className="px-3 py-1.5"><FileAudio className="h-4 w-4 mr-2 hidden sm:inline-flex"/>Audio</TabsTrigger>
          </TabsList>

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
            disabled={isLoading}
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
        <TabsContent value="text" className="mt-2 text-sm text-muted-foreground text-center">
         Provide a text prompt to generate a new video clip.
        </TabsContent>
        <TabsContent value="image" className="mt-2 space-y-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {fileName || "Upload an Image"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">Provide an image and a prompt to generate a video inspired by it.</p>
        </TabsContent>
        <TabsContent value="video" className="mt-2 space-y-2">
            <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {fileName || "Upload a Video"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">Provide a video and a prompt to edit it with AI.</p>
        </TabsContent>
        <TabsContent value="audio" className="mt-2 space-y-2">
            <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {fileName || "Upload an Audio File"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">Provide an audio file and a prompt to create a matching video.</p>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
