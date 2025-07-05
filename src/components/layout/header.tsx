"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Link as LinkIcon,
  Plus,
  Share2,
  Twitter,
  Youtube,
  Lock,
} from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="lg:hidden" />
        <Icons.Logo className="hidden h-6 w-6 lg:block" />
        <h1 className="hidden text-lg font-semibold lg:block">
          Mishra Studios
        </h1>
      </div>

      <div className="flex flex-1 justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-base">
              My First Project
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-64">
            <DropdownMenuItem>Project 1</DropdownMenuItem>
            <DropdownMenuItem>Project 2</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create new project</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-end gap-2 sm:gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Export Video</DialogTitle>
              <DialogDescription>
                Choose your settings and share your creation.
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="settings" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="share">Share</TabsTrigger>
              </TabsList>
              <TabsContent value="settings">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="resolution" className="text-right">
                      Resolution
                    </Label>
                    <Select defaultValue="1080p">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select resolution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p (HD)</SelectItem>
                        <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                        <SelectItem value="4k" disabled>
                          <div className="flex items-center gap-2">
                            <Lock className="h-3 w-3" />
                            <span>4K (Ultra HD) - Premium</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="format" className="text-right">
                      Format
                    </Label>
                    <Select defaultValue="mp4">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mp4">MP4</SelectItem>
                        <SelectItem value="mov">MOV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="watermark" className="text-right">
                      Watermark
                    </Label>
                    <div className="col-span-3">
                      <Switch id="watermark" defaultChecked />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">
                    Start Export
                  </Button>
                </DialogFooter>
              </TabsContent>
              <TabsContent value="share">
                <div className="flex flex-col gap-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Share directly to your favorite platforms.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline">
                      <Youtube className="mr-2 h-4 w-4 text-red-600" /> YouTube
                      Shorts
                    </Button>
                    <Button variant="outline">
                      <Instagram className="mr-2 h-4 w-4 text-pink-500" />{" "}
                      Instagram Reels
                    </Button>
                    <Button variant="outline">
                      <Facebook className="mr-2 h-4 w-4 text-blue-600" />{" "}
                      Facebook
                    </Button>
                    <Button variant="outline">
                      <Twitter className="mr-2 h-4 w-4 text-sky-500" /> X /
                      Twitter
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2">
                    <Input
                      defaultValue="https://mishra.studio/share/a1b2c3d4"
                      readOnly
                    />
                    <Button size="icon" variant="outline">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
