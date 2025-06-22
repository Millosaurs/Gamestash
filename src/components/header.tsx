"use client";
import {
  FileArchive,
  Menu,
  X,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

// Types
interface UserSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface SessionData {
  data: UserSession | null;
}

// Import your better-auth session hook
import { useSession } from "@/lib/auth-client";

// Import your dropdown and avatar components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

function ThemeToggle({ isMobile = false }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size={isMobile ? "sm" : "default"}
        className={`${
          isMobile ? "px-2 py-1.5 h-8" : "px-3 py-2 h-10"
        } rounded-lg transition-all duration-200`}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size={isMobile ? "sm" : "default"}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`${
        isMobile ? "px-2 py-1.5 h-8" : "px-3 py-2 h-10"
      } rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      {isMobile && (
        <span className="ml-2 text-sm">
          {resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </Button>
  );
}

function MobileMenu({ session }: { session: UserSession | null }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        !(event.target as Element)?.closest(".mobile-menu-container")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="md:hidden mobile-menu-container">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMenu}
        className="p-2 h-10 w-10 rounded-lg transition-all duration-200 hover:bg-accent"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 md:hidden"
            onClick={closeMenu}
          />
          <div className="absolute top-full right-0 mt-2 w-64 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-4 space-y-3">
              {/* Navigation Links */}
              <div className="space-y-2">
                <Link
                  href="/explore"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  <Home className="h-4 w-4" />
                  Explore
                </Link>
                <Link
                  href="/developers"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  <User className="h-4 w-4" />
                  Developers
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                  onClick={closeMenu}
                >
                  <Settings className="h-4 w-4" />
                  About Us
                </Link>
              </div>

              <div className="border-t border-border pt-3">
                <ThemeToggle isMobile={true} />
              </div>

              {/* User Section */}
              {session?.user ? (
                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {session.user.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/accounts"
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    onClick={closeMenu}
                  >
                    <Settings className="h-4 w-4" />
                    Account
                  </Link>
                  <button
                    onClick={() => {
                      window.location.href = "/auth";
                      closeMenu();
                    }}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="border-t border-border pt-3">
                  <Button
                    onClick={() => {
                      window.location.href = "/auth";
                      closeMenu();
                    }}
                    className="w-full justify-start gap-3 h-10"
                  >
                    <User className="h-4 w-4" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const { data: session }: SessionData = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg">
              <FileArchive className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground font-display hidden sm:block">
              SkriptStore
            </h1>
            <h1 className="text-lg font-bold text-foreground font-display sm:hidden">
              SS
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/explore"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200"
            >
              Explore
            </Link>
            <Link
              href="/developers"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200"
            >
              Developers
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-all duration-200"
            >
              About Us
            </Link>
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent hover:ring-accent transition-all duration-200"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={session.user.image || "/placeholder.svg"}
                        alt={session.user.name || "User"}
                      />
                      <AvatarFallback>
                        {session.user.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56"
                  align="end"
                  sideOffset={8}
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/dashboard")}
                    className="cursor-pointer"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/accounts")}
                    className="cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => (window.location.href = "/auth")}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => (window.location.href = "/auth")}
                className="h-10 px-4 rounded-lg transition-all duration-200 hover:shadow-md"
              >
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <MobileMenu session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
