"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { Shield, Lock, Mail, Loader2, Key } from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function AdminLoginForm({ errorMsg }: { errorMsg?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorMsg || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear any active customer session (like nancy) to prevent session lock conflicts
    signOut({ redirect: false });
  }, []);

  const handleAutoFill = () => {
    setEmail("aiadmin@gmail.com");
    setPassword("admin123");
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        // Successful login, redirect to admin panel
        router.push("/admin");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-left">

      {/* Title */}
      <div className="flex flex-col items-center text-center space-y-3 mb-6 select-none">
        <Logo height={50} className="self-center" />
        <h2 className="text-xl font-black text-white tracking-tight mt-3">Admin Portal</h2>
        <div>
          <p className="text-xs text-slate-500 font-semibold mt-1">Sign in to manage website settings & users</p>
        </div>
      </div>

      {/* Access Denied / Error Alerts */}
      {error && (
        <div className="mb-5 p-4 rounded-2xl bg-red-950/40 border border-red-900/60 text-red-400 text-xs font-semibold leading-relaxed">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              placeholder="aiadmin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-xs font-bold text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider"
        >
          {loading ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              Verifying credentials...
            </>
          ) : (
            "Authenticate Admin"
          )}
        </button>

      </form>

      {/* Auto-fill Helper Banner */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-left">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-start gap-2.5">
            <Key className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Test Credentials</span>
              <p className="text-[10px] text-slate-500 font-bold leading-normal">
                Email: <span className="text-slate-300 select-all">aiadmin@gmail.com</span> <br />
                Password: <span className="text-slate-300 select-all">admin123</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleAutoFill}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800/80 text-amber-400 hover:text-amber-300 font-extrabold text-[10px] rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer uppercase tracking-wider select-none focus:outline-none"
          >
            One-Click Auto fill
          </button>
        </div>
      </div>

    </div>
  );
}
