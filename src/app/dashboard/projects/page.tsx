import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Plus, Globe, ScanSearch, AlertTriangle, ChevronRight, ShieldCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string;

  const [projects, domains] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        scans: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: { select: { scans: true } },
      },
    }),
    prisma.domain.findMany({
      where: { userId },
    }),
  ]);

  const domainMap = new Map();
  domains.forEach((d: any) => {
    domainMap.set(d.domain.toLowerCase(), d.status);
  });

  return (
    <div className="space-y-8 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-gray-400 mt-1">
            Manage your websites and monitor accessibility widget authorization.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/install"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verify Domains
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all border-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No projects yet</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">
            Add your first website URL to scan for accessibility compliance and deploy the AI widget.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-5 h-5" />
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project: any) => {
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

            let cleanHost = "";
            try {
              const urlObj = new URL(project.url.startsWith("http") ? project.url : `https://${project.url}`);
              cleanHost = urlObj.hostname.replace(/^www\./, "").toLowerCase();
            } catch (e) {
              cleanHost = project.url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "").toLowerCase();
            }

            const domStatus = domainMap.get(cleanHost);

            return (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:-translate-y-0.5 transition-all group border border-white/5 hover:border-blue-500/30"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-white font-semibold group-hover:text-blue-300 transition-colors">
                      {project.name}
                    </h3>
                    {domStatus === "VERIFIED" ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        🟢 Widget Domain Verified
                      </span>
                    ) : domStatus === "UNVERIFIED" || domStatus === "FAILED" ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        🟡 Domain Unverified
                      </span>
                    ) : (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-extrabold uppercase tracking-wider flex items-center gap-1">
                        ⚡ Not Registered for Widget
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs font-mono truncate mt-1">
                    {project.url}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <ScanSearch className="w-3.5 h-3.5" />
                      {project._count.scans} audit scans
                    </span>
                    {latestScan && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
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

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-white/5">
                  <div className={`text-sm font-extrabold px-3 py-1 rounded-xl ${scoreColor}`}>
                    {score !== undefined && score !== null ? `${score}/100` : "Not Scanned"}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">Accessibility Score</span>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors shrink-0 hidden sm:block" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
