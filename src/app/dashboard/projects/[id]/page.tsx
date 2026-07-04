import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { Globe, ArrowLeft, AlertTriangle, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ScanButton from "@/components/dashboard/ScanButton";
import IssueList from "@/components/dashboard/IssueList";
import ScoreRing from "@/components/dashboard/ScoreRing";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  const userId = (session?.user as { id: string })?.id;
  const { id } = await params;

  const project = await prisma.project.findFirst({
    where: { id, userId },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          issues: { orderBy: [{ severity: "asc" }, { type: "asc" }] },
        },
      },
    },
  });

  if (!project) notFound();

  const latestScan = project.scans[0] ?? null;
  const score = latestScan?.score ?? null;
  const issues = latestScan?.issues ?? [];

  const criticalCount = issues.filter((i: { severity: string }) => i.severity === "CRITICAL").length;
  const highCount = issues.filter((i: { severity: string }) => i.severity === "HIGH").length;
  const mediumCount = issues.filter((i: { severity: string }) => i.severity === "MEDIUM").length;
  const lowCount = issues.filter((i: { severity: string }) => i.severity === "LOW").length;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Projects
        </Link>
        <span className="text-gray-600">/</span>
        <span className="text-sm text-white font-medium">{project.name}</span>
      </div>

      {/* Header */}
      <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shrink-0">
          <Globe className="w-7 h-7 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-sm mt-1 inline-flex items-center gap-1 transition-colors"
          >
            {project.url}
          </a>
          <p className="text-xs text-gray-500 mt-1">
            Last scan:{" "}
            {latestScan
              ? new Date(latestScan.createdAt).toLocaleString()
              : "Never scanned"}
          </p>
        </div>

        {/* Score + Scan Button */}
        <div className="flex items-center gap-4 shrink-0">
          {score !== null && <ScoreRing score={score} />}
          <ScanButton projectId={project.id} />
        </div>
      </div>

      {/* No scan yet */}
      {!latestScan && (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to scan!</h3>
          <p className="text-gray-400 text-sm">
            Click "Run Scan" above to analyse{" "}
            <span className="text-blue-400">{project.url}</span> for accessibility issues.
          </p>
        </div>
      )}

      {/* Stats Row */}
      {latestScan && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Critical", count: criticalCount, color: "text-red-400 bg-red-500/10" },
              { label: "High", count: highCount, color: "text-orange-400 bg-orange-500/10" },
              { label: "Medium", count: mediumCount, color: "text-amber-400 bg-amber-500/10" },
              { label: "Low", count: lowCount, color: "text-emerald-400 bg-emerald-500/10" },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-lg font-bold`}>
                  {s.count}
                </div>
                <div>
                  <p className="text-xs text-gray-400">{s.label} Issues</p>
                  <p className="text-white font-semibold">{s.count} found</p>
                </div>
              </div>
            ))}
          </div>

          {/* Issues */}
          {issues.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No issues found! 🎉
              </h3>
              <p className="text-gray-400 text-sm">
                This page passed all our automated accessibility checks.
              </p>
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white">
                  {issues.length} Accessibility Issue{issues.length > 1 ? "s" : ""} Found
                </h2>
              </div>
              <IssueList issues={issues} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
