"use client";

import Link from "next/link";
import { Plus, Sparkles, Accessibility } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full pt-6 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section: Logo + Menu Pill */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Accessibility className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              2all<span className="text-blue-600">.ai</span>
            </span>
          </Link>

          {/* Plus Menu Pill */}
          <button className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-white rounded-full pl-1.5 pr-4 py-1.5 transition-all text-xs font-semibold shadow-sm">
            <span className="w-5 h-5 rounded-full bg-white text-slate-950 flex items-center justify-center">
              <Plus className="w-3 h-3 stroke-[3]" />
            </span>
            Menu
          </button>
        </div>

        {/* Center Section: Sub-pills (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/40 text-[11px] font-semibold text-slate-600">
            WCAG 2.2 Compliance
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/40 text-[11px] font-semibold text-slate-600">
            AI Automation
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/40 text-[11px] font-semibold text-slate-600">
            ADA & EAA Ready
          </span>
        </div>

        {/* Right Section: CTA Pill */}
        <div className="flex items-center">
          <Link
            href="/register"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 rounded-full pl-2 pr-4 py-1.5 transition-all text-xs font-semibold shadow-sm"
          >
            <span className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center">
              <Sparkles className="w-3 h-3 fill-white" />
            </span>
            Start Scanning
          </Link>
        </div>
      </div>
    </header>
  );
}
