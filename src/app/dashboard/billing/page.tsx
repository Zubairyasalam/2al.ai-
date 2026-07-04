import { auth } from "@/lib/auth";
import { CreditCard, Check } from "lucide-react";
import Link from "next/link";

const plans = [
  { name: "Starter", price: "$49", features: ["100 pages/month", "Basic AI fixes", "PDF reports"] },
  { name: "Professional", price: "$149", features: ["1,000 pages/month", "Advanced AI", "API Access"], popular: true },
  { name: "Enterprise", price: "Custom", features: ["Unlimited pages", "Full AI suite", "Dedicated support"] },
];

export default async function BillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-1">Manage your subscription and payment details.</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Current Plan</p>
            <p className="text-lg font-bold text-white">Free Trial</p>
          </div>
          <span className="ml-auto text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
            Active
          </span>
        </div>
        <p className="text-sm text-gray-400">
          Your free trial gives you access to 5 scans and basic reports. Upgrade to unlock full AI features.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card rounded-2xl p-6 flex flex-col ${plan.popular ? "border-blue-500/30" : ""}`}
          >
            {plan.popular && (
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-bold text-white">{plan.name}</h3>
            <p className="text-3xl font-bold text-white mt-2 mb-4">
              {plan.price}
              {plan.price !== "Custom" && <span className="text-sm text-gray-400 font-normal">/mo</span>}
            </p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${plan.popular ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {plan.price === "Custom" ? "Contact Sales" : "Upgrade Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
