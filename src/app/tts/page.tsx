"use client";

import { useState } from "react";
import { textToSpeechNarration } from "@/ai/flows/text-to-speech-narration";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Volume2 } from "lucide-react";

export default function TTSPage() {
  const [text, setText] = useState(
    "Hello, welcome to Mishra Studios. Your creative journey starts here."
  );
  const [voice, setVoice] = useState("Algenib");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateSpeech = async () => {
    if (!text) {
      toast({
        title: "Text is empty",
        description: "Please enter some text to generate speech.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setAudioUrl(null);
    try {
      const result = await textToSpeechNarration({ text, voiceName: voice });
      setAudioUrl(result.media);
      toast({
        title: "Speech Generated!",
        description: "Your audio is ready to be played.",
      });
    } catch (error) {
      console.error("Failed to generate speech:", error);
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
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto flex items-center justify-center">
            <Card className="w-full max-w-2xl shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-6 h-6" /> Text-to-Speech Narration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tts-text">Text</Label>
                  <Textarea
                    id="tts-text"
                    placeholder="Enter the text you want to convert to speech..."
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tts-voice">Voice</Label>
                  <Select value={voice} onValueChange={setVoice}>
                    <SelectTrigger id="tts-voice">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Algenib">Algenib (Female)</SelectItem>
                      <SelectItem value="Achernar">Achernar (Male)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleGenerateSpeech}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-5 w-5" />
                  )}
                  {isLoading ? "Generating..." : "Generate Speech"}
                </Button>
                {audioUrl && (
                  <div className="pt-4">
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
