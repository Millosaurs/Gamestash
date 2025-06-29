"use client";

import * as React from "react";
import {
  Command,
  FileArchive,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export type NavUserProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null;
    avatar?: string | null;
  };
};

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Products",
          url: "/dashboard/products",
        },
        {
          title: "Analytics",
          url: "/dashboard/analytics",
        },
        // {
        //   title: "Reviews",
        //   url: "/dashboard/reviews",
        // },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: Bot,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: BookOpen,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Connect",
      url: "/dashboard/connect",
      icon: Send,
    },
  ],
};

export function AppSidebar({
  adminLinks = false,
  secondaryNav = [],
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  adminLinks?: boolean;
  secondaryNav?: any[];
}) {
  const { data: session } = useSession();

  // Admin navigation
  const adminNav = [
    {
      title: "Users",
      url: "/admin/users",
      icon: Frame,
    },
    {
      title: "Products",
      url: "/admin/products",
      icon: Command,
    },
    {
      title: "Approval",
      url: "/admin/approval",
      icon: Map,
    },
    {
      title: "Statistics",
      url: "/admin/statistics",
      icon: PieChart,
    },
  ];

  // Logout handler for admin
  const handleAdminLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <FileArchive className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-sidebar-foreground font-medium">
                    Gamestash
                  </span>
                  <span className="truncate text-xs"></span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {adminLinks ? (
          <>
            <NavMain items={adminNav} />
            {secondaryNav.length > 0 && (
              <NavSecondary items={secondaryNav} className="mt-4" />
            )}
          </>
        ) : (
          <>
            <NavMain items={data.navMain} />
            <NavSecondary items={data.navSecondary} className="mt-auto" />
          </>
        )}
      </SidebarContent>
      {adminLinks ? (
        <SidebarFooter>
          <Button
            variant="outline"
            onClick={handleAdminLogout}
            className="w-full"
          >
            Logout
          </Button>
        </SidebarFooter>
      ) : (
        <>
          <SidebarFooter>
            {session?.user && <NavUser user={session.user} />}
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}
