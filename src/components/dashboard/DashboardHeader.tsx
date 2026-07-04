"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  user: { name?: string | null; email?: string | null };
}

export default function DashboardHeader({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-8">
      {/* Search */}
      <div className="flex items-center gap-3 flex-1 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold">
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}
