import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = session!.user!;

  return (
    <div className="min-h-screen bg-[#030712] flex">
      <DashboardSidebar user={user} />
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
