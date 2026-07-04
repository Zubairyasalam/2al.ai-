"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Loader2, CreditCard, ShieldCheck, ArrowLeft, AlertCircle, Info } from "lucide-react";
import Logo from "@/components/ui/Logo";

// Helper to dynamically load external scripts
function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const plan = searchParams.get("plan") || "micro";
  const billing = searchParams.get("billing") || "yearly";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderInfo, setOrderInfo] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);

  // Map plan price Copy
  const planDetails: Record<string, { title: string; price: number; desc: string }> = {
    micro: { title: "Micro Plan", price: billing === "yearly" ? 490 : 49, desc: "Under 999 pages website volume" },
    business: { title: "Business Plan", price: billing === "yearly" ? 1490 : 149, desc: "Under 29,999 pages website volume" },
    advanced: { title: "Advanced Plan", price: billing === "yearly" ? 3990 : 399, desc: "Under 999,999 pages website volume" }
  };

  const selectedPlan = planDetails[plan.toLowerCase()] || planDetails.micro;

  useEffect(() => {
    // 1. Enforce authentication
    if (status === "unauthenticated") {
      router.push(`/register?plan=${plan}&billing=${billing}`);
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      initializePayment();
    }
  }, [status, session]);

  const initializePayment = async () => {
    setLoading(true);
    setError("");

    try {
      // 2. Fetch Razorpay Order from server API
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, billing })
      });

      if (!res.ok) {
        throw new Error("Failed to initialize payment gateway order.");
      }

      const data = await res.json();
      setOrderInfo(data);

      // 3. Load Razorpay scripts if live mode keys exist
      if (!data.mock) {
        const scriptLoaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        if (!scriptLoaded) {
          throw new Error("Razorpay SDK failed to load. Check your network connection.");
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred starting checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleLivePayment = () => {
    if (!orderInfo || orderInfo.mock) return;

    try {
      const options = {
        key: orderInfo.keyId,
        amount: orderInfo.amount,
        currency: orderInfo.currency,
        name: "2all.ai",
        description: `2all.ai ${plan.toUpperCase()} Subscription Plan`,
        image: "/images/logo.png",
        order_id: orderInfo.orderId,
        handler: async function (response: any) {
          setVerifying(true);
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan,
                usdPrice: selectedPlan.price,
                email: session?.user?.email,
                mock: false
              })
            });

            if (verifyRes.ok) {
              router.push("/dashboard?subscribed=success");
            } else {
              const data = await verifyRes.json();
              setError(data.message || "Payment verification failed.");
            }
          } catch (e) {
            setError("Failed to verify transaction signature.");
          } finally {
            setVerifying(false);
          }
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || ""
        },
        theme: {
          color: "#004bff"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Failed to open Razorpay script modal.");
    }
  };

  // Safe Fallback test mode buyer
  const handleMockPayment = async () => {
    setVerifying(true);
    setError("");

    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderInfo?.orderId || `mock_order_${Date.now()}`,
          razorpay_payment_id: `mock_pay_${Date.now()}`,
          razorpay_signature: "mock_sig_valid",
          plan: plan.toUpperCase(),
          usdPrice: selectedPlan.price,
          email: session?.user?.email,
          mock: true
        })
      });

      if (verifyRes.ok) {
        router.push("/dashboard?subscribed=success");
      } else {
        const data = await verifyRes.json();
        setError(data.message || "Mock payment verification failed.");
      }
    } catch (e) {
      setError("Connection failure during mock verification.");
    } finally {
      setVerifying(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-xs text-slate-400 font-bold">Contacting secure payment gateway...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-md mx-auto">
      {/* Back button */}
      <Link 
        href="/pricing" 
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to pricing
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="pb-4 border-b border-slate-100 flex flex-col items-center text-center">
          <Logo height={48} className="mb-4" />
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Checkout Order</h2>
          <p className="text-xs text-slate-400 font-bold">Confirm your plan settings below to continue.</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Plan Specs */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">Plan Details:</span>
            <strong className="text-slate-950 font-black">{selectedPlan.title}</strong>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">Billing Cycle:</span>
            <strong className="text-slate-950 font-black uppercase">{billing}</strong>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/40">
            <span className="text-slate-400 font-bold">Amount Due:</span>
            <strong className="text-slate-950 font-black text-base">${selectedPlan.price} USD</strong>
          </div>
        </div>

        {/* Payment actions */}
        <div className="space-y-3">
          {verifying ? (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying signature receipt...
            </div>
          ) : orderInfo?.mock ? (
            /* SANDBOX MOCK MODE */
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-100 text-amber-800 text-[11px] font-bold rounded-xl flex items-start gap-2">
                <Info className="w-4.5 h-4.5 shrink-0 text-amber-500 mt-0.5" />
                <span>Running in Sandbox Mode (No active keys found). Complete a mock payment to test database updates and SMTP email receipt alerts.</span>
              </div>
              <button
                onClick={handleMockPayment}
                className="w-full py-3 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <CreditCard className="w-4.5 h-4.5" />
                Complete Sandbox Purchase
              </button>
            </div>
          ) : (
            /* LIVE PAYMENTS MODE */
            <button
              onClick={handleLivePayment}
              className="w-full py-3 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
            >
              <CreditCard className="w-4.5 h-4.5" />
              Pay with Razorpay
            </button>
          )}

          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-Bit SSL Encryption</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#f4f7f9] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-slate-800">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-xs text-slate-400 font-bold">Loading secure portal...</p>
          </div>
        }>
          <CheckoutContent />
        </Suspense>
      </div>
    </SessionProvider>
  );
}
