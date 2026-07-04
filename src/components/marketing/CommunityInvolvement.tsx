"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function CommunityInvolvement() {
  const cards = [
    {
      type: "card",
      title: "Community-first product",
      desc: "Our solutions and services are developed with input from disability community members.",
      bgColor: "bg-violet-50/60 border-violet-100/80 text-violet-950",
      iconColor: "bg-violet-500/10 text-violet-600 border-violet-200",
      delay: 0.1
    },
    {
      type: "image",
      src: "/images/community_selfie.png",
      alt: "Disability community selfie at event",
      delay: 0.15
    },
    {
      type: "card",
      title: "User testing performed",
      desc: "We proudly leverage user testing to ensure our solutions’ optimal accessibility.",
      bgColor: "bg-rose-50/60 border-rose-100/80 text-rose-950",
      iconColor: "bg-rose-500/10 text-rose-600 border-rose-200",
      delay: 0.2
    },
    {
      type: "image",
      src: "/images/testing_session.png",
      alt: "Accessibility user testing session",
      delay: 0.25
    },
    {
      type: "card",
      title: "Nonprofit partnerships",
      desc: "We partner with over 600 disability-focused nonprofit organizations to advance inclusion goals.",
      bgColor: "bg-sky-50/60 border-sky-100/80 text-sky-950",
      iconColor: "bg-sky-500/10 text-sky-600 border-sky-200",
      delay: 0.3
    },
    {
      type: "image",
      src: "/images/nonprofit_group.png",
      alt: "Nonprofit partner group photo",
      delay: 0.35
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden select-none font-sans">
      {/* Soft background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004bff] block">Making an Impact</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            When you work with <span className="text-[#004bff]">2all.ai</span>,<br />
            you work with the disability community
          </h2>
          <p className="text-slate-500 text-lg font-light max-w-2xl mx-auto leading-relaxed">
            We believe in &ldquo;Nothing About Us Without Us.&rdquo; Our products and services are developed, audited, and optimized in direct collaboration with people with disabilities.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {cards.map((item, index) => {
            if (item.type === "card") {
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  whileHover={{ y: -5 }}
                  className={`border rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/40 cursor-pointer ${item.bgColor}`}
                >
                  <div className="space-y-6 text-left flex-1 flex flex-col justify-between">
                    
                    {/* Circle Check Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${item.iconColor}`}>
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-extrabold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={item.src}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: item.delay }}
                  className="rounded-[32px] overflow-hidden aspect-video md:aspect-[4/3] relative shadow-sm border border-slate-200/40 group cursor-pointer"
                >
                  {/* Photo container with zoom on hover */}
                  <motion.img
                    src={item.src}
                    alt={item.alt}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
                </motion.div>
              );
            }
          })}
        </div>

      </div>
    </section>
  );
}
