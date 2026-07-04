"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ArrowLeftRight, 
  Sparkles, 
  BookOpen, 
  Accessibility, 
  Book, 
  FileText, 
  BadgeCheck, 
  Star, 
  HelpCircle, 
  Mail, 
  Lock,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MegamenuProps {
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ResourcesMegamenu({ isOpen, onMouseEnter, onMouseLeave }: MegamenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.99 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="absolute top-[72px] left-10 right-10 max-w-7xl mx-auto bg-white border border-slate-200/80 rounded-3xl shadow-2xl z-40 p-8 grid grid-cols-12 gap-8 text-left select-none"
        >
          {/* COLUMN 1: LEARN (cols 3) */}
          <div className="col-span-3 space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-100 pb-2">
              Learn
            </h4>
            <div className="space-y-3.5">
              {[
                { title: "Compliance", desc: "Explore accessibility regulations", icon: ShieldCheck },
                { title: "Why choose 2all.ai", desc: "Compare us to competitors", icon: ArrowLeftRight },
                { title: "Artificial intelligence", desc: "How AI works in accessibility", icon: Sparkles },
                { title: "Glossary", desc: "Define accessibility terms", icon: Book },
                { title: "Accessibility Interface", desc: "Discover the full scope", icon: Accessibility },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.title} 
                    href="/register" 
                    className="flex gap-3 group/item hover:bg-slate-50/60 p-2 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <span className="block text-[12px] font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: EXPLORE (cols 3) */}
          <div className="col-span-3 space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-100 pb-2">
              Explore
            </h4>
            <div className="space-y-4">
              {[
                { title: "Blog", desc: "Accessibility education & trends", icon: BookOpen },
                { title: "Industry reports", desc: "Research, data, and impact", icon: FileText },
                { title: "Case Studies", desc: "Discover how real clients benefit", icon: BadgeCheck },
                { title: "Customer Examples", desc: "See 2all.ai in action", icon: Star },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.title} 
                    href="/register" 
                    className="flex gap-3 group/item hover:bg-slate-50/60 p-2 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <span className="block text-[12px] font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: SUPPORT (cols 3) */}
          <div className="col-span-3 space-y-5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none border-b border-slate-100 pb-2">
              Support
            </h4>
            <div className="space-y-4">
              {[
                { title: "Help center", desc: "Check out guides & resources", icon: HelpCircle },
                { title: "Contact Us", desc: "Get in touch", icon: Mail },
                { title: "Security & Privacy", desc: "How your privacy is protected", icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.title} 
                    href="/register" 
                    className="flex gap-3 group/item hover:bg-slate-50/60 p-2 rounded-xl transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/50">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <span className="block text-[12px] font-black text-slate-900 group-hover/item:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-bold mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* COLUMN 4: PROMO CARD (cols 3) */}
          <div className="col-span-3 bg-blue-600 text-white rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg h-[400px]">
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Top portion: Graphic indicator */}
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center text-[9px] font-black text-blue-100 tracking-widest uppercase border-b border-white/10 pb-2">
                <span>Issues Solved</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12.4%
                </span>
              </div>
              
              <div className="space-y-2 py-1">
                <div className="flex justify-between items-center bg-white/10 p-2 rounded-xl border border-white/5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    <span className="font-bold">Breadcrumbs-1410</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-emerald-400 text-slate-900 rounded-md font-black text-[9px]">DONE</span>
                </div>
                <div className="flex justify-between items-center bg-white/10 p-2 rounded-xl border border-white/5 text-[10px]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
                    <span className="font-bold">Page-Title-048a93</span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-amber-300 text-slate-900 rounded-md font-black text-[9px]">IN PROGRESS</span>
                </div>
              </div>
            </div>

            {/* Bottom portion: Webinar promotion */}
            <div className="space-y-3 pt-4 border-t border-white/10 relative z-10">
              <span className="block text-[9px] font-black text-blue-200 tracking-widest uppercase">
                On-Demand Webinar
              </span>
              <h5 className="text-[13px] font-black text-white leading-snug tracking-tight">
                How dev teams are tackling accessibility debt
              </h5>
              
              <Link
                href="/register"
                className="w-full py-2.5 bg-white hover:bg-slate-100 text-blue-600 font-extrabold text-[11px] rounded-xl flex items-center justify-center gap-2 tracking-wider uppercase transition-all shadow-sm"
              >
                Watch Recording
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
