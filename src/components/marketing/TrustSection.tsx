"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Accessibility, Check, Star, Globe, Shield, Sparkles, Award } from "lucide-react";
import siteConfig from "@/data/site-config.json";

const colorMap = {
  blue: { bg: "bg-blue-600", text: "text-blue-500", ping: "bg-blue-600", shadow: "shadow-blue-500/50" },
  purple: { bg: "bg-purple-600", text: "text-purple-500", ping: "bg-purple-600", shadow: "shadow-purple-500/50" },
  emerald: { bg: "bg-emerald-600", text: "text-emerald-500", ping: "bg-emerald-600", shadow: "shadow-emerald-500/50" },
  indigo: { bg: "bg-indigo-600", text: "text-indigo-500", ping: "bg-indigo-600", shadow: "shadow-indigo-500/50" },
  orange: { bg: "bg-orange-600", text: "text-orange-500", ping: "bg-orange-600", shadow: "shadow-orange-500/50" },
};

export default function TrustSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const orbitingLogos = [
    {
      name: "General Electric",
      component: (
        <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white text-[12px] font-serif italic font-black">
          g&
        </div>
      ),
    },
    {
      name: "British Airways",
      component: (
        <div className="flex flex-col items-center select-none leading-none">
          <span className="text-[8px] font-black text-slate-900 tracking-tight">BRITISH</span>
          <span className="text-[8px] font-bold text-slate-600 tracking-tight">AIRWAYS</span>
          <div className="w-6 h-0.5 bg-red-500 mt-0.5" />
        </div>
      ),
    },
    {
      name: "BMW",
      component: (
        <div className="w-11 h-11 rounded-full border border-slate-900 bg-black flex items-center justify-center relative overflow-hidden select-none">
          <div className="absolute inset-2 rounded-full border border-white flex flex-wrap transform rotate-45">
            <div className="w-1/2 h-1/2 bg-blue-500" />
            <div className="w-1/2 h-1/2 bg-white" />
            <div className="w-1/2 h-1/2 bg-white" />
            <div className="w-1/2 h-1/2 bg-blue-500" />
          </div>
          <span className="absolute text-[5px] font-extrabold text-white top-0.5">BMW</span>
        </div>
      ),
    },
    {
      name: "Nintendo",
      component: (
        <span className="px-2.5 py-0.5 border-2 border-red-600 text-red-600 rounded-full text-[9px] font-black tracking-tighter uppercase font-sans">
          Nintendo
        </span>
      ),
    },
    {
      name: "Panasonic",
      component: (
        <span className="text-[10px] font-black text-blue-900 tracking-tighter uppercase font-mono">
          Panasonic
        </span>
      ),
    },
    {
      name: "Playmobil",
      component: (
        <span className="text-[10px] font-black text-sky-500 lowercase font-sans tracking-tight">
          playmobil
        </span>
      ),
    },
  ];

  return (
    <section className="pt-10 pb-24 bg-slate-950 text-white relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT COLUMN: Rotating Logo Orbit Wheel */}
        <div className="relative flex items-center justify-center h-[460px] select-none">
          
          {/* Outer dotted circular track */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-white/30" />
          
          {/* Inner dotted track */}
          <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-white/30" />

          {/* Rotating Orbit Container */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 32, ease: "linear", repeat: Infinity }}
            className="absolute w-[360px] h-[360px]"
          >
            {mounted && orbitingLogos.map((logo, index) => {
              // Calculate points on circle
              const angle = (index / orbitingLogos.length) * 2 * Math.PI;
              const radius = 180; // half of 360px
              const x = Math.round(Math.cos(angle) * radius);
              const y = Math.round(Math.sin(angle) * radius);

              return (
                <div
                  key={logo.name}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                  className="absolute"
                >
                  {/* Counter-rotation to keep logo upright */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    whileHover={{ 
                      scale: 1.25,
                      borderColor: "#004bff",
                      boxShadow: "0 20px 25px -5px rgba(0, 75, 255, 0.4), 0 8px 10px -6px rgba(0, 75, 255, 0.4)",
                      zIndex: 50
                    }}
                    transition={{
                      rotate: { duration: 32, ease: "linear", repeat: Infinity },
                      scale: { type: "spring", stiffness: 300, damping: 15 },
                      borderColor: { duration: 0.2 },
                      boxShadow: { duration: 0.2 }
                    }}
                    className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center p-2 text-slate-800 cursor-pointer"
                  >
                    {logo.component}
                  </motion.div>
                </div>
              );
            })}
          </motion.div>

          {/* Glowing central Accessibility Core */}
          {(() => {
            const theme = colorMap[siteConfig.primaryColor as keyof typeof colorMap] || colorMap.blue;
            const Icon = siteConfig.orbitIcon === "shield" ? Shield 
                       : siteConfig.orbitIcon === "sparkles" ? Sparkles 
                       : siteConfig.orbitIcon === "award" ? Award 
                       : Globe;
            return (
              <div className={`relative w-20 h-20 rounded-full ${theme.bg} flex items-center justify-center text-white shadow-2xl ${theme.shadow} z-10 border border-white/10`}>
                <Icon className="w-10 h-10 text-white stroke-[2]" />
                {/* Pulsing ring */}
                <div className={`absolute inset-0 rounded-full ${theme.ping} animate-ping opacity-25`} />
              </div>
            );
          })()}

        </div>

        {/* RIGHT COLUMN: Value Stats & Trust Badges */}
        <div className="flex flex-col justify-center space-y-12">
          
          {/* Header */}
          <div className="space-y-4">
            <span className={`${colorMap[siteConfig.primaryColor as keyof typeof colorMap]?.text || "text-blue-500"} text-xs font-bold uppercase tracking-widest`}>Global Compliance Standard</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Trusted by Businesses & Industry Leaders
            </h2>
            <p className="text-slate-400 text-md font-light leading-relaxed">
              We empower compliance and deliver measurable business value, minimizing risks while optimizing conversion rates for enterprises worldwide.
            </p>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-3 gap-6 border-y border-slate-800 py-8">
            {[
              { val: "100%", label: "Response rate" },
              { val: "120x", label: "ROI" },
              { val: "10x", label: "Cost reduction" },
            ].map((stat) => (
              <div key={stat.label} className="text-left space-y-1">
                <span className="text-3xl md:text-4xl font-extrabold text-white block">
                  {stat.val}
                </span>
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Badges footer row */}
          <div className="flex flex-wrap items-center gap-6">
            
            {/* G2 Rating Capsule */}
            <div className="flex items-center gap-2 bg-[#004bff]/10 border border-[#004bff]/20 rounded-xl px-4 py-2">
              <div className="w-6 h-6 rounded bg-[#004bff] flex items-center justify-center text-white text-xs font-black">
                G
              </div>
              <div className="text-[10px] leading-tight">
                <span className="font-extrabold text-white block">4.6 RATING</span>
                <span className="text-slate-400 block flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2 h-2 fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </div>
            </div>

            {/* Inc. 5000 Badge */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-[10px] leading-tight">
              <div>
                <span className="font-serif italic font-black text-slate-200 block text-xs">Inc. 5000</span>
                <span className="text-slate-500 text-[8px] uppercase tracking-wider block">Honoree</span>
              </div>
            </div>

            {/* Patents Pill */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-[10px] font-semibold text-emerald-400">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>11 registered patents</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
