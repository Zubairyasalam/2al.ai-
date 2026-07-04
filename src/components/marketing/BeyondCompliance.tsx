"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Award } from "lucide-react";

export default function BeyondCompliance() {
  const points = [
    {
      num: "01",
      title: "Demonstrate inclusion",
      desc: "Contribute to a more inclusive internet, making a meaningful impact on the lives of millions.",
      icon: <Users className="w-5 h-5 text-[#004bff]" />,
      color: "border-blue-200 text-[#004bff] bg-blue-50/50",
      delay: 0.1
    },
    {
      num: "02",
      title: "Tap into new opportunity",
      desc: "Unlock over $8 trillion in expendable income that businesses can only tap with an accessible website.",
      icon: <TrendingUp className="w-5 h-5 text-[#004bff]" />,
      color: "border-blue-200 text-[#004bff] bg-blue-50/50",
      delay: 0.2
    },
    {
      num: "03",
      title: "Boost brand reputation",
      desc: "Web accessibility isn’t just a feature—it reflects leadership and values, elevating brand reputation with every click.",
      icon: <Award className="w-5 h-5 text-[#004bff]" />,
      color: "border-blue-200 text-[#004bff] bg-blue-50/50",
      delay: 0.3
    }
  ];

  // SVG ring variants for drawing animation
  const ringVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (customDelay: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeInOut", delay: customDelay }
    })
  };

  const labelVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (customDelay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: customDelay + 0.6 }
    })
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden select-none font-sans">
      {/* Background accents */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: Header & Animated Rings SVG */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-[#004bff] uppercase tracking-widest inline-block font-sans">
                Beyond Legal Standards
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight font-sans">
                More than <br />
                <span className="text-[#004bff]">compliance</span>
              </h2>
              <p className="text-slate-500 text-lg font-normal leading-relaxed font-sans">
                Web accessibility is the right thing to do and good for business. Achieve real inclusion while driving growth.
              </p>
            </div>

            {/* High-fidelity overlapping Rings SVG illustrating brand value convergence */}
            <div className="relative w-full max-w-[320px] aspect-square mx-auto lg:mx-0 p-6 border border-zinc-800 bg-zinc-950 rounded-[40px] shadow-2xl flex items-center justify-center overflow-hidden">
              {/* Deep glowing background radial flare */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12)_0%,transparent_70%)] pointer-events-none" />

              <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
                
                {/* Inclusion Ring */}
                <motion.circle
                  cx="85"
                  cy="85"
                  r="45"
                  fill="rgba(59, 130, 246, 0.02)"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{
                    strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" }
                  }}
                  custom={0.2}
                  variants={ringVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
                
                {/* Opportunity Ring */}
                <motion.circle
                  cx="115"
                  cy="85"
                  r="45"
                  fill="rgba(16, 185, 129, 0.02)"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  animate={{ strokeDashoffset: [0, 20] }}
                  transition={{
                    strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" }
                  }}
                  custom={0.4}
                  variants={ringVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />
                
                {/* Reputation Ring */}
                <motion.circle
                  cx="100"
                  cy="115"
                  r="45"
                  fill="rgba(99, 102, 241, 0.02)"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  animate={{ strokeDashoffset: [0, -20] }}
                  transition={{
                    strokeDashoffset: { repeat: Infinity, duration: 4, ease: "linear" }
                  }}
                  custom={0.6}
                  variants={ringVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                />

                {/* Staggered Labels */}
                <motion.text
                  x="50"
                  y="74"
                  fill="#93c5fd"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  custom={0.2}
                  variants={labelVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-sans tracking-wide"
                >
                  Inclusion
                </motion.text>
                
                <motion.text
                  x="150"
                  y="74"
                  fill="#a7f3d0"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  custom={0.4}
                  variants={labelVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-sans tracking-wide"
                >
                  Opportunity
                </motion.text>
                
                <motion.text
                  x="100"
                  y="156"
                  fill="#c7d2fe"
                  fontSize="9.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  custom={0.6}
                  variants={labelVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="font-sans tracking-wide"
                >
                  Reputation
                </motion.text>
                
                {/* Core intersection indicator (pulsing) */}
                <motion.circle
                  cx="100"
                  cy="95"
                  r="7"
                  fill="#ffffff"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                />
                <circle cx="100" cy="95" r="3" fill="#004bff" />
              </svg>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Cards List */}
          <div className="lg:col-span-7 space-y-6">
            {points.map((pt) => (
              <motion.div
                key={pt.num}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: pt.delay }}
                whileHover={{ x: 6, y: -2 }}
                className="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-blue-200 rounded-3xl p-6 flex gap-6 items-start transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group"
              >
                {/* Number & Icon Container */}
                <div className="flex flex-col items-center shrink-0 space-y-3">
                  <motion.span
                    whileHover={{ scale: 1.1 }}
                    className="text-3xl font-black text-slate-300 font-mono tracking-tighter group-hover:text-[#004bff] transition-colors"
                  >
                    {pt.num}
                  </motion.span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${pt.color}`}>
                    {pt.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 text-left flex-1 font-sans">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#004bff] transition-colors font-sans">
                    {pt.title}
                  </h3>
                  <p className="text-slate-500 text-sm md:text-base font-normal leading-relaxed font-sans">
                    {pt.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
