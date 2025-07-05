"use client"

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
import { Wand2 } from "lucide-react";

const samplePrompts = [
  "Create a birthday video.",
  "Add soft background music and crop silent parts.",
  "Make a 30-second teaser from this video.",
  "Generate a highlight reel of the best moments.",
  "Apply a vintage film effect to the whole clip.",
];

export function PromptSection() {
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
            placeholder="e.g., 'Make a 30-second teaser with motivational music.'"
            className="h-full text-base resize-none"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-muted-foreground">
            Or try a sample prompt
          </h3>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {samplePrompts.map((prompt, index) => (
                <CarouselItem key={index} className="basis-auto">
                  <Button variant="outline" size="sm" className="h-auto py-1.5 whitespace-normal text-left">
                    {prompt}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="h-6 w-6 -left-2" />
            <CarouselNext className="h-6 w-6 -right-2" />
          </Carousel>
        </div>
        <Button size="lg" className="w-full font-semibold text-base shadow-lg hover:shadow-xl transition-shadow">
          <Wand2 className="mr-2 h-5 w-5" />
          Generate Clip
        </Button>
      </CardContent>
    </Card>
  );
}
