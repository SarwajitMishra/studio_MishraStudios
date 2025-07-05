"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2, Sparkles } from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
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
  const { toast } = useToast();

  const handleApplyPrompt = async () => {
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
      const result = await textToVideo({ prompt });
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
        <Button variant="ghost" size="icon">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Prompt Suggestions</span>
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
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          {isLoading ? "Applying..." : "Apply Prompt"}
        </Button>
      </div>
    </Card>
  );
}
