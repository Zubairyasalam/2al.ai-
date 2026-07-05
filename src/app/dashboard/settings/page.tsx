"use client";

import { useState } from "react";
import { User, Bell, Shield, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({ email: true, weekly: true, critical: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-16 font-sans select-none">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Manage your account preferences and notifications.</p>
      </div>

      {/* Profile */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">Profile</h2>
            <p className="text-[11px] text-slate-400 font-medium">Update your display name and email address.</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] font-black text-slate-600 uppercase tracking-wider mb-1.5">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0052ff] hover:bg-blue-700 text-white text-sm font-bold w-fit cursor-pointer border-none shadow-md shadow-blue-500/20 transition-all"
          >
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Profile</>}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-9 h-9 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">Notifications</h2>
            <p className="text-[11px] text-slate-400 font-medium">Control how and when you receive alerts.</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "email", label: "Email notifications", description: "Receive scan results via email" },
            { key: "weekly", label: "Weekly digest", description: "Get a weekly summary of your accessibility scores" },
            { key: "critical", label: "Critical alerts", description: "Instant alerts for critical accessibility issues" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-bold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{item.description}</p>
              </div>
              <button
                onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer border-none ${
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-red-100 pb-4 mb-4">
          <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800">Danger Zone</h2>
            <p className="text-[11px] text-red-500 font-medium">Irreversible and destructive actions.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 font-medium mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="px-4 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm font-bold hover:bg-red-50 transition-all cursor-pointer bg-transparent">
          Delete Account
        </button>
      </div>
    </div>
  );
}
