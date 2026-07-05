"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "MICRO",
      desc: "Family-owned business and Entrepreneurs",
      price: "$490",
      period: "/year",
      isRecommended: false,
      delay: 0.1
    },
    {
      name: "GROWTH",
      desc: "Businesses experiencing rapid expansion",
      price: "$1,490",
      period: "/year",
      isRecommended: false,
      delay: 0.2
    },
    {
      name: "SCALE",
      desc: "Businesses expanding operations to support demand",
      price: "$3,990",
      period: "/year",
      isRecommended: true,
      delay: 0.3
    },
    {
      name: "ENTERPRISE",
      desc: "Established companies driving progress and growth",
      price: "Custom",
      period: "",
      isRecommended: false,
      delay: 0.4
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden select-none font-sans border-t border-slate-100">
      
      {/* Background Technical Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4 mb-20">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004bff] block">
            A Solution for Every Budget
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Plans customized to fit your<br />
            web accessibility needs
          </h2>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: plan.delay }}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer bg-white border ${
                plan.isRecommended
                  ? "border-[#004bff] shadow-xl shadow-blue-500/5 ring-1 ring-[#004bff]/20"
                  : "border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md"
              }`}
            >
              {/* Recommended Top Banner */}
              {plan.isRecommended && (
                <div className="absolute top-0 left-0 right-0 h-10 bg-[#02183a] rounded-t-[22px] flex items-center justify-center gap-1.5">
                  <span className="text-[10px] font-black text-white tracking-widest uppercase flex items-center gap-1">
                    ★ RECOMMENDED
                  </span>
                </div>
              )}

              {/* Main Content */}
              <div className={`space-y-6 text-left flex-grow ${plan.isRecommended ? "pt-6" : ""}`}>
                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold text-[#02183a] tracking-wider uppercase">
                    {plan.name}
                  </h3>
                  <p className="text-slate-500 text-sm font-normal leading-relaxed min-h-[40px]">
                    {plan.desc}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-slate-400 text-sm font-bold ml-1.5 uppercase tracking-wider">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 w-full">
                {plan.isRecommended ? (
                  <button className="w-full flex items-center justify-center gap-2 bg-[#004bff] hover:bg-[#003edd] text-white rounded-2xl py-4 text-xs font-extrabold tracking-wider transition-all shadow-md shadow-blue-500/20 group">
                    SEE FULL PLANS
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[3]" />
                  </button>
                ) : (
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#004bff] text-[#02183a] hover:text-[#004bff] bg-transparent hover:bg-[#004bff]/5 rounded-2xl py-4 text-xs font-extrabold tracking-wider transition-all group">
                    SEE FULL PLANS
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[3]" />
                  </button>
                )}
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
