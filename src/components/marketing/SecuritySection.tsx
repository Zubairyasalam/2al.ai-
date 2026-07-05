"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Shield, ArrowRight } from "lucide-react";

export default function SecuritySection() {
  const securityFeatures = [
    { name: "SOC2 Type II Certified", desc: "Rigorous independent auditing of data controls" },
    { name: "AES-256 Data Encryption", desc: "Full end-to-end encryption in transit and at rest" },
    { name: "Continuous Threat Monitoring", desc: "Real-time automated vulnerability checking" }
  ];

  return (
    <section className="py-24 bg-slate-950 text-white relative overflow-hidden select-none font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT COLUMN: Headings & Copy */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <div className="space-y-4">
              <span className="px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-widest inline-block font-sans">
                Highest Security Standards
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight font-sans">
                Uncompromising security <br />
                and privacy <span className="text-blue-500">you can trust</span>
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed font-sans max-w-xl">
                Your business and customers are in good hands. 2all.ai upholds stringent security standards, with regular testing and monitoring as part of SOC2 compliance.
              </p>
            </div>

            {/* Interactive Link */}
            <div className="pt-2">
              <a
                href="#security-whitepaper"
                className="inline-flex items-center gap-2 text-white hover:text-blue-400 font-extrabold text-sm uppercase tracking-wider transition-all duration-300 group"
              >
                Learn more
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <ArrowRight className="w-4 h-4 text-blue-500 stroke-[3]" />
                </motion.span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Holographic Security Widget */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-[460px] bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              {/* Inner glowing core */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                {/* Shield Header */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
                    <Shield className="w-6 h-6 text-blue-400" />
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2.5 }}
                      className="absolute inset-0 rounded-xl bg-blue-400/20 pointer-events-none"
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">System Integrity</span>
                    <span className="text-sm font-extrabold text-white">Active Compliance Audit</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  {securityFeatures.map((feat) => (
                    <div key={feat.name} className="flex gap-4 items-start text-left group">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 transition-colors group-hover:bg-emerald-500/20">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {feat.name}
                        </h4>
                        <p className="text-xs text-slate-500 font-light">
                          {feat.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Lock Capsule */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      GDPR & CCPA COMPLIANT
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-lg tracking-wider">
                    SECURED
                  </span>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
