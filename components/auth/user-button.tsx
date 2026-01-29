"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { LogOut, User } from "lucide-react";

export function UserButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        data-testid="user-button-loading"
      >
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!session) {
    return (
      <Button asChild data-testid="user-button-sign-in">
        <Link href="/sign-in">Sign In</Link>
      </Button>
    );
  }

  const initials =
    session.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full"
          data-testid="user-button-trigger"
        >
          <Avatar className="h-10 w-10" data-testid="user-button-avatar">
            <AvatarImage
              src={session.user?.image || ""}
              alt={session.user?.name || "User"}
              data-testid="user-button-avatar-image"
            />
            <AvatarFallback data-testid="user-button-avatar-fallback">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p
              className="text-sm font-medium leading-none"
              data-testid="user-button-name"
            >
              {session.user?.name}
            </p>
            <p
              className="text-xs leading-none text-muted-foreground"
              data-testid="user-button-email"
            >
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
          data-testid="user-button-sign-out"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
