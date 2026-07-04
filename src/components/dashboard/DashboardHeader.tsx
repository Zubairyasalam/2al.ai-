"use client";

import Link from "next/link";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  FileText,
  Activity,
  ShieldAlert,
  Users,
  LogOut
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Logo from "@/components/ui/Logo";

interface HeaderProps {
  user: { name?: string | null; email?: string | null };
}

export default function DashboardHeader({ user }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const firstName = user?.name?.split(" ")[0] ?? "Zubairya";

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 px-6 sm:px-12 py-3.5 flex items-center justify-between select-none">

      {/* LEFT: Logo & Main Nav */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo height={36} className="self-center" />
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
            <FileText className="w-4 h-4 text-slate-400" />
            My Licenses
          </Link>
          <Link href="/dashboard/projects" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
            <Activity className="w-4 h-4 text-slate-400" />
            My Services
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
            <ShieldAlert className="w-4 h-4 text-slate-400" />
            My Audits
          </Link>
          <Link href="/dashboard/partners" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors">
            <Users className="w-4 h-4 text-slate-400" />
            Partners
          </Link>
        </nav>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-4">
        {/* Contact Sales */}
        <button className="hidden sm:inline-flex px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-colors cursor-pointer border-none">
          Contact Sales
        </button>

        {/* Help Circle */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border-none bg-transparent">
          <HelpCircle className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Bell Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border-none bg-transparent">
          <Bell className="w-5 h-5 stroke-[2.5]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border-none bg-transparent"
          >
            {/* Avatar Circle */}
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-extrabold text-sm border border-blue-200">
              {firstName[0]?.toUpperCase()}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-slate-700">{firstName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 stroke-[2.5]" />
          </button>

          {/* Simple Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors cursor-pointer border-none bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>

      </div>

    </header>
  );
}
