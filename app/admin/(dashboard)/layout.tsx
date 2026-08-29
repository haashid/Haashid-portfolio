import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./_components/sidebar";
import { AdminTopbar } from "./_components/topbar";
import { AdminCommandPalette } from "./_components/command-palette";
import "../admin.css";

export const metadata = {
  title: "Portfolio Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar user={session.user} />
        <main className="admin-content">{children}</main>
      </div>
      <AdminCommandPalette />
    </div>
  );
}
