"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Check, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Sparkles,
  Info,
  DollarSign,
  Star
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import Footer from "@/components/marketing/Footer";
import DemoModal from "@/components/marketing/DemoModal";
import SolutionsMegamenu from "@/components/marketing/SolutionsMegamenu";
import CompanyMegamenu from "@/components/marketing/CompanyMegamenu";
import PartnersMegamenu from "@/components/marketing/PartnersMegamenu";
import ResourcesMegamenu from "@/components/marketing/ResourcesMegamenu";

export default function PricingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };

  const getPrice = (monthlyPrice: number) => {
    if (billingPeriod === "yearly") {
      return monthlyPrice * 10; // 2 months free (20% off)
    }
    return monthlyPrice;
  };

  const faqs = [
    {
      q: "Does 2all.ai comply with regulations?",
      a: "Yes, our automated and expert solutions are designed to satisfy key international accessibility requirements, including WCAG 2.2 Level AA, ADA, EAA, Section 508, and more."
    },
    {
      q: "How's 2all.ai different from accessibility plugins?",
      a: "Unlike static plugins that merely adjust fonts or contrast, 2all.ai uses advanced AI logic and contextual computer vision to adapt structure, add missing screen reader alt-texts, correct keyboard navigation, and resolve full HTML code hierarchies dynamically."
    },
    {
      q: "Do 2all.ai solutions integrate with website builders and CMS?",
      a: "Absolutely. A single installation script integrates immediately with WordPress, Shopify, Webflow, Wix, Squarespace, Drupal, Custom React/NextJS setups, and all other major CMS frameworks."
    },
    {
      q: "Does accessWidget help you conform to WCAG?",
      a: "Yes, accessWidget automatically remediates interactive elements, form fields, document states, and navigational structures to align with official WCAG 2.2 AA guidelines."
    },
    {
      q: "How much does accessWidget cost?",
      a: "Pricing starts as low as $49/mo (or $490 billed annually) for smaller sites, scaling incrementally based on the total page count of your digital platform."
    },
    {
      q: "Does accessWidget affect loading speed?",
      a: "No. The system loads asynchronously and executes after the main DOM is fully parsed, ensuring zero impact on your Core Web Vitals or page load performance."
    },
    {
      q: "How do I install accessWidget?",
      a: "Simply paste a single line of JavaScript code right before the closing </body> tag of your website. Alternatively, use our official CMS plugins for one-click installation."
    },
    {
      q: "Can I customize accessWidget's user interface?",
      a: "Yes. Through the admin dashboard customizer, you can change the widget's primary colors, positioning, button shapes, icons, and language selections to align perfectly with your branding."
    },
    {
      q: "How do I know which plan is right for my needs?",
      a: "Plans are based strictly on total page volume. The Micro plan covers up to 999 pages, the Business plan up to 29,999 pages, and the Advanced plan covers up to 999,999 pages. Volume above this falls under our custom Enterprise category."
    },
    {
      q: "When I subscribe to a plan, will my entire domain become accessible?",
      a: "Yes. Once the automated script runs, it crawls and corrects accessibility issues across all public sub-pages and dynamic endpoints under your registered domain."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-white relative overflow-x-hidden selection:bg-slate-100 font-sans text-slate-800">
      
      {/* HEADER SECTION */}
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

        {/* Megamenu Overlays */}
        <SolutionsMegamenu 
          isOpen={activeHoverMenu === "SOLUTIONS"} 
          onMouseEnter={() => setActiveHoverMenu("SOLUTIONS")}
          onMouseLeave={() => setActiveHoverMenu(null)}
        />
        <CompanyMegamenu 
          isOpen={activeHoverMenu === "COMPANY"} 
          onMouseEnter={() => setActiveHoverMenu("COMPANY")}
          onMouseLeave={() => setActiveHoverMenu(null)}
        />
        <PartnersMegamenu 
          isOpen={activeHoverMenu === "PARTNERS"} 
          onMouseEnter={() => setActiveHoverMenu("PARTNERS")}
          onMouseLeave={() => setActiveHoverMenu(null)}
        />
        <ResourcesMegamenu 
          isOpen={activeHoverMenu === "RESOURCES"} 
          onMouseEnter={() => setActiveHoverMenu("RESOURCES")}
          onMouseLeave={() => setActiveHoverMenu(null)}
        />
      </header>

      {/* TITLE & TOGGLES */}
      <section className="relative bg-[#f8fafc] pt-20 pb-16 overflow-hidden text-center border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight max-w-3xl mx-auto">
            <span className="text-blue-600 italic font-serif">Plans</span> scale with your website's growth and accessibility needs
          </h1>

          {/* Toggle Control */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <div className="bg-slate-100/80 border border-slate-200/50 p-1 rounded-2xl flex items-center gap-1">
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-2 ${
                  billingPeriod === "yearly" ? "bg-white text-blue-600 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Pay yearly
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded-md text-[9px] font-black tracking-normal">Save 20%</span>
              </button>
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer ${
                  billingPeriod === "monthly" ? "bg-white text-blue-600 shadow-sm" : "bg-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                Pay monthly
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Card 1: Micro */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all text-left">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Micro</span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">${getPrice(49)}</span>
                  <span className="text-xs text-slate-400 font-bold ml-1">/{billingPeriod === "yearly" ? "yr" : "mo"}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-2">Under 999 pages website volume.</p>
              </div>
              
              <Link
                href={`/checkout?plan=micro&billing=${billingPeriod}`}
                className="w-full py-3 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                Buy Now
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Automated Accessibility</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>accessWidget (AI-Powered Overlay)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Automated Screen Reader adjustments</span>
                  </li>
                </ul>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pt-2">Support</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Standard support helpdesk</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Business */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all text-left">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Business</span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">${getPrice(149)}</span>
                  <span className="text-xs text-slate-400 font-bold ml-1">/{billingPeriod === "yearly" ? "yr" : "mo"}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-2">Under 29,999 pages website volume.</p>
              </div>
              
              <Link
                href={`/checkout?plan=business&billing=${billingPeriod}`}
                className="w-full py-3 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                Buy Now
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Everything in Micro, plus:</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Larger scan volume capacity</span>
                  </li>
                </ul>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pt-2">Premium Features</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Full widget customization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>White-label brand dashboard removal</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 3: Advanced */}
          <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all relative text-left">
            <span className="absolute top-0 right-6 -translate-y-1/2 bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Most Popular
            </span>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block font-sans">Advanced</span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">${getPrice(399)}</span>
                  <span className="text-xs text-slate-400 font-bold ml-1">/{billingPeriod === "yearly" ? "yr" : "mo"}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-2">Under 999,999 pages website volume.</p>
              </div>
              
              <Link
                href={`/checkout?plan=advanced&billing=${billingPeriod}`}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/20 tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                Buy Now
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Everything in Business, plus:</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Top-tier site crawling engines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Dedicated account success advisor</span>
                  </li>
                </ul>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pt-2">Compliance & Reports</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Scheduled compliance scanning reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Card 4: Enterprise */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all text-left">
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Enterprise</span>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">Custom</span>
                </div>
                <p className="text-[11px] text-slate-500 font-bold mt-2">Above 999,999 pages volume.</p>
              </div>
              
              <button
                onClick={() => setIsDemoOpen(true)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-xs rounded-xl tracking-wider uppercase border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                Get a Quote
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="border-t border-slate-100 pt-6 space-y-4 text-xs font-semibold text-slate-600">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Everything in Advanced, plus:</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Unlimited crawling and custom volume</span>
                  </li>
                </ul>

                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pt-2">Integrations & Security</span>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Single Sign-On (SSO) Support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Custom SLA compliance guarantees</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE COMPARISON TABLE */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8 text-left">
          Compare all plan features
        </h2>

        <div className="flex items-center justify-end gap-2 mb-6">
          <button
            onClick={() => setBillingPeriod("yearly")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer flex items-center gap-2 ${
              billingPeriod === "yearly"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:text-slate-700"
            }`}
          >
            Yearly (save 30%)
          </button>
          <button
            onClick={() => setBillingPeriod("monthly")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border cursor-pointer ${
              billingPeriod === "monthly"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-slate-500 border-slate-200 hover:text-slate-700"
            }`}
          >
            Monthly
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-wider bg-white w-1/3">Features</th>
                {[
                  { name: "Micro", volume: "Up to 1k monthly visits", price: getPrice(49), href: `/checkout?plan=micro&billing=${billingPeriod}`, highlight: false },
                  { name: "Growth", volume: "Up to 30k monthly visits", price: getPrice(149), href: `/checkout?plan=business&billing=${billingPeriod}`, highlight: true },
                  { name: "Scale", volume: "Up to 100k monthly visits", price: getPrice(399), href: `/checkout?plan=advanced&billing=${billingPeriod}`, highlight: false },
                  { name: "Enterprise", volume: "Over 100k monthly visits", price: null, href: null, highlight: false },
                ].map((col) => (
                  <th
                    key={col.name}
                    className={`p-5 text-center align-top ${col.highlight ? "bg-blue-50" : "bg-white"}`}
                  >
                    {col.highlight && (
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Recommended</span>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 font-bold">{col.volume}</p>
                    <p className="text-xl font-black text-slate-900 mt-1">
                      {col.price !== null ? (
                        <>${col.price}<span className="text-xs text-slate-400 font-normal ml-1">/{billingPeriod === "yearly" ? "year" : "mo"}</span></>
                      ) : (
                        <span className="text-blue-600">Custom price</span>
                      )}
                    </p>
                    <p className="text-sm font-black text-slate-700 mt-0.5">{col.name}</p>
                    <div className="mt-3">
                      {col.href ? (
                        <Link
                          href={col.href}
                          className={`block w-full py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-center transition-all ${
                            col.highlight
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-slate-900 hover:bg-slate-800 text-white"
                          }`}
                        >
                          Buy plan
                        </Link>
                      ) : (
                        <button
                          onClick={() => setIsDemoOpen(true)}
                          className="block w-full py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-center transition-all bg-transparent border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                        >
                          Contact sales
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600">
              {[
                { feature: "AI powered accessibility", values: [true, true, true, true] },
                { feature: "Compliance for ADA, ACDA, EAA", values: [true, true, true, true] },
                { feature: "Automated proof of effort", values: [true, true, true, true] },
                { feature: "Customer support", values: [true, true, true, true] },
                { feature: "First response SLA", values: [false, true, true, true] },
                { feature: "Litigation support package", values: ["48hr", "48hr", "48hr", "24hr"] },
                { feature: "Litigation pledge", values: [false, true, true, true] },
                { feature: "Detailed remediation report", values: [false, "$15k", "$20k", "$20k"] },
                { feature: "Google Analytics", values: [true, true, true, true] },
                { feature: "Multi-account management", values: [false, true, true, true] },
                { feature: "User & team management", values: [false, true, true, true] },
                { feature: "APIs & batch management", values: [false, true, true, true] },
                { feature: "Manual testing", values: [false, true, true, true] },
                { feature: "Custom fixes to improve accessibility conformance", values: [false, false, true, true] },
                { feature: "Custom code fixes", values: [false, false, "Yearly", "Yearly + custom"] },
                { feature: "Single sign-on (SSO)", values: [false, false, true, true] },
                { feature: "Dedicated account manager", values: [false, false, true, true] },
                { feature: "Custom legal terms", values: [false, false, false, true] },
              ].map((row, ri) => (
                <tr key={ri} className={`border-t border-slate-100 ${ri % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                  <td className="px-5 py-4 font-semibold text-slate-700">{row.feature}</td>
                  {row.values.map((val, vi) => (
                    <td
                      key={vi}
                      className={`px-5 py-4 text-center ${vi === 1 ? "bg-blue-50/40" : ""}`}
                    >
                      {val === true ? (
                        <Check className="w-4 h-4 text-blue-600 mx-auto stroke-[2.5]" />
                      ) : val === false ? (
                        <span className="text-slate-300 font-black">—</span>
                      ) : (
                        <span className="text-slate-600 font-bold">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADDITIONAL CTAS SECTION */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">Litigation support you can depend on</h4>
              <p className="text-xs text-slate-400 font-bold mt-1">Get peace of mind with expert legal guidance and documentation.</p>
              <Link href="/register" className="text-blue-600 hover:text-blue-700 text-xs font-black uppercase tracking-wider mt-2 inline-flex items-center gap-1">
                Learn more
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex gap-4 items-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100/50 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">AI and custom remediation for ADA compliance</h4>
              <p className="text-xs text-slate-400 font-bold mt-1">Get tailored web accessibility solution for your website.</p>
              <button 
                onClick={() => setIsDemoOpen(true)}
                className="text-blue-600 hover:text-blue-700 text-xs font-black uppercase tracking-wider mt-2 inline-flex items-center gap-1 border-none bg-transparent cursor-pointer"
              >
                Contact Sales
                <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* RATINGS & BADGES BANNER */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h3 className="text-2xl font-black tracking-tight">The #1 rated web accessibility solution for ADA & EAA compliance</h3>
          <div className="flex flex-wrap justify-center gap-8 pt-4 opacity-80">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">G2 Leader</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Capterra Best Value</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">GetApp Category Leader</span>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">SoftwareAdvice Highly Rated</span>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-left space-y-16">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight text-center">Frequently asked questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-slate-200 pb-4">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center py-3 text-left border-none bg-transparent cursor-pointer"
              >
                <span className="text-sm font-black text-slate-800 hover:text-blue-600 transition-colors">
                  {faq.q}
                </span>
                {activeFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {activeFaq === idx && (
                <div className="mt-2 text-xs text-slate-500 font-bold leading-relaxed pr-8 animate-in slide-in-from-top-1 duration-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* DEMO MODAL */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

    </div>
  );
}
