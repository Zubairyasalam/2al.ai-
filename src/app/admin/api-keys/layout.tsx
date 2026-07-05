import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminApiKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  const isAdmin = user && ((user as any)?.role === "ADMIN" || (user as any)?.role === "SUPER_ADMIN");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
