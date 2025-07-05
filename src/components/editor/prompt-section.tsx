"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Wand2 } from "lucide-react";
import { textToVideo } from "@/ai/flows/text-to-video";
import { useToast } from "@/hooks/use-toast";

const samplePrompts = [
  "A majestic lion in the savanna at sunrise.",
  "A neon-lit cyberpunk city street at night.",
  "A tranquil beach with turquoise water and white sand.",
  "An enchanted forest with glowing mushrooms.",
  "A robot orchestra playing classical music.",
];

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
  const [prompt, setPrompt] = useState("");
  const { toast } = useToast();

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
      const result = await textToVideo({ prompt });
      if (result.videoDataUri) {
        setVideoUrl(result.videoDataUri);
        toast({
          title: "Clip Generated!",
          description: "Your new clip is ready in the preview window.",
        });
      }
    } catch (error) {
      console.error("Failed to generate video:", error);
      toast({
        title: "Generation Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wand2 className="w-5 h-5 text-primary" />
          <span>AI Prompt</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex-1">
          <Textarea
            placeholder="e.g., 'A golden retriever puppy playing in a field of flowers.'"
            className="h-full text-base resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            Or try a sample prompt
          </h3>
          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full"
          >
            <CarouselContent>
              {samplePrompts.map((p, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-auto py-1.5 whitespace-normal text-left"
                    onClick={() => setPrompt(p)}
                  >
                    {p}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-6 w-6 -left-2" />
            <CarouselNext className="h-6 w-6 -right-2" />
          </Carousel>
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
