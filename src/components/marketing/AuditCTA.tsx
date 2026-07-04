"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Globe, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AuditCTA() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState("Initializing compliance checks...");
  const [placeholder, setPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const placeholders = [
    "yoursite.com",
    "acme.web",
    "yourstore.com",
    "myagency.org",
    "portfolio.co"
  ];

  // Typing effect loop for input placeholder
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentText = placeholders[typingIndex];
    
    if (isScanning) return; // Stop typing during scan

    if (isDeleting) {
      timer = setTimeout(() => {
        setPlaceholder(currentText.substring(0, charIndex - 1));
        setCharIndex(prev => prev - 1);
      }, 50);
    } else {
      timer = setTimeout(() => {
        setPlaceholder(currentText.substring(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 100);
    }

    if (!isDeleting && charIndex === currentText.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTypingIndex(prev => (prev + 1) % placeholders.length);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex, isScanning]);

  // Handle Scan Progress Count-up
  useEffect(() => {
    if (!isScanning) return;

    setScanProgress(0);
    setScanStatus("Initializing compliance checks...");

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(interval);
          setScanStatus("Audit complete! Redirecting...");
          
          // Redirect after completion
          setTimeout(() => {
            setIsScanning(false);
            window.location.href = `/register?scanUrl=${encodeURIComponent(url || placeholder)}`;
          }, 1000);
          return 100;
        }

        // Dynamically adjust status texts based on percentage
        if (next < 25) {
          setScanStatus("Checking contrast ratios & font sizes...");
        } else if (next >= 25 && next < 55) {
          setScanStatus("Analyzing landmarks & screen reader accessibility tags...");
        } else if (next >= 55 && next < 85) {
          setScanStatus("Validating keyboard focus flow & interactive elements...");
        } else {
          setScanStatus("Compiling WCAG 2.2 audit compliance score...");
        }

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !placeholder) return;
    setIsScanning(true);
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Sleek Matte Black Card Container */}
        <div className="relative w-full bg-zinc-950 border border-zinc-800/80 rounded-[40px] px-8 py-16 md:p-20 overflow-hidden shadow-2xl shadow-black/40">
          
          {/* Subtle Grid Backdrop (Inspired by Pinterest Pin) */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="auditGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#auditGrid)" />
            </svg>
          </div>

          {/* Deep glowing purple-cyan radial flare inside container */}
          <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

          {/* Contents Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Headline */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <h2 className="text-4xl md:text-5xl lg:text-[48px] font-black text-white leading-[1.15] tracking-tight">
                Put your website to the <span className="italic text-cyan-400 font-extrabold font-serif">test</span>
              </h2>
              <p className="text-zinc-400 text-base md:text-lg font-light max-w-lg leading-relaxed">
                One compliance gap can expose your business to costly accessibility lawsuits. Scan your site instantly.
              </p>
            </div>

            {/* Right Form & Progress Container */}
            <div className="lg:col-span-5 w-full">
              <AnimatePresence mode="wait">
                {!isScanning ? (
                  /* SLEEK INPUT FORM */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative w-full"
                  >
                    {/* Glowing outer violet ring on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-[24px] blur-md opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Input wrapper */}
                    <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-[20px] p-2 flex items-center justify-between shadow-inner backdrop-blur-md">
                      <div className="flex-1 flex items-center pl-4 gap-3">
                        <Globe className="w-5 h-5 text-zinc-500 shrink-0" />
                        <input
                          type="text"
                          placeholder={placeholder ? `https://${placeholder}` : "https://yoursite.com"}
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="w-full bg-transparent border-none text-white placeholder-zinc-600 text-sm md:text-base font-bold focus:outline-none focus:ring-0"
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        className="bg-white hover:bg-slate-100 text-black rounded-xl px-6 py-3.5 text-xs md:text-sm font-black tracking-wider uppercase flex items-center gap-2 transition-all shadow-md shrink-0 shadow-black/10 hover:shadow-black/20"
                      >
                        Get Audit
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  /* SIMULATED PROGRESS SCANNING CARD WITH SLIDING FILE ANIMATION */
                  <motion.div
                    key="scan-group"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 w-full"
                  >
                    {/* Visual file cards sliding down (Inspired by Pinterest video file drop) */}
                    <div className="relative h-20 w-full overflow-hidden flex items-center justify-center">
                      <AnimatePresence mode="wait">
                        {scanProgress < 33 ? (
                          <motion.div
                            key="file-html"
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3.5 shadow-xl shadow-black/30"
                          >
                            <FileText className="w-5 h-5 text-blue-400 animate-pulse" />
                            <div className="text-left">
                              <span className="text-xs font-black text-white block">index.html</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">HTML DOM CHECK</span>
                            </div>
                          </motion.div>
                        ) : scanProgress >= 33 && scanProgress < 66 ? (
                          <motion.div
                            key="file-css"
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3.5 shadow-xl shadow-black/30"
                          >
                            <FileText className="w-5 h-5 text-indigo-400 animate-pulse" />
                            <div className="text-left">
                              <span className="text-xs font-black text-white block">styles.css</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CSS Contrast SCAN</span>
                            </div>
                          </motion.div>
                        ) : scanProgress >= 66 && scanProgress < 100 ? (
                          <motion.div
                            key="file-js"
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                            className="absolute bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-3.5 shadow-xl shadow-black/30"
                          >
                            <FileText className="w-5 h-5 text-violet-400 animate-pulse" />
                            <div className="text-left">
                              <span className="text-xs font-black text-white block">main.js</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">JS Interactivity TEST</span>
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    {/* Progress Card */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full bg-zinc-900/80 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-lg shadow-xl shadow-black/35 relative"
                    >
                      <div className="space-y-4">
                        {/* Top Info Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-violet-400" />
                            </div>
                            <div className="text-left">
                              <span className="text-xs font-semibold text-zinc-500 block">TARGET URL</span>
                              <span className="text-sm font-extrabold text-white truncate max-w-[200px] block">
                                {url || placeholder}
                              </span>
                            </div>
                          </div>
                          {/* Percentage */}
                          <div className="text-right">
                            <span className="text-2xl font-black text-cyan-400 font-mono">
                              {scanProgress}%
                            </span>
                          </div>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden p-[1px] border border-zinc-800">
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: `${scanProgress}%` }}
                            transition={{ duration: 0.15 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400"
                          />
                        </div>

                        {/* Scanned Details Checklist */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            <span className="text-xs font-bold text-zinc-400">
                              {scanStatus}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            ADA / WCAG 2.2
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
