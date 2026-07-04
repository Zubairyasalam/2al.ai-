"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Rocket } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "AI Accessibility Automation",
    description: "Automatically detect accessibility issues and receive intelligent remediation suggestions in minutes.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Globe,
    title: "Global Compliance Ready",
    description: "Support WCAG 2.2, ADA, EAA, Section 508, and other accessibility standards with confidence.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    icon: Rocket,
    title: "Quick Setup & Continuous Monitoring",
    description: "Integrate with your website in minutes and keep accessibility optimized as your content evolves.",
    color: "bg-sky-50 text-sky-600 border-sky-100",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Make Accessibility <span className="text-blue-600">Effortless</span>
          </h2>
          <p className="text-lg text-slate-600">
            A comprehensive suite of tools built on robust automation and human-centric design, ensuring compliance and access for every user.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 rounded-2xl p-8 transition-all duration-300 flex flex-col items-start"
              >
                <div className={`w-12 h-12 rounded-xl border ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
