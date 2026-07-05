import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminDashboardPage(props: { searchParams?: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || "overview";
  const session = await auth();

  // Auth check — only ADMIN or SUPER_ADMIN can access
  const user = session?.user;
  const isAdmin = user && ((user as any)?.role === "ADMIN" || (user as any)?.role === "SUPER_ADMIN");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  // Fetch telemetry data with safety fallbacks for HMR dev reloading
  let users: any[] = [];
  let projects: any[] = [];
  let domains: any[] = [];

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    projects = await prisma.project.findMany({
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
  } catch (err) {
    console.warn("Could not query users/projects:", err);
  }

  try {
    if ((prisma as any).domain) {
      domains = await (prisma as any).domain.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              apiKeys: { select: { id: true, status: true } },
              widgetConfigs: { select: { id: true, publishedConfig: true, draftConfig: true } },
            },
          },
        },
      });

      if (domains.length === 0 && projects.length > 0) {
        for (const proj of projects) {
          let cleanDomain = proj.url?.trim().toLowerCase() || "";
          cleanDomain = cleanDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
          if (cleanDomain && !domains.some((d: any) => d.domain === cleanDomain)) {
            try {
              const created = await (prisma as any).domain.create({
                data: {
                  userId: proj.userId || (users.length > 0 ? users[0].id : ""),
                  domain: cleanDomain,
                  verificationToken: `2all-verify=${Math.random().toString(36).substring(2, 15)}`,
                  status: "VERIFIED",
                  verifiedAt: new Date(),
                },
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      apiKeys: { select: { id: true, status: true } },
                      widgetConfigs: { select: { id: true, publishedConfig: true, draftConfig: true } },
                    },
                  },
                },
              });
              domains.push(created);
            } catch (e) {
              console.warn("Could not sync project to domain:", e);
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn("Could not query domains table:", err);
  }

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
    console.error("Could not load config file in Admin Dashboard, using defaults.");
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AdminDashboard
        initialUsers={users as any}
        initialProjects={projects as any}
        initialDomains={domains as any}
        initialConfig={config}
        currentUser={user as any}
        initialTab={tab}
      />
    </div>
  );
}
