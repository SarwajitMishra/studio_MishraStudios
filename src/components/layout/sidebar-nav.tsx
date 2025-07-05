"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import {
  Upload,
  LayoutDashboard,
  Settings,
  Sparkles,
  Library,
  BookText,
  Captions,
  FileText,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { UserAuthButton } from "../auth/user-auth-button";
import { DarkModeToggle } from "../dark-mode-toggle";
import { useToast } from "@/hooks/use-toast";

export function SidebarNav() {
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const samplePrompts = [
    "Create a birthday video.",
    "Add soft background music.",
    "Crop silent parts.",
    "Make a 30s teaser.",
    "Add subtitles.",
  ];
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `${file.name} is ready for processing.`,
      });
      // Here you would typically handle the file upload to a state management or a server
    }
  };


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.Logo className="w-7 h-7 text-primary" />
          <span className="text-lg font-semibold group-data-[state=collapsed]:hidden">
            Mishra Studios
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-4">
        <div className="px-2">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          <Button
            className="w-full justify-start text-base group-data-[state=collapsed]:justify-center group-data-[state=collapsed]:w-auto group-data-[state=collapsed]:p-2"
            size="lg"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-5 w-5 group-data-[state=collapsed]:mr-0" />
            <span className="group-data-[state=collapsed]:hidden">Upload...</span>
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>My Media</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full">
                <SidebarMenuButton tooltip="Editor" isActive={pathname === "/"}>
                  <Library />
                  <span className="group-data-[state=collapsed]:hidden">
                    Editor
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/dashboard" className="w-full">
                <SidebarMenuButton
                  tooltip="Dashboard"
                  isActive={pathname === "/dashboard"}
                >
                  <LayoutDashboard />
                  <span className="group-data-[state=collapsed]:hidden">
                    Dashboard
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Prompts</SidebarGroupLabel>
          <div className="px-2 group-data-[state=collapsed]:hidden">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {samplePrompts.map((prompt, index) => (
                  <CarouselItem key={index}>
                    <Card className="bg-muted/50 border-dashed">
                      <CardContent className="flex h-20 items-center justify-center p-4 text-center">
                        <span className="text-sm font-medium text-muted-foreground">
                          {prompt}
                        </span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Media Tools</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/tts" className="w-full">
                <SidebarMenuButton
                  tooltip="Text-to-Speech"
                  isActive={pathname === "/tts"}
                >
                  <BookText />
                  <span className="group-data-[state=collapsed]:hidden">
                    Text-to-Speech
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/captions" className="w-full">
                <SidebarMenuButton
                  tooltip="Auto-Caption"
                  isActive={pathname === "/captions"}
                >
                  <Captions />
                  <span className="group-data-[state=collapsed]:hidden">
                    Auto-Caption
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/summarizer" className="w-full">
                <SidebarMenuButton
                  tooltip="Clip Summarizer"
                  isActive={pathname === "/summarizer"}
                >
                  <FileText />
                  <span className="group-data-[state=collapsed]:hidden">
                    Clip Summarizer
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Media Generation">
                <Sparkles />
                <span className="group-data-[state=collapsed]:hidden">
                  Media Generation
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2 flex flex-col gap-2">
          <div className="group-data-[state=expanded]:hidden">
            <DarkModeToggle />
          </div>
          <div className="group-data-[state=collapsed]:hidden flex justify-between items-center">
            <span className="text-sm">Dark Mode</span>
            <DarkModeToggle />
          </div>
          <UserAuthButton />
        </div>
      </SidebarFooter>
    </>
  );
}
