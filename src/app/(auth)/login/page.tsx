"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, ChevronRight } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const billing = searchParams.get("billing");
  const trial = searchParams.get("trial");
  const site = searchParams.get("site");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        if (plan) {
          router.push(`/checkout?plan=${plan}&billing=${billing || "yearly"}`);
        } else if (trial === "1" && site) {
          router.push(`/dashboard?trial=1&site=${site}`);
        } else {
          router.push("/dashboard");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-800 select-none">
      
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 flex flex-col items-center">
        <Link href="/" className="flex items-center justify-center shrink-0">
          <Logo height={56} className="self-center" />
        </Link>
        <h2 className="mt-4 text-center text-[26px] font-black text-slate-900 tracking-tight leading-none">
          Welcome to 2all.ai
        </h2>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0"
      >
        <div className="bg-white border border-slate-200/80 py-8 px-6 sm:px-10 rounded-3xl shadow-xl space-y-5 text-left">
          
          {/* Continue with Google */}
          <button
            type="button"
            onClick={() => alert("Google login not implemented yet.")}
            className="w-full flex items-center justify-center gap-2.5 border border-slate-200/85 hover:bg-slate-50 text-slate-700 bg-white rounded-xl py-3 text-xs font-extrabold tracking-wider uppercase transition-all cursor-pointer"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          {/* Or Divider */}
          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-slate-400 font-bold lowercase">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Email address <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200/80 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">
                Password <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200/80 bg-slate-50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors border-none bg-transparent cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-start text-[11px] pt-1">
              <a href="#" className="font-extrabold text-blue-600 hover:text-blue-700 transition-colors">
                Forgot your password?
              </a>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#004bff] hover:bg-[#003edd] disabled:bg-blue-400 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              {loading && <Loader2 className="w-4.5 h-4.5 animate-spin" />}
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />}
            </button>
          </form>

          <div className="text-center text-xs font-bold text-slate-500 pt-2 border-t border-slate-50">
            Don't have an account yet?{" "}
            <Link 
              href={plan ? `/register?plan=${plan}&billing=${billing || "yearly"}` : "/register"} 
              className="text-blue-600 hover:text-blue-700 font-extrabold transition-colors"
            >
              Sign up
            </Link>
          </div>

          {/* SSO Login */}
          <div className="text-center text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer pt-1">
            SSO Login
          </div>

        </div>
      </motion.div>

    </div>
  );
}
