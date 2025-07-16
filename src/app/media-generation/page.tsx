
"use client";

import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ImageIcon,
  Mic,
  Sparkles,
  Type,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

const tools = [
  {
    title: "Text to Video",
    description: "Generate a video from a text prompt.",
    icon: <Type className="h-8 w-8 text-primary" />,
    href: "/editor", // Placeholder, ideally a specific page like /text-to-video
  },
  {
    title: "Image to Video",
    description: "Animate an image with a prompt.",
    icon: <ImageIcon className="h-8 w-8 text-primary" />,
    href: "/editor",
  },
  {
    title: "Audio to Video",
    description: "Create visuals for an audio file.",
    icon: <Mic className="h-8 w-8 text-primary" />,
    href: "/editor",
  },
  {
    title: "Edit Image Background",
    description: "Replace the background of any image.",
    icon: <Video className="h-8 w-8 text-primary" />,
    href: "/edit-background",
  },
];

export default function MediaGenerationPage() {
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col h-screen bg-background">
          <Header />
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 text-center">
                <Sparkles className="mx-auto h-12 w-12 text-primary" />
                <h1 className="text-4xl font-bold mt-4">
                  AI Media Generation
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Choose a tool to start creating with the power of AI.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {tools.map((tool) => (
                  <Card
                    key={tool.title}
                    className="cursor-pointer hover:shadow-primary/20 hover:shadow-lg transition-shadow duration-300"
                    onClick={() => router.push(tool.href)}
                  >
                    <CardHeader className="flex flex-row items-center gap-4">
                      {tool.icon}
                      <div className="flex-1">
                        <CardTitle>{tool.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {tool.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
