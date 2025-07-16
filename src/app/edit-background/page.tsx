"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { editImageBackground } from "@/ai/flows/edit-image-background";
import { generateUploadUrl } from "@/ai/flows/generate-upload-url";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Zap, Image as ImageIcon, Upload, FileImage, Sparkles } from "lucide-react";

export default function EditBackgroundPage() {
  const [gcsUri, setGcsUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("A beautiful beach at sunset");
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setGcsUri(null);
    setEditedImageUrl(null);
    setMimeType(file.type);
    setIsLoading(true);
    setProgress(0);

    const objectUrl = URL.createObjectURL(file);
    setOriginalImageUrl(objectUrl);

    try {
      const { uploadUrl, gcsUri } = await generateUploadUrl({
        fileName: file.name,
        mimeType: file.type,
      });

      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setGcsUri(gcsUri);
          toast({
            title: "Upload Complete",
            description: `${file.name} is ready.`,
          });
        } else {
          console.error(`Upload failed with status: ${xhr.status}`);
          toast({
            title: "Upload Failed",
            description: `The server responded with status ${xhr.status}. Check CORS settings.`,
            variant: "destructive",
          });
        }
        setIsLoading(false);
      };

      xhr.onerror = () => {
        setIsLoading(false);
        setProgress(0);
        console.error("Network error during file upload.");
        toast({
          title: "Upload Failed",
          description: "A network error occurred. Check CORS configuration.",
          variant: "destructive",
        });
      };

      xhr.send(file);
    } catch (error) {
      setIsLoading(false);
      setProgress(0);
      setOriginalImageUrl(null);
      console.error("File upload failed:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Could not upload file.",
        variant: "destructive",
      });
    }
  };

  const handleGenerate = async () => {
    if (!gcsUri || !mimeType) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }
    if (!prompt) {
      toast({
        title: "Prompt is empty",
        description: "Please describe the background you want.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setEditedImageUrl(null);
    try {
      const result = await editImageBackground({ gcsUri, mimeType, prompt });
      setEditedImageUrl(result.imageDataUri);
      toast({
        title: "Background Edited!",
        description: "Your new image is ready.",
      });
    } catch (error) {
      console.error("Failed to edit background:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-6 h-6" /> Edit Image Background
                  </CardTitle>
                  <CardDescription>Upload an image and describe the background you want to generate.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">1. Upload Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isLoading || isGenerating}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {originalImageUrl ? "Change Image" : "Select Image"}
                    </Button>
                    {isLoading && (
                       <div className="space-y-2 pt-2">
                        <Progress value={progress} className="w-full" />
                        <p className="text-xs text-muted-foreground text-center">Uploading... {progress}%</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prompt-input">2. Describe New Background</Label>
                    <Input 
                      id="prompt-input"
                      placeholder="e.g., A futuristic city skyline at night"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading || isGenerating}
                    />
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isLoading || isGenerating || !gcsUri}
                  >
                    {isGenerating ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-5 w-5" />
                    )}
                    {isGenerating ? "Generating..." : "Generate Background"}
                  </Button>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Original</Label>
                  <Card className="aspect-square flex items-center justify-center bg-muted overflow-hidden">
                    {originalImageUrl ? (
                      <Image src={originalImageUrl} alt="Original" width={500} height={500} className="object-cover w-full h-full" />
                    ) : (
                      <div className="text-center text-muted-foreground p-4">
                        <FileImage className="mx-auto h-12 w-12" />
                        <p>Upload an image to start</p>
                      </div>
                    )}
                  </Card>
                </div>
                 <div className="space-y-2">
                  <Label>Edited</Label>
                  <Card className="aspect-square flex items-center justify-center bg-muted overflow-hidden">
                    {isGenerating ? (
                      <div className="text-center text-muted-foreground p-4">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                        <p>Generating new background...</p>
                      </div>
                    ) : editedImageUrl ? (
                      <Image src={editedImageUrl} alt="Edited" width={500} height={500} className="object-cover w-full h-full" />
                    ) : (
                       <div className="text-center text-muted-foreground p-4">
                        <Sparkles className="mx-auto h-12 w-12" />
                        <p>Your generated image will appear here</p>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
