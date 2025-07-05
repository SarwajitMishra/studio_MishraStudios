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
  Clapperboard,
  LayoutDashboard,
  Settings,
  Sparkles,
  Library,
} from "lucide-react";
import { Button } from "../ui/button";
  
  export function SidebarNav() {
    return (
      <>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.Logo className="w-7 h-7 text-primary" />
            <span className="text-lg font-semibold">Mishra Studios</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button className="w-full justify-start text-base" size="lg">
                <Upload className="mr-2 h-5 w-5" />
                Upload Video
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
  
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Dashboard" isActive>
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Media Library">
                  <Library />
                  <span>Media Library</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
  
          <SidebarGroup>
            <SidebarGroupLabel>AI Tools</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="AI Clip Generator">
                  <Clapperboard />
                  <span>AI Clip Generator</span>
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
  