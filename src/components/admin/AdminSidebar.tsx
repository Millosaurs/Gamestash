"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeToggle } from "@/components/toggle-theme";

export default function AdminSidebar() {
  return (
    <div className="flex flex-col h-full">
      <AppSidebar adminLinks />
      <div className="p-4 mt-auto flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
