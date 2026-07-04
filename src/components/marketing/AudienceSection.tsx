"use client";

import { motion } from "framer-motion";
import { Globe, Shield, Handshake, CheckCircle2, ArrowRight } from "lucide-react";

export default function AudienceSection() {
  const cards = [
    {
      type: "owners",
      pill: "Website Owners",
      title: "It's your choice, our work.",
      desc: "With automated AI, human expertise, or a blend of both—get a tailored solution that fits your website.",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      features: [
        "Automated AI auto-remediation",
        "Expert manual auditing & validation",
        "Hybrid plan tailored to your site"
      ],
      ctaText: "Get Tailored Solution",
      ctaLink: "/register",
      bgGradient: "from-blue-500/5 to-indigo-500/5",
      borderHover: "hover:border-blue-500/30 hover:shadow-blue-500/5"
    },
    {
      type: "partners",
      pill: "Partners & Agencies",
      title: "Offer your clients the best.",
      desc: "Close deals, grow revenue, and make clients happy with AI-driven accessibility backed by unmatched support.",
      icon: <Handshake className="w-8 h-8 text-indigo-600" />,
      features: [
        "White-label options & portal",
        "Revenue sharing & partner pricing",
        "Priority support & dedicated account team"
      ],
      ctaText: "Explore Partner Program",
      ctaLink: "/partners",
      bgGradient: "from-indigo-500/5 to-purple-500/5",
      borderHover: "hover:border-indigo-500/30 hover:shadow-indigo-500/5"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden select-none">
      {/* Decorative background shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Solutions for Everyone</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            How Can We Help <span className="text-blue-600">You?</span>
          </h2>
          <p className="text-slate-500 text-lg font-light">
            Select the path that fits your goals. We have tailor-made tools for businesses of all sizes and partner agencies.
          </p>
        </div>

        {/* Dual Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {cards.map((card, index) => (
            <motion.div
              key={card.pill}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`bg-gradient-to-br ${card.bgGradient} border border-slate-200/60 rounded-[32px] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${card.borderHover} hover:-translate-y-1.5 shadow-sm hover:shadow-xl`}
            >
              <div className="space-y-6">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <span className="px-4 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-extrabold text-slate-800 tracking-wider shadow-sm">
                    {card.pill}
                  </span>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-md shadow-slate-100/50">
                    {card.icon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 pt-4 border-t border-slate-200/50">
                  {card.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-slate-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <a
                  href={card.ctaLink}
                  className="w-full inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white rounded-2xl px-6 py-4 text-sm font-extrabold tracking-wide transition-all shadow-md hover:shadow-slate-950/20 group"
                >
                  {card.ctaText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
