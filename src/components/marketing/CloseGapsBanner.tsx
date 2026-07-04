"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CloseGapsBanner() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = url || "yoursite.com";
    window.location.href = `/register?scanUrl=${encodeURIComponent(targetUrl)}`;
  };

  return (
    <section className="py-16 bg-white relative overflow-hidden select-none font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Main Blue Banner Container */}
        <div className="w-full bg-[#004bff] rounded-[32px] px-8 py-16 md:px-16 md:py-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 shadow-xl shadow-blue-500/10">
          
          {/* Left Text */}
          <div className="text-left space-y-2 lg:max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight font-sans">
              Close your web <br className="hidden sm:inline" />
              accessibility <span className="italic font-serif font-semibold text-[#2effd3] lowercase tracking-wide">gaps</span>
            </h2>
          </div>

          {/* Right Input Form */}
          <form onSubmit={handleSubmit} className="w-full lg:max-w-md shrink-0">
            <div className="relative border border-white/30 rounded-full p-2 flex items-center justify-between bg-[#004bff] shadow-inner focus-within:border-white/60 transition-colors">
              <input
                type="text"
                placeholder="https://yoursite.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-none text-white placeholder-white/60 text-sm md:text-base font-extrabold focus:outline-none focus:ring-0 pl-6 pr-4"
              />
              
              <button
                type="submit"
                className="bg-white hover:bg-slate-50 text-[#004bff] rounded-full px-6 py-3.5 text-xs md:text-sm font-black tracking-wider uppercase flex items-center gap-2 transition-all shadow-md hover:scale-103 shrink-0"
              >
                GET AUDIT
                <ArrowRight className="w-4 h-4 text-[#004bff] stroke-[3]" />
              </button>
            </div>
          </form>

        </div>

      </div>
    </section>
  );
}
