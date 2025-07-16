
"use client";

import { useAuth } from "@/hooks/use-auth";
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
import { LogOut, User, Settings, UserPlus, LogIn } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export function UserAuthButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="group-data-[state=collapsed]:hidden flex flex-col gap-1 w-32">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-2 group-data-[state=collapsed]:hidden">
        <Link href="/login" passHref>
          <Button className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link href="/signup" passHref>
          <Button variant="outline" className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start items-center gap-3 p-2 h-auto"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.photoURL ?? ''}
              alt={user.displayName ?? "User Avatar"}
              data-ai-hint="person portrait"
            />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
          <div className="group-data-[state=collapsed]:hidden text-left truncate">
            <p className="text-sm font-medium leading-none truncate">
              {user.displayName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email || "No email provided"}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
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
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
