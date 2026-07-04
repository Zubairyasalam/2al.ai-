"use client";

import { motion } from "framer-motion";
import { BookOpen, Headphones, Scale, ArrowRight } from "lucide-react";

export default function ServicesSection() {
  // Framer Motion Variants
  const cardVariants = {
    initial: { opacity: 0, y: 25 },
    animate: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay }
    }),
    hover: {
      y: -10,
      scale: 1.015,
      transition: { type: "spring", stiffness: 150, damping: 15 }
    }
  };

  // Icon Animations
  const bookIconVariants = {
    hover: {
      rotateY: [0, -180, 0],
      scale: 1.1,
      transition: { duration: 0.95, ease: "easeInOut" }
    }
  };

  const headphonesIconVariants = {
    hover: {
      y: [0, -6, 0, -3, 0],
      scale: 1.1,
      transition: { duration: 0.65, ease: "easeOut" }
    }
  };

  const scaleIconVariants = {
    hover: {
      rotate: [0, -12, 12, -6, 6, 0],
      scale: 1.1,
      transition: { duration: 0.85, ease: "easeInOut" }
    }
  };

  // Bullet Point Animations
  const bulletDotVariants = (color: string) => ({
    initial: { scale: 1, backgroundColor: "#e2e8f0" },
    hover: {
      scale: 1.3,
      backgroundColor: color,
      transition: { type: "spring", stiffness: 200, damping: 10 }
    }
  });

  const bulletTextVariants = {
    initial: { x: 0, color: "#475569" },
    hover: {
      x: 6,
      color: "#0f172a",
      transition: { type: "spring", stiffness: 150, damping: 15 }
    }
  };

  // Learn More Arrow Animations
  const arrowVariants = {
    initial: { x: 0 },
    hover: {
      x: 5,
      transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 0.4 }
    }
  };

  const services = [
    {
      title: "Accessibility training & marketing materials",
      icon: (
        <motion.div variants={bookIconVariants}>
          <BookOpen className="w-6 h-6 text-blue-600" />
        </motion.div>
      ),
      bullets: [
        "White-label lead generation capabilities",
        "Impactful assets to sell web accessibility",
        "Private accessibility training sessions"
      ],
      dotColor: "#2563eb", // blue-600
      hoverBorder: "hover:border-blue-500/30 hover:shadow-blue-500/10",
      colorAccent: "bg-blue-500/10 text-blue-600 border-blue-100",
      delay: 0.1
    },
    {
      title: "Unparalleled personal support",
      icon: (
        <motion.div variants={headphonesIconVariants}>
          <Headphones className="w-6 h-6 text-indigo-600" />
        </motion.div>
      ),
      bullets: [
        "Your own dedicated representative",
        "In-call sales involvement to close deals",
        "Choose how involved you want us to be"
      ],
      dotColor: "#4f46e5", // indigo-600
      hoverBorder: "hover:border-indigo-500/30 hover:shadow-indigo-500/10",
      colorAccent: "bg-indigo-500/10 text-indigo-600 border-indigo-100",
      delay: 0.2
    },
    {
      title: "Comprehensive litigation support",
      icon: (
        <motion.div variants={scaleIconVariants}>
          <Scale className="w-6 h-6 text-violet-600" />
        </motion.div>
      ),
      bullets: [
        "Dedicated case manager, start to finish",
        "Detailed claims analysis and responses",
        "ADA attorney consult"
      ],
      dotColor: "#7c3aed", // violet-600
      hoverBorder: "hover:border-violet-500/30 hover:shadow-violet-500/10",
      colorAccent: "bg-violet-500/10 text-violet-600 border-violet-100",
      delay: 0.3
    }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden select-none">
      {/* Background soft blur visual assets */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-100/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">Unmatched Partnership Benefits</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Compliance Built on <span className="text-blue-600">Expertise & Support</span>
          </h2>
          <p className="text-slate-500 text-lg font-light leading-relaxed">
            We provide agencies, developers, and legal departments with all the assets, hands-on support, and compliance infrastructure needed to succeed.
          </p>
        </div>

        {/* Coordinated 3-Card Grid */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {services.map((svc) => (
            <motion.div
              key={svc.title}
              custom={svc.delay}
              initial="initial"
              whileInView="animate"
              whileHover="hover"
              viewport={{ once: true }}
              variants={cardVariants}
              className={`bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 shadow-sm cursor-pointer relative overflow-hidden ${svc.hoverBorder}`}
            >
              <div className="space-y-6">
                
                {/* Icon Core */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${svc.colorAccent}`}>
                  {svc.icon}
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                  {svc.title}
                </h3>

                {/* Bullets List */}
                <ul className="space-y-4 pt-4 border-t border-slate-100">
                  {svc.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      {/* Animated circular bullet indicator */}
                      <motion.div
                        variants={bulletDotVariants(svc.dotColor)}
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      </motion.div>
                      {/* Animated bullet text */}
                      <motion.span
                        variants={bulletTextVariants}
                        className="text-sm font-medium leading-relaxed"
                      >
                        {bullet}
                      </motion.span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link Footer */}
              <div className="mt-8 pt-4 border-t border-slate-50 flex justify-end">
                <span className="text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                  Learn More
                  <motion.span variants={arrowVariants} className="inline-block">
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </motion.span>
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
