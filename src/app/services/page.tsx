"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, 
  Layout, 
  ShieldCheck, 
  Users, 
  Search, 
  Sparkles, 
  Code,
  ArrowRight,
  ChevronRight,
  Play,
  PhoneCall,
  CheckCircle2
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/marketing/Footer";
import DemoModal from "@/components/marketing/DemoModal";
import SolutionsMegamenu from "@/components/marketing/SolutionsMegamenu";
import CompanyMegamenu from "@/components/marketing/CompanyMegamenu";
import PartnersMegamenu from "@/components/marketing/PartnersMegamenu";
import ResourcesMegamenu from "@/components/marketing/ResourcesMegamenu";

export default function ServicesPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden selection:bg-slate-100 font-sans text-slate-800">
      
      {/* HEADER SECTION (Same as home page for consistency) */}
      <header 
        onMouseLeave={() => setActiveHoverMenu(null)}
        className="w-full py-2 px-10 z-30 shrink-0 bg-white border-b border-slate-100 relative"
      >
        <div className="w-full flex items-center gap-4">

          {/* Left Capsule */}
          <div className="bg-transparent px-4 py-1.5 flex items-center justify-between flex-grow">
            <Link href="/" className="flex items-center group mr-6 shrink-0">
              <img
                src="/images/logo.jpeg"
                alt="2all.ai Logo"
                className="h-16 w-auto object-contain mix-blend-multiply"
              />
            </Link>

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

            <Link
              href="/login"
              className="text-[13px] font-bold text-[#0a1e3f] hover:text-blue-600 tracking-wider mr-2"
            >
              LOGIN
            </Link>
          </div>

          {/* Right Capsule */}
          <div className="bg-transparent py-1.5 pl-6 flex items-center gap-5 shrink-0">
            <button
              onClick={() => setIsDemoOpen(true)}
              className="text-[13px] font-bold text-blue-600 hover:text-blue-700 tracking-wider border-none bg-transparent cursor-pointer"
            >
              BOOK A DEMO
            </button>
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#004bff] hover:bg-[#003edd] text-white rounded-xl px-6 py-3 text-[12px] font-extrabold tracking-wider transition-all shadow-md shadow-blue-500/20"
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

      {/* HERO SECTION */}
      <section className="relative bg-[#f8fafc] pt-20 pb-24 overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 relative z-10">
          <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-bold text-blue-600 uppercase tracking-widest inline-block">
            Professional Compliance Services
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-[52px] font-black text-slate-900 leading-[1.15] tracking-tight max-w-4xl mx-auto">
            Digital accessibility <span className="text-blue-600 italic font-serif">services</span> for inclusion and compliance
          </h1>
          <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-semibold">
            2all.ai provides you with all the professional services you need to meet the accessibility requirements important to you — with dedicated experts for every step of your needs.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-[#004bff] hover:bg-[#003edd] text-white rounded-full px-8 py-3.5 text-xs font-black tracking-wider uppercase transition-all shadow-md shadow-blue-500/20"
            >
              Get started
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES GRID SECTION */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "VPAT",
              desc: "Meet accessibility standards requirements with an audited, professional document that details your accessibility status.",
              icon: FileText,
            },
            {
              title: "File accessibility",
              desc: "Ensure PDF, Word, PowerPoint, and multimedia files are fully accessible, screen-reader friendly and compliant.",
              icon: Layout,
            },
            {
              title: "Litigation support",
              desc: "Enjoy peace of mind with expert legal guidance and documentation when dealing with accessibility lawsuits.",
              icon: ShieldCheck,
            },
            {
              title: "User testing",
              desc: "Confirm user experience for individuals with disabilities by using our network of testers who live with various impairments.",
              icon: Users,
            },
            {
              title: "Expert audit",
              desc: "Go beyond basic software checks for complete assurance with a manual accessibility audit of your website's interface.",
              icon: Search,
            },
          ].map((service) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.title} 
                className="bg-white border border-slate-200/70 rounded-3xl p-8 hover:shadow-xl transition-all flex flex-col justify-between group hover:border-blue-200 text-left"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-bold">
                    {service.desc}
                  </p>
                </div>
                <div className="pt-6 flex justify-start">
                  <Link 
                    href="/register" 
                    className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-all border border-slate-100"
                  >
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXCEPTIONAL SERVICE SECTION */}
      <section className="bg-[#FAF8F5] py-24 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 leading-tight">
              Exceptional service.<br />Unmatched expertise.
            </h2>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#004bff] hover:bg-[#003edd] text-white rounded-full px-8 py-3.5 text-xs font-black tracking-wider uppercase transition-all shadow-md shadow-blue-500/20"
            >
              Get Started
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </Link>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Experts in accessibility & compliance",
                desc: "The trust you are looking for with dozens of 2all.ai experts working with you to ensure your project's success.",
              },
              {
                title: "Bypassing deadlines",
                desc: "Meet deadlines under pressure. Services are delivered on time without compromising on quality, subject to custom project schedules.",
              },
              {
                title: "Competitive pricing",
                desc: "Pricing is determined by your project's scope, duration and custom requirements. Get a transparent quote before starting.",
              },
            ].map((bullet, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 mt-1">
                  <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">{bullet.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">{bullet.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER PORTAL SECTION */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center space-y-16">
        <div className="space-y-3">
          <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Customer Portal</span>
          <h2 className="text-3xl font-black text-slate-950 tracking-tight">
            Enjoy frictionless service from A to Z through our customer portal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              num: "1",
              title: "Request",
              desc: "Request a service within minutes through our customer portal.",
            },
            {
              num: "2",
              title: "Service under review",
              desc: "Receive a transparent quote, accept it, and check in on project progress in real-time, anytime.",
            },
            {
              num: "3",
              title: "Project delivery",
              desc: "Your fully compliant deliverables are sent directly to your email, ready for use.",
              checked: true,
            },
          ].map((step) => (
            <div 
              key={step.num}
              className="bg-white border border-slate-200/80 rounded-3xl p-8 hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between h-56 text-left"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-black text-slate-300">{step.num}</span>
                  {step.checked && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </div>
                <h4 className="text-sm font-black text-slate-950">{step.title}</h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{step.desc}</p>
              </div>
              {!step.checked && (
                <div className="flex justify-start">
                  <Link href="/register" className="text-slate-400 hover:text-blue-600 transition-colors">
                    <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CHALLENGE SOLUTION SECTION */}
      <section className="bg-slate-50 py-24 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-16">
          <div className="space-y-3">
            <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">Other Solutions</span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              A solution for every accessibility challenge
            </h2>
            <p className="text-xs text-slate-400 font-bold max-w-xl mx-auto leading-relaxed">
              2all.ai integrates with standard web platforms to help businesses easily manage web accessibility. Choose the solution that's right for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "accessWidget",
                desc: "AI-powered automated accessibility tool.",
                icon: Sparkles,
                bg: "bg-blue-500/10 text-blue-600",
              },
              {
                title: "accessFlow",
                desc: "Developer suite for accessible code verification.",
                icon: Code,
                bg: "bg-emerald-500/10 text-emerald-600",
              },
              {
                title: "accessServices",
                desc: "Manual compliance auditing & expert support.",
                icon: FileText,
                bg: "bg-purple-500/10 text-purple-600",
              },
            ].map((prod) => {
              const Icon = prod.icon;
              return (
                <div 
                  key={prod.title} 
                  className="bg-white border border-slate-200/70 rounded-3xl p-6 hover:shadow-xl transition-all text-left flex flex-col justify-between h-48"
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-xl ${prod.bg} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-950">{prod.title}</h4>
                      <p className="text-[11px] text-slate-400 font-bold">{prod.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <Link href="/register" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-blue-600 transition-colors uppercase tracking-wider">
                      Explore solution
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION CARDS */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center space-y-16">
        <h2 className="text-3xl font-black text-slate-950 tracking-tight max-w-2xl mx-auto leading-tight">
          Get a quote online or chat with a team member to get started
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between h-60">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Get a quote</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Request a transparent, no-obligation quote for your project within minutes.
              </p>
            </div>
            <Link 
              href="/register" 
              className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider"
            >
              Get started
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 hover:shadow-xl hover:border-blue-200 transition-all flex flex-col justify-between h-60">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900">Talk to an expert</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Schedule a free consultation call to discuss your project requirements.
              </p>
            </div>
            <button 
              onClick={() => setIsDemoOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 uppercase tracking-wider border-none bg-transparent cursor-pointer"
            >
              Schedule call
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* DEMO MODAL */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

    </div>
  );
}
