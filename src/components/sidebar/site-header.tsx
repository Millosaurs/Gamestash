import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

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

export function SiteHeader({ title = "Dashboard" }: { title?: string }) {
  return (
    <header className="flex flex-row justify-between h-16 shrink-0 items-center gap-2">
      <div className="flex flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1>{title}</h1>
      </div>
      <div className="mr-4 flex items-center gap-2">
        <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
          <ThemeToggle />
        </Button>
      </div>
    </header>
  );
}
