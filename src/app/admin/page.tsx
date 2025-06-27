import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await verifyAdminSession();
  if (session && session.adminId) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }
  return null;
}
