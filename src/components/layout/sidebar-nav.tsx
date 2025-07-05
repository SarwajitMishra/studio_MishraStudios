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
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";

export function SidebarNav() {
  const samplePrompts = [
    "Create a birthday video.",
    "Add soft background music.",
    "Crop silent parts.",
    "Make a 30s teaser.",
    "Add subtitles.",
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Icons.Logo className="w-7 h-7 text-primary" />
          <span className="text-lg font-semibold">Mishra Studios</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-4">
        <div className="px-2">
          <Button
            className="w-full justify-start text-base"
            size="lg"
            variant="outline"
          >
            <Upload className="mr-2 h-5 w-5" />
            <span>Upload...</span>
          </Button>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>My Media</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Media Library" isActive>
                <Library />
                <span>Media Library</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Prompts</SidebarGroupLabel>
          <div className="px-2">
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
              <SidebarMenuButton tooltip="Text-to-Speech">
                <BookText />
                <span>Text-to-Speech</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Media Generation">
                <Sparkles />
                <span>Media Generation</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
