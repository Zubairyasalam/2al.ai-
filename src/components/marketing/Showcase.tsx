"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Accessibility, Sparkles } from "lucide-react";

export default function Showcase() {
  const [phase, setPhase] = useState(0); // 0: Dashboard/Auto-Fix, 1: Mobile scan, 2: Desktop scan
  const [cursorClicked, setCursorClicked] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  
  // Scans visibility states
  const [mobileImgFixed, setMobileImgFixed] = useState(false);
  const [mobileTextFixed, setMobileTextFixed] = useState(false);
  const [desktopTitleFixed, setDesktopTitleFixed] = useState(false);
  const [desktopBtnFixed, setDesktopBtnFixed] = useState(false);

  useEffect(() => {
    const runAnimationLoop = async () => {
      // PHASE 0: Dashboard Auto-Fix
      setPhase(0);
      setCursorClicked(false);
      setShowSparkles(false);
      setMobileImgFixed(false);
      setMobileTextFixed(false);
      setDesktopTitleFixed(false);
      setDesktopBtnFixed(false);

      // 1. Move cursor to button & click
      await delay(1800);
      setCursorClicked(true);
      setShowSparkles(true);

      // PHASE 1: Transition to Mobile and Scan
      await delay(1500);
      setPhase(1);

      // Mobile Image Fix
      await delay(1500);
      setMobileImgFixed(true);

      // Mobile Text Fix
      await delay(1500);
      setMobileTextFixed(true);

      // PHASE 2: Transition to Desktop and Scan
      await delay(2000);
      setPhase(2);

      // Desktop Title Fix
      await delay(1500);
      setDesktopTitleFixed(true);

      // Desktop Button Fix
      await delay(1500);
      setDesktopBtnFixed(true);

      // Wait before resetting
      await delay(3000);
    };

    runAnimationLoop();
    const interval = setInterval(runAnimationLoop, 15000);
    return () => clearInterval(interval);
  }, []);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Motion layout variants for 3 screens
  const getScreenStyles = (screenIndex: number) => {
    // Current active screen in center
    if (phase === screenIndex) {
      return {
        x: "0%",
        scale: 1,
        opacity: 1,
        zIndex: 30,
        filter: "blur(0px)",
      };
    }
    
    // Left Screen
    if ((phase === 0 && screenIndex === 1) || (phase === 1 && screenIndex === 2) || (phase === 2 && screenIndex === 0)) {
      return {
        x: -380,
        scale: 0.8,
        opacity: 0.6,
        zIndex: 10,
        filter: "blur(1px)",
      };
    }

    // Right Screen
    return {
      x: 380,
      scale: 0.8,
      opacity: 0.6,
      zIndex: 10,
      filter: "blur(1px)",
    };
  };

  return (
    <section className="pt-12 pb-10 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden select-none">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-col items-center">
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 relative z-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-6">
            See AI Remediation in <span className="text-blue-600">Real-Time</span>
          </h2>
          <p className="text-lg text-slate-500 font-light">
            Watch 2all.ai scan, highlight, and automatically resolve critical accessibility violations across web interfaces instantly.
          </p>
        </div>

        {/* Presentation Stage */}
        <div className="relative w-full h-[620px] flex items-center justify-center overflow-hidden">
          
          {/* ======================================================== */}
          {/* SCREEN 1: MOBILE SCANNER (Index 1)                      */}
          {/* ======================================================== */}
          <motion.div
            animate={getScreenStyles(1)}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
            className="absolute w-[280px] h-[540px] bg-white border-[10px] border-slate-950 rounded-[44px] shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Top Bar Notch / Speaker */}
            <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-40 bg-white">
              <div className="w-24 h-4 bg-slate-950 rounded-b-xl" />
            </div>

            {/* Mobile Header */}
            <div className="pt-8 px-4 flex justify-between items-center z-10 bg-white">
              <span className="text-[10px] font-bold text-slate-800 tracking-wider">SKISHOP</span>
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900" />
              </div>
            </div>

            {/* Product Body */}
            <div className="flex-1 px-4 py-4 flex flex-col justify-start relative z-10 bg-white overflow-hidden">
              {/* Product Image Frame */}
              <div className="relative w-full aspect-square rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center mb-4">
                <img
                  src="/images/white_puffer_jacket.png"
                  alt="Ski Puffer Jacket"
                  className="w-[85%] h-[85%] object-contain"
                />

                {/* AI Overlay Frame */}
                <AnimatePresence>
                  {phase === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute inset-0 border-2 transition-colors duration-300 ${
                        mobileImgFixed ? "border-emerald-500 bg-emerald-500/5" : "border-amber-400 bg-amber-400/5"
                      }`}
                    >
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-0.5 text-white ${
                          mobileImgFixed ? "bg-emerald-500" : "bg-amber-400"
                        }`}>
                          {mobileImgFixed ? (
                            <>
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Fixed
                            </>
                          ) : "Missing Alt text"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Info */}
              <div className="relative">
                {/* AI Text Overlay Frame */}
                <AnimatePresence>
                  {phase === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute -inset-1 border-2 rounded-lg transition-colors duration-300 ${
                        mobileTextFixed ? "border-emerald-500 bg-emerald-500/5" : "border-amber-400 bg-amber-400/5"
                      }`}
                    >
                      <div className="absolute -top-3 left-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-[6px] font-bold uppercase tracking-wider shadow-sm text-white ${
                          mobileTextFixed ? "bg-emerald-500" : "bg-amber-400"
                        }`}>
                          {mobileTextFixed ? "Fixed" : "Contrast Error"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h3 className={`text-md font-bold transition-colors ${mobileTextFixed ? "text-slate-900" : "text-slate-400"}`}>
                  Ski Puffer Jacket
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Premium Winter Outerwear</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-md font-extrabold text-slate-900">$125</span>
                <button className="bg-slate-900 text-white rounded-full px-4 py-1.5 text-[9px] font-bold tracking-wider">
                  ADD TO CART
                </button>
              </div>
            </div>

            {/* Floating Accessibility Scanner (Phase 1) */}
            <AnimatePresence>
              {phase === 1 && (
                <motion.div
                  initial={{ x: 100, y: 300, opacity: 0 }}
                  animate={
                    mobileImgFixed
                      ? mobileTextFixed
                        ? { x: -60, y: 260, opacity: 1 } // Position over Text
                        : { x: 50, y: 110, opacity: 1 } // Position over Image
                      : { x: 120, y: 380, opacity: 1 } // Initial floating entrance
                  }
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="absolute z-50 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
                >
                  <Accessibility className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ======================================================== */}
          {/* SCREEN 2: MAIN DASHBOARD & CODE EDITOR (Index 0)        */}
          {/* ======================================================== */}
          <motion.div
            animate={getScreenStyles(0)}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
            className="absolute w-[95vw] md:w-[680px] h-[460px] bg-slate-950/40 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header Address Bar */}
            <div className="px-6 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
                <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
              </div>
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg px-8 py-1.5 text-[9px] text-slate-400 tracking-wider">
                2all-ai.dashboard / app
              </div>
              <div className="w-12" />
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-6 flex gap-6 overflow-hidden">
              {/* Sidebar layout */}
              <div className="w-10 flex flex-col items-center gap-6 shrink-0 border-r border-slate-800/40 pr-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded bg-slate-800/50 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  </div>
                ))}
              </div>

              {/* Central components */}
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="flex gap-4">
                  {/* Circular chart card */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-900/60 border border-slate-800/60 p-3 flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Score</span>
                    <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-slate-800 fill-none" strokeWidth="3" />
                        <motion.circle
                          cx="24" cy="24" r="20"
                          className="stroke-blue-500 fill-none"
                          strokeWidth="3.5"
                          strokeDasharray="125"
                          initial={{ strokeDashoffset: 45 }}
                          animate={{ strokeDashoffset: cursorClicked ? 15 : 45 }}
                          transition={{ duration: 1.5 }}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black text-white">
                        {cursorClicked ? "96%" : "86%"}
                      </span>
                    </div>
                  </div>

                  {/* Graph card */}
                  <div className="flex-1 h-24 rounded-2xl bg-slate-900/60 border border-slate-800/60 p-3 flex flex-col justify-between">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Issues History</span>
                    <div className="w-full h-10 flex items-end justify-between px-2 gap-1.5">
                      {[30, 45, 55, 38, cursorClicked ? 12 : 72].map((height, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1 }}
                          className={`w-full rounded-t-sm ${i === 4 ? "bg-emerald-500" : "bg-indigo-500/60"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Send Money Pill mock */}
                <div className="bg-slate-900/30 border border-slate-800/40 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-white">
                      $76
                    </div>
                    <span className="text-[9px] text-slate-400">Payment Processed</span>
                  </div>
                  <span className="text-[8px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              </div>

              {/* Code Fix Popup (AI code suggestion) */}
              <div className="w-[280px] rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col justify-between relative shadow-xl">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-amber-400" /> AI Code Suggestion
                    </span>
                    <span className="text-[8px] text-slate-500 uppercase font-mono">index.html</span>
                  </div>

                  {/* Simulated Code Panel */}
                  <div className="bg-slate-950 rounded-lg p-3 font-mono text-[9px] text-slate-400 space-y-1.5 border border-slate-800/40 min-h-[140px]">
                    <div className="text-slate-600">&lt;div className="hero"&gt;</div>
                    <div className="pl-3 text-slate-600">&lt;img src="/hero.jpg" /&gt;</div>
                    <div className="pl-3 flex flex-col gap-0.5">
                      <div className="text-red-400 bg-red-950/20 border-l border-red-500 px-1 py-0.5">
                        - &lt;button className="bg-blue-600"&gt;
                      </div>
                      <motion.div
                        animate={{ 
                          height: cursorClicked ? "auto" : 0, 
                          opacity: cursorClicked ? 1 : 0 
                        }}
                        className="overflow-hidden text-emerald-400 bg-emerald-950/20 border-l border-emerald-500 px-1 py-0.5"
                      >
                        + &lt;button className="bg-blue-600" aria-label="Auto fix accessibility"&gt;
                      </motion.div>
                    </div>
                    <div className="pl-6 text-slate-400">&lt;span&gt;Auto-fix&lt;/span&gt;</div>
                    <div className="pl-3 text-slate-600">&lt;/button&gt;</div>
                    <div className="text-slate-600">&lt;/div&gt;</div>
                  </div>
                </div>

                {/* Fix Actions button */}
                <div className="flex gap-2 justify-end mt-4">
                  <span className="text-[8px] text-slate-500 uppercase self-center font-bold">JIRA</span>
                  <button
                    className={`rounded-lg px-4 py-2 text-[9px] font-black tracking-wide transition-all shadow-sm ${
                      cursorClicked
                        ? "bg-emerald-500 text-white shadow-emerald-500/10"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10"
                    }`}
                  >
                    {cursorClicked ? "FIXED ✓" : "AUTO FIX"}
                  </button>
                </div>

                {/* Simulated Sparkles on Click */}
                <AnimatePresence>
                  {showSparkles && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [1, 1.4, 0], opacity: [0, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute bottom-6 right-6 pointer-events-none"
                    >
                      <Sparkles className="w-12 h-12 text-amber-400 fill-amber-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Simulated Mouse Cursor (Phase 0) */}
            {phase === 0 && (
              <motion.div
                initial={{ x: 500, y: 350, opacity: 0 }}
                animate={
                  cursorClicked
                    ? { x: 615, y: 405, opacity: 1, scale: 0.85 } // Clicks the button
                    : { x: 480, y: 280, opacity: 1, scale: 1 }    // Hovering towards it
                }
                transition={{ duration: 1.2, ease: "easeInOut" }}
                className="absolute z-50 pointer-events-none w-5 h-5 bg-white border border-slate-900 shadow-md rounded-full origin-top-left"
                style={{
                  clipPath: "polygon(0 0, 100% 70%, 45% 70%, 0 100%)",
                }}
              />
            )}
          </motion.div>

          {/* ======================================================== */}
          {/* SCREEN 3: DESKTOP SCANNER (Index 2)                     */}
          {/* ======================================================== */}
          <motion.div
            animate={getScreenStyles(2)}
            transition={{ type: "spring", stiffness: 70, damping: 18 }}
            className="absolute w-[95vw] md:w-[680px] h-[460px] bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between"
          >
            {/* Header Address Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200" />
              </div>
              <div className="bg-slate-100 rounded-lg px-12 py-1 text-[9px] text-slate-500 font-medium">
                https://acme.web
              </div>
              <div className="w-12" />
            </div>

            {/* Desktop Web Body */}
            <div className="flex-1 p-8 bg-slate-950 flex flex-col justify-between relative overflow-hidden text-white">
              
              {/* Decorative Web Background */}
              <div className="absolute -top-1/4 -right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[60px]" />

              {/* Web Header */}
              <div className="flex justify-between items-center z-10 shrink-0">
                <span className="text-xs font-black tracking-tight">acme.web</span>
                <div className="flex items-center gap-4 text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  <span>About Us</span>
                  <span>Services</span>
                  <span>Our Teams</span>
                  <span className="text-white border border-slate-700 rounded-full px-3 py-1 bg-slate-900/60">
                    Contact Us
                  </span>
                </div>
              </div>

              {/* Web Hero Section */}
              <div className="my-auto max-w-md flex flex-col gap-3 text-left z-10 relative p-1.5">
                {/* AI Title Highlight */}
                <AnimatePresence>
                  {phase === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute -inset-2 border-2 rounded-xl transition-colors duration-300 ${
                        desktopTitleFixed ? "border-emerald-500 bg-emerald-500/5" : "border-amber-400 bg-amber-400/5"
                      }`}
                    >
                      <div className="absolute -top-3.5 left-2">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider shadow-sm text-white ${
                          desktopTitleFixed ? "bg-emerald-500" : "bg-amber-400"
                        }`}>
                          {desktopTitleFixed ? "Alt Tag Added" : "Aria Landmark Missing"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <h1 className={`text-4xl font-black tracking-tight transition-colors leading-tight ${
                  desktopTitleFixed ? "text-white" : "text-slate-400"
                }`}>
                  Powerful Digital Agency
                </h1>
                <p className="text-xs text-slate-400 leading-relaxed max-w-[340px]">
                  Innovating branding and high-performance design to scale businesses and amplify global connectivity.
                </p>
              </div>

              {/* Web CTA Section */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800/60 z-10 shrink-0 relative">
                
                {/* AI Button Highlight */}
                <AnimatePresence>
                  {phase === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`absolute -inset-1 border-2 rounded-xl transition-colors duration-300 ${
                        desktopBtnFixed ? "border-emerald-500 bg-emerald-500/5" : "border-amber-400 bg-amber-400/5"
                      }`}
                    >
                      <div className="absolute -top-3.5 left-1">
                        <span className={`px-1.5 py-0.5 rounded-full text-[5px] font-bold uppercase tracking-wider text-white ${
                          desktopBtnFixed ? "bg-emerald-500" : "bg-amber-400"
                        }`}>
                          {desktopBtnFixed ? "Contrast Fixed" : "Contrast Ratio 2.4:1"}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-2">
                  <button className="bg-slate-900 border border-slate-700 hover:bg-slate-850 text-white rounded-full px-5 py-2 text-[9px] font-bold tracking-wider">
                    Learn More
                  </button>
                  <button className={`rounded-full px-5 py-2 text-[9px] font-bold tracking-wider transition-all ${
                    desktopBtnFixed ? "bg-blue-600 text-white" : "bg-[#1f2937] text-slate-500"
                  }`}>
                    See projects
                  </button>
                </div>

                {/* Team Avatars mock */}
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-slate-950 bg-slate-800" />
                    ))}
                  </div>
                  <span className="text-[8px] text-slate-400 font-medium">500+ Clients</span>
                </div>
              </div>
            </div>

            {/* Floating Accessibility Scanner (Phase 2) */}
            <AnimatePresence>
              {phase === 2 && (
                <motion.div
                  initial={{ x: -100, y: 300, opacity: 0 }}
                  animate={
                    desktopTitleFixed
                      ? desktopBtnFixed
                        ? { x: -220, y: 340, opacity: 1 } // Position over button
                        : { x: -220, y: 150, opacity: 1 } // Position over title
                      : { x: -150, y: 300, opacity: 1 } // Initial floating entrance
                  }
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 60, damping: 15 }}
                  className="absolute z-50 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
                >
                  <Accessibility className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
