"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Accessibility,
  MessageSquare,
  Check,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Eye,
  EyeOff,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import Logo from "@/components/ui/Logo";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const [step, setStep] = useState(1);
  const [website, setWebsite] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password validation regex checks
  const hasMinLength = password.length >= 7;
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim()) {
      setError("Please enter your website URL to continue.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password requirements before submit
    if (!hasMinLength || !hasMixedCase || !hasNumber) {
      setError("Please meet all password requirements before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, website }),
      });

      const data = await res.json().catch(() => ({ message: "Please restart your Next.js development server (npm run dev) to apply the Prisma database changes." }));

      if (!res.ok) {
        setError(data.message || "Failed to register.");
      } else {
        // Automatically sign in the user
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginRes?.error) {
          // Fallback to login redirect if automatic sign-in fails
          setSuccess(true);
          setTimeout(() => {
            if (plan) {
              router.push(`/login?plan=${plan}&billing=${billing || "yearly"}`);
            } else {
              const encodedSite = encodeURIComponent(website.trim());
              router.push(`/login?trial=1&site=${encodedSite}`);
            }
          }, 2000);
        } else {
          setSuccess(true);
          setTimeout(() => {
            if (plan) {
              router.push(`/checkout?plan=${plan}&billing=${billing || "yearly"}`);
            } else {
              // Redirect to dashboard with trial modal trigger + prefilled website
              const encodedSite = encodeURIComponent(website.trim());
              router.push(`/dashboard?trial=1&site=${encodedSite}`);
            }
          }, 1500);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Helper checkmark circle component
  const ReqCheck = ({ isValid }: { isValid: boolean }) => (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${isValid ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400 border border-slate-200/80"}`}>
      <Check className="w-2.5 h-2.5 stroke-[3.5]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col justify-between relative overflow-x-hidden font-sans text-slate-900 select-none">

      {/* HEADER BAR */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 py-6 grid grid-cols-3 items-center z-10">
        {/* Left: Back button (visible only in step 2) */}
        <div className="flex justify-start">
          <AnimatePresence>
            {step === 2 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => {
                  setStep(1);
                  setShowPasswordPopup(false);
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-extrabold text-sm transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                Back
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Center: Centered Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Logo height={64} className="self-center" />
          </Link>
        </div>

        {/* Right: Log in link */}
        <div className="flex justify-end">
          <span className="text-sm font-medium text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-blue-600 hover:text-blue-700 transition-colors ml-1">
              Log in
            </Link>
          </span>
        </div>
      </header>

      {/* CENTER CARD CONTAINER */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-[32px] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-100/80 max-w-4xl w-full p-8 md:p-14 grid md:grid-cols-2 gap-10 md:gap-16 items-start"
        >
          {/* LEFT COLUMN: Features & Steps */}
          <div className="flex flex-col justify-between h-full min-h-[220px]">
            <div>
              {/* Step indicator capsule dots */}
              <div className="flex items-center gap-1.5 mb-8">
                <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? "w-8 bg-blue-600" : "w-2 bg-blue-600"}`} />
                <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? "w-8 bg-blue-600" : "w-2 bg-slate-200"}`} />
              </div>

              {/* Step Heading */}
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-[1.2] tracking-tight mb-6">
                {step === 1 ? (
                  "Whatever your accessibility needs, we've got you covered"
                ) : (
                  "Add your details"
                )}
              </h2>

              {/* Step Description */}
              <p className="text-sm font-semibold text-slate-500 leading-relaxed">
                {step === 1 ? (
                  "Start scanning your site and making it accessible with a click."
                ) : (
                  "Add your full name, business email and a password you'll remember."
                )}
              </p>
            </div>

            {/* Bullets List (Visible only on Step 1) */}
            {step === 1 && (
              <div className="space-y-4 mt-8">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    Free 7-day trial - no credit card required
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Form Fields */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">Registration Successful!</h3>
                  <p className="text-slate-500 text-sm font-semibold">Redirecting to login...</p>
                </motion.div>
              ) : step === 1 ? (
                /* STEP 1 FORM: WEBSITE URL */
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleNextStep}
                  className="space-y-6"
                >
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Enter your website <span className="text-red-500">*</span>
                    </label>
                    <div className="flex rounded-xl border border-slate-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 overflow-hidden shadow-sm transition-all bg-white">
                      <div className="bg-slate-50 border-r border-slate-100 px-4 flex items-center gap-1.5 text-slate-400 font-bold text-xs select-none shrink-0">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span>www.</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="flex-1 px-4 py-3.5 bg-white text-slate-900 placeholder-slate-300 focus:outline-none text-sm font-semibold"
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-1 shadow-md shadow-blue-500/15 transition-all text-sm uppercase tracking-wider cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 stroke-[3]" />
                  </button>
                </motion.form>
              ) : (
                /* STEP 2 FORM: ACCOUNT INFO (AS SHOWN IN SCREENSHOT) */
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold">
                      {error}
                    </div>
                  )}

                  {/* Continue with Google */}
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                    className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all text-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.842 1.091 15.114 0 12 0 7.354 0 3.327 2.673 1.341 6.577l3.925 3.188z" />
                      <path fill="#34A853" d="M16.04 15.345c-1.07.728-2.43 1.164-4.04 1.164a7.077 7.077 0 0 1-6.75-4.909l-3.925 3.188c1.986 3.905 6.013 6.577 10.675 6.577 3.09 0 5.864-1.036 7.84-2.827l-3.8-2.993z" />
                      <path fill="#4285F4" d="M23.864 12.273c0-.818-.073-1.636-.218-2.427H12v4.61h6.654a5.69 5.69 0 0 1-2.463 3.73l3.8 2.993c2.218-2.045 4.318-5.073 4.318-8.906z" />
                      <path fill="#FBBC05" d="M5.25 12c0-.527.09-1.036.25-1.527L1.575 7.285A11.954 11.954 0 0 0 0 12c0 1.68.345 3.28.97 4.736l3.913-3.18c-.16-.49-.25-.99-.25-1.556z" />
                    </svg>
                    Continue with Google
                  </button>

                  {/* "or" Divider */}
                  <div className="flex items-center gap-4 text-slate-300 text-xs font-bold uppercase tracking-wider justify-center">
                    <div className="h-px bg-slate-100 flex-1" />
                    <span>or</span>
                    <div className="h-px bg-slate-100 flex-1" />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-semibold transition-all shadow-sm"
                    />
                  </div>

                  {/* Company Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Enter your company email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-semibold transition-all shadow-sm"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative z-10">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setShowPasswordPopup(true)}
                        className="w-full px-4 py-3.5 pr-10 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm font-semibold transition-all shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <Eye className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>

                    {/* Requirements validation bar */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 font-semibold mt-2.5 select-none">
                      <div className="flex items-center gap-1.5">
                        <ReqCheck isValid={hasMinLength} />
                        <span>7+ Characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ReqCheck isValid={hasMixedCase} />
                        <span>1 Upper & Lower case</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ReqCheck isValid={hasNumber} />
                        <span>1 Number</span>
                      </div>
                    </div>

                    {/* Transparent Click-Outside Backdrop for Password Popup */}
                    {showPasswordPopup && (
                      <div
                        className="fixed inset-0 z-20 cursor-default"
                        onClick={() => setShowPasswordPopup(false)}
                      />
                    )}

                    {/* Simulated Google Password Manager Popup Dialog */}
                    <AnimatePresence>
                      {showPasswordPopup && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 md:left-auto md:-right-8 top-full mt-3 bg-white border border-slate-200/80 rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.08)] p-5 z-30 w-full max-w-[380px] text-left"
                        >
                          {/* Triangle Speech bubble arrow */}
                          <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-slate-200/80 -mt-[25.5px] left-10 md:left-auto md:right-16 absolute z-30" />

                          <div className="flex items-start gap-3 relative z-31">
                            {/* Colorful Key Icon */}
                            <div className="mt-0.5 shrink-0 flex items-center">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                                <path d="M11.5 12h5.5v1.5h-1v1h-1.5v-1h-3v-1.5Z" fill="#FBBC05" />
                                <circle cx="8.5" cy="12" r="2.5" fill="#4285F4" />
                                <circle cx="8.5" cy="12" r="1" fill="#EA4335" />
                                <rect x="14" y="12.5" width="1.5" height="2" rx="0.5" fill="#34A853" />
                              </svg>
                            </div>
                            <h4 className="text-xs font-bold text-slate-800 leading-snug">
                              Google Password Manager created a strong password for this website
                            </h4>
                          </div>

                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2.5 relative z-31">
                            You won't need to remember this password. It will be saved to Google Password Manager for zubairyasalamkhan213@gmail.com.
                          </p>

                          <div className="flex justify-end gap-2.5 mt-4 relative z-31">
                            <button
                              type="button"
                              onClick={() => setShowPasswordPopup(false)}
                              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 font-extrabold text-[11px] rounded-full transition-colors cursor-pointer"
                            >
                              Choose your own
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPassword("R!Ehd$4s6bApHDF");
                                setShowPasswordPopup(false);
                              }}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-full transition-colors cursor-pointer"
                            >
                              Use strong password
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 transition-all text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                      </>
                    )}
                  </button>

                  {/* Terms & Privacy */}
                  <p className="text-[11px] text-slate-400 font-semibold text-center mt-4 leading-normal">
                    By signing up, you agree to our{" "}
                    <Link href="/terms" className="text-blue-500 hover:underline">
                      Terms of Use
                    </Link>{" "}
                    and acknowledge you've read our{" "}
                    <Link href="/privacy" className="text-blue-500 hover:underline">
                      Privacy Notice
                    </Link>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* FOOTER: TRUST LOGOS */}
      <footer className="w-full pb-8 pt-4 z-10 shrink-0">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mb-6">
          Trusted by over 100,000 businesses worldwide
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 max-w-4xl mx-auto px-6 select-none opacity-40">
          <span className="font-sans font-black text-lg tracking-tighter text-slate-900 uppercase">TOSHIBA</span>
          <span className="font-serif text-xs tracking-[0.25em] text-slate-900 uppercase">DOLCE & GABBANA</span>
          <span className="font-sans font-bold text-md text-slate-900 lowercase tracking-tight">playmobil</span>
          <span className="font-serif font-black text-md tracking-widest text-slate-900 uppercase">SEIKO</span>
          <span className="font-sans font-extrabold text-md text-slate-900 uppercase tracking-tight">Panasonic</span>
        </div>
      </footer>

      {/* FLOATING ACTION ICONS IN BOTTOM-RIGHT */}
      <div className="fixed bottom-6 right-6 flex items-center gap-3.5 z-50">
        {/* Chat circle */}
        <button className="w-12 h-12 rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
          <MessageSquare className="w-5 h-5 fill-none stroke-current" />
        </button>
        {/* Accessibility circle */}
        <button className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer">
          <Accessibility className="w-5 h-5 fill-none stroke-current stroke-[2]" />
        </button>
      </div>

    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
