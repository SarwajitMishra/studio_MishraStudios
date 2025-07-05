"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Wand2,
  File as FileIcon,
  Image as LucideImage,
  FileVideo,
  Music,
  X as XIcon,
} from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { imageToVideo } from "@/ai/flows/image-to-video";
import { promptToVideo } from "@/ai/flows/prompt-to-video";
import { audioToVideo } from "@/ai/flows/audio-to-video";

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
  const [activeTab, setActiveTab] = useState("text");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const { toast } = useToast();

  const toDataUri = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const clearFile = (type: "image" | "video" | "audio") => {
    const fileInput = document.getElementById(
      `${type}-file-input`
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
    if (type === "image") setImageFile(null);
    if (type === "video") setVideoFile(null);
    if (type === "audio") setAudioFile(null);
  };

  const handleGenerateClick = async () => {
    if (!prompt) {
      toast({
        title: "Prompt is empty",
        description: "Please enter a prompt to generate a video.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setVideoUrl(null);

    try {
      let result;
      switch (activeTab) {
        case "image":
          if (!imageFile) {
            toast({
              title: "No image selected",
              description: "Please upload an image file.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          const imageDataUri = await toDataUri(imageFile);
          result = await imageToVideo({ prompt, imageDataUri });
          break;
        case "video":
          if (!videoFile) {
            toast({
              title: "No video selected",
              description: "Please upload a video file.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          const videoDataUri = await toDataUri(videoFile);
          result = await promptToVideo({ prompt, videoDataUri });
          break;
        case "audio":
          if (!audioFile) {
            toast({
              title: "No audio selected",
              description: "Please upload an audio file.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }
          const audioDataUri = await toDataUri(audioFile);
          result = await audioToVideo({ prompt, audioDataUri });
          break;
        case "text":
        default:
          result = await textToVideo({ prompt });
          break;
      }

      if (result.videoDataUri) {
        setVideoUrl(result.videoDataUri);
        toast({
          title: "Clip Generated!",
          description: "Your new clip is ready in the preview window.",
        });
      } else {
        throw new Error("No video data URI returned from the flow.");
      }
    } catch (error) {
      console.error(`Failed to generate video for tab ${activeTab}:`, error);
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

  const renderFileUploader = (
    type: "image" | "video" | "audio",
    file: File | null,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
    accept: string
  ) => (
    <div className="p-4 border-2 border-dashed rounded-lg text-center h-full flex flex-col justify-center items-center bg-muted/20">
      {file ? (
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted w-full">
          <FileIcon className="h-5 w-5 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium truncate flex-1 text-left">
            {file.name}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => clearFile(type)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full">
          <p className="mb-2 text-sm text-muted-foreground">
            Upload a file to provide context
          </p>
          <Input
            id={`${type}-file-input`}
            type="file"
            accept={accept}
            className="text-sm max-w-full file:mr-2 file:truncate"
            onChange={(e) => handleFileChange(e, setter)}
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wand2 className="w-5 h-5 text-primary" />
          <span>AI Generator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="e.g., 'Make the lion look like it's on the moon.'"
          className="text-base resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex-1">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="text" className="gap-1">
                <Wand2 className="h-4 w-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="image" className="gap-1">
                <LucideImage className="h-4 w-4" />
                Image
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-1">
                <FileVideo className="h-4 w-4" />
                Video
              </TabsTrigger>
              <TabsTrigger value="audio" className="gap-1">
                <Music className="h-4 w-4" />
                Audio
              </TabsTrigger>
            </TabsList>
            <div className="flex-1 mt-2">
              <TabsContent value="text" className="h-full mt-0">
                <div className="p-4 border-2 border-dashed rounded-lg text-center h-full flex flex-col justify-center items-center bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    Use a text prompt to generate a clip.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Or, select another tab to add a file as context.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="image" className="h-full mt-0">
                {renderFileUploader(
                  "image",
                  imageFile,
                  setImageFile,
                  "image/*"
                )}
              </TabsContent>
              <TabsContent value="video" className="h-full mt-0">
                {renderFileUploader(
                  "video",
                  videoFile,
                  setVideoFile,
                  "video/*"
                )}
              </TabsContent>
              <TabsContent value="audio" className="h-full mt-0">
                {renderFileUploader(
                  "audio",
                  audioFile,
                  setAudioFile,
                  "audio/*"
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        <Button
          size="lg"
          className="w-full font-semibold text-base shadow-lg hover:shadow-xl transition-shadow"
          onClick={handleGenerateClick}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Generating..." : "Generate Clip"}
        </Button>
      </CardContent>
    </Card>
  );
}
