"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { X, Globe, Check } from "lucide-react";

export default function FreeTrialModal() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (searchParams.get("trial") === "1") {
      const site = searchParams.get("site") || "";
      setWebsite(decodeURIComponent(site));
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    // Clean URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete("trial");
    url.searchParams.delete("site");
    window.history.replaceState({}, "", url.pathname);
  };

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim()) return;
    setIsOpen(false);
    router.push("/dashboard/install");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT: Form Panel */}
        <div className="flex-1 p-8 md:p-10 text-left">
          {/* Logo + Close */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white stroke-[2.5]">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12h8M12 8v8" />
                </svg>
              </div>
              <span className="text-sm font-black text-slate-800">accessWidget</span>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors bg-transparent border-none cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
            Start your 7-day free trial
          </h2>

          <form onSubmit={handleStartTrial} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Your website <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
                <span className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-slate-400 text-xs font-semibold shrink-0 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  www.
                </span>
                <input
                  type="text"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yourwebsite.com"
                  className="flex-1 px-3 py-2.5 text-sm font-semibold text-slate-800 bg-white border-none outline-none placeholder:text-slate-300"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">
                Need more websites? Add them one by one, or{" "}
                <span className="text-blue-600 cursor-pointer font-bold">talk to us</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
              <p className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                Get up and running in just a few steps
              </p>
              {[
                "Install the code snippet",
                "AI starts scanning your site",
                "See results in under 48 hrs",
              ].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3.5] stroke-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{step}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-extrabold hover:bg-slate-50 transition-colors bg-transparent cursor-pointer"
              >
                Skip to purchase
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-colors border-none cursor-pointer flex items-center justify-center gap-2"
              >
                Start free trial
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[3] stroke-current fill-none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: Decorative Panel */}
        <div className="hidden md:block relative w-64 shrink-0 overflow-hidden">
          <img
            src="/images/dashboard/trial_modal_banner.png"
            alt="2all.ai Accessibility Widget Preview"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
          <div className="absolute bottom-6 left-5 right-5 text-white text-left">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-2">
              Trusted by 300,000+ websites
            </p>
            <p className="text-sm font-black leading-snug">
              The #1 rated web accessibility platform for ADA &amp; WCAG compliance
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
