import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  // Validate admin authentication (must be ADMIN or SUPER_ADMIN)
  const user = session?.user;
  const isAdmin = user && ((user as any)?.role === "ADMIN" || (user as any)?.role === "SUPER_ADMIN"); 

  // If there is no session or user is not an admin, redirect to admin login
  if (!session || !isAdmin) {
    redirect("/admin/login?error=AccessDenied");
  }

  // Fetch initial telemetry data
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // Read current site configuration
  let config = {
    brandName: "2all.ai",
    tagline: "Intelligence that scans",
    showDemoButton: true,
    showTrialButton: true,
    trialButtonText: "START FREE TRIAL",
    demoButtonText: "BOOK A DEMO",
    stripeActive: true,
    paypalActive: false,
    trialPeriodDays: 7,
    primaryColor: "blue",
    proPrice: 49,
    auditBannerTitle: "Put your website to the test",
    orbitIcon: "globe",
    customCss: "/* Inject custom CSS here */\nbody { font-family: sans-serif; }",
    customJs: "console.log('White label platform script injected');",
    trackingScripts: "<!-- Google Analytics or Tracking pixels code -->"
  };

  try {
    const configPath = path.join(process.cwd(), "src/data/site-config.json");
    const data = await fs.readFile(configPath, "utf-8");
    config = JSON.parse(data);
  } catch (err) {
    console.error("Could not load config file in Admin Page, using default fallback.");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminDashboard 
        initialUsers={users as any} 
        initialProjects={projects as any} 
        initialConfig={config} 
        currentUser={user as any}
      />
    </div>
  );
}
