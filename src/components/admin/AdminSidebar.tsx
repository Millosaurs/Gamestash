"use client";

import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { ThemeToggle } from "@/components/toggle-theme";
import { Settings2 } from "lucide-react";

export default function AdminSidebar() {
  // Secondary nav for admin
  const adminSecondaryNav = [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings2,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <AppSidebar adminLinks secondaryNav={adminSecondaryNav} />
      <div className="p-4 mt-auto flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
