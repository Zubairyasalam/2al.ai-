"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  HelpCircle,
  ChevronDown,
  LayoutDashboard,
  Globe,
  CreditCard,
  BarChart3,
  Settings,
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
  const pathname = usePathname();
  const firstName = user?.name?.split(" ")[0] ?? "Zubairya";

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/domains", label: "My Domains", icon: Globe },
    { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
    { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="sticky top-0 z-30 w-full flex flex-col">
      <header className="w-full bg-white border-b border-slate-200/80 px-4 sm:px-12 py-3.5 flex items-center justify-between select-none">

      {/* LEFT: Logo & Main Nav */}
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <Logo height={36} className="self-center" />
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-2 font-extrabold text-xs uppercase tracking-wider transition-colors ${
                  isActive 
                    ? "text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100" 
                    : "text-slate-600 hover:text-blue-600"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
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

      {/* Mobile Nav Row */}
      <nav className="md:hidden flex items-center gap-6 px-4 py-3 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar w-full shadow-inner select-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`flex flex-col items-center gap-1.5 font-extrabold text-[10px] uppercase tracking-wider transition-colors shrink-0 ${
                isActive 
                  ? "text-blue-600" 
                  : "text-slate-500 hover:text-blue-600"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
