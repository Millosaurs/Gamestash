"use client";
import { FileArchive } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// Import your better-auth session hook
import { useSession } from "@/lib/auth-client";

// Import your dropdown and avatar components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Button
      variant="ghost"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="px-3 py-2 h-10 rounded"
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? "🌙" : "☀️"}
    </Button>
  );
}

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <FileArchive className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground font-display">
            SkriptStore
          </h1>
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <a
            href="/explore"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Explore
          </a>
          <a
            href="/developers"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            Developers
          </a>
          <a
            href="/about"
            className="text-foreground hover:text-primary transition-colors font-medium"
          >
            About Us
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                    />
                    <AvatarFallback>
                      {session.user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/accounts")}
                >
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/auth")}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              className="flex items-center gap-2 h-10 border rounded px-4"
              onClick={() => (window.location.href = "/auth")}
            >
              <span className="hidden sm:inline">Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
