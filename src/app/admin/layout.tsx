import AdminSidebar from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full ">
        <AdminSidebar />
        <main className="flex-1 w-full overflow-auto bg-background">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
