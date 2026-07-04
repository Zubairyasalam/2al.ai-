"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import siteConfig from "@/data/site-config.json";

const colorMap = {
  blue: { bg: "bg-blue-600", hover: "hover:bg-blue-700", text: "text-blue-600", border: "border-blue-600", shadow: "shadow-blue-500/5", shadowHover: "hover:shadow-blue-500/25 shadow-blue-500/10" },
  purple: { bg: "bg-purple-600", hover: "hover:bg-purple-700", text: "text-purple-600", border: "border-purple-600", shadow: "shadow-purple-500/5", shadowHover: "hover:shadow-purple-500/25 shadow-purple-500/10" },
  emerald: { bg: "bg-emerald-600", hover: "hover:bg-emerald-700", text: "text-emerald-600", border: "border-emerald-600", shadow: "shadow-emerald-500/5", shadowHover: "hover:shadow-emerald-500/25 shadow-emerald-500/10" },
  indigo: { bg: "bg-indigo-600", hover: "hover:bg-indigo-700", text: "text-indigo-600", border: "border-indigo-600", shadow: "shadow-indigo-500/5", shadowHover: "hover:shadow-indigo-500/25 shadow-indigo-500/10" },
  orange: { bg: "bg-orange-600", hover: "hover:bg-orange-700", text: "text-orange-600", border: "border-orange-600", shadow: "shadow-orange-500/5", shadowHover: "hover:shadow-orange-500/25 shadow-orange-500/10" },
};

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Perfect for small websites and blogs just getting started with accessibility.",
    features: [
      "Up to 100 pages scanned/month",
      "Basic AI fix suggestions",
      "Monthly automated scans",
      "Standard PDF reports",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    description: "Ideal for growing businesses and agencies managing multiple client sites.",
    features: [
      "Up to 1,000 pages scanned/month",
      "Advanced AI fixes (Alt text, ARIA)",
      "Weekly automated scans",
      "Detailed PDF & CSV exports",
      "API Access (100 req/day)",
      "Priority email support",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations requiring comprehensive monitoring and integrations.",
    features: [
      "Unlimited pages scanned",
      "Full AI auto-fix suite",
      "Daily automated scans",
      "CI/CD Pipeline Integration",
      "Unlimited API Access",
      "Dedicated Account Manager",
      "SSO & Advanced Security",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const theme = colorMap[siteConfig.primaryColor as keyof typeof colorMap] || colorMap.blue;

  return (
    <section id="pricing" className="py-24 bg-slate-50 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Simple, transparent <span className={theme.text}>pricing</span>
          </h2>
          <p className="text-lg text-slate-600">
            Choose the plan that fits your needs. All plans include a {siteConfig.trialPeriodDays}-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-8 flex flex-col border transition-all ${
                plan.popular
                  ? `${theme.border} shadow-xl ${theme.shadow} scale-105 md:scale-105 z-10`
                  : "border-slate-200 shadow-sm hover:border-slate-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className={`${theme.bg} text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-md`}>
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-950 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {plan.name === "Starter" ? `$${siteConfig.proPrice}` : plan.name === "Professional" ? `$${siteConfig.proPrice * 3}` : plan.price}
                  </span>
                  {plan.price !== "Custom" && <span className="text-slate-500 font-medium">/mo</span>}
                </div>
                <p className="text-sm text-slate-600 mt-4 min-h-[40px] leading-relaxed">{plan.description}</p>
              </div>

              <div className="flex-1">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 ${theme.text} shrink-0`} />
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={plan.price === "Custom" ? "/contact" : "/register"}
                className={`w-full py-3.5 rounded-xl text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? `${theme.bg} text-white ${theme.hover} shadow-md ${theme.shadowHover}`
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
