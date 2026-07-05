"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Code, Sparkles, Maximize2, Minimize2, Globe, ShieldCheck, AlertCircle, RefreshCw, Eye, Palette, Layout, Sliders, Save, Send, ShieldAlert } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: string;
}

interface Domain {
  id: string;
  domain: string;
  verificationToken: string;
  status: string;
}

export default function InstallCodeBlock({ domain }: { domain: string }) {
  const [activeTab, setActiveTab] = useState<"install" | "customize" | "domain">("install");
  const [copied, setCopied] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Live Data State
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>(domain || "example.com");
  const [newDomainInput, setNewDomainInput] = useState("");

  // Status & Verification State
  const [installStatus, setInstallStatus] = useState<"IDLE" | "CHECKING" | "VERIFIED" | "PENDING">("IDLE");
  const [installDetails, setInstallDetails] = useState<any>(null);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);

  // Customization State
  const [config, setConfig] = useState({
    primaryColor: "#2563eb",
    position: "bottom-right",
    size: "medium",
    enabledTools: ["text-resize", "high-contrast", "dark-mode", "highlight-links", "readable-font", "screen-reader"],
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // Fetch API Keys
      const keysRes = await fetch("/api/api-keys");
      if (keysRes.ok) {
        const keysData: ApiKey[] = await keysRes.json();
        const activeKeys = keysData.filter((k) => k.status === "ACTIVE");
        setApiKeys(activeKeys);
        if (activeKeys.length > 0 && !selectedKey) {
          setSelectedKey(activeKeys[0].key);
        }
      }

      // Fetch Domains
      const domsRes = await fetch("/api/domains");
      if (domsRes.ok) {
        const domsData: Domain[] = await domsRes.json();
        setDomains(domsData);
        if (domsData.length > 0) {
          setSelectedDomain(domsData[0].domain);
        }
      }

      // Fetch Widget Config
      const confRes = await fetch("/api/widget-config");
      if (confRes.ok) {
        const confData = await confRes.json();
        if (confData.draftConfig && Object.keys(confData.draftConfig).length > 0) {
          setConfig((prev) => ({ ...prev, ...confData.draftConfig }));
        }
      }
    } catch (e) {
      console.error("Error loading widget data:", e);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomainInput.trim() }),
      });
      if (res.ok) {
        const newDom = await res.json();
        setDomains([newDom, ...domains]);
        setSelectedDomain(newDom.domain);
        setNewDomainInput("");
      } else {
        const err = await res.json();
        alert(err.message || "Failed to register domain");
      }
    } catch (e) {
      console.error("Error adding domain:", e);
    }
  };

  const handleVerifyDomain = async (domainId: string, simulate = false) => {
    try {
      setVerifyingDomainId(domainId);
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domainId, simulate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setDomains(domains.map((d) => (d.id === domainId ? { ...d, status: "VERIFIED" } : d)));
      } else {
        alert(data.message || "Domain verification failed. Make sure the meta tag is present on your site.");
      }
    } catch (e) {
      console.error("Error verifying domain:", e);
    } finally {
      setVerifyingDomainId(null);
    }
  };

  const handleCheckInstall = async () => {
    try {
      setInstallStatus("CHECKING");
      const res = await fetch("/api/widget/verify-install", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: selectedDomain }),
      });
      const data = await res.json();
      if (res.ok) {
        setInstallStatus(data.status);
        setInstallDetails(data);
      } else {
        setInstallStatus("PENDING");
      }
    } catch (e) {
      setInstallStatus("PENDING");
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSavingConfig(true);
      await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftConfig: config }),
      });
    } catch (e) {
      console.error("Failed to save draft:", e);
    } finally {
      setSavingConfig(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setPublishSuccess(false);
      // Save draft first
      await fetch("/api/widget-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftConfig: config }),
      });
      // Then publish
      const res = await fetch("/api/widget-config/publish", { method: "POST" });
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => setPublishSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to publish config:", e);
    } finally {
      setPublishing(false);
    }
  };

  const currentKey = selectedKey || (apiKeys.length > 0 ? apiKeys[0].key : "2all_live_YOUR_API_KEY");
  const originUrl = typeof window !== "undefined" ? window.location.origin : "https://cdn.2all.ai";

  const codeSnippet = `<script src="${originUrl}/loader.js" data-api-key="${currentKey}" data-domain="${selectedDomain}" async></script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="space-y-6 select-none bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 pt-2 gap-2">
        <button
          onClick={() => setActiveTab("install")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px focus:outline-none ${
            activeTab === "install" ? "border-blue-600 text-blue-600 bg-white rounded-t-xl" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Code className="w-4 h-4 stroke-[2.5]" />
          1. Install Snippet
        </button>
        <button
          onClick={() => setActiveTab("domain")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px focus:outline-none ${
            activeTab === "domain" ? "border-blue-600 text-blue-600 bg-white rounded-t-xl" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Globe className="w-4 h-4 stroke-[2.5]" />
          2. Domain Verification
        </button>
        <button
          onClick={() => setActiveTab("customize")}
          className={`flex items-center gap-2 px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px focus:outline-none ${
            activeTab === "customize" ? "border-blue-600 text-blue-600 bg-white rounded-t-xl" : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          3. Customize & Publish
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {activeTab === "install" ? (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 font-black">
                  🔑
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select API Key</label>
                  {apiKeys.length > 0 ? (
                    <select
                      value={selectedKey}
                      onChange={(e) => setSelectedKey(e.target.value)}
                      className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none cursor-pointer mt-0.5 border-none"
                    >
                      {apiKeys.map((k) => (
                        <option key={k.id} value={k.key}>
                          {k.name} ({k.key.slice(0, 15)}...)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-xs font-bold text-amber-600">No active keys. Create one in API Keys tab.</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 font-black">
                  🌐
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Target Domain</label>
                  <input
                    type="text"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    placeholder="example.com"
                    className="bg-transparent text-slate-800 text-xs font-bold focus:outline-none w-36 border-none mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Quick installation guide */}
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800">Copy the dynamic loader snippet</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    This lightweight asynchronous script validates domain authorization before loading the widget.
                  </p>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between gap-4">
                  <code className="font-mono text-xs text-blue-300 truncate flex-1 text-left select-all">
                    {codeSnippet}
                  </code>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400 font-medium">
                    ⚡ 2KB asynchronous loader — zero impact on Core Web Vitals
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer border-none uppercase tracking-wider"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 stroke-[2.5]" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 & Live Status */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black text-slate-800">Verify Installation Status</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Paste the script in your website&apos;s <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs">&lt;head&gt;</code> or before <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs">&lt;/body&gt;</code>, then click test below.
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {installStatus === "VERIFIED" ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                    </div>
                  ) : installStatus === "CHECKING" ? (
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                      <RefreshCw className="w-5 h-5 animate-spin stroke-[2.5]" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-6 h-6 stroke-[2]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700">Status:</span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        installStatus === "VERIFIED"
                          ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                          : installStatus === "CHECKING"
                          ? "bg-blue-500/15 text-blue-700"
                          : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                      }`}>
                        {installStatus === "VERIFIED" ? "🟢 Active & Detected" : installStatus === "CHECKING" ? "Checking..." : "🟡 Not Detected Yet"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {installStatus === "VERIFIED"
                        ? `Great job! Received ping from ${selectedDomain}. Last active: ${new Date(installDetails?.lastDetected || Date.now()).toLocaleTimeString()}`
                        : "We haven't received a live ping from your website yet."}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCheckInstall}
                  disabled={installStatus === "CHECKING"}
                  className="px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0 uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${installStatus === "CHECKING" ? "animate-spin" : ""}`} />
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        ) : activeTab === "domain" ? (
          <div className="space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Domain Verification Management</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  To prevent unauthorized quota usage, verify ownership of domains where the widget is installed.
                </p>
              </div>

              <form onSubmit={handleAddDomain} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. mycompany.com"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer border-none uppercase tracking-wider"
                >
                  + Add Domain
                </button>
              </form>
            </div>

            <div className="space-y-4">
              {domains.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Globe className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-600">No domains added yet. Add your domain above to begin verification.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {domains.map((dom) => (
                    <div key={dom.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-black text-slate-800">{dom.domain}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            dom.status === "VERIFIED"
                              ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30"
                              : "bg-amber-500/15 text-amber-700 border border-amber-500/30"
                          }`}>
                            {dom.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {dom.status !== "VERIFIED" && (
                            <>
                              <button
                                onClick={() => handleVerifyDomain(dom.id, true)}
                                title="Simulate verification for testing/demo"
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[11px] rounded-lg cursor-pointer border-none"
                              >
                                Simulate Verify
                              </button>
                              <button
                                onClick={() => handleVerifyDomain(dom.id, false)}
                                disabled={verifyingDomainId === dom.id}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] rounded-lg cursor-pointer border-none flex items-center gap-1.5 shadow-sm"
                              >
                                <RefreshCw className={`w-3 h-3 ${verifyingDomainId === dom.id ? "animate-spin" : ""}`} />
                                Verify Now
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {dom.status !== "VERIFIED" && (
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                          <p className="text-xs font-bold text-slate-700">
                            Add this HTML tag inside your website&apos;s <code className="text-blue-600">&lt;head&gt;</code> section:
                          </p>
                          <div className="flex items-center justify-between gap-3 bg-slate-900 p-3 rounded-lg text-xs font-mono text-blue-300">
                            <span className="truncate">&lt;meta name="2all-verification" content="{dom.verificationToken}"&gt;</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`<meta name="2all-verification" content="${dom.verificationToken}">`);
                                setCopiedToken(true);
                                setTimeout(() => setCopiedToken(false), 2000);
                              }}
                              className="text-white hover:text-blue-300 bg-transparent border-none cursor-pointer p-1 shrink-0"
                            >
                              {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Customize & Publish Tab */
          <div className="space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-800">Widget Appearance & Tools</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tweak settings in draft mode, then push to live visitors when you are ready.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={savingConfig}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200 flex items-center gap-2 uppercase tracking-wider"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingConfig ? "Saving..." : "Save Draft"}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer border-none flex items-center gap-2 uppercase tracking-wider"
                >
                  <Send className={`w-3.5 h-3.5 ${publishing ? "animate-bounce" : ""}`} />
                  {publishing ? "Publishing..." : "Publish to Live Site"}
                </button>
              </div>
            </div>

            {publishSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Successfully published! Your live widget on {selectedDomain} is now serving these settings.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Controls */}
              <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Primary Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border-none cursor-pointer bg-transparent"
                    />
                    <div className="flex gap-2">
                      {["#2563eb", "#7c3aed", "#059669", "#dc2626", "#d97706", "#0f172a"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setConfig({ ...config, primaryColor: c })}
                          className="w-7 h-7 rounded-full border-2 border-white shadow-sm cursor-pointer"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Floating Placement
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bottom-right", label: "Bottom Right" },
                      { id: "bottom-left", label: "Bottom Left" },
                      { id: "top-right", label: "Top Right" },
                      { id: "top-left", label: "Top Left" },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setConfig({ ...config, position: pos.id })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                          config.position === pos.id
                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/15"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                    Trigger Button Size
                  </label>
                  <div className="flex gap-2">
                    {["small", "medium", "large"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setConfig({ ...config, size: s })}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border capitalize cursor-pointer transition-all ${
                          config.size === s
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-slate-900 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border border-slate-800 min-h-[280px]">
                <div className="absolute top-4 left-4 bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white uppercase tracking-wider">
                  Live Draft Preview
                </div>

                <div className="my-auto text-center space-y-2 pt-6">
                  <p className="text-sm font-extrabold text-white">Your Website Page</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    The floating button will anchor to the <strong className="text-blue-400 capitalize">{config.position.replace("-", " ")}</strong> of your customer&apos;s screen.
                  </p>
                </div>

                {/* Preview Trigger Button */}
                <div
                  className="absolute flex items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: config.primaryColor,
                    width: config.size === "large" ? "64px" : config.size === "small" ? "48px" : "56px",
                    height: config.size === "large" ? "64px" : config.size === "small" ? "48px" : "56px",
                    bottom: config.position.includes("bottom") ? "20px" : "auto",
                    top: config.position.includes("top") ? "20px" : "auto",
                    right: config.position.includes("right") ? "20px" : "auto",
                    left: config.position.includes("left") ? "20px" : "auto",
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                    <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
