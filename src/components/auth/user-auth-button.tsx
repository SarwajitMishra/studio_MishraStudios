
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import Link from "next/link";

export function UserAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // In a real app, these would be replaced with actual auth logic (e.g., from Firebase)
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);

  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start items-center gap-3 p-2 h-auto"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src="https://placehold.co/40x40.png"
                alt="User Avatar"
                data-ai-hint="person portrait"
              />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
            <div className="group-data-[state=collapsed]:hidden text-left">
              <p className="text-sm font-medium leading-none">
                User
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                user@example.com
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">User</p>
              <p className="text-xs leading-none text-muted-foreground">
                user@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // To see the logged in state, you can click the "Sign In" button which will
  // just toggle the state for now.
  return (
    <div className="flex flex-col gap-2 group-data-[state=collapsed]:hidden">
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
