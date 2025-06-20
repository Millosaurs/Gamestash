import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { ThemeToggle } from "../toggle-theme";

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
