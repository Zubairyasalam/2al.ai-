import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Plus, Globe, ScanSearch, AlertTriangle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: { select: { scans: true } },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor all your websites.
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

      {projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No projects yet</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Add your first website URL to start scanning for accessibility issues with AI.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: typeof projects[number]) => {
            const latestScan = project.scans[0];
            const score = latestScan?.score;
            const scoreColor =
              score === undefined || score === null
                ? "text-gray-400 bg-gray-500/20"
                : score >= 80
                ? "text-emerald-400 bg-emerald-500/20"
                : score >= 50
                ? "text-amber-400 bg-amber-500/20"
                : "text-red-400 bg-red-500/20";

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:-translate-y-0.5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate mt-0.5">
                    {project.url}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ScanSearch className="w-3 h-3" />
                      {project._count.scans} scans
                    </span>
                    {latestScan && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          latestScan.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : latestScan.status === "FAILED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {latestScan.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${scoreColor}`}
                    >
                      {score ?? "—"}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Score</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
