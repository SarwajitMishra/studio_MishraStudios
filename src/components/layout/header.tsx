"use client"

import { UserAuthButton } from "@/components/auth/user-auth-button";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Share2, Upload } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Icons.Logo className="h-6 w-6" />
        <h1 className="text-lg font-semibold">Mishra Studios</h1>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-2 hidden md:block" />

      <div className="hidden md:flex">
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    My First Project
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem>Project 1</DropdownMenuItem>
                <DropdownMenuItem>Project 2</DropdownMenuItem>
                <DropdownMenuItem>Create new project</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="hidden sm:inline-flex">
              <Share2 className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button size="icon" className="sm:hidden">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Export</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Video</DialogTitle>
              <DialogDescription>
                Choose your desired export settings.
              </DialogDescription>
            </DialogHeader>
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
                    <SelectItem value="4k">4K (Ultra HD) - Premium</SelectItem>
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
            </div>
            <DialogFooter>
              <Button type="submit">Start Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DarkModeToggle />
        <UserAuthButton />
      </div>
    </header>
  );
}
