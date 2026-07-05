"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Showcase from "@/components/marketing/Showcase";
import TrustSection from "@/components/marketing/TrustSection";
import AudienceSection from "@/components/marketing/AudienceSection";
import ServicesSection from "@/components/marketing/ServicesSection";
import AuditCTA from "@/components/marketing/AuditCTA";
import BeyondCompliance from "@/components/marketing/BeyondCompliance";
import CommunityInvolvement from "@/components/marketing/CommunityInvolvement";
import ComplianceSection from "@/components/marketing/ComplianceSection";
import SecuritySection from "@/components/marketing/SecuritySection";
import PricingSection from "@/components/marketing/PricingSection";
import CloseGapsBanner from "@/components/marketing/CloseGapsBanner";
import Footer from "@/components/marketing/Footer";
import DemoModal from "@/components/marketing/DemoModal";
import SolutionsMegamenu from "@/components/marketing/SolutionsMegamenu";
import CompanyMegamenu from "@/components/marketing/CompanyMegamenu";
import PartnersMegamenu from "@/components/marketing/PartnersMegamenu";
import ResourcesMegamenu from "@/components/marketing/ResourcesMegamenu";

export default function Home() {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);

  useEffect(() => {
    // Hands animation trigger
    const timer = setTimeout(() => {
      setAnimationStarted(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden selection:bg-slate-100">
      
      {/* SECTION 1: Intro Screen (First Viewport) */}
      <div className="h-screen w-screen flex flex-col justify-between relative overflow-hidden bg-white">
        
        {/* Header Navigation */}
        <header 
          onMouseLeave={() => setActiveHoverMenu(null)}
          className="w-full py-2 px-4 md:px-10 z-30 shrink-0 bg-transparent relative"
        >
          <div className="w-full flex items-center justify-between gap-2 md:gap-4">

            {/* Left Capsule (Logo, Nav links, Login) */}
            <div className="bg-transparent md:px-4 py-1.5 flex items-center justify-between flex-grow">

              {/* Logo */}
              <Link href="/" className="flex items-center group mr-2 md:mr-6 shrink-0">
                <img
                  src="/images/logo.jpeg"
                  alt="2all.ai Logo"
                  className="h-10 md:h-16 w-auto object-contain mix-blend-multiply"
                />
              </Link>

              {/* Nav links */}
              <nav className="hidden lg:flex items-center gap-8">
                {[
                  { name: "SOLUTIONS", hasDropdown: true },
                  { name: "COMPANY", hasDropdown: true },
                  { name: "PARTNERS", hasDropdown: true },
                  { name: "RESOURCES", hasDropdown: true },
                  { name: "PRICING", hasDropdown: false },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.name === "PRICING" ? "/pricing" : "#"}
                    onMouseEnter={() => {
                      if (link.name === "SOLUTIONS") {
                        setActiveHoverMenu("SOLUTIONS");
                      } else if (link.name === "COMPANY") {
                        setActiveHoverMenu("COMPANY");
                      } else if (link.name === "PARTNERS") {
                        setActiveHoverMenu("PARTNERS");
                      } else if (link.name === "RESOURCES") {
                        setActiveHoverMenu("RESOURCES");
                      } else {
                        setActiveHoverMenu(null);
                      }
                    }}
                    className="text-[13px] font-bold text-[#374b6c] hover:text-blue-600 transition-colors flex items-center gap-1.5 tracking-wider"
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[3.5] stroke-current fill-none">
                        <path d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>
                ))}
              </nav>

              {/* Login Link */}
              <Link
                href="/login"
                className="hidden md:block text-[13px] font-bold text-[#0a1e3f] hover:text-blue-600 tracking-wider mr-2"
              >
                LOGIN
              </Link>
            </div>

            {/* Right Capsule (Book a demo & Start trial) */}
            <div className="bg-transparent py-1.5 md:pl-6 flex items-center gap-3 md:gap-5 shrink-0">
              <button
                onClick={() => setIsDemoOpen(true)}
                className="hidden md:block text-[13px] font-bold text-blue-600 hover:text-blue-700 tracking-wider border-none bg-transparent cursor-pointer"
              >
                BOOK A DEMO
              </button>
              <Link
                href="/register"
                className="flex items-center gap-1 md:gap-2 bg-[#004bff] hover:bg-[#003edd] text-white rounded-xl px-4 md:px-6 py-2 md:py-3 text-[10px] md:text-[12px] font-extrabold tracking-wider transition-all shadow-md shadow-blue-500/20 whitespace-nowrap"
              >
                START FREE TRIAL
                <svg viewBox="0 0 24 24" className="w-3 h-3 stroke-[3] stroke-current fill-none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>

          {/* Solutions Megamenu Overlay */}
          <SolutionsMegamenu 
            isOpen={activeHoverMenu === "SOLUTIONS"} 
            onMouseEnter={() => setActiveHoverMenu("SOLUTIONS")}
            onMouseLeave={() => setActiveHoverMenu(null)}
          />

          {/* Company Megamenu Overlay */}
          <CompanyMegamenu 
            isOpen={activeHoverMenu === "COMPANY"} 
            onMouseEnter={() => setActiveHoverMenu("COMPANY")}
            onMouseLeave={() => setActiveHoverMenu(null)}
          />

          {/* Partners Megamenu Overlay */}
          <PartnersMegamenu 
            isOpen={activeHoverMenu === "PARTNERS"} 
            onMouseEnter={() => setActiveHoverMenu("PARTNERS")}
            onMouseLeave={() => setActiveHoverMenu(null)}
          />

          {/* Resources Megamenu Overlay */}
          <ResourcesMegamenu 
            isOpen={activeHoverMenu === "RESOURCES"} 
            onMouseEnter={() => setActiveHoverMenu("RESOURCES")}
            onMouseLeave={() => setActiveHoverMenu(null)}
          />
        </header>

        {/* Left and Right Hands meeting in center (sliding together relative to the FULL VIEWPORT) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full z-20">

          {/* Left Hand: Human reaching */}
          <motion.div
            animate={animationStarted ? {
              x: ["-60vw", "-12vw", "-12vw", "-60vw"],
              opacity: [0, 1, 1, 0],
            } : { x: "-60vw", opacity: 0 }}
            transition={animationStarted ? {
              duration: 5.0,
              times: [0, 0.35, 0.65, 1],
              ease: ["easeOut", "linear", "easeIn", "easeIn"],
              repeat: Infinity,
              repeatDelay: 1.0
            } : { duration: 0 }}
            className="absolute left-0 bottom-0 top-0 w-[60vw] h-full shrink-0 overflow-hidden"
          >
            <div
              className="w-full h-full bg-[url('/images/hands_collaboration.png')] bg-no-repeat"
              style={{
                backgroundSize: '200% 100%',
                backgroundPosition: 'left center'
              }}
            />
          </motion.div>

          {/* Right Hand: AI / Robotic reaching */}
          <motion.div
            animate={animationStarted ? {
              x: ["60vw", "12vw", "12vw", "60vw"],
              opacity: [0, 1, 1, 0],
            } : { x: "60vw", opacity: 0 }}
            transition={animationStarted ? {
              duration: 5.0,
              times: [0, 0.35, 0.65, 1],
              ease: ["easeOut", "linear", "easeIn", "easeIn"],
              repeat: Infinity,
              repeatDelay: 1.0
            } : { duration: 0 }}
            className="absolute right-0 bottom-0 top-0 w-[60vw] h-full shrink-0 overflow-hidden"
          >
            <div
              className="w-full h-full bg-[url('/images/hands_collaboration.png')] bg-no-repeat"
              style={{
                backgroundSize: '200% 100%',
                backgroundPosition: 'right center'
              }}
            />
          </motion.div>
        </div>

        {/* Center Presentation Stage */}
        <div className="flex-1 relative flex flex-col justify-start gap-10 pt-0 pb-8 px-6 max-w-7xl mx-auto w-full z-10">

          {/* Soft central gradient accent behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-100/25 via-orange-100/10 to-blue-100/25 rounded-full blur-[100px] pointer-events-none" />

          {/* Central Hero Content - Fades in when hands meet and loops in sync with hands */}
          <motion.div
            animate={animationStarted ? {
              opacity: [1, 0, 1, 1, 1],
              y: [0, 15, 0, 0, 0]
            } : { opacity: 0, y: 15 }}
            transition={animationStarted ? {
              duration: 5.0,
              times: [0, 0.2, 0.35, 0.65, 1],
              ease: ["easeIn", "easeOut", "linear", "linear"],
              repeat: Infinity,
              repeatDelay: 1.0
            } : { duration: 0 }}
            className="w-full flex flex-col justify-start items-center text-center max-w-4xl mx-auto z-20 space-y-3 pt-0"
          >
            <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-[#004bff] uppercase tracking-widest block font-sans">
              EXPERT-DRIVEN. AI-POWERED.
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-[54px] font-black text-slate-900 leading-[1.15] tracking-tight font-sans max-w-3xl">
              Web accessibility <span className="italic font-serif font-semibold text-[#004bff]">tailored</span> for your business
            </h1>
            
            <p 
              className="text-slate-500 text-sm sm:text-base md:text-lg font-normal max-w-2xl leading-relaxed font-sans"
              style={{ marginTop: '24px' }}
            >
              We combine AI technology with accessibility expertise to help businesses achieve compliance, improve usability, and create more inclusive digital experiences.
            </p>

            <div 
              className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 pt-0 w-full px-4 sm:px-0"
              style={{ marginTop: '24px' }}
            >
              <button
                onClick={() => setIsDemoOpen(true)}
                className="w-full sm:w-auto justify-center border-2 border-slate-200 hover:border-slate-800 text-slate-800 rounded-full px-6 py-3 md:px-8 md:py-3.5 text-xs md:text-sm font-extrabold tracking-wider uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all bg-transparent cursor-pointer"
              >
                BOOK A DEMO
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[3] stroke-current fill-none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <Link
                href="/register"
                className="w-full sm:w-auto justify-center bg-[#004bff] hover:bg-[#003edd] text-white rounded-full px-6 py-3 md:px-8 md:py-3.5 text-xs md:text-sm font-extrabold tracking-wider uppercase flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md shadow-blue-500/20"
              >
                START FREE TRIAL
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 stroke-[3] stroke-current fill-none">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Bottom Features Row - Fades in together with Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={animationStarted ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 1.0, delay: 1.4 }}
            className="grid md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto pt-8 border-t border-slate-100/60 z-20"
          >
            {[
              {
                title: "ADA & EAA COMPLIANCE",
                desc: "WCAG 2.2 AA-based remediation for legal compliance and accessibility readiness."
              },
              {
                title: "CUSTOMIZABLE",
                desc: "Solutions and plans designed to fit every business type, platform, and accessibility goal."
              },
              {
                title: "HEAVY-LIFTING ON US",
                desc: "Fast to implement, easy to scale, and fully managed by our accessibility specialists."
              }
            ].map((feat, index) => {
              const isActive = activeCard === index;
              return (
                <motion.div
                  key={feat.title}
                  onClick={() => setActiveCard(index)}
                  layout
                  animate={{
                    y: isActive ? -12 : 0,
                    scale: isActive ? 1.04 : 1.0,
                    borderColor: isActive ? "#004bff" : "rgba(241, 245, 249, 0.8)",
                    backgroundColor: isActive ? "#ffffff" : "rgba(248, 250, 252, 0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.04,
                    borderColor: "#004bff",
                    backgroundColor: "#ffffff",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`border p-8 sm:p-10 rounded-[32px] text-center space-y-3 cursor-pointer select-none transition-shadow duration-300 group
                    ${isActive 
                      ? "shadow-2xl shadow-blue-500/5" 
                      : "shadow-sm hover:shadow-2xl hover:shadow-blue-500/5"
                    }
                  `}
                >
                  <h4 className={`text-sm sm:text-base font-black tracking-wider uppercase transition-colors duration-300 group-hover:text-[#004bff]
                    ${isActive ? "text-[#004bff]" : "text-slate-800"}
                  `}>
                    {feat.title}
                  </h4>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-[280px] mx-auto transition-colors duration-300 group-hover:text-slate-600
                    ${isActive ? "text-slate-600" : "text-slate-500"}
                  `}>
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* SECTION 2: Showcase Carousel (Video Animation) */}
      <Showcase />

      {/* SECTION 2.5: Trust Section (Orbiting Logos + Stats) */}
      <TrustSection />

      {/* SECTION 2.8: Audience Section (Website Owners / Partners) */}
      <AudienceSection />

      {/* SECTION 2.9: Services Section (Training, Support, Litigation) */}
      <ServicesSection />

      {/* SECTION 2.95: Audit CTA Banner */}
      <AuditCTA />

      {/* SECTION 2.98: Beyond Compliance (Inclusion, Opportunity, Reputation) */}
      <BeyondCompliance />

      {/* SECTION 2.99: Community Involvement Collage */}
      <CommunityInvolvement />

      {/* SECTION 2.995: Legal Compliance Badges Section */}
      <ComplianceSection />

      {/* SECTION 2.998: Highest Security Standards Section */}
      <SecuritySection />

      {/* SECTION 2.999: Pricing Plans Table Section */}
      <PricingSection />

      {/* SECTION 3: Close Gaps Blue Banner CTA */}
      <CloseGapsBanner />

      {/* SECTION 4: Brand Footer */}
      <Footer />

      {/* SCHEDULE A DEMO POPUP MODAL */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

    </div>
  );
}
