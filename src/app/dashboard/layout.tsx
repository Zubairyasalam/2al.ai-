import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Suspense } from "react";
import FreeTrialModal from "@/components/dashboard/FreeTrialModal";

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
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col font-sans">
      <DashboardHeader user={user} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 py-8 overflow-auto">
        {children}
      </main>
      {/* Free Trial Modal — reads ?trial=1 query param */}
      <Suspense fallback={null}>
        <FreeTrialModal />
      </Suspense>
    </div>
  );
}

