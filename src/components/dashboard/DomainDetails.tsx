"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  ShieldCheck,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  KeyRound,
  Code,
  Sliders,
  BarChart3,
  FileText,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Activity,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  Send,
  Download,
  Zap,
  Monitor,
  Smartphone,
  Package,
  List,
} from "lucide-react";

interface ApiKeyType {
  id: string;
  name: string;
  key: string;
  status: string;
  createdAt: string;
  lastUsedAt?: string;
}

interface DomainType {
  id: string;
  websiteName?: string;
  domain: string;
  canonicalDomain?: string;
  environment?: string;
  verificationMethod?: string;
  verificationToken?: string;
  status: string;
  verified: boolean;
  verifiedAt?: string;
  widgetStatus?: string;
  installed?: boolean;
  notes?: string;
  createdAt: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    widgetConfigs?: any[];
  };
  apiKeys: ApiKeyType[];
}

interface DomainDetailsProps {
  domain: DomainType;
  userName: string;
}

type Tab = "overview" | "api-keys" | "widget-config" | "install" | "usage" | "logs";

const WIDGET_CONFIG_TABS = ["Brand", "Trigger Button", "Panel", "Accessibility Features", "Help Links", "Advanced"] as const;

export default function DomainDetails({ domain: initialDomain, userName }: DomainDetailsProps) {
  const [domain, setDomain] = useState<DomainType>(initialDomain);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // API Keys tab state
  const [keys, setKeys] = useState<ApiKeyType[]>(initialDomain.apiKeys || []);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const [revealedKeyId, setRevealedKeyId] = useState<string | null>(null);

  // Widget Config tab state
  const [widgetTab, setWidgetTab] = useState<typeof WIDGET_CONFIG_TABS[number]>("Brand");
  const [widgetConfig, setWidgetConfig] = useState({
    widgetTitle: "Accessibility Tools",
    primaryColor: "#0052ff",
    secondaryColor: "#38bdf8",
    textColor: "#0f172a",
    bgColor: "#ffffff",
    showBranding: false,
    brandingText: "Powered by 2all.ai",
    logoUrl: "",
    // Trigger
    buttonIconType: "Accessibility",
    customIconText: "",
    buttonShape: "Circle",
    buttonSize: "Medium",
    desktopPosition: "Bottom Right",
    mobilePosition: "Bottom Right",
    horizontalOffset: "0",
    verticalOffset: "0",
    zIndex: "9999",
    showOnMobile: true,
    // Panel
    panelLayout: "Comfortable",
    panelPosition: "Right",
    panelWidth: "320",
    borderRadius: "24",
    openAnimation: "Slide",
    defaultOpen: false,
    footerText: "Need help? Reach out using the links below.",
    // Features enabled list
    enabledFeatures: ["text-resize", "high-contrast", "readable-font", "highlight-links"],
    // Help
    helpEmail: "",
    helpPhone: "",
    helpUrl: "",
    // Advanced
    devMode: false,
    customCss: "",
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);

  // Install tab state
  const [copiedScript, setCopiedScript] = useState(false);

  // Usage tab state
  const [usageData, setUsageData] = useState<any>(null);
  const [loadingUsage, setLoadingUsage] = useState(false);

  // Logs tab state
  const [logs, setLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Verification state
  const [verifying, setVerifying] = useState(false);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const updateWidget = (key: string, value: any) => {
    setWidgetConfig((prev) => ({ ...prev, [key]: value }));
    setHasUnsaved(true);
  };

  // Load widget config
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/widget-config");
        if (res.ok) {
          const data = await res.json();
          if (data.draftConfig && Object.keys(data.draftConfig).length > 0) {
            setWidgetConfig((prev) => ({ ...prev, ...data.draftConfig }));
          }
          if (data.publishedAt) setLastPublished(data.publishedAt);
        }
      } catch (_) {}
    };
    loadConfig();
  }, []);

  // Load usage when tab opens
  useEffect(() => {
    if (activeTab === "usage" && !usageData) {
      setLoadingUsage(true);
      fetch("/api/reports/usage")
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { setUsageData(d); setLoadingUsage(false); })
        .catch(() => setLoadingUsage(false));
    }
  }, [activeTab]);

  // Load logs when tab opens
  useEffect(() => {
    if (activeTab === "logs" && logs.length === 0) {
      setLoadingLogs(true);
      fetch("/api/audit-logs")
        .then((r) => r.ok ? r.json() : [])
        .then((d) => { setLogs(Array.isArray(d) ? d : []); setLoadingLogs(false); })
        .catch(() => setLoadingLogs(false));
    }
  }, [activeTab]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim(), domainId: domain.id, domainName: domain.domain }),
      });
      if (res.ok) {
        const newKey = await res.json();
        setKeys([newKey, ...keys]);
        setNewKeyName("");
        showToast("API key generated successfully.");
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to generate key.", "error");
      }
    } catch (_) {
      showToast("Network error.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCopyScript = (id: string, key: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://cdn.2all.ai";
    const script = `<script src="${origin}/loader.js?key=${key}" async></script>`;
    navigator.clipboard.writeText(script);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this API key? The widget using this key will stop working immediately.")) return;
    const res = await fetch(`/api/api-keys/${id}/revoke`, { method: "POST" });
    if (res.ok) {
      setKeys(keys.map((k) => k.id === id ? { ...k, status: "REVOKED" } : k));
      showToast("API key revoked.");
    }
  };

  const handleRotate = async (id: string) => {
    if (!confirm("Rotate this key? The old key will be revoked and replaced with a new one.")) return;
    setRotatingId(id);
    const res = await fetch(`/api/api-keys/${id}/rotate`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setKeys([data.newKey, ...keys.map((k) => k.id === id ? { ...k, status: "REVOKED" } : k)]);
      showToast("API key rotated successfully.");
    }
    setRotatingId(null);
  };

  const handleSaveDraft = async () => {
    setSavingConfig(true);
    try {
      await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftConfig: widgetConfig }),
      });
      setHasUnsaved(false);
      showToast("Draft saved.");
    } catch (_) {
      showToast("Failed to save draft.", "error");
    } finally {
      setSavingConfig(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftConfig: widgetConfig }),
      });
      const res = await fetch("/api/widget-config/publish", { method: "POST" });
      if (res.ok) {
        setHasUnsaved(false);
        setLastPublished(new Date().toISOString());
        showToast("Widget published to live site!");
        setDomain((prev) => ({ ...prev, widgetStatus: "PUBLISHED" }));
      }
    } catch (_) {
      showToast("Failed to publish.", "error");
    } finally {
      setPublishing(false);
    }
  };

  const handleVerify = async (simulate = false) => {
    setVerifying(true);
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId: domain.id, method: domain.verificationMethod || "META", simulate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDomain((prev) => ({ ...prev, verified: true, status: "ACTIVE", verifiedAt: new Date().toISOString() }));
        showToast("Domain verified successfully!");
      } else {
        showToast(data.message || "Verification failed. Check your token placement.", "error");
      }
    } catch (_) {
      showToast("Network error during verification.", "error");
    } finally {
      setVerifying(false);
    }
  };

  const isVerified = domain.verified || domain.status === "ACTIVE" || domain.status === "VERIFIED";
  const isPublished = domain.widgetStatus === "PUBLISHED";
  const activeKeys = keys.filter((k) => k.status === "ACTIVE");
  const firstActiveKey = activeKeys[0];

  const origin = typeof window !== "undefined" ? window.location.origin : "https://cdn.2all.ai";
  const installScript = `<script src="${origin}/loader.js" data-api-key="${firstActiveKey?.key || "YOUR_API_KEY"}" data-domain="${domain.domain}" async></script>`;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "api-keys", label: "API Keys", icon: KeyRound },
    { id: "widget-config", label: "Widget Config", icon: Sliders },
    { id: "install", label: "Install Script", icon: Code },
    { id: "usage", label: "Usage", icon: BarChart3 },
    { id: "logs", label: "Logs", icon: FileText },
  ];

  return (
    <div className="w-full space-y-6 select-none pb-16 font-sans">

      {/* Toast */}
      {statusMsg && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${statusMsg.type === "success" ? "bg-emerald-900/95 border-emerald-500/50 text-white" : "bg-red-900/95 border-red-500/50 text-white"}`}>
          {statusMsg.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          <span className="text-xs font-bold">{statusMsg.text}</span>
          <button onClick={() => setStatusMsg(null)} className="text-white/60 hover:text-white ml-2 bg-transparent border-none cursor-pointer">✕</button>
        </div>
      )}

      {/* Back breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/dashboard/domains" className="flex items-center gap-1.5 font-bold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          My Domains
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-bold text-slate-800">{domain.domain}</span>
      </div>

      {/* Domain Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black tracking-widest text-[#0052ff] uppercase">Customer Workspace</span>
              {isVerified && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase">Active</span>}
              {isVerified && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-extrabold uppercase">Verified</span>}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{domain.domain}</h1>
            <p className="text-xs text-slate-500 font-medium">Canonical host: <span className="font-mono font-bold text-slate-700">{domain.canonicalDomain || domain.domain}</span></p>
            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-0.5">
              {domain.websiteName && <span className="font-bold text-slate-600">{domain.websiteName}</span>}
              {domain.environment && <span className="text-slate-400">{domain.environment}</span>}
              <span>{new Date(domain.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!isVerified && (
              <button
                onClick={() => handleVerify(true)}
                className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Simulate Verify
              </button>
            )}
            <Link href="/dashboard/domains" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-colors">
              ← Back to Domains
            </Link>
          </div>
        </div>

        {/* Domain Verification Section */}
        <div className={`mt-5 p-5 rounded-2xl border ${isVerified ? "bg-emerald-50/50 border-emerald-100" : "bg-amber-50/50 border-amber-200"}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Domain Verification</span>
                {isVerified
                  ? <span className="text-[10px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-100 rounded-full">Verified</span>
                  : <span className="text-[10px] font-black text-amber-600 px-2 py-0.5 bg-amber-100 rounded-full">Pending</span>}
              </div>
              <h3 className="text-sm font-black text-slate-800">Verify ownership with DNS, HTML meta tag, or file upload</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-lg">Use one of the methods below to prove control of the approved domain. The widget only loads for active, verified domains unless the development override is enabled in settings.</p>
              {domain.verificationToken && !isVerified && (
                <div className="mt-3 p-3 bg-white border border-slate-200 rounded-xl font-mono text-xs text-slate-700 flex items-center gap-3">
                  <span className="truncate">{`<meta name="2all-verification" content="${domain.verificationToken}">`}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(`<meta name="2all-verification" content="${domain.verificationToken}">`); showToast("Token copied!"); }}
                    className="text-slate-400 hover:text-blue-600 bg-transparent border-none cursor-pointer shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!isVerified && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleVerify(false)}
                    disabled={verifying}
                    className="px-4 py-2 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer border-none flex items-center gap-2 shadow-md shadow-blue-500/20 disabled:opacity-50"
                  >
                    {verifying ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking...</> : <><ShieldCheck className="w-3.5 h-3.5" /> Verify Domain</>}
                  </button>
                  <button
                    onClick={() => handleVerify(true)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border-none"
                  >
                    Simulate (Dev)
                  </button>
                </div>
              )}
            </div>
            {isVerified && domain.verifiedAt && (
              <span className="px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold shrink-0">
                Verified {new Date(domain.verifiedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label: "API Keys", value: keys.length, sub: "Issued keys", onClick: () => setActiveTab("api-keys"), highlight: true },
            { label: "Widget Config", value: isPublished ? "Published" : "Draft", sub: "Current config state", onClick: () => setActiveTab("widget-config"), bold: isPublished },
            { label: "Usage Events", value: usageData?.totalWidgetLoads ?? "—", sub: "Recent activity sample", onClick: () => setActiveTab("usage") },
            { label: "Access Logs", value: logs.length || "—", sub: "Recent validation requests", onClick: () => setActiveTab("logs") },
          ].map((card) => (
            <button
              key={card.label}
              onClick={card.onClick}
              className="text-left p-4 bg-white border border-slate-200/80 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs text-slate-500 font-medium">{card.label}</span>
                <span className="text-[10px] font-bold text-[#0052ff] hover:underline">{card.sub}</span>
              </div>
              <p className={`mt-1 ${card.bold ? "text-base font-black text-slate-800" : "text-2xl font-black text-slate-900"}`}>{card.value}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-slate-200 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px whitespace-nowrap focus:outline-none ${activeTab === t.id ? "border-slate-900 text-slate-900 bg-slate-900 text-white rounded-full px-4 py-2 mb-1 border-0" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                style={activeTab === t.id ? { background: "#0f172a", borderRadius: "999px", color: "white", padding: "6px 16px", marginBottom: "4px", border: "none" } : {}}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* =================== TAB CONTENT =================== */}
        <div className="p-6">

          {/* --- OVERVIEW TAB --- */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-sm font-black text-slate-800">Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    { label: "Allowed Hosts", value: `${domain.domain}, www.${domain.domain}` },
                    { label: "Verification Date", value: domain.verifiedAt ? new Date(domain.verifiedAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Not yet verified" },
                    { label: "Tenant", value: domain.websiteName || userName },
                    { label: "Status", value: isVerified ? "Active" : "Pending Verification" },
                    { label: "Environment", value: domain.environment || "Production" },
                    { label: "Widget Status", value: isPublished ? "Published" : "Draft" },
                  ].map((item) => (
                    <div key={item.label}>
                      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.label}</span>
                      <span className="block text-xs font-bold text-slate-800 mt-0.5">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-800">Next actions</h3>
                <div className="space-y-2">
                  {!isVerified && (
                    <button onClick={() => setActiveTab("overview")} className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                      ⚡ Verify your domain to unlock the widget.
                    </button>
                  )}
                  {activeKeys.length === 0 && (
                    <button onClick={() => setActiveTab("api-keys")} className="w-full text-left px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                      🔑 Generate or link an API key to unlock the final install script.
                    </button>
                  )}
                  {!isPublished && (
                    <button onClick={() => setActiveTab("widget-config")} className="w-full text-left px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer">
                      📦 Publish a widget config to move this domain closer to production readiness.
                    </button>
                  )}
                  <button onClick={() => setActiveTab("install")} className="w-full text-left px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer">
                    📋 View install script for this domain.
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- API KEYS TAB (EXACT APPROVED UI) --- */}
          {activeTab === "api-keys" && (
            <div className="space-y-6">
              {/* Top Section: Generate Form + Info Cards */}
              <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Left: Generate API Key Form */}
                <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-4">Generate API Key</h3>
                  <form onSubmit={handleCreateKey} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Target Domain</label>
                        <select 
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0052ff] transition-all cursor-not-allowed opacity-70"
                          disabled
                        >
                          <option>{domain.domain} (Active)</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Key Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Production Keys"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#0052ff] transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isCreating || !newKeyName.trim() || !isVerified}
                        className="px-6 py-2.5 bg-[#0052ff] hover:bg-blue-700 disabled:hover:bg-[#0052ff] text-white font-bold text-xs rounded-xl border-none cursor-pointer disabled:cursor-not-allowed shadow-md shadow-blue-500/20 disabled:shadow-none disabled:opacity-50 transition-all flex items-center gap-2 uppercase tracking-wider"
                      >
                        {isCreating ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...</> : "Create API Key"}
                      </button>
                      {!isVerified && (
                        <p className="text-xs font-bold text-amber-600 mt-2">
                          Domain must be verified before generating API keys.
                        </p>
                      )}
                    </div>
                  </form>
                </div>

                {/* Right: Information Cards */}
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Secure your keys</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                        API keys provide full access to widget configuration for this domain. Never commit them to public repositories.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600 shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Key Rotation</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                        If a key is compromised, rotate it immediately. The old key will be revoked and a new one generated.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: API Keys Table */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-slate-800">Active API Keys</h3>
                  <span className="text-xs font-bold text-[#0052ff] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                    {keys.length} Keys
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                        <th className="pb-3 pr-4">Public Key</th>
                        <th className="pb-3 px-4">Customer</th>
                        <th className="pb-3 px-4">Domain</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 px-4">Last Used</th>
                        <th className="pb-3 px-4">Created</th>
                        <th className="pb-3 pl-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {keys.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 text-xs font-medium border-b-0">
                            No API keys found. Generate a key above to get started.
                          </td>
                        </tr>
                      ) : (
                        keys.map((k) => (
                          <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-4 pr-4">
                              <div>
                                <p className="text-xs font-black text-slate-800">{k.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <code className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    {revealedKeyId === k.id ? k.key : k.key.slice(0, 10) + "•".repeat(k.key.length - 10)}
                                  </code>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs font-bold text-slate-600">
                              {userName}
                            </td>
                            <td className="py-4 px-4 text-xs font-bold text-slate-600">
                              {domain.domain}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${k.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-red-100 text-red-600 border border-red-200"}`}>
                                {k.status === "ACTIVE" ? "Active" : "Revoked"}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-xs font-medium text-slate-500">
                              {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Never"}
                            </td>
                            <td className="py-4 px-4 text-xs font-medium text-slate-500">
                              {new Date(k.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </td>
                            <td className="py-4 pl-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setRevealedKeyId(revealedKeyId === k.id ? null : k.id)}
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                  title={revealedKeyId === k.id ? "Hide key" : "Show key"}
                                >
                                  {revealedKeyId === k.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleCopyKey(k.id, k.key)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                  title="Copy key"
                                >
                                  {copiedKeyId === k.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                                {k.status === "ACTIVE" && (
                                  <>
                                    <button
                                      onClick={() => handleCopyScript(k.id, k.key)}
                                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                      title="Copy Install Script"
                                    >
                                      {copiedScriptId === k.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Code className="w-4 h-4" />}
                                    </button>
                                    <button
                                      onClick={() => handleRotate(k.id)}
                                      disabled={rotatingId === k.id}
                                      className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer disabled:opacity-50"
                                      title="Rotate Key"
                                    >
                                      <RefreshCw className={`w-4 h-4 ${rotatingId === k.id ? "animate-spin" : ""}`} />
                                    </button>
                                    <button
                                      onClick={() => handleRevoke(k.id)}
                                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                      title="Revoke Key"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- WIDGET CONFIG TAB --- */}
          {activeTab === "widget-config" && (
            <div className="space-y-0">
              {/* Widget Config Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#0052ff] uppercase block">Customer Workspace</span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">Widget Customization</h2>
                  <p className="text-xs text-slate-500 mt-1">Tune the accessibility widget brand, behavior, and features with a live preview that updates as you edit.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hasUnsaved && <span className="text-xs font-bold text-amber-600">Unpublished changes</span>}
                  {lastPublished && <span className="text-xs text-slate-400">Last published {new Date(lastPublished).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>}
                  <button onClick={handleSaveDraft} disabled={savingConfig} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-2 disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" /> {savingConfig ? "Saving..." : "Save Draft"}
                  </button>
                  <button onClick={handlePublish} disabled={publishing} className="px-4 py-2 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center gap-2 disabled:opacity-50 shadow-md shadow-blue-500/20">
                    <Send className="w-3.5 h-3.5" /> {publishing ? "Publishing..." : "Publish"}
                  </button>
                  <button onClick={() => { setWidgetConfig((c) => ({ ...c })); setHasUnsaved(false); }} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-50">Reset</button>
                </div>
              </div>

              {/* Unpublished changes banner */}
              {hasUnsaved && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-amber-800">You have unpublished changes.</p>
                      <p className="text-[10px] text-amber-700 font-medium">Save a draft to preserve them, or publish when the widget is ready for production.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-600 whitespace-nowrap">Draft only until published</span>
                </div>
              )}

              {/* Two-column layout: config + preview */}
              <div className="grid md:grid-cols-2 gap-6 mt-5">
                {/* Left: Config tabs + content */}
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1 px-3 pt-3 overflow-x-auto">
                    {WIDGET_CONFIG_TABS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setWidgetTab(t)}
                        className={`px-3 py-2 text-xs font-bold rounded-t-xl whitespace-nowrap transition-all cursor-pointer border-none ${widgetTab === t ? "bg-slate-900 text-white" : "bg-transparent text-slate-500 hover:text-slate-700"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="p-5 space-y-5 border-t border-slate-100">
                    {widgetTab === "Brand" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Brand</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Define the visible identity and the widget's color system.</p>
                        </div>
                        {[
                          { label: "Widget title", key: "widgetTitle", placeholder: "Accessibility Tools" },
                          { label: "Primary color", key: "primaryColor", placeholder: "#0052ff" },
                          { label: "Secondary color", key: "secondaryColor", placeholder: "#38bdf8" },
                          { label: "Text color", key: "textColor", placeholder: "#0f172a" },
                          { label: "Background color", key: "bgColor", placeholder: "#ffffff" },
                          { label: "Branding text", key: "brandingText", placeholder: "Powered by 2all.ai" },
                          { label: "Logo URL", key: "logoUrl", placeholder: "https://..." },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <input
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="showBranding" checked={widgetConfig.showBranding} onChange={(e) => updateWidget("showBranding", e.target.checked)} className="accent-[#0052ff]" />
                          <label htmlFor="showBranding" className="text-xs font-bold text-slate-700 cursor-pointer">Show branding — Display branding text in the widget footer.</label>
                        </div>
                      </>
                    )}
                    {widgetTab === "Trigger Button" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Trigger Button</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Set the floating launcher shape, icon, size, and placement.</p>
                        </div>
                        {[
                          { label: "Button icon type", key: "buttonIconType", options: ["Accessibility", "Person", "Universal", "Custom"] },
                          { label: "Button shape", key: "buttonShape", options: ["Circle", "Rounded", "Square"] },
                          { label: "Button size", key: "buttonSize", options: ["Small", "Medium", "Large"] },
                          { label: "Desktop position", key: "desktopPosition", options: ["Bottom Right", "Bottom Left", "Top Right", "Top Left"] },
                          { label: "Mobile position", key: "mobilePosition", options: ["Bottom Right", "Bottom Left", "Top Right", "Top Left"] },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <select
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            >
                              {f.options.map((o) => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                        {[
                          { label: "Horizontal offset", key: "horizontalOffset" },
                          { label: "Vertical offset", key: "verticalOffset" },
                          { label: "Z-index", key: "zIndex" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <input
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="showOnMobile" checked={widgetConfig.showOnMobile} onChange={(e) => updateWidget("showOnMobile", e.target.checked)} className="accent-[#0052ff]" />
                          <label htmlFor="showOnMobile" className="text-xs font-bold text-slate-700 cursor-pointer">Show on mobile — Keep the trigger visible on smaller screens.</label>
                        </div>
                      </>
                    )}
                    {widgetTab === "Panel" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Panel</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Control the drawer geometry and how the panel opens for visitors.</p>
                        </div>
                        {[
                          { label: "Panel layout", key: "panelLayout", options: ["Comfortable", "Compact", "Spacious"] },
                          { label: "Panel position", key: "panelPosition", options: ["Right", "Left"] },
                          { label: "Open animation", key: "openAnimation", options: ["Slide", "Fade", "Scale"] },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <select
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            >
                              {f.options.map((o) => <option key={o}>{o}</option>)}
                            </select>
                          </div>
                        ))}
                        {[
                          { label: "Panel width", key: "panelWidth" },
                          { label: "Border radius", key: "borderRadius" },
                          { label: "Footer text", key: "footerText" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <input
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="defaultOpen" checked={widgetConfig.defaultOpen} onChange={(e) => updateWidget("defaultOpen", e.target.checked)} className="accent-[#0052ff]" />
                          <label htmlFor="defaultOpen" className="text-xs font-bold text-slate-700 cursor-pointer">Default open — Open the preview panel immediately on page load.</label>
                        </div>
                      </>
                    )}
                    {widgetTab === "Accessibility Features" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Accessibility Features</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Toggle which accessibility tools appear in the widget panel.</p>
                        </div>
                        <div className="space-y-2">
                          {[
                            { id: "text-resize", label: "Text Resize" },
                            { id: "high-contrast", label: "High Contrast" },
                            { id: "readable-font", label: "Readable Font" },
                            { id: "highlight-links", label: "Highlight Links" },
                            { id: "dark-mode", label: "Dark Mode" },
                            { id: "line-height", label: "Line Height" },
                            { id: "letter-spacing", label: "Letter Spacing" },
                            { id: "screen-reader", label: "Screen Reader" },
                          ].map((feature) => (
                            <label key={feature.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                              <input
                                type="checkbox"
                                checked={widgetConfig.enabledFeatures.includes(feature.id)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...widgetConfig.enabledFeatures, feature.id]
                                    : widgetConfig.enabledFeatures.filter((f) => f !== feature.id);
                                  updateWidget("enabledFeatures", updated);
                                }}
                                className="accent-[#0052ff]"
                              />
                              <span className="text-xs font-bold text-slate-700">{feature.label}</span>
                            </label>
                          ))}
                        </div>
                      </>
                    )}
                    {widgetTab === "Help Links" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Help Links</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Provide contact options shown in the widget footer for users who need assistance.</p>
                        </div>
                        {[
                          { label: "Help email", key: "helpEmail", placeholder: "support@yoursite.com" },
                          { label: "Help phone", key: "helpPhone", placeholder: "+1 (555) 000-0000" },
                          { label: "Help URL", key: "helpUrl", placeholder: "https://yoursite.com/accessibility" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{f.label}</label>
                            <input
                              value={(widgetConfig as any)[f.key]}
                              onChange={(e) => updateWidget(f.key, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        ))}
                      </>
                    )}
                    {widgetTab === "Advanced" && (
                      <>
                        <div>
                          <p className="text-xs font-black text-slate-800">Advanced</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Developer options and custom CSS injection.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="devMode" checked={widgetConfig.devMode} onChange={(e) => updateWidget("devMode", e.target.checked)} className="accent-[#0052ff]" />
                          <label htmlFor="devMode" className="text-xs font-bold text-slate-700 cursor-pointer">Development mode — Bypasses domain verification for local testing.</label>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom CSS</label>
                          <textarea
                            rows={5}
                            value={widgetConfig.customCss}
                            onChange={(e) => updateWidget("customCss", e.target.value)}
                            placeholder="/* Custom CSS injected into widget shadow DOM */"
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-400 resize-y"
                          />
                        </div>
                      </>
                    )}
                    <button onClick={handleSaveDraft} disabled={savingConfig} className="w-full py-2.5 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-blue-500/15 disabled:opacity-50">
                      <Save className="w-3.5 h-3.5" /> {savingConfig ? "Saving..." : "Save Draft"}
                    </button>
                  </div>
                </div>

                {/* Right: Live Preview */}
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                    <span className="text-[10px] font-black text-[#0052ff] uppercase tracking-widest block">Live Preview</span>
                    <h3 className="text-sm font-black text-slate-800 mt-0.5">Widget Experience</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">The preview responds instantly as you edit the draft settings.</p>
                    <p className="text-[10px] text-slate-400 font-medium text-right mt-1">{widgetConfig.desktopPosition?.toLowerCase()}</p>

                    <div className="mt-4 bg-white border border-slate-200 rounded-xl p-4 relative min-h-[280px]">
                      <div className="space-y-2 mb-6">
                        <div className="h-2.5 bg-slate-100 rounded-full w-3/4"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                        <div className="h-2 bg-slate-100 rounded-full w-2/3"></div>
                      </div>
                      {/* Widget Preview Card */}
                      <div className="absolute top-4 right-4 w-48 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                        <div className="p-3 text-white text-[10px] font-black flex items-center justify-between" style={{ backgroundColor: widgetConfig.primaryColor }}>
                          <span>{widgetConfig.widgetTitle || "Accessibility Tools"}</span>
                          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">A</span>
                        </div>
                        <div className="bg-white p-2 space-y-1">
                          {widgetConfig.enabledFeatures.slice(0, 6).map((f) => (
                            <div key={f} className="text-[8px] font-bold text-slate-600 bg-slate-50 rounded px-2 py-1 truncate">{f.replace("-", " ")}</div>
                          ))}
                          {widgetConfig.showBranding && (
                            <div className="pt-1 border-t border-slate-100">
                              <span className="text-[7px] font-black px-2 py-0.5 rounded text-white" style={{ backgroundColor: widgetConfig.primaryColor }}>{widgetConfig.brandingText}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Trigger button */}
                      <div
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg"
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                      >A</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- INSTALL SCRIPT TAB --- */}
          {activeTab === "install" && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-5">
                <div>
                  <span className="text-[10px] font-black text-[#0052ff] uppercase tracking-widest block">Customer Workspace</span>
                  <h2 className="text-xl font-black text-slate-900 mt-0.5">Install Script</h2>
                  <p className="text-xs text-slate-500 mt-1">Copy this script and paste it into your website's &lt;head&gt; or before &lt;/body&gt;.</p>
                </div>

                {/* Script block */}
                <div className="bg-[#0f172a] rounded-2xl p-5 border border-slate-800 space-y-4">
                  <div className="flex items-start gap-3">
                    <code className="font-mono text-xs text-blue-300 break-all flex-1 select-all leading-relaxed">
                      {installScript}
                    </code>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium">⚡ 2KB async loader — zero Core Web Vitals impact</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { navigator.clipboard.writeText(firstActiveKey?.key || ""); showToast("API key copied!"); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-[11px] rounded-lg border-none cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3" /> Copy API Key
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(installScript);
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2000);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] rounded-lg border-none cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                      >
                        {copiedScript ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Script</>}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Installation Instructions</h3>
                  {[
                    { step: 1, title: "Copy the script above", desc: "This lightweight script validates domain authorization before loading the accessibility widget." },
                    { step: 2, title: "Paste into your site", desc: "Add the script tag inside your website's <head> section or just before </body> on every page." },
                    { step: 3, title: "Widget loads automatically", desc: "Once installed, the widget appears for all visitors and adapts to your configured brand settings." },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#0052ff] text-white flex items-center justify-center text-[10px] font-black shrink-0">{s.step}</div>
                      <div>
                        <p className="text-xs font-black text-slate-800">{s.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right status cards */}
              <div className="space-y-3">
                {[
                  { label: "Domain Status", value: isVerified ? "Active" : "Pending", ok: isVerified, icon: Globe },
                  { label: "API Key Status", value: activeKeys.length > 0 ? `${activeKeys.length} Active` : "No active keys", ok: activeKeys.length > 0, icon: KeyRound },
                  { label: "Widget Status", value: isPublished ? "Published" : "Draft", ok: isPublished, icon: Package },
                  { label: "Last Seen", value: domain.verifiedAt ? new Date(domain.verifiedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never", ok: !!domain.verifiedAt, icon: Activity },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="p-4 bg-white border border-slate-200/80 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{card.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${card.ok ? "bg-emerald-500" : "bg-amber-400"}`} />
                        <span className="text-xs font-black text-slate-800">{card.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* --- USAGE TAB --- */}
          {activeTab === "usage" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-black text-slate-800">Usage Analytics</h3>
                <p className="text-xs text-slate-500 mt-0.5">Widget load events, visitor engagement, and feature usage for {domain.domain}.</p>
              </div>
              {loadingUsage ? (
                <div className="py-16 flex items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-bold">Loading usage data...</span>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Widget Loads", value: usageData?.totalWidgetLoads ?? 0, icon: Zap, color: "text-blue-600 bg-blue-50 border-blue-100" },
                      { label: "Unique Visitors", value: usageData?.uniqueVisitors ?? 0, icon: Monitor, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                      { label: "Page Views", value: usageData?.totalPageViews ?? 0, icon: Eye, color: "text-purple-600 bg-purple-50 border-purple-100" },
                      { label: "Mobile Sessions", value: usageData?.mobileSessions ?? 0, icon: Smartphone, color: "text-orange-600 bg-orange-50 border-orange-100" },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="p-4 bg-white border border-slate-200/80 rounded-2xl">
                          <div className={`w-8 h-8 rounded-xl border flex items-center justify-center mb-3 ${stat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-2xl font-black text-slate-900">{typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}</p>
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5">{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 text-center text-slate-400">
                    <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-xs font-bold">Detailed timeline charts and feature breakdown available in the full analytics dashboard.</p>
                    <p className="text-[10px] font-medium mt-1">Usage data refreshes every 24 hours.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- LOGS TAB --- */}
          {activeTab === "logs" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Access Logs</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Bootstrap requests, API calls, loader activity, errors, and audit events for {domain.domain}.</p>
                </div>
                <button
                  onClick={() => { setLoadingLogs(true); fetch("/api/audit-logs").then(r => r.json()).then(d => { setLogs(Array.isArray(d) ? d : []); setLoadingLogs(false); }).catch(() => setLoadingLogs(false)); }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>
              {loadingLogs ? (
                <div className="py-16 flex items-center justify-center gap-3 text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span className="text-xs font-bold">Loading logs...</span>
                </div>
              ) : logs.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-slate-200 rounded-2xl">
                  <List className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400">No activity logs found for this domain.</p>
                  <p className="text-[10px] text-slate-300 mt-1">Logs appear once the widget receives its first bootstrap request.</p>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <th className="px-5 py-3">Action</th>
                        <th className="px-5 py-3">Details</th>
                        <th className="px-5 py-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {logs.slice(0, 30).map((log: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3">
                            <span className="text-xs font-black text-slate-800">{log.action || "EVENT"}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs text-slate-500 font-medium">{typeof log.details === "object" ? JSON.stringify(log.details).slice(0, 60) : String(log.details || "—")}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs text-slate-400 font-medium">{log.createdAt ? new Date(log.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
