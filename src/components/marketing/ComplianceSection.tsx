"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

export default function ComplianceSection() {
  const badges = [
    {
      acronym: "ADA",
      fullName: "Americans with Disabilities Act",
      delay: 0.1
    },
    {
      acronym: "EAA",
      fullName: "European Accessibility Act",
      delay: 0.2
    },
    {
      acronym: "Sec 508",
      fullName: "Technical requirements",
      delay: 0.3
    },
    {
      acronym: "AODA",
      fullName: "Ontarians with Disabilities Act",
      delay: 0.4
    },
    {
      acronym: "ACA",
      fullName: "Accessible Canada Act",
      delay: 0.5
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden select-none font-sans border-t border-slate-100">
      {/* Background radial flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 text-center">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004bff] block">
            WCAG-Based Remediation
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Mitigate legal risk.<br />
            Comply with global regulations.
          </h2>
          <p className="text-slate-500 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Our solutions evolve with regulations and industry requirements, supporting businesses in compliance.
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-20">
          <a
            href="#call"
            className="inline-flex items-center gap-2 bg-[#02183a] hover:bg-[#06224e] text-white rounded-full px-8 py-4 text-sm font-extrabold tracking-wide transition-all shadow-md hover:shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 group"
          >
            BOOK A CALL
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
          </a>
        </div>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
          {badges.map((badge) => (
            <motion.div
              key={badge.acronym}
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                delay: badge.delay
              }}
              whileHover={{ 
                y: -10, 
                rotate: [0, -3, 3, 0], 
                scale: 1.03,
                transition: { duration: 0.4 }
              }}
              className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 flex flex-col items-center justify-center cursor-pointer group"
            >
              {/* Jagged Stamp/Seal Background Shape */}
              <svg 
                viewBox="0 0 100 100" 
                className="absolute inset-0 w-full h-full text-indigo-50/60 fill-current stroke-indigo-100/40 stroke-[0.8] transition-colors group-hover:text-blue-50/60 group-hover:stroke-blue-400/40"
              >
                <path d="M50,4 C53.2,4 55.4,7.2 58.4,8.2 C61.4,9.2 65.2,8.0 67.8,9.8 C70.4,11.6 71.4,15.2 73.6,17.6 C75.8,20.0 79.4,20.8 81.0,23.6 C82.6,26.4 82.0,30.2 83.0,33.2 C84.0,36.2 87.0,38.2 87.4,41.4 C87.8,44.6 85.2,47.4 85.0,50.6 C84.8,53.8 87.0,56.6 86.2,59.6 C85.4,62.6 82.2,64.2 81.0,67.0 C79.8,69.8 79.6,73.6 77.6,76.0 C75.6,78.4 72.0,79.0 69.6,81.0 C67.2,83.0 65.2,86.2 62.2,87.4 C59.2,88.6 55.6,87.6 52.4,88.2 C49.2,88.8 46.4,91.0 43.4,90.8 C40.4,90.6 37.8,88.0 35.0,87.2 C32.2,86.4 28.4,87.6 25.8,86.0 C23.2,84.4 22.0,80.8 19.8,78.6 C17.6,76.4 14.0,75.6 12.6,72.8 C11.2,70.0 12.2,66.2 11.2,63.2 C10.2,60.2 7.0,58.2 6.8,55.0 C6.6,51.8 9.4,49.0 9.4,45.8 C9.4,42.6 7.0,39.8 7.6,36.8 C8.2,33.8 11.4,32.2 12.4,29.4 C13.4,26.6 13.2,22.8 15.2,20.4 C17.2,18.0 20.8,17.4 23.0,15.4 C25.2,13.4 27.2,10.2 30.2,9.0 C33.2,7.8 36.8,8.8 40.0,8.2 C43.2,7.6 46.0,5.4 49.0,5.6 C49.3,5.6 49.7,4 50,4 Z" />
              </svg>

              {/* Badge Text Content */}
              <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                <span className="text-lg sm:text-xl md:text-2xl font-black text-[#02183a] leading-none tracking-tight">
                  {badge.acronym}
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-slate-500 leading-snug max-w-[100px] sm:max-w-[110px] md:max-w-[120px] block">
                  {badge.fullName}
                </span>
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#004bff] stroke-[4] mt-1.5" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
