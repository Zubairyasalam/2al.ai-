"use client";

import { useState, useEffect } from "react";
import {
  FileText, Download, TrendingUp, BarChart3, ShieldAlert,
  CheckCircle2, KeyRound, Globe, Sliders, Calendar, Activity, RefreshCw
} from "lucide-react";

interface UsageData {
  month: string;
  plan: string;
  totalPageViews: number;
  totalWidgetLoads: number;
  quotaLimit: number;
  usagePercentage: number;
  domains: any[];
}

interface AuditLog {
  id: string;
  action: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"usage" | "audit" | "scans">("usage");
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usageRes, auditRes] = await Promise.all([
        fetch("/api/reports/usage"),
        fetch("/api/audit-logs"),
      ]);
      if (usageRes.ok) setUsage(await usageRes.json());
      if (auditRes.ok) setAuditLogs(await auditRes.json());
    } catch (e) {
      console.error("Error fetching reports:", e);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("KEY")) return <KeyRound className="w-4 h-4 text-blue-500" />;
    if (action.includes("DOMAIN")) return <Globe className="w-4 h-4 text-purple-500" />;
    if (action.includes("WIDGET") || action.includes("CONFIG")) return <Sliders className="w-4 h-4 text-emerald-500" />;
    return <Activity className="w-4 h-4 text-amber-500" />;
  };

  const formatActionName = (action: string) =>
    action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="space-y-6 select-none pb-16 font-sans">

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Usage & Audit Reports</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor real-time widget pageviews, quota limits, and security compliance logs.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: "usage" as const, label: "Usage Analytics", icon: BarChart3 },
            { id: "audit" as const, label: "Audit Logs", icon: ShieldAlert },
            { id: "scans" as const, label: "Scan Reports", icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
          <RefreshCw className="w-6 h-6 text-slate-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-medium">Loading analytics and logs...</p>
        </div>
      ) : activeTab === "usage" ? (
        <div className="space-y-5">

          {/* Quota Overview */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 mb-3">
                  {usage?.plan || "NONE"} PLAN QUOTA
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  {(usage?.totalPageViews ?? 0).toLocaleString()}
                  <span className="text-sm font-medium text-slate-400 ml-2">
                    / {(usage?.quotaLimit ?? 0).toLocaleString()} monthly pageviews
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Billing cycle: {usage?.month || "Current Month"}
                </p>
              </div>
              <div className="w-full md:w-72 shrink-0">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                  <span>Usage Consumed</span>
                  <span>{usage?.usagePercentage ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-700 rounded-full ${
                      (usage?.usagePercentage ?? 0) > 90 ? "bg-red-500"
                        : (usage?.usagePercentage ?? 0) > 75 ? "bg-amber-500"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    }`}
                    style={{ width: `${Math.min(100, usage?.usagePercentage ?? 0)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Widget Pageviews</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{(usage?.totalPageViews ?? 0).toLocaleString()}</h4>
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3 h-3" /> Live tracked via Bootstrap API
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Activity className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Widget Initializations</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">{(usage?.totalWidgetLoads ?? 0).toLocaleString()}</h4>
                <p className="text-xs text-purple-600 mt-1.5 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3 h-3" /> Successfully loaded on verified domains
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Globe className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-800">Domain Breakdown</h4>
            {usage?.domains && usage.domains.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {usage.domains.map((d: any) => (
                  <div key={d.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="font-bold text-slate-800">{d.domain}</span>
                    </div>
                    <div className="flex gap-6 text-slate-500 font-medium">
                      <span><strong className="text-slate-800">{d.pageViews?.toLocaleString()}</strong> pageviews</span>
                      <span><strong className="text-slate-800">{d.widgetLoads?.toLocaleString()}</strong> widget loads</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-8 text-center font-medium">
                No domain usage recorded this month yet. Visit a site with your widget installed to record pageviews.
              </p>
            )}
          </div>
        </div>

      ) : activeTab === "audit" ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-800">Security & Compliance Audit Logs</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Chronological record of sensitive account and widget mutations.</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {auditLogs.length} events recorded
            </span>
          </div>

          {auditLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              No audit events logged yet. Creating keys, verifying domains, or publishing configs will log events here.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => {
                let parsedDetails: any = {};
                try { parsedDetails = JSON.parse(log.details); } catch { parsedDetails = { info: log.details }; }
                return (
                  <div key={log.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shrink-0 mt-0.5">
                        {getActionIcon(log.action)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-800">{formatActionName(log.action)}</span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono border border-slate-200">
                            {log.ipAddress || "127.0.0.1"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-mono break-all max-w-xl">
                          {JSON.stringify(parsedDetails)}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      ) : (
        /* Scan Reports */
        <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Accessibility Scan Reports</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm font-medium">
            Run an automated accessibility scan on your projects to export comprehensive PDF and CSV compliance documentation.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              Export Summary PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0052ff] text-white text-xs font-bold hover:bg-blue-700 transition-all cursor-pointer border-none shadow-md shadow-blue-500/20">
              <TrendingUp className="w-3.5 h-3.5" />
              Export Full CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
