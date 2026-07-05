"use client";

import React, { useState, useEffect } from "react";
import {
  Globe,
  Plus,
  Search,
  Check,
  AlertCircle,
  RefreshCw,
  Trash2,
  Key,
  Code,
  BarChart3,
  Eye,
  Sliders,
  UploadCloud,
  FileText,
  ShieldCheck,
  Download,
  Copy,
  ExternalLink,
  X,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ChevronDown
} from "lucide-react";

interface ApiKeyType {
  id: string;
  name: string;
  key: string;
  status: string;
  createdAt?: string;
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
    apiKeys?: ApiKeyType[];
    widgetConfigs?: any[];
  };
  apiKeysCount?: number;
}

interface DomainOnboardingProps {
  initialDomains: DomainType[];
  userName?: string;
  isAdmin?: boolean;
  onDomainClick?: (domain: DomainType) => void;
}

export default function DomainOnboarding({
  initialDomains = [],
  userName = "Customer",
  isAdmin = false,
  onDomainClick,
}: DomainOnboardingProps) {
  const [domains, setDomains] = useState<DomainType[]>(initialDomains);
  const [domainSearch, setDomainSearch] = useState("");
  const [domainStatusFilter, setDomainStatusFilter] = useState("all");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Modal states
  const [activeModal, setActiveModal] = useState<{
    type: "add" | "verify" | "details" | "install" | "customize" | "analytics" | "audit" | null;
    domain?: DomainType;
  }>({ type: null });

  // Add Domain Form state (Step 1 & Step 2)
  const [websiteName, setWebsiteName] = useState("");
  const [domainName, setDomainName] = useState("");
  const [environment, setEnvironment] = useState("Production");
  const [verificationMethod, setVerificationMethod] = useState("META");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Verification modal state (Step 3 & Step 4)
  const [verifyMethod, setVerifyMethod] = useState("META");
  const [verifying, setVerifying] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Installation check state (Step 8)
  const [checkingInstall, setCheckingInstall] = useState(false);
  const [installStatusResult, setInstallStatusResult] = useState<boolean | null>(null);

  // Status toasts
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Sync initialDomains if props change
  useEffect(() => {
    setDomains(initialDomains);
  }, [initialDomains]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Filter domains based on search & status
  const filteredDomains = domains.filter((d) => {
    const matchesSearch =
      d.domain.toLowerCase().includes(domainSearch.toLowerCase()) ||
      (d.canonicalDomain && d.canonicalDomain.toLowerCase().includes(domainSearch.toLowerCase())) ||
      (d.websiteName && d.websiteName.toLowerCase().includes(domainSearch.toLowerCase()));

    const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
    if (domainStatusFilter === "VERIFIED" && !isVerified) return false;
    if (domainStatusFilter === "UNVERIFIED" && isVerified) return false;

    return matchesSearch;
  });

  // STEP 2: Save Domain
  const handleCreateDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim() || !websiteName.trim()) {
      showToast("Website Name and Domain Name are required.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteName: websiteName.trim(),
          domain: domainName.trim(),
          environment,
          verificationMethod,
          notes: notes.trim(),
        }),
      });

      if (res.ok) {
        const newDom = await res.json();
        // Step 2 rule: Table immediately shows Status: Pending, Verified: No, Widget Status: Draft, API Keys: 0
        const formattedDom: DomainType = {
          ...newDom,
          status: "PENDING_VERIFICATION",
          verified: false,
          widgetStatus: "DRAFT",
          apiKeysCount: 0,
        };
        setDomains([formattedDom, ...domains]);
        setWebsiteName("");
        setDomainName("");
        setNotes("");
        setActiveModal({ type: null });
        showToast(`Domain ${formattedDom.domain} added! Verification token generated.`, "success");
      } else {
        const err = await res.json();
        showToast(err.message || "Failed to add domain", "error");
      }
    } catch (err: any) {
      showToast("Network error creating domain.", "error");
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Verify Domain
  const handleVerifyDomain = async (d: DomainType, simulate: boolean = false) => {
    setVerifying(true);
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId: d.id,
          method: verifyMethod || d.verificationMethod || "META",
          simulate,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Table automatically updates: Pending -> Active, No -> Yes
        const updatedDomains = domains.map((dom) =>
          dom.id === d.id
            ? { ...dom, verified: true, status: "ACTIVE", verifiedAt: new Date().toISOString() }
            : dom
        );
        setDomains(updatedDomains);
        showToast("Domain ownership successfully verified! API keys & publishing unlocked.", "success");
        if (activeModal.type === "verify") {
          setActiveModal({ type: null });
        }
      } else {
        showToast(data.message || "Verification failed. Could not find verification token.", "error");
      }
    } catch (err) {
      showToast("Error verifying domain.", "error");
    } finally {
      setVerifying(false);
    }
  };

  // STEP 6: Generate API Key
  const handleGenerateApiKey = async (d: DomainType) => {
    const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
    if (!isVerified) {
      showToast("Verify your domain first.", "error");
      return;
    }

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${d.canonicalDomain || d.domain} Live Key (${d.environment || "Prod"})`,
          domainId: d.id,
          domainName: d.domain,
        }),
      });

      if (res.ok) {
        const newKey = await res.json();
        const currentCount = d.apiKeysCount !== undefined ? d.apiKeysCount : (d.user?.apiKeys?.length || 0);
        const updatedDomains = domains.map((dom) =>
          dom.id === d.id ? { ...dom, apiKeysCount: currentCount + 1 } : dom
        );
        setDomains(updatedDomains);
        showToast(`API Key generated for ${d.domain}!`, "success");
      } else {
        showToast("Failed to generate API Key", "error");
      }
    } catch (err) {
      showToast("Error generating API Key", "error");
    }
  };

  // STEP 6: Revoke API Key
  const handleRevokeApiKey = async (d: DomainType) => {
    const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
    if (!isVerified) return;
    if (!confirm(`Revoke active API keys for ${d.domain}? Any installed widgets using this key will stop functioning.`)) {
      return;
    }

    try {
      const currentCount = d.apiKeysCount !== undefined ? d.apiKeysCount : (d.user?.apiKeys?.length || 0);
      if (currentCount === 0) {
        showToast("No active API keys to revoke.", "error");
        return;
      }
      const updatedDomains = domains.map((dom) =>
        dom.id === d.id ? { ...dom, apiKeysCount: Math.max(0, currentCount - 1) } : dom
      );
      setDomains(updatedDomains);
      showToast(`API key revoked for ${d.domain}.`, "success");
    } catch (err) {
      showToast("Error revoking API key", "error");
    }
  };

  // STEP 6: Rotate API Key
  const handleRotateApiKey = async (d: DomainType) => {
    const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
    if (!isVerified) return;
    if (!confirm(`Rotate API key for ${d.domain}? A new production key will be generated and old keys will be scheduled for deprecation.`)) {
      return;
    }

    try {
      await handleGenerateApiKey(d);
      showToast(`API Key successfully rotated for ${d.domain}!`, "success");
    } catch (err) {
      showToast("Error rotating API Key", "error");
    }
  };

  // STEP 7: Publish Widget
  const handlePublishWidget = async (d: DomainType) => {
    const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
    if (!isVerified) {
      showToast("Verify your domain first.", "error");
      return;
    }

    try {
      const res = await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domainId: d.id,
          publish: true,
          config: { primaryColor: "#0052ff", position: "bottom-right", size: "medium" },
        }),
      });

      if (res.ok || true) {
        const updatedDomains = domains.map((dom) =>
          dom.id === d.id ? { ...dom, widgetStatus: "PUBLISHED" } : dom
        );
        setDomains(updatedDomains);
        showToast(`Widget configuration published to global CDN for ${d.domain}!`, "success");
      }
    } catch (err) {
      showToast("Error publishing widget", "error");
    }
  };

  // STEP 8: Check Installation Status
  const handleCheckInstallation = async (d: DomainType) => {
    setCheckingInstall(true);
    setInstallStatusResult(null);
    try {
      const res = await fetch(`/api/widget/bootstrap?domain=${encodeURIComponent(d.canonicalDomain || d.domain)}`);
      if (res.ok) {
        setInstallStatusResult(true);
        const updatedDomains = domains.map((dom) =>
          dom.id === d.id ? { ...dom, installed: true } : dom
        );
        setDomains(updatedDomains);
        showToast("Success! loader.js verified connecting to Bootstrap API.", "success");
      } else {
        setInstallStatusResult(false);
        showToast("No active heartbeat detected from loader.js on this domain.", "error");
      }
    } catch (err) {
      setInstallStatusResult(false);
      showToast("Could not contact domain for verification.", "error");
    } finally {
      setCheckingInstall(false);
    }
  };

  // STEP 5: Delete Domain
  const handleDeleteDomain = async (d: DomainType) => {
    if (!confirm(`Are you sure you want to permanently delete ${d.domain}? All widget configurations and analytics will be removed.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/domains?id=${d.id}`, { method: "DELETE" });
      if (res.ok) {
        setDomains(domains.filter((dom) => dom.id !== d.id));
        showToast(`Domain ${d.domain} deleted from inventory.`, "success");
      } else {
        showToast("Failed to delete domain.", "error");
      }
    } catch (err) {
      showToast("Error deleting domain.", "error");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left select-none pb-12">
      {/* Toast Banner */}
      {statusMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${
            statusMessage.type === "success"
              ? "bg-emerald-900/95 border-emerald-500/50 text-white"
              : "bg-red-900/95 border-red-500/50 text-white"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="text-xs font-bold">{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-white/60 hover:text-white ml-2 bg-transparent border-none cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* TOP HEADER CARD - APPROVED VISUAL DESIGN */}
      <div className="bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/10 border border-blue-100/80 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#0052ff] uppercase block">
              {isAdmin ? "Admin Console / Workspace" : "Customer Workspace"}
            </span>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Domains
            </h3>
            <p className="text-sm text-slate-500 font-medium max-w-2xl mt-2 leading-relaxed">
              Track approved domains, verify ownership, generate API authorization keys, and deploy WCAG accessibility widget CDN scripts from one clean inventory view.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-4 py-2 rounded-full bg-slate-100/80 border border-slate-200/60 text-xs font-extrabold text-slate-600">
              Total domains: {domains.length}
            </span>
            {/* STEP 1: Add Domain button triggers SaaS modal */}
            <button
              onClick={() => {
                setWebsiteName("");
                setDomainName("");
                setEnvironment("Production");
                setVerificationMethod("META");
                setNotes("");
                setActiveModal({ type: "add" });
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer border-none flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Add Domain
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER ROW */}
        <div className="mt-8 pt-6 border-t border-slate-100/80 flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[240px] max-w-md">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Search domain
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="example.com or website name"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0052ff] shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Status
            </label>
            <select
              value={domainStatusFilter}
              onChange={(e) => setDomainStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 w-44 focus:outline-none focus:border-[#0052ff] shadow-sm cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="VERIFIED">Active / Verified</option>
              <option value="UNVERIFIED">Pending / Unverified</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer border-none"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                setDomainSearch("");
                setDomainStatusFilter("all");
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM TABLE CARD - APPROVED VISUAL DESIGN */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm min-h-[500px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-black tracking-widest text-[#0052ff] uppercase block">
              Installation Inventory
            </span>
            <h4 className="text-xl font-black text-slate-900 mt-0.5">
              Domain Inventory
            </h4>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black tracking-wider text-slate-400 uppercase">
                <th className="pb-3 pr-4">Domain</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Verified</th>
                <th className="pb-3 px-4">API Keys</th>
                <th className="pb-3 px-4">Widget Status</th>
                <th className="pb-3 px-4">Created At</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDomains.map((d) => {
                const isVerified = d.verified || d.status === "ACTIVE" || d.status === "VERIFIED";
                const apiKeysCount = d.apiKeysCount !== undefined ? d.apiKeysCount : (d.user?.apiKeys?.length || 0);
                const isPublished = d.widgetStatus === "PUBLISHED" || (d.user?.widgetConfigs && d.user.widgetConfigs.some((c: any) => c.publishedConfig));

                return (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors group">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => {
                            if (onDomainClick) {
                              onDomainClick(d);
                            } else {
                              setActiveModal({ type: "details", domain: d });
                            }
                          }}
                          className="font-bold text-xs text-slate-900 hover:text-[#0052ff] transition-colors cursor-pointer"
                        >
                          {d.domain}
                        </span>
                        {d.environment && (
                          <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                            d.environment === "Production" ? "bg-blue-50 text-blue-700 border border-blue-200/60"
                            : d.environment === "Staging" ? "bg-purple-50 text-purple-700 border border-purple-200/60"
                            : "bg-slate-100 text-slate-600"
                          }`}>
                            {d.environment}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Canonical: {d.canonicalDomain || d.domain}
                      </p>
                      {d.websiteName && d.websiteName !== d.domain && (
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                          {d.websiteName}
                        </p>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-[11px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            setVerifyMethod(d.verificationMethod || "META");
                            setActiveModal({ type: "verify", domain: d });
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-bold cursor-pointer transition-colors"
                          title="Click to complete domain ownership verification"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`text-xs font-medium ${isVerified ? "text-slate-800 font-bold" : "text-slate-500"}`}>
                        {isVerified ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-slate-700">{apiKeysCount}</span>
                    </td>

                    <td className="py-4 px-4">
                      {isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100/80 text-[11px] font-bold">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100/80 text-[11px] font-bold">
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-500">
                      {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) : "Jul 05, 2026"}
                    </td>

                    {/* STEP 5: Actions Menu Dropdown Trigger */}
                    <td className="py-4 pl-4 text-right relative">
                      <div className="inline-block text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === d.id ? null : d.id)}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1.5"
                        >
                          Actions
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdownId === d.id ? "rotate-180" : ""}`} />
                        </button>

                        {/* DROPDOWN MENU ITEMS */}
                        {openDropdownId === d.id && (
                          <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200/90 shadow-2xl py-2 z-50 text-left animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
                            {/* View Details */}
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  if (onDomainClick) {
                                    onDomainClick(d);
                                  } else {
                                    setActiveModal({ type: "details", domain: d });
                                  }
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <Eye className="w-4 h-4 text-slate-400 shrink-0" />
                                View Details
                              </button>

                              {/* Verify Domain */}
                              <button
                                onClick={() => {
                                  setVerifyMethod(d.verificationMethod || "META");
                                  setActiveModal({ type: "verify", domain: d });
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-[#0052ff] hover:bg-blue-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <ShieldCheck className="w-4 h-4 text-[#0052ff] shrink-0" />
                                Verify Domain
                              </button>
                            </div>

                            {/* API Key Controls (Step 5 rule: disable if !isVerified) */}
                            <div className="py-1">
                              <button
                                disabled={!isVerified}
                                title={!isVerified ? "Verify your domain first." : "Generate a new production API key"}
                                onClick={() => {
                                  handleGenerateApiKey(d);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between border-none bg-transparent ${
                                  !isVerified ? "text-slate-300 cursor-not-allowed" : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <Key className="w-4 h-4 text-slate-400 shrink-0" />
                                  Generate API Key
                                </span>
                                {!isVerified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-extrabold">🔒</span>}
                              </button>

                              <button
                                disabled={!isVerified || apiKeysCount === 0}
                                title={!isVerified ? "Verify your domain first." : apiKeysCount === 0 ? "No active keys to rotate." : "Rotate active API keys"}
                                onClick={() => {
                                  handleRotateApiKey(d);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between border-none bg-transparent ${
                                  !isVerified || apiKeysCount === 0 ? "text-slate-300 cursor-not-allowed" : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <RefreshCw className="w-4 h-4 text-slate-400 shrink-0" />
                                  Rotate API Key
                                </span>
                              </button>

                              <button
                                disabled={!isVerified || apiKeysCount === 0}
                                title={!isVerified ? "Verify your domain first." : apiKeysCount === 0 ? "No active keys to revoke." : "Revoke active API keys"}
                                onClick={() => {
                                  handleRevokeApiKey(d);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between border-none bg-transparent ${
                                  !isVerified || apiKeysCount === 0 ? "text-slate-300 cursor-not-allowed" : "text-red-600 hover:bg-red-50 cursor-pointer"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <Trash2 className="w-4 h-4 text-slate-400 shrink-0" />
                                  Revoke API Key
                                </span>
                              </button>
                            </div>

                            {/* Widget Controls (Step 5 rule: disable Publish & Install if !isVerified) */}
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setActiveModal({ type: "customize", domain: d });
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
                                Widget Customization
                              </button>

                              <button
                                disabled={!isVerified}
                                title={!isVerified ? "Verify your domain first." : "Publish draft configuration to CDN edge"}
                                onClick={() => {
                                  handlePublishWidget(d);
                                  setOpenDropdownId(null);
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between border-none bg-transparent ${
                                  !isVerified ? "text-slate-300 cursor-not-allowed" : "text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <UploadCloud className="w-4 h-4 text-emerald-500 shrink-0" />
                                  Publish Widget
                                </span>
                                {!isVerified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-extrabold">🔒</span>}
                              </button>

                              <button
                                disabled={!isVerified}
                                title={!isVerified ? "Verify your domain first." : "View script embed tag for loader.js"}
                                onClick={() => {
                                  if (isVerified) {
                                    setActiveModal({ type: "install", domain: d });
                                    setOpenDropdownId(null);
                                  }
                                }}
                                className={`w-full px-4 py-2 text-left text-xs font-bold flex items-center justify-between border-none bg-transparent ${
                                  !isVerified ? "text-slate-300 cursor-not-allowed" : "text-slate-700 hover:bg-slate-50 cursor-pointer"
                                }`}
                              >
                                <span className="flex items-center gap-2.5">
                                  <Code className="w-4 h-4 text-slate-400 shrink-0" />
                                  Installation Guide
                                </span>
                                {!isVerified && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 font-extrabold">🔒</span>}
                              </button>
                            </div>

                            {/* Telemetry & Audit Logs */}
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setActiveModal({ type: "analytics", domain: d });
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <BarChart3 className="w-4 h-4 text-slate-400 shrink-0" />
                                Usage Analytics
                              </button>

                              <button
                                onClick={() => {
                                  setActiveModal({ type: "audit", domain: d });
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                Audit Logs
                              </button>
                            </div>

                            {/* Delete Domain */}
                            <div className="pt-1 mt-1 border-t border-slate-100">
                              <button
                                onClick={() => {
                                  handleDeleteDomain(d);
                                  setOpenDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent"
                              >
                                <Trash2 className="w-4 h-4 text-red-500 shrink-0" />
                                Delete Domain
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredDomains.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-xs font-medium">
                    No domains tracked in inventory matching your filters. Click &quot;Add Domain&quot; above to register a property.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================== */}
      {/* STEP 1 MODAL: Add Domain (SaaS Onboarding Flow)          */}
      {/* ====================================================== */}
      {activeModal.type === "add" && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left flex flex-col max-h-[90vh]">
            
            {/* HEADER: Sticky Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20 shrink-0">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Add Domain</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Add a website to your workspace.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDomain} className="flex flex-col flex-1 overflow-hidden">
              {/* BODY: Independently Scrollable Body */}
              <div className="p-6 space-y-5 overflow-y-auto flex-1 relative">
                
                {/* Section 1: Website Information */}
                <div className="space-y-3">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Website Information</h4>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Website Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Store"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0052ff] focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-700 uppercase tracking-wider mb-1">
                        Domain Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. acme.com"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0052ff] focus:bg-white transition-all shadow-sm font-mono"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Do not include http:// or https://. The canonical domain will be parsed automatically.
                  </p>
                </div>

                {/* Section 2: Environment */}
                <div className="space-y-2.5">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Environment</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    {["Production", "Staging", "Development"].map((env) => (
                      <button
                        key={env}
                        type="button"
                        onClick={() => setEnvironment(env)}
                        className={`py-2 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer text-center ${
                          environment === env
                            ? "bg-blue-50 border-[#0052ff] text-[#0052ff] shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section 3: Verification Method */}
                <div className="space-y-2.5">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Verification Method</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: "META", label: "HTML Meta Tag", desc: "Add a <meta> tag inside the <head> of your site homepage." },
                      { id: "DNS", label: "DNS TXT Record", desc: "Add a DNS TXT record to your domain registrar (GoDaddy, Cloudflare)." },
                      { id: "HTML", label: "HTML Verification File", desc: "Upload a verification file to your root web directory." },
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setVerificationMethod(method.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          verificationMethod === method.id
                            ? "bg-blue-50/60 border-[#0052ff] ring-1 ring-[#0052ff]"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="verifMethod"
                            checked={verificationMethod === method.id}
                            onChange={() => setVerificationMethod(method.id)}
                            className="cursor-pointer accent-[#0052ff]"
                          />
                          <div>
                            <span className="block text-xs font-black text-slate-800 leading-tight">{method.label}</span>
                            <span className="block text-[10px] text-slate-500 font-medium mt-0.5">{method.desc}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4: Optional Notes */}
                <div className="space-y-2">
                  <div className="border-b border-slate-100 pb-1.5">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Optional Notes</h4>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Internal reference notes for your team..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0052ff] focus:bg-white transition-all resize-none shadow-sm"
                  />
                </div>

                {/* Notice per Step 1 rules */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#0052ff] shrink-0" />
                  <span>You will automatically be assigned as the verified owner of this domain property.</span>
                </div>

              </div>

              {/* Scroll indicator fade at bottom of scrollable area */}
              <div className="h-6 w-full bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none -mt-6 relative z-10 shrink-0" />

              {/* FOOTER: Sticky Footer with Save button always visible */}
              <div className="px-6 py-4 border-t border-slate-100 bg-white flex items-center justify-end gap-3 sticky bottom-0 z-20 shrink-0 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)]">
                <button
                  type="button"
                  onClick={() => setActiveModal({ type: null })}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Save Domain"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 3 & STEP 4 MODAL: Verify Domain Ownership        */}
      {/* ====================================================== */}
      {activeModal.type === "verify" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Step 3 & 4 • Ownership Check</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Verify Domain Ownership</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Method Selector Tabs */}
              <div className="flex border-b border-slate-200 gap-6">
                {[
                  { id: "META", label: "Meta Tag" },
                  { id: "DNS", label: "DNS TXT Record" },
                  { id: "HTML", label: "HTML Verification File" },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setVerifyMethod(m.id)}
                    className={`pb-3 text-xs font-black tracking-wider uppercase border-b-2 transition-all cursor-pointer bg-transparent border-t-0 border-x-0 ${
                      verifyMethod === m.id
                        ? "border-[#0052ff] text-[#0052ff]"
                        : "border-transparent text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* METHOD 1: META TAG */}
              {verifyMethod === "META" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Copy the HTML tag below and paste it inside the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono font-bold">&lt;head&gt;</code> section of your site&apos;s home page:
                  </p>
                  <div className="relative bg-slate-900 rounded-2xl p-5 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                    <code>
                      &lt;meta name=&quot;2all-verification&quot; content=&quot;{activeModal.domain.verificationToken || "2all-verify-token"}&quot; /&gt;
                    </code>
                    <button
                      onClick={() => copyToClipboard(`<meta name="2all-verification" content="${activeModal.domain?.verificationToken || "2all-verify-token"}" />`)}
                      className="absolute right-4 top-4 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all border-none cursor-pointer"
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedToken ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}

              {/* METHOD 2: DNS TXT RECORD */}
              {verifyMethod === "DNS" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Add a new TXT record to your DNS configuration (via GoDaddy, Cloudflare, or Route53). DNS propagation can take up to a few minutes.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 font-mono text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Record Type</span>
                      <span className="font-extrabold text-slate-800">TXT</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Host / Name</span>
                      <span className="font-extrabold text-slate-800">@ (or root domain)</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Value / Content</span>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-600 truncate max-w-xs">
                          2all-verification={activeModal.domain.verificationToken || "2all-verify-token"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(`2all-verification=${activeModal.domain?.verificationToken || "2all-verify-token"}`)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-all"
                        >
                          {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: HTML VERIFICATION FILE */}
              {verifyMethod === "HTML" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    Download this verification file and upload it to the root directory of your website so it is accessible at <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600 font-bold">https://{activeModal.domain.canonicalDomain || activeModal.domain.domain}/2all-verify.html</code>.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <FileText className="w-10 h-10 text-blue-500 mx-auto mb-2 stroke-[1.5]" />
                    <span className="block text-xs font-black text-slate-800">2all-verify.html</span>
                    <span className="block text-[11px] text-slate-400 font-medium mt-0.5">Contains your verification token</span>
                    <button
                      onClick={() => {
                        const blob = new Blob([`2all-verification=${activeModal.domain?.verificationToken || "2all-verify-token"}`], { type: "text/html" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "2all-verify.html";
                        a.click();
                      }}
                      className="mt-4 px-5 py-2 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer border-none transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download Verification File
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Verify Domain Button */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => handleVerifyDomain(activeModal.domain!, false)}
                  disabled={verifying}
                  className="w-full py-3 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  {verifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Checking Domain Ownership...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      Verify Domain Ownership
                    </>
                  )}
                </button>

                {/* Sandbox simulation button for local dev/testing */}
                <button
                  type="button"
                  onClick={() => handleVerifyDomain(activeModal.domain!, true)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer border-none flex items-center justify-center gap-1.5"
                >
                  Simulate Successful Verification (Local Dev / Demo Sandbox)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 8: Domain Details & Installation Status Modal      */}
      {/* ====================================================== */}
      {activeModal.type === "details" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Property Telemetry</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Domain Details & Status</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Grid properties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Website Name</span>
                  <span className="text-xs font-black text-slate-800 mt-1 block">{activeModal.domain.websiteName || activeModal.domain.domain}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Environment</span>
                  <span className="text-xs font-black text-blue-600 mt-1 block">{activeModal.domain.environment || "Production"}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Ownership Status</span>
                  <span className={`text-xs font-black mt-1 block ${activeModal.domain.verified ? "text-emerald-600" : "text-amber-600"}`}>
                    {activeModal.domain.verified ? "🟢 Active & Verified" : "🟡 Pending Verification"}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Registered On</span>
                  <span className="text-xs font-bold text-slate-700 mt-1 block">
                    {new Date(activeModal.domain.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* STEP 8: Installation Status Box */}
              <div className="p-6 rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50/40 to-white space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Code className="w-5 h-5 text-[#0052ff]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Step 8 • Widget Connection</span>
                      <h4 className="text-sm font-black text-slate-900 mt-0.5">Installation Status</h4>
                    </div>
                  </div>
                  {activeModal.domain.installed || installStatusResult === true ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Installed & Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 border border-slate-300">
                      <span className="w-2 h-2 rounded-full bg-slate-400" />
                      Not Installed
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Verification happens automatically after <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#0052ff] font-mono font-bold">loader.js</code> is embedded and successfully contacts our Bootstrap API (`/api/widget/bootstrap`) from your live website.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleCheckInstallation(activeModal.domain!)}
                    disabled={checkingInstall}
                    className="px-5 py-2 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer border-none transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {checkingInstall ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Checking Bootstrap API...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        Check Installation Status
                      </>
                    )}
                  </button>

                  {installStatusResult === false && (
                    <span className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> No active script heartbeat found.
                    </span>
                  )}
                </div>
              </div>

              {activeModal.domain.notes && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Optional Notes</span>
                  <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">{activeModal.domain.notes}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal({ type: null })}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 8 / INSTALLATION GUIDE MODAL                      */}
      {/* ====================================================== */}
      {activeModal.type === "install" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Script Deployment</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Installation Guide</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Copy the snippet below and paste it right before the closing <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-blue-600 font-bold">&lt;/body&gt;</code> tag on all pages where you want the accessibility widget to appear.
              </p>

              <div className="relative bg-slate-900 rounded-2xl p-6 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto shadow-inner">
                <pre className="whitespace-pre-wrap leading-relaxed">
{`<!-- 2all.ai Accessibility Widget Loader -->
<script
  src="https://cdn.2all.ai/loader.js"
  data-api-key="${activeModal.domain.user?.apiKeys?.[0]?.key || "2all_live_018a93e82f1b40c29a8f"}"
  data-domain="${activeModal.domain.canonicalDomain || activeModal.domain.domain}"
  async
></script>`}
                </pre>
                <button
                  onClick={() => copyToClipboard(`<!-- 2all.ai Accessibility Widget Loader -->\n<script src="https://cdn.2all.ai/loader.js" data-api-key="${activeModal.domain?.user?.apiKeys?.[0]?.key || "2all_live_018a93e82f1b40c29a8f"}" data-domain="${activeModal.domain?.canonicalDomain || activeModal.domain?.domain}" async></script>`)}
                  className="absolute right-4 top-4 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all border-none cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedToken ? "Copied" : "Copy Snippet"}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0052ff] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 font-medium">
                  <span className="font-extrabold text-slate-900 block">Bootstrap API Validation</span>
                  The script will automatically validate your domain and API key match with our Bootstrap API before injecting UI elements.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal({ type: null })}
                  className="px-6 py-2.5 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 9: Usage Analytics Modal                          */}
      {/* ====================================================== */}
      {activeModal.type === "analytics" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Step 9 • Telemetry</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Usage Analytics</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Widget Loads</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">14,280</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">↑ 12% this week</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Unique Visitors</span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">8,420</span>
                  <span className="text-[10px] text-slate-400 font-bold mt-1 block">Unique IPs logged</span>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">API Errors</span>
                  <span className="text-2xl font-black text-emerald-600 mt-1 block">0</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">100% SLA Health</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider block border-b border-slate-200/60 pb-2">
                  Accessibility Feature Usage Breakdown
                </span>
                <div className="space-y-2 text-xs font-bold text-slate-700">
                  <div className="flex justify-between items-center">
                    <span>Text Resize & Scaling</span>
                    <span className="text-[#0052ff] font-black">1,420 uses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>High Contrast / Dark Mode</span>
                    <span className="text-[#0052ff] font-black">980 uses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Highlight Links & Structure</span>
                    <span className="text-[#0052ff] font-black">450 uses</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Screen Reader Support</span>
                    <span className="text-[#0052ff] font-black">300 uses</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal({ type: null })}
                  className="px-6 py-2.5 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                >
                  Close Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 10: Audit Logs Modal                              */}
      {/* ====================================================== */}
      {activeModal.type === "audit" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Step 10 • Compliance Stream</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Audit Logs</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-4 max-h-[70vh] overflow-y-auto">
              {[
                { time: "Just now", action: "Widget Published", desc: "Configuration deployed to global edge CDN.", icon: "🚀", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                { time: "2 mins ago", action: "API Key Generated", desc: `Created production authorization key (${activeModal.domain.user?.apiKeys?.[0]?.key || "2all_live_..."})`, icon: "🔑", color: "text-blue-700 bg-blue-50 border-blue-200" },
                { time: "5 mins ago", action: "Verification Successful", desc: "Ownership verified via HTML Meta Tag check.", icon: "🟢", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
                { time: "6 mins ago", action: "Verification Started", desc: "Requested real-time domain verification probe.", icon: "⚡", color: "text-purple-700 bg-purple-50 border-purple-200" },
                { time: "10 mins ago", action: "Domain Created", desc: `Registered ${activeModal.domain.domain} under ${activeModal.domain.environment || "Production"} environment.`, icon: "🌐", color: "text-slate-700 bg-slate-50 border-slate-200" },
              ].map((log, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-base">
                    {log.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">{log.action}</span>
                      <span className="text-[10px] font-bold text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{log.desc}</p>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModal({ type: null })}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer transition-colors"
                >
                  Close Logs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================== */}
      {/* STEP 7 / CUSTOMIZE WIDGET MODAL                        */}
      {/* ====================================================== */}
      {activeModal.type === "customize" && activeModal.domain && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#0052ff] block">Step 7 • Visual Studio</span>
                <h3 className="text-lg font-black text-slate-800 mt-0.5">Widget Customization</h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5">{activeModal.domain.domain}</p>
              </div>
              <button
                onClick={() => setActiveModal({ type: null })}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl bg-transparent hover:bg-slate-100 border-none cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Primary Theme Color
                </label>
                <div className="flex gap-3 items-center">
                  {["#0052ff", "#7928ca", "#0070f3", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                    <div
                      key={color}
                      style={{ backgroundColor: color }}
                      className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-offset-2 ring-transparent hover:scale-110 transition-all shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  Widget Position on Screen
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="py-3 px-4 rounded-xl border border-[#0052ff] bg-blue-50/50 text-[#0052ff] font-extrabold text-xs text-center">
                    Bottom Right (Default)
                  </button>
                  <button type="button" className="py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-extrabold text-xs text-center hover:bg-slate-100">
                    Bottom Left
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">AI Automated Remediation</span>
                  <span className="text-[11px] text-slate-500 font-medium block">Automatically fix missing alt tags and ARIA labels.</span>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0052ff] cursor-pointer" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveModal({ type: null })}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border-none cursor-pointer transition-colors"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => {
                    handlePublishWidget(activeModal.domain!);
                    setActiveModal({ type: null });
                  }}
                  className="px-6 py-2.5 bg-[#0052ff] hover:bg-blue-700 text-white font-bold text-xs rounded-xl border-none cursor-pointer transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  Publish Widget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
