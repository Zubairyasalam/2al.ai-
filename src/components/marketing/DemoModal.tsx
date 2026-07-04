"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [website, setWebsite] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const fullPhone = `${phonePrefix} ${phoneNumber}`;
      const res = await fetch("/api/admin/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: fullPhone, website }),
      });

      if (res.ok) {
        setSuccess(true);
        // Clear fields
        setName("");
        setEmail("");
        setPhoneNumber("");
        setWebsite("");
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative z-10 text-left select-none"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>

            {success ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-md">
                  <CheckCircle2 className="w-9 h-9 stroke-[2]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Demo Scheduled!</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-xs leading-relaxed">
                    Thank you! We've received your request and will reach out to you within 24 business hours to coordinate.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer border-none uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Form State */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Header */}
                <div className="pb-1">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Schedule an Accessibility Demo</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Let our experts walk you through full WCAG compliance.</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                    {error}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Full name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Business Email <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Phone number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5 relative">
                      <select
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-2 py-2.5 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-bold cursor-pointer appearance-none text-center"
                      >
                        <option value="+91">India (भारत)</option>
                        <option value="+1">United States</option>
                        <option value="+44">United Kingdom</option>
                        <option value="+61">Australia</option>
                      </select>
                    </div>
                    <div className="col-span-7">
                      <input
                        type="tel"
                        required
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                    Website link <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                  />
                </div>

                {/* Consent notice */}
                <p className="text-[10.5px] text-slate-400 leading-normal font-bold pt-1">
                  By pressing the button, you agree to accessiBe's{" "}
                  <a href="#" className="text-slate-500 underline hover:text-slate-800">
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-slate-500 underline hover:text-slate-800">
                    privacy notice
                  </a>
                  .
                </p>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 bg-[#004bff] hover:bg-[#003edd] disabled:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
                >
                  {loading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
                  {loading ? "Scheduling..." : "SCHEDULE A DEMO"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
