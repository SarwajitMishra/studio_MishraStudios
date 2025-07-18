
"use client";

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
  LayoutDashboard,
  Settings,
  Sparkles,
  Library,
  BookText,
  FileText,
  Image as ImageIcon,
  PenSquare,
  Home,
} from "lucide-react";
import { UserAuthButton } from "../auth/user-auth-button";
import { DarkModeToggle } from "../dark-mode-toggle";

export function SidebarNav() {
  const pathname = usePathname();

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
        <SidebarGroup>
          <SidebarGroupLabel>My Media</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/editor" className="w-full">
                <SidebarMenuButton tooltip="Editor" isActive={pathname === "/editor"}>
                  <PenSquare />
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
          <SidebarGroupLabel>Media Tools</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/media-generation" className="w-full">
                <SidebarMenuButton
                  tooltip="Media Generation"
                  isActive={pathname.startsWith("/media-generation") || pathname.startsWith("/text-to-video") || pathname.startsWith("/image-to-video") || pathname.startsWith("/audio-to-video")}
                >
                  <Sparkles />
                  <span className="group-data-[state=collapsed]:hidden">
                    Media Generation
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/edit-background" className="w-full">
                <SidebarMenuButton
                  tooltip="Edit Background"
                  isActive={pathname === "/edit-background"}
                >
                  <ImageIcon />
                  <span className="group-data-[state=collapsed]:hidden">
                    Edit Background
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
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-2 flex flex-col gap-2">
           <SidebarMenu>
             <SidebarMenuItem>
                <Link href="/" className="w-full">
                  <SidebarMenuButton tooltip="Landing Page">
                    <Home />
                    <span className="group-data-[state=collapsed]:hidden">
                      Landing Page
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
           </SidebarMenu>
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
