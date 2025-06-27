"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full ">
        {!isLogin && <AdminSidebar />}
        <main className="flex-1 w-full overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
