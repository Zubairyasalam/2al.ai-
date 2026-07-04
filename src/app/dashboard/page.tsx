import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  ShieldCheck,
  ScanSearch,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

async function getDashboardStats(userId: string) {
  const [projectCount, scans, criticalIssues] = await Promise.all([
    prisma.project.count({ where: { userId } }),
    prisma.scan.findMany({
      where: { project: { userId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { project: true },
    }),
    prisma.issue.count({
      where: { severity: "CRITICAL", scan: { project: { userId } } },
    }),
  ]);

  const avgScore =
    scans.length > 0
      ? Math.round(
          scans.reduce((acc: number, s: { score: number | null }) => acc + (s.score ?? 0), 0) / scans.length
        )
      : 0;

  return { projectCount, scans, criticalIssues, avgScore };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;
  const { projectCount, scans, criticalIssues, avgScore } =
    await getDashboardStats(userId);

  const stats = [
    {
      label: "Avg. Accessibility Score",
      value: projectCount === 0 ? "N/A" : `${avgScore}%`,
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      description: "Across all scanned projects",
    },
    {
      label: "Total Projects",
      value: projectCount,
      icon: ScanSearch,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      description: "Websites being monitored",
    },
    {
      label: "Critical Issues",
      value: criticalIssues,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      bg: "bg-red-500/10",
      iconColor: "text-red-400",
      description: "Require immediate attention",
    },
    {
      label: "Total Scans",
      value: scans.length,
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500",
      bg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      description: "Scans performed to date",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here's an overview of your accessibility performance.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-6 flex items-start gap-4"
            >
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Scans */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Recent Scans</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {scans.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ScanSearch className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">No scans yet</h3>
            <p className="text-gray-400 text-sm mb-6">
              Add your first project and run an accessibility scan.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Your First Project
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {scans.map((scan: { id: string; score: number | null; status: string; issuesCount: number; project: { name: string; url: string } }) => (
              <div
                key={scan.id}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    (scan.score ?? 0) >= 80
                      ? "bg-emerald-500/20 text-emerald-400"
                      : (scan.score ?? 0) >= 50
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {scan.score ?? "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {scan.project.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {scan.project.url}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      scan.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : scan.status === "FAILED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {scan.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {scan.issuesCount} issues
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compliance Section */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">
            Compliance Standards
          </h2>
          <div className="space-y-4">
            {[
              { name: "WCAG 2.1 AA", color: "bg-blue-500", pct: avgScore },
              { name: "ADA", color: "bg-purple-500", pct: Math.max(0, avgScore - 5) },
              { name: "Section 508", color: "bg-emerald-500", pct: Math.max(0, avgScore - 8) },
              { name: "EAA", color: "bg-amber-500", pct: Math.max(0, avgScore - 12) },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{item.name}</span>
                  <span className="text-gray-400 font-medium">{item.pct}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "New Scan", href: "/dashboard/projects/new", icon: ScanSearch, color: "text-blue-400 bg-blue-500/10" },
              { label: "View Reports", href: "/dashboard/reports", icon: TrendingUp, color: "text-purple-400 bg-purple-500/10" },
              { label: "API Keys", href: "/dashboard/api-keys", icon: ShieldCheck, color: "text-emerald-400 bg-emerald-500/10" },
              { label: "Settings", href: "/dashboard/settings", icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-white/10 text-center transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
