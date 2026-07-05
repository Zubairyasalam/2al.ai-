"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Copy, 
  Check, 
  ChevronDown, 
  RefreshCw, 
  Trash2, 
  Activity, 
  Code2, 
  KeyRound,
  ShieldCheck
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: string;
  domainId?: string | null;
  domainName?: string | null;
  createdAt: string;
  lastUsedAt?: string;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

interface Domain {
  id: string;
  domain: string;
  websiteName?: string;
  status: string;
  verified?: boolean;
}

export default function AdminApiKeysPanel() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form state
  const [selectedDomainId, setSelectedDomainId] = useState<string>("");
  const [keyLabel, setKeyLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  // Action state
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [rotatingId, setRotatingId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [keysRes, domainsRes] = await Promise.all([
        fetch("/api/api-keys"),
        fetch("/api/domains")
      ]);
      if (keysRes.ok) {
        const keysData = await keysRes.json();
        setKeys(keysData);
      }
      if (domainsRes.ok) {
        const domainsData = await domainsRes.json();
        setDomains(domainsData);
      }
    } catch (e) {
      console.error("Failed to fetch API keys or domains:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyLabel.trim()) return;

    try {
      setIsCreating(true);
      const selectedDom = domains.find(d => d.id === selectedDomainId);
      
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: keyLabel.trim(),
          domainId: selectedDomainId || null,
          domainName: selectedDom ? selectedDom.domain : null
        }),
      });

      if (res.ok) {
        const newKey = await res.json();
        setKeys([newKey, ...keys]);
        setKeyLabel("");
        setSelectedDomainId("");
      } else {
        const errData = await res.json().catch(() => null);
        alert(errData?.message || "Failed to create API key");
      }
    } catch (e) {
      console.error("Failed to create key:", e);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setActiveDropdownId(null);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyScript = (id: string, keyStr: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://2all.in";
    const script = `<script src="${origin}/loader.js?key=${keyStr}" async></script>`;
    navigator.clipboard.writeText(script);
    setCopiedScriptId(id);
    setActiveDropdownId(null);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  const handleRotateKey = async (id: string) => {
    if (!confirm("Rotate this API key? The existing key will be revoked immediately and replaced with a new production key.")) {
      return;
    }
    try {
      setRotatingId(id);
      const res = await fetch(`/api/api-keys/${id}/rotate`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setKeys([
          data.newKey,
          ...keys.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k)),
        ]);
        setActiveDropdownId(null);
      }
    } catch (e) {
      console.error("Failed to rotate key:", e);
    } finally {
      setRotatingId(null);
    }
  };

  const handleRevokeKey = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Any accessibility widget using this key will immediately stop working.")) {
      return;
    }
    try {
      const res = await fetch(`/api/api-keys/${id}/revoke`, { method: "POST" });
      if (res.ok) {
        setKeys(keys.map((k) => (k.id === id ? { ...k, status: "REVOKED" } : k)));
        setActiveDropdownId(null);
      }
    } catch (e) {
      console.error("Failed to revoke key:", e);
    }
  };

  const filteredKeys = keys.filter(k => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      k.name.toLowerCase().includes(q) ||
      k.key.toLowerCase().includes(q) ||
      (k.domainName && k.domainName.toLowerCase().includes(q)) ||
      k.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 select-none font-sans">
      
      {/* Top Header & Status Badges matching DomainOnboarding style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#0052ff] uppercase tracking-widest block mb-1">
            Admin Console / Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            API Keys Suite
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xl mt-1">
            Manage platform-wide installation keys, domain bindings, and script loaders across all customers with unlimited domain selection.
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-700 tracking-wide">Secure tenant isolation</span>
          </div>
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-full flex items-center gap-1.5 shadow-2xs">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] font-bold text-slate-700 tracking-wide">Live widget telemetry</span>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input 
          type="text"
          placeholder="Search customers, domains, API keys, reports, and settings"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-sm transition-all"
        />
      </div>

      {/* Two Column Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Card: Issue API Key Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
              Issue a new public installation key for any domain on the platform. As an Admin, there are no domain restrictions.
            </p>

            <form onSubmit={handleCreateKey} id="create-admin-key-form" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Domain (All Customers)
                </label>
                <div className="relative">
                  <select 
                    value={selectedDomainId}
                    onChange={(e) => setSelectedDomainId(e.target.value)}
                    className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs appearance-none cursor-pointer pr-9"
                  >
                    <option value="">Select any domain</option>
                    {domains.map((dom) => (
                      <option key={dom.id} value={dom.id}>
                        {dom.domain} {dom.status !== "ACTIVE" && dom.status !== "VERIFIED" ? `(${dom.status})` : ""}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Key label
                </label>
                <input 
                  type="text"
                  placeholder="Production install key"
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>
            </form>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              form="create-admin-key-form"
              disabled={isCreating || !keyLabel.trim()}
              className="px-6 py-3 bg-[#0052ff] hover:bg-[#0042cc] disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/25 transition-all cursor-pointer flex items-center gap-2 border-none uppercase tracking-wider"
            >
              {isCreating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create API Key"
              )}
            </button>
          </div>
        </div>

        {/* Right Card: Rules & Instructions */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between gap-3.5">
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            Paste the script before the closing &apos;body&apos; tag or in the &apos;head&apos; section.
          </div>
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            Keys are public on approved sites, but should not be reused on unapproved domains.
          </div>
          <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            If the key, domain, tenant, or widget status does not match later validation rules, the widget will fail silently.
          </div>
        </div>
      </div>

      {/* API Keys Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-xs font-semibold">
            Loading platform API keys...
          </div>
        ) : filteredKeys.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-14 h-14 bg-blue-50 text-[#0052ff] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <KeyRound className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-1">No API Keys Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create a new public installation key above to link any customer domain and unlock the embed script.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">PUBLIC KEY</th>
                  <th className="py-4 px-6">CUSTOMER</th>
                  <th className="py-4 px-6">DOMAIN</th>
                  <th className="py-4 px-6">STATUS</th>
                  <th className="py-4 px-6">LAST USED</th>
                  <th className="py-4 px-6">CREATED</th>
                  <th className="py-4 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Public Key & Label */}
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-2">
                        {k.key}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 mt-0.5">
                        {k.name}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {k.user?.name || k.user?.email || "Demo Customer"}
                    </td>

                    {/* Domain Link */}
                    <td className="py-4 px-6">
                      {k.domainName ? (
                        <a 
                          href={`http://${k.domainName}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-bold text-[#0052ff] hover:underline flex items-center gap-1"
                        >
                          {k.domainName}
                        </a>
                      ) : (
                        <span className="text-slate-400 font-medium">All domains</span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      {k.status === "ACTIVE" && (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200/60 rounded-full text-[11px] font-bold inline-block">
                          Active
                        </span>
                      )}
                      {k.status === "REVOKED" && (
                        <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200/60 rounded-full text-[11px] font-bold inline-block">
                          Revoked
                        </span>
                      )}
                      {k.status === "EXPIRED" && (
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-200/60 rounded-full text-[11px] font-bold inline-block">
                          Expired
                        </span>
                      )}
                    </td>

                    {/* Last Used */}
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : "Never"}
                    </td>

                    {/* Created */}
                    <td className="py-4 px-6 text-slate-500 font-medium whitespace-nowrap">
                      {new Date(k.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </td>

                    {/* Action Dropdown */}
                    <td className="py-4 px-6 text-right relative">
                      <div className="inline-block relative" ref={activeDropdownId === k.id ? dropdownRef : null}>
                        <button 
                          type="button"
                          onClick={() => setActiveDropdownId(activeDropdownId === k.id ? null : k.id)}
                          className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer ml-auto"
                        >
                          Actions
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdownId === k.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-2 z-30 text-left animate-in fade-in zoom-in-95 duration-150">
                            
                            <button
                              type="button"
                              onClick={() => handleCopyKey(k.id, k.key)}
                              className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left"
                            >
                              {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                              Copy API Key
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyScript(k.id, k.key)}
                              className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left"
                            >
                              {copiedScriptId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Code2 className="w-3.5 h-3.5 text-slate-400" />}
                              Copy Install Script
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRotateKey(k.id)}
                              disabled={k.status !== "ACTIVE" || rotatingId === k.id}
                              className={`w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left ${k.status !== "ACTIVE" ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${rotatingId === k.id ? "animate-spin" : ""}`} />
                              Rotate API Key
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRevokeKey(k.id)}
                              disabled={k.status !== "ACTIVE"}
                              className={`w-full px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left ${k.status !== "ACTIVE" ? "opacity-40 pointer-events-none" : ""}`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-amber-500" />
                              Revoke API Key
                            </button>

                            <div className="h-px bg-slate-100 my-1" />

                            <button
                              type="button"
                              onClick={() => {
                                setActiveDropdownId(null);
                                window.location.href = `/dashboard/reports?domain=${encodeURIComponent(k.domainName || "")}`;
                              }}
                              className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer border-none bg-transparent text-left"
                            >
                              <Activity className="w-3.5 h-3.5 text-blue-500" />
                              View Usage
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Title */}
      <p className="text-center text-xs text-slate-400 font-bold tracking-wide">
        Admin Console: Generate and manage API keys across all domains
      </p>

      {/* Toast notifications */}
      {(copiedId || copiedScriptId) && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          {copiedScriptId ? "Install script copied to clipboard!" : "API key copied to clipboard!"}
        </div>
      )}

    </div>
  );
}
