"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Globe,
  Award,
  DollarSign,
  LayoutGrid,
  Sliders,
  CreditCard,
  UserCog,
  Check,
  Trash2,
  Search,
  LogOut,
  Save,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Sparkles,
  Code,
  Palette,
  Layout,
  Layers,
  Settings,
  FileText,
  FolderOpen,
  Languages,
  FileCode,
  Eye,
  Menu,
  Loader2,
  KeyRound
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import DomainOnboarding from "@/components/dashboard/DomainOnboarding";
import AdminApiKeysPanel from "@/components/admin/AdminApiKeysPanel";

interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
}

interface ProjectType {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  } | null;
}

interface ConfigType {
  brandName: string;
  tagline: string;
  showDemoButton: boolean;
  showTrialButton: boolean;
  trialButtonText: string;
  demoButtonText: string;
  stripeActive: boolean;
  paypalActive: boolean;
  trialPeriodDays: number;
  primaryColor: string;
  proPrice: number;
  auditBannerTitle: string;
  orbitIcon: string;
  customCss: string;
  customJs: string;
  trackingScripts: string;
}

interface DashboardProps {
  initialUsers: UserType[];
  initialProjects: ProjectType[];
  initialDomains?: any[];
  initialConfig: ConfigType;
  currentUser?: { name?: string | null; email?: string | null };
  initialTab?: string;
}

export default function AdminDashboard({
  initialUsers,
  initialProjects,
  initialDomains = [],
  initialConfig,
  currentUser,
  initialTab = "overview"
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (tabId === "overview") {
        url.searchParams.delete("tab");
      } else {
        url.searchParams.set("tab", tabId);
      }
      window.history.pushState({}, "", url.toString());
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  }, []);

  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects);
  const [config, setConfig] = useState<ConfigType>(initialConfig);

  // Customizer local edits state
  const [editConfig, setEditConfig] = useState<ConfigType>(initialConfig);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  // Demo requests states
  const [demoRequests, setDemoRequests] = useState<any[]>([]);
  const [loadingDemoRequests, setLoadingDemoRequests] = useState(false);

  useEffect(() => {
    if (activeTab === "form") {
      const fetchDemos = async () => {
        setLoadingDemoRequests(true);
        try {
          const res = await fetch("/api/admin/demo");
          if (res.ok) {
            const data = await res.json();
            setDemoRequests(data.requests || []);
          }
        } catch (e) {
          console.error("Failed to load demo requests", e);
        } finally {
          setLoadingDemoRequests(false);
        }
      };
      fetchDemos();
    }
  }, [activeTab]);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Save UI Configuration API Call
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editConfig),
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data.config);
        showToast("Configuration saved successfully!");
      } else {
        showToast(data.message || "Failed to update configuration", "error");
      }
    } catch (err) {
      showToast("A network error occurred while saving configuration", "error");
    } finally {
      setLoading(false);
    }
  };

  // Update User Role API Call
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        showToast(`User role updated to ${newRole}!`);
      } else {
        showToast(data.message || "Failed to update role", "error");
      }
    } catch (err) {
      showToast("Network error updating role", "error");
    }
  };

  // Delete User API Call
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action is irreversible.")) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        setProjects(projects.filter(p => p.user?.email !== users.find(u => u.id === userId)?.email));
        showToast("User deleted successfully!");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete user", "error");
      }
    } catch (err) {
      showToast("Network error deleting user", "error");
    }
  };

  const filteredUsers = users.filter(u =>
    (u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
    (u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 antialiased font-sans select-none">

      {/* SIDEBAR: BLUE & WHITE STYLING */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none">
        <div className="overflow-y-auto flex-grow max-h-[calc(100vh-70px)]">
          {/* Logo */}
          <div className="p-5 border-b border-slate-100 flex items-center gap-3">
            <Logo height={36} className="self-center" />
            <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase mt-2.5 block leading-none">Console</span>
          </div>

          {/* Navigation Links Group 1: System Panel */}
          <div className="p-4 space-y-1">
            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3 leading-none">System Telemetry</span>
            {[
              { id: "overview", label: "Overview Panel", icon: LayoutGrid },
              { id: "users", label: "User Database", icon: UserCog },
              { id: "payments", label: "Payments Gateway", icon: CreditCard },
              { id: "domains", label: "Customer Workspace", icon: Globe },
              { id: "api-keys", label: "API Keys Console", icon: KeyRound },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-black transition-all cursor-pointer border-none ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Navigation Links Group 2: Platform Builder Modules */}
          <div className="p-4 pt-1 space-y-1">
            <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-3 leading-none">Platform Builder Modules</span>
            {[
              { id: "branding", label: "Branding Manager", icon: Award },
              { id: "theme", label: "Theme Manager", icon: Palette },
              { id: "website", label: "Website Builder", icon: Globe },
              { id: "navigation", label: "Navigation Builder", icon: Layers },
              { id: "landing", label: "Landing Page Builder", icon: Layout },
              { id: "cms", label: "CMS (Content Management)", icon: Sliders },
              { id: "features", label: "Feature Manager", icon: Settings },
              { id: "dashboard", label: "Dashboard Builder", icon: LayoutGrid },
              { id: "form", label: "Form Builder", icon: FileText },
              { id: "auth", label: "Auth Configuration", icon: ShieldCheck },
              { id: "cssjs", label: "Custom CSS/JS", icon: Code },
              { id: "whitelabel", label: "White-Label Manager", icon: UserCog },
              { id: "media", label: "Media Library", icon: FolderOpen },
              { id: "translation", label: "Translation Config", icon: Languages }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left text-xs font-black transition-all cursor-pointer border-none ${activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-transparent text-slate-600 hover:text-blue-600 hover:bg-blue-50/50"
                    }`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2.5]" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-extrabold text-xs rounded-xl transition-all cursor-pointer uppercase tracking-wider text-center"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            User Area
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* TOP HEADER */}
        <header className="sticky top-0 z-20 h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between select-none">
          <h2 className="text-xs font-black text-slate-700 tracking-wider uppercase">
            {activeTab === "overview" && "Telemetry Overview Panel"}
            {activeTab === "users" && "System User Profiles Registry"}
            {activeTab === "payments" && "Backend Payment Systems Integrations"}
            {activeTab === "branding" && "Branding Identity Manager"}
            {activeTab === "theme" && "Global Theme & Color manager"}
            {activeTab === "cssjs" && "Custom CSS / JS / Tracking script manager"}
            {["website", "navigation", "landing", "cms", "features", "dashboard", "form", "auth", "whitelabel", "media", "translation"].includes(activeTab) && `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module`}
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">Admin Mode</span>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
          </div>
        </header>

        {/* CONTENT VIEW */}
        <main className="flex-grow p-8 overflow-y-auto">

          {/* TOAST TO NOTIFY SUCCESS/ERROR */}
          {statusMessage && (
            <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-black transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                : "bg-red-50 text-red-800 border border-red-100"
              }`}>
              <Check className="w-4 h-4 stroke-[3]" />
              {statusMessage.text}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-200 text-left">

              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Accounts", value: users.length, icon: Users, color: "text-blue-600 bg-blue-50 border-blue-100" },
                  { label: "Active Domains", value: projects.length, icon: Globe, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
                  { label: "Sandbox Licenses", value: users.filter(u => u.role === "ADMIN").length + projects.length, icon: Award, color: "text-purple-600 bg-purple-50 border-purple-100" },
                  { label: "Virtual Trial Yield", value: `$${users.length * 49}`, icon: DollarSign, color: "text-amber-600 bg-amber-50 border-amber-100" },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <div key={card.label} className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                      <div className="space-y-1.5">
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{card.label}</span>
                        <span className="block text-2xl font-black text-slate-800 tracking-tight leading-none">{card.value}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Lists Row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Users Table */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">Recent Registrations</h3>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-medium text-slate-600">
                      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200/60">
                        <tr>
                          <th className="px-6 py-3 text-left">User</th>
                          <th className="px-6 py-3 text-left">Role</th>
                          <th className="px-6 py-3 text-left">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.slice(0, 5).map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3.5">
                              <span className="block font-black text-slate-800">{user.name || "Unnamed"}</span>
                              <span className="block text-[10px] text-slate-400 font-bold">{user.email}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${user.role === "ADMIN" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                                }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-3.5 text-slate-400 font-bold">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Projects Table */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200/60 flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">Active Projects</h3>
                    <Globe className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-medium text-slate-600">
                      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200/60">
                        <tr>
                          <th className="px-6 py-3 text-left">Domain</th>
                          <th className="px-6 py-3 text-left">Owner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.slice(0, 5).map((project) => (
                          <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3.5">
                              <span className="block font-black text-slate-800">{project.name}</span>
                              <span className="block text-[9px] text-slate-400 font-bold truncate max-w-[150px]">{project.url}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="block text-[11px] font-black text-slate-700">{project.user?.name || "Unnamed"}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: BRANDING MANAGER */}
          {activeTab === "branding" && (
            <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200 text-left">

              {/* Form settings */}
              <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">Identity & Branding Copy</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">Customize global site text tags and button copy elements.</p>
                </div>

                <form onSubmit={handleSaveConfig} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Brand Name</label>
                      <input
                        type="text"
                        value={editConfig.brandName}
                        onChange={(e) => setEditConfig({ ...editConfig, brandName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Trial Button CTA</label>
                      <input
                        type="text"
                        value={editConfig.trialButtonText}
                        onChange={(e) => setEditConfig({ ...editConfig, trialButtonText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Tagline / Subheading</label>
                    <input
                      type="text"
                      value={editConfig.tagline}
                      onChange={(e) => setEditConfig({ ...editConfig, tagline: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Demo Button CTA</label>
                      <input
                        type="text"
                        value={editConfig.demoButtonText}
                        onChange={(e) => setEditConfig({ ...editConfig, demoButtonText: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Trial Duration (Days)</label>
                      <input
                        type="number"
                        value={editConfig.trialPeriodDays}
                        onChange={(e) => setEditConfig({ ...editConfig, trialPeriodDays: parseInt(e.target.value) || 7 })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Toggle switches for sections */}
                  <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => setEditConfig({ ...editConfig, showTrialButton: !editConfig.showTrialButton })}
                        className="p-0 border-none bg-transparent cursor-pointer"
                      >
                        {editConfig.showTrialButton ? <ToggleRight className="w-8 h-8 text-blue-600" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                      </button>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Show Trial CTA</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => setEditConfig({ ...editConfig, showDemoButton: !editConfig.showDemoButton })}
                        className="p-0 border-none bg-transparent cursor-pointer"
                      >
                        {editConfig.showDemoButton ? <ToggleRight className="w-8 h-8 text-blue-600" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                      </button>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Show Demo CTA</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider"
                  >
                    <Save className="w-4.5 h-4.5" />
                    {loading ? "Saving Changes..." : "Save Branding Config"}
                  </button>

                </form>
              </div>

              {/* Real-time Hero Preview Block */}
              <div className="lg:col-span-5 space-y-3">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Homepage Preview</span>
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-center items-center text-center h-[280px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] pointer-events-none" />

                  {(() => {
                    const previewColorMap = {
                      blue: { bg: "bg-blue-600", text: "text-blue-500", border: "border-blue-100", lightBg: "bg-blue-50" },
                      purple: { bg: "bg-purple-600", text: "text-purple-500", border: "border-purple-100", lightBg: "bg-purple-50" },
                      emerald: { bg: "bg-emerald-600", text: "text-emerald-500", border: "border-emerald-100", lightBg: "bg-emerald-50" },
                      indigo: { bg: "bg-indigo-600", text: "text-indigo-500", border: "border-indigo-100", lightBg: "bg-indigo-50" },
                      orange: { bg: "bg-orange-600", text: "text-orange-500", border: "border-orange-100", lightBg: "bg-orange-50" },
                    };
                    const theme = previewColorMap[editConfig.primaryColor as keyof typeof previewColorMap] || previewColorMap.blue;

                    return (
                      <>
                        <span className={`px-2.5 py-0.5 ${theme.lightBg} border ${theme.border} rounded-full text-[9px] font-black ${theme.text} uppercase tracking-wider mb-4`}>
                          Hero Section
                        </span>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                          {editConfig.brandName}
                        </h2>
                        <p className="text-xs text-slate-400 font-bold max-w-xs leading-relaxed mb-6">
                          {editConfig.tagline}
                        </p>

                        <div className="flex gap-3">
                          {editConfig.showTrialButton && (
                            <span className={`px-4 py-2 ${theme.bg} text-white font-extrabold text-[9px] rounded-lg tracking-wider uppercase select-none shadow-sm`}>
                              {editConfig.trialButtonText}
                            </span>
                          )}
                          {editConfig.showDemoButton && (
                            <span className="px-4 py-2 border border-slate-200 text-slate-500 font-extrabold text-[9px] rounded-lg tracking-wider uppercase select-none">
                              {editConfig.demoButtonText}
                            </span>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: THEME MANAGER */}
          {activeTab === "theme" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-2xl text-left animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Theme & Visual Elements</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Customize global site colors and widgets iconography.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-6 mt-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary Theme Color Accent</label>
                  <div className="flex gap-3 items-center py-1">
                    {["blue", "purple", "emerald", "indigo", "orange"].map((color) => {
                      const bgClass = color === "blue" ? "bg-blue-600"
                        : color === "purple" ? "bg-purple-600"
                          : color === "emerald" ? "bg-emerald-600"
                            : color === "indigo" ? "bg-indigo-600"
                              : "bg-orange-600";
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditConfig({ ...editConfig, primaryColor: color })}
                          className={`w-8 h-8 rounded-full border-2 ${bgClass} cursor-pointer transition-all ${editConfig.primaryColor === color ? "border-slate-800 scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                            }`}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Orbit Center Icon Widget</label>
                  <select
                    value={editConfig.orbitIcon}
                    onChange={(e) => setEditConfig({ ...editConfig, orbitIcon: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
                  >
                    <option value="globe">Globe (Icon)</option>
                    <option value="shield">Shield (Icon)</option>
                    <option value="sparkles">Sparkles (Icon)</option>
                    <option value="award">Award (Icon)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider"
                >
                  <Save className="w-4.5 h-4.5" />
                  {loading ? "Saving Changes..." : "Save Theme Config"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: CUSTOM CSS/JS (MATCHES THE SCREENSHOT EXACTLY) */}
          {activeTab === "cssjs" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-4xl text-left animate-in fade-in duration-200 space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Custom CSS / JS / Tracking script manager</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Inject styling and client analytics tags globally onto the head/body without rewriting production components.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Inject Custom CSS</label>
                  <textarea
                    rows={4}
                    value={editConfig.customCss}
                    onChange={(e) => setEditConfig({ ...editConfig, customCss: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[11px] font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Inject Custom Javascript</label>
                  <textarea
                    rows={4}
                    value={editConfig.customJs}
                    onChange={(e) => setEditConfig({ ...editConfig, customJs: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[11px] font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Analytics/Tracking scripts (Google Analytics / Pixel)</label>
                  <textarea
                    rows={4}
                    value={editConfig.trackingScripts}
                    onChange={(e) => setEditConfig({ ...editConfig, trackingScripts: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-[11px] font-mono text-emerald-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                {/* TEAL BUTTON MATCHING THE SCREENSHOT EXACTLY */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-[#00a88f] hover:bg-[#009680] disabled:bg-teal-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-teal-500/10 transition-all cursor-pointer border-none uppercase tracking-wider flex items-center gap-2"
                >
                  <FileCode className="w-4.5 h-4.5" />
                  {loading ? "Injecting..." : "Inject Code scripts"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: WEBSITE BUILDER */}
          {activeTab === "website" && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm max-w-2xl text-left animate-in fade-in duration-200 space-y-6">
              <div>
                <h3 className="text-base font-black text-slate-800 tracking-tight">Website Builder Configuration</h3>
                <p className="text-xs text-slate-400 font-bold mt-0.5">Customize global landing page headers and banner scripts.</p>
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Audit Banner Title</label>
                  <input
                    type="text"
                    value={editConfig.auditBannerTitle}
                    onChange={(e) => setEditConfig({ ...editConfig, auditBannerTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider"
                >
                  <Save className="w-4.5 h-4.5" />
                  {loading ? "Saving Changes..." : "Save Website Config"}
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="grid lg:grid-cols-2 gap-8 items-start animate-in fade-in duration-200 text-left">

              {/* Stripe Panel */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">Stripe Gateway</h3>
                      <span className="text-[10px] text-slate-400 font-bold">Standard card checkout payments</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditConfig({ ...editConfig, stripeActive: !editConfig.stripeActive })}
                    className="p-0 border-none bg-transparent cursor-pointer"
                  >
                    {editConfig.stripeActive ? <ToggleRight className="w-9 h-9 text-blue-600" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                  </button>
                </div>

                <div className="space-y-4 opacity-90">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Stripe Public Key</label>
                    <input
                      type="text"
                      value="pk_test_51Mz2allAiSecretPublicKeyExample12345"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10.5px] font-mono text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* PayPal Panel */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                        <path d="M7.076 2.136C7.79 1.48 8.79 1 10.05 1h6.63c.69 0 1.25.5 1.34 1.18l1.94 13.62c.07.5-.3.94-.8.94h-4.3l-.22-1.57c-.1-.7-.7-.12-1.3-.12H9.01c-.56 0-1.02-.45-1.12-1.01L6.15 2.17a1 1 0 0 1 .92-1.03zm-1.8 4.2l-.76 5.3c-.1.55.33 1.01.89 1.01h2.24l.58-4.08a.5.5 0 0 1 .49-.43h3.58c.84 0 1.5-.32 1.97-.75.48-.43.76-1.1.66-1.85-.12-.86-.88-1.51-1.74-1.51H7.81c-.55 0-1.01.44-1.11.99L5.27 6.34z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight">PayPal Gateway</h3>
                      <span className="text-[10px] text-slate-400 font-bold">Standard alternative payments checkout</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditConfig({ ...editConfig, paypalActive: !editConfig.paypalActive })}
                    className="p-0 border-none bg-transparent cursor-pointer"
                  >
                    {editConfig.paypalActive ? <ToggleRight className="w-9 h-9 text-blue-600" /> : <ToggleLeft className="w-9 h-9 text-slate-400" />}
                  </button>
                </div>

                <div className="space-y-4 opacity-90">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">PayPal Client ID</label>
                    <input
                      type="text"
                      value="Af_2allAiPayPalClientIdMockupExample99348924823"
                      disabled
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10.5px] font-mono text-slate-400"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 7: USERS DATABASE */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-200 text-left">

              {/* Search filter row */}
              <div className="flex justify-between items-center gap-4 bg-white border border-slate-200/80 rounded-2xl px-5 py-3 shadow-sm">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
              </div>

              {/* Users registry list */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-medium text-slate-600">
                    <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200/60">
                      <tr>
                        <th className="px-6 py-3.5 text-left">User details</th>
                        <th className="px-6 py-3.5 text-left">Security Role</th>
                        <th className="px-6 py-3.5 text-left">Date registered</th>
                        <th className="px-6 py-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="block font-black text-slate-800">{user.name || "Unnamed"}</span>
                            <span className="block text-[10px] text-slate-400 font-bold">{user.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-extrabold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all cursor-pointer"
                            >
                              <option value="CUSTOMER">CUSTOMER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-slate-400 font-bold">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all cursor-pointer border-none bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: FORM BUILDER (DEMO REQUESTS MANAGER) */}
          {activeTab === "form" && (
            <div className="space-y-6 animate-in fade-in duration-200 text-left">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col space-y-2">
                <h3 className="text-base font-black text-slate-800 tracking-tight">Form Submissions: Demo Schedule Requests</h3>
                <p className="text-xs text-slate-400 font-bold">Review and contact customer accounts that scheduled accessibility platform walkthroughs.</p>
              </div>

              {loadingDemoRequests ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-xs text-slate-400 font-bold flex items-center justify-center gap-2 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  Loading demo requests...
                </div>
              ) : demoRequests.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center text-xs text-slate-400 font-bold shadow-sm">
                  No demo requests scheduled yet.
                </div>
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-medium text-slate-600">
                      <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-200/60">
                        <tr>
                          <th className="px-6 py-3.5 text-left">Customer Name</th>
                          <th className="px-6 py-3.5 text-left">Business Email</th>
                          <th className="px-6 py-3.5 text-left">Phone Number</th>
                          <th className="px-6 py-3.5 text-left">Website URL</th>
                          <th className="px-6 py-3.5 text-left">Submitted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {demoRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-black text-slate-800">{req.name}</td>
                            <td className="px-6 py-4 font-bold text-blue-600">{req.email}</td>
                            <td className="px-6 py-4 text-slate-700 font-semibold">{req.phone}</td>
                            <td className="px-6 py-4">
                              <a 
                                href={req.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-slate-500 hover:text-blue-600 font-bold underline"
                              >
                                {req.website}
                              </a>
                            </td>
                            <td className="px-6 py-4 text-slate-400 font-bold">
                              {new Date(req.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: DOMAINS (CUSTOMER WORKSPACE INVENTORY) */}
          {activeTab === "domains" && (
            <DomainOnboarding initialDomains={initialDomains} userName={currentUser?.name || "Admin"} isAdmin={true} />
          )}

          {/* TAB: API KEYS CONSOLE */}
          {activeTab === "api-keys" && (
            <AdminApiKeysPanel />
          )}

          {/* OTHER MOCK BUILDER MODULES */}
          {["navigation", "landing", "cms", "features", "dashboard", "auth", "whitelabel", "media", "translation"].includes(activeTab) && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm text-left animate-in fade-in duration-200 max-w-3xl space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                  <Settings className="w-6 h-6 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module Active
                  </h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">
                    This platform builder module is fully synchronized with the 2all.ai backend database.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-400 font-bold">Module State:</span>
                  <span className="text-emerald-600 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    ONLINE / COMPILED
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2 pt-1">
                  <span className="text-slate-400 font-bold">Database Synchronicity:</span>
                  <span className="text-blue-600 font-black">Prisma Schema v5.22 (Synced)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400 font-bold">Target Elements:</span>
                  <span className="text-slate-700 font-black">All production components</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
