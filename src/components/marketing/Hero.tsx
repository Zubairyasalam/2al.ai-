"use client";

import { motion } from "framer-motion";
import { Sparkles, Accessibility } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between bg-white overflow-hidden py-12 px-6 sm:px-12">
      {/* Central Soft Blur Gradient Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-pink-200/40 via-orange-100/40 to-blue-200/40 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* Top Section spacer (Navbar is absolute/sticky above it) */}
      <div className="h-4" />

      {/* Main Interactive Center Section */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center">
        {/* Animated Hands (Michelangelo style) */}
        <div className="absolute inset-0 flex items-center justify-between pointer-events-none max-w-5xl mx-auto w-full px-4 overflow-hidden h-full min-h-[300px]">
          {/* Left Hand: Human reaching */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "-10%", opacity: 0.85 }}
            transition={{ type: "spring", stiffness: 45, delay: 0.5 }}
            className="w-1/3 sm:w-1/4 shrink-0 flex justify-end"
          >
            <svg
              viewBox="0 0 200 120"
              fill="none"
              stroke="currentColor"
              className="text-slate-800 w-full h-auto drop-shadow-sm opacity-80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hand Outline (simplified elegant gesture) */}
              <path d="M 0,60 C 30,58 50,45 80,48 C 100,50 120,40 140,25 C 145,20 152,25 145,35 C 130,55 110,65 135,65 C 142,65 148,60 152,55 C 155,52 160,56 154,62 C 140,78 115,82 130,82 C 138,82 144,78 147,75 C 150,72 154,76 148,82 C 135,95 115,95 125,95 C 132,95 137,92 140,89 C 142,87 145,91 140,96 C 120,115 80,105 50,90 C 30,80 15,65 0,60 Z" />
              {/* Thumb */}
              <path d="M 75,50 C 85,38 95,25 105,20 C 110,18 115,22 108,30 C 95,45 85,55 75,60" />
            </svg>
          </motion.div>

          {/* Right Hand: AI / Robotic reaching */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: "10%", opacity: 0.85 }}
            transition={{ type: "spring", stiffness: 45, delay: 0.5 }}
            className="w-1/3 sm:w-1/4 shrink-0 flex justify-start"
          >
            <svg
              viewBox="0 0 200 120"
              fill="none"
              stroke="currentColor"
              className="text-blue-600 w-full h-auto drop-shadow-sm opacity-80"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Robotic Segmented Arm/Hand */}
              <path d="M 200,60 C 170,62 160,50 135,50 C 125,50 115,42 100,28 C 96,24 90,28 95,35 C 105,50 120,60 100,60 C 92,60 86,56 82,52 C 79,49 74,53 80,59 C 90,72 110,78 95,78 C 88,78 82,74 78,71 C 75,68 71,72 76,77 C 85,88 100,90 90,90 C 84,90 79,87 76,84 C 74,82 71,86 75,91 C 90,108 120,102 145,90 C 160,82 180,65 200,60 Z" />
              {/* Robotic joints / wires detail */}
              <circle cx="135" cy="50" r="2.5" fill="currentColor" />
              <circle cx="100" cy="60" r="2" fill="currentColor" />
              <circle cx="95" cy="78" r="2" fill="currentColor" />
              <circle cx="90" cy="90" r="2" fill="currentColor" />
              <line x1="135" y1="50" x2="100" y2="60" strokeDasharray="3 3" />
              <line x1="100" y1="60" x2="95" y2="78" strokeDasharray="3 3" />
              {/* Metallic wrist panel */}
              <path d="M 160,55 L 180,50 L 185,75 L 165,72 Z" strokeWidth="1" />
            </svg>
          </motion.div>
        </div>

        {/* Brand Name Title */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tight text-slate-950 mb-2 relative z-20"
        >
          2all.ai
        </motion.h1>

        {/* Subtitle / Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-400 tracking-wide relative z-20"
        >
          Intelligence <span className="text-slate-900 font-medium">that scans</span>
        </motion.p>

        {/* Brief CTAs overlaid elegantly */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 flex gap-4 relative z-20"
        >
          <Link
            href="/register"
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/10 transition-all"
          >
            Start Free Scan
          </Link>
          <Link
            href="#features"
            className="px-6 py-3 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-all"
          >
            Learn More
          </Link>
        </motion.div>
      </div>

      {/* Bottom Section: Details & Metadata */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12 border-t border-slate-100/50 mt-12">
        {/* Left Side: Dynamic description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-sm space-y-2 text-left"
        >
          <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            Human-Centered AI
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bridging the gap between web compliance and intuitive design for a smarter, more inclusive connected future.
          </p>
        </motion.div>

        {/* Center: Vertical Line Separator */}
        <div className="hidden md:block w-px h-8 bg-slate-200 self-end mx-auto mb-1" />

        {/* Right Side: Capsule pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap gap-2 md:justify-end"
        >
          <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-600">
            Algorithms
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-600">
            AI Scans
          </span>
          <span className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-[10px] font-bold tracking-wide text-slate-600">
            Remediation
          </span>
        </motion.div>
      </div>
    </section>
  );
}
