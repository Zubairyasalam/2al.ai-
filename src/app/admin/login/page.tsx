import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const isAccessDenied = params.error === "AccessDenied";

  // Seed/Sync default admin
  const adminEmail = "aiadmin@gmail.com";
  const hashedPassword = await bcrypt.hash("admin123", 12);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      
      <AdminLoginForm errorMsg={isAccessDenied ? "Access Denied: You do not have administrator privileges." : undefined} />
    </div>
  );
}
