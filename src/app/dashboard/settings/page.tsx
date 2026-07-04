"use client";

import { useState } from "react";
import { User, Bell, Shield, Palette, Save } from "lucide-react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState({ email: true, weekly: true, critical: true });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and notifications.</p>
      </div>

      {/* Profile */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <User className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Profile</h2>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium w-fit">
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Notifications</h2>
        </div>
        {[
          { key: "email", label: "Email notifications", description: "Receive scan results via email" },
          { key: "weekly", label: "Weekly digest", description: "Get a weekly summary of your accessibility scores" },
          { key: "critical", label: "Critical alerts", description: "Instant alerts for critical accessibility issues" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-gray-400">{item.description}</p>
            </div>
            <button
              onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-gray-600"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-2xl p-6 border-red-500/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-base font-semibold text-white">Danger Zone</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}
