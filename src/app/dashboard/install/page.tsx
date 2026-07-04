"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  CreditCard,
  FileText,
  Code,
  BarChart3,
  ShieldCheck,
  User,
  Award,
  Globe,
  Rocket,
  HelpCircle,
  ArrowUpRight,
  Check,
} from "lucide-react";
import InstallCodeBlock from "@/components/dashboard/InstallCodeBlock";

const PLAN_CARDS = [
  {
    name: "Micro",
    price: "$490",
    per: "/yr",
    features: ["Up to 999 pages/month", "AI-Powered widget", "Standard support"],
    href: "/checkout?plan=micro&billing=yearly",
    popular: false,
  },
  {
    name: "Business",
    price: "$1,490",
    per: "/yr",
    features: ["Up to 29,999 pages/month", "Full widget customization", "Priority support"],
    href: "/checkout?plan=business&billing=yearly",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    per: "",
    features: ["Unlimited pages", "Full AI suite", "Dedicated account manager"],
    href: null,
    popular: false,
  },
];

type Tab =
  | "plan"
  | "statement"
  | "install"
  | "remediation"
  | "audit"
  | "owner"
  | "proof";

const NAV_ITEMS: { label: string; icon: any; tab: Tab }[] = [
  { label: "Plan and payments", icon: CreditCard, tab: "plan" },
  { label: "Accessibility statement", icon: FileText, tab: "statement" },
  { label: "Install and customize widget", icon: Code, tab: "install" },
  { label: "Remediation report", icon: BarChart3, tab: "remediation" },
  { label: "Audit report", icon: ShieldCheck, tab: "audit" },
  { label: "License owner info", icon: User, tab: "owner" },
  { label: "Proof of effort toolkit", icon: Award, tab: "proof" },
];

function PlanContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">Plan and payments</h1>

      {/* Current plan banner */}
      <div className="bg-[#eef4ff] border border-blue-100 rounded-3xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5 text-blue-600 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Current Plan</p>
            <p className="text-sm font-black text-blue-900">Free Trial</p>
            <p className="text-[10px] text-blue-600/70 font-bold mt-0.5">Your free trial gives you access to basic features. Upgrade to unlock full AI accessibility.</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">Active</span>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {PLAN_CARDS.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white border rounded-2xl p-6 flex flex-col shadow-sm ${
              plan.popular ? "border-blue-500 ring-1 ring-blue-200" : "border-slate-200/80"
            }`}
          >
            {plan.popular && (
              <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2">
                Most Popular
              </span>
            )}
            <h3 className="text-base font-black text-slate-800">{plan.name}</h3>
            <p className="text-2xl font-black text-slate-900 mt-1 mb-3">
              {plan.price}
              {plan.per && <span className="text-xs text-slate-400 font-normal ml-1">{plan.per}</span>}
            </p>
            <ul className="space-y-2 mb-5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 stroke-[2.5]" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.href ? (
              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-center transition-all ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                Upgrade Now
              </Link>
            ) : (
              <button className="w-full py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-center bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer border-none">
                Contact Sales
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingSoonContent({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
      <div className="bg-white border border-slate-200/80 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
          <Rocket className="w-7 h-7 text-blue-500 stroke-[2]" />
        </div>
        <h3 className="text-base font-black text-slate-800">Coming soon</h3>
        <p className="text-xs font-semibold text-slate-400 max-w-xs">
          This section is being built and will be available shortly. Check back soon!
        </p>
      </div>
    </div>
  );
}

/* ── Shared empty-state for locked report tables ── */
function EmptyTableState({ message, sub }: { message: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3">
      <div className="relative">
        <div className="w-16 h-12 bg-slate-100 rounded-lg border border-slate-200 flex items-end justify-center pb-2">
          <div className="w-8 h-1.5 bg-slate-200 rounded-full mb-1" />
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-200 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
        </div>
      </div>
      <p className="text-sm font-black text-slate-700">{message}</p>
      <p className="text-xs text-slate-400 font-semibold">{sub}</p>
    </div>
  );
}

/* ── Upgrade banner (purple) ── */
function UpgradeBanner({ title, sub, cta }: { title: string; sub: string; cta?: string }) {
  return (
    <div className="bg-[#f0edff] border border-purple-200/60 rounded-2xl p-4 flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-purple-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-white stroke-[2.5]">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-black text-purple-800">{title}</p>
          <p className="text-[10px] font-semibold text-purple-600/80">{sub}</p>
        </div>
      </div>
      <Link
        href="/dashboard/install?tab=plan"
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-extrabold rounded-xl uppercase tracking-wider transition-colors shrink-0"
      >
        {cta || "Choose a Plan"}
      </Link>
    </div>
  );
}

/* ── 1. Remediation Report ── */
function RemediationReportContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Remediation report</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed max-w-2xl">
          Get a detailed monthly report of all accessibility remediations and code changes accessWidget has applied to your website.
        </p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5">
          <UpgradeBanner
            title="Advanced feature!"
            sub="Upgrade your accessWidget plan to gain access to remediation reports"
          />
          {/* Table header */}
          <div className="grid grid-cols-4 px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <span>Date</span>
            <span className="text-center">Remediations</span>
            <span className="text-center">Categories</span>
            <span className="text-right">Action</span>
          </div>
          <EmptyTableState
            message="No remediation reports available yet."
            sub="Remediation reports will show up here"
          />
        </div>
      </div>
    </div>
  );
}

/* ── 2. Audit Report ── */
function AuditReportContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Audit report</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed max-w-2xl">
          View the history of all monthly accessibility audits run for your websites and download the reports.
        </p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5">
          <UpgradeBanner
            title="Buy a plan!"
            sub="Gain access to Audit reports by purchasing a plan."
          />
          {/* Table header */}
          <div className="grid grid-cols-3 px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <span>Date</span>
            <span className="text-center">Verdict</span>
            <span className="text-right">Action</span>
          </div>
          <EmptyTableState
            message="No audit reports available yet."
            sub="Audit reports will show up here."
          />
        </div>
      </div>
    </div>
  );
}

/* ── 3. License Owner Info ── */
function LicenseOwnerContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">License owner info</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed max-w-2xl">
          This information is used in the accessibility statement and for sending account notifications based on your preferences in account settings.
        </p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
        <div className="space-y-5 max-w-lg">
          {/* Website owner's name */}
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <label className="text-xs font-black text-slate-700">Website owner&apos;s name</label>
            <input
              type="text"
              placeholder=""
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 w-full focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Website owner's email */}
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <label className="text-xs font-black text-slate-700">Website owner&apos;s email</label>
            <input
              type="email"
              placeholder=""
              className="border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 w-full focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
            />
          </div>
          {/* Phone number */}
          <div className="grid grid-cols-[200px_1fr] items-center gap-4">
            <label className="text-xs font-black text-slate-700">Phone number</label>
            <div className="flex items-center gap-2">
              <select className="border border-slate-200 rounded-lg px-2 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-400 transition-all bg-white shrink-0">
                <option value="+1">🇺🇸 United States (+1)</option>
                <option value="+44">🇬🇧 UK (+44)</option>
                <option value="+91">🇮🇳 India (+91)</option>
                <option value="+61">🇦🇺 Australia (+61)</option>
                <option value="+49">🇩🇪 Germany (+49)</option>
                <option value="+33">🇫🇷 France (+33)</option>
              </select>
              <input
                type="tel"
                placeholder="Phone digits here..."
                className="border border-slate-200 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-800 flex-1 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
              />
            </div>
          </div>
          {/* Save button */}
          <div className="pt-2">
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer border-none transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 4. Proof of Effort Toolkit ── */
function ProofOfEffortContent() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Proof of effort toolkit</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-relaxed max-w-2xl">
          You&apos;ve taken steps to make your website accessible. The proof of effort toolkit compiles key documentation
          that showcases your commitment to accessibility. If your website&apos;s accessibility is ever challenged (i.e.
          you receive a demand letter), you&apos;ll have evidence to demonstrate your efforts and respond with confidence.
        </p>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5">
          <UpgradeBanner
            title="Buy a plan"
            sub="Gain access to Proof of Effort documentation by purchasing a plan."
          />
          <EmptyTableState
            message="No Proof of Effort documentation available yet"
            sub="Your Proof of Effort zip package will show up here, ready for download."
          />
        </div>
      </div>
    </div>
  );
}

function AccessibilityStatementContent({ domain }: { domain: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4">
      {/* Top bar: date + print button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{today}</span>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl cursor-pointer border-none transition-colors"
        >
          Print
        </button>
      </div>

      {/* Document card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* Document header */}
        <div className="p-8 pb-6 border-b border-slate-100">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black text-blue-600 tracking-tight">Accessibility Statement</h1>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs font-semibold text-slate-500">{domain}</span>
                <span className="text-slate-200">|</span>
                <span className="text-xs font-semibold text-slate-500">{today}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Issued by</p>
              <div className="flex items-center gap-1.5 justify-end">
                <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 stroke-white stroke-[2.5]">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span className="text-sm font-black text-slate-800">2all.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document body */}
        <div className="p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900">Compliance status</h2>
            <p>
              We firmly believe that the internet should be available and accessible to anyone and are committed to
              providing a website that is accessible to the broadest possible audience, regardless of ability.
            </p>
            <p>
              To fulfill this, we aim to adhere as strictly as possible to the World Wide Web Consortium's (W3C) Web
              Content Accessibility Guidelines 2.2 (WCAG 2.2) at the AA level. These guidelines explain how to make
              web content accessible to people with a wide array of disabilities. Complying with those guidelines
              helps us ensure that the website is accessible to blind people, people with motor impairments, visual
              impairment, cognitive disabilities, and more.
            </p>
            <p>
              This website utilizes various technologies that are meant to make it as accessible as possible at all times.
              We utilize an accessibility interface that allows persons with specific disabilities to adjust the website's
              UI (user interface) and design it to their personal needs.
            </p>
            <p>
              Additionally, the website utilizes an AI-based application that runs in the background and optimizes its
              accessibility level constantly. This application remediates the website's HTML, adapts its functionality
              and behavior for screen-readers used by blind users, and for keyboard functions used by individuals with
              motor impairments.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900">Screen-reader and keyboard navigation</h2>
            <p>
              Our website implements the ARIA attributes (Accessible Rich Internet Applications) technique, alongside
              various different behavioral changes, to ensure blind users visiting with screen-readers are able to
              read, comprehend, and enjoy the website's functions. As soon as a user with a screen-reader enters your
              website, they immediately receive a prompt to enter the Screen-Reader Profile so they can browse and
              operate your website effectively.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900">Disability profiles supported</h2>
            <ul className="list-none space-y-2">
              {[
                { name: "Epilepsy Safe Mode", desc: "Reduces the risk of seizures by eliminating flashing or blinking animations and risky color combinations." },
                { name: "Visually Impaired Mode", desc: "Optimizes the website for the experience of users with visual impairments such as Degrading Eyesight, Tunnel Vision, Cataract, Glaucoma, and others." },
                { name: "Cognitive Disability Mode", desc: "Assists with reading and focusing by significantly reducing the distracting elements." },
                { name: "ADHD Friendly Mode", desc: "Reduces distractions and improves focus by enabling a reading bar, a reading mask, and suppressing irrelevant elements." },
                { name: "Blind Users (Screen-reader)", desc: "Optimizes the website's compatibility with screen-readers such as JAWS, NVDA, VoiceOver, and TalkBack." },
                { name: "Keyboard Navigation Profile", desc: "Enables motor-impaired persons to operate the website using the keyboard Tab, Shift+Tab, and the Enter keys." },
              ].map((item) => (
                <li key={item.name} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  </div>
                  <span><strong className="font-black text-slate-800">{item.name}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900">Additional UI, design, and readability adjustments</h2>
            <p>
              In addition to the profiles above, we provide users the ability to change font sizes, spacing, alignment,
              colors, and more via accessibility tools built into our widget. Changes are stored via browser cookies and
              persist across sessions.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-black text-slate-900">Assistive technology support</h2>
            <p>
              We aim to support the widest array of browsers and assistive technologies as possible, so our users can
              choose the best fitting tools for them, with as few limitations as possible. We support all major systems
              including Windows and Mac ecosystems, major browsers including Chrome, Firefox, Safari, and Opera,
              screen readers including NVDA and JAWS for Windows and VoiceOver for Mac and iOS.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-2">
            <h2 className="text-sm font-black text-slate-900">Got feedback or encountered an issue?</h2>
            <p className="text-xs text-slate-600">
              We are always striving to improve our accessibility. If you find anything broken or have suggestions,
              please contact us and we will be happy to assist.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Anna Chat Widget ── */
function AnnaChatWidget() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ from: "anna" | "user"; text: string }[]>([
    { from: "anna", text: "Hi, I'm Anna! I'm your 24 hour virtual assistant." },
    { from: "anna", text: "Ask me a question or select one of the following options below." },
  ]);
  const [quickReplied, setQuickReplied] = useState(false);

  const now = new Date();
  const startedAt = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const startedLabel = `Started ${now.getDate()} ${now.toLocaleString("en-US", { month: "short" })} at ${startedAt}`;

  const handleQuickReply = (text: string) => {
    setQuickReplied(true);
    setMessages((prev) => [
      ...prev,
      { from: "user", text },
      { from: "anna", text: "Thanks! Let me connect you with the right support. A team member will be with you shortly." },
    ]);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: message.trim() },
      { from: "anna", text: "Thanks for your message! Our team will get back to you soon." },
    ]);
    setMessage("");
  };

  return (
    <>
      {/* Floating buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
        {/* Anna bubble popover (shown when chat is closed) */}
        {showBubble && !open && (
          <div
            className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xl max-w-[220px] flex items-center gap-3 mr-2 relative cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-slate-200/80 rotate-45" />
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-slate-400 mt-0.5">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="text-left flex-1">
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Anna</span>
              <p className="text-[10px] text-slate-700 font-bold leading-normal">Hi, I&apos;m Anna! I&apos;m your 24 hour virtual assistant.</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
              className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer shrink-0 text-sm font-bold focus:outline-none"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Accessibility button */}
          <button className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-105 transition-all cursor-pointer border-none">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current stroke-[2.5]">
              <path d="M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.5 12h9M12 8v8M10 22v-6h4v6" strokeLinecap="round" />
            </svg>
          </button>
          {/* Chat button — opens Anna panel */}
          <button
            onClick={() => { setOpen(true); setShowBubble(false); }}
            className="w-12 h-12 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg shadow-slate-900/30 hover:scale-105 transition-all cursor-pointer border-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current stroke-[2.5]">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-0 right-6 z-50 w-80 h-[520px] bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80">
          {/* Header */}
          <div className="bg-[#1a2340] px-4 py-3 flex items-center gap-3 shrink-0">
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white border-none bg-transparent cursor-pointer p-1 -ml-1 focus:outline-none"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-[2.5]">
                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="w-9 h-9 rounded-full bg-slate-600 border-2 border-white/20 overflow-hidden flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-slate-300">
                <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-black truncate">{startedLabel}</p>
            </div>
            <button className="text-white/70 hover:text-white border-none bg-transparent cursor-pointer focus:outline-none">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-[2.5]">
                <circle cx="12" cy="5" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="19" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* Notice bar */}
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-2 text-center">
            <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
              This chat is recorded using a cloud service and is subject to the terms of our{" "}
              <a href="#" className="underline text-slate-500">Privacy Notice ↗</a>.
            </p>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {/* Timestamp */}
            <p className="text-center text-[9px] text-slate-400 font-semibold">{startedAt}</p>

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.from === "user" ? "flex-row-reverse" : ""}`}>
                {msg.from === "anna" && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden mt-0.5">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-500">
                      <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
                <div>
                  {msg.from === "anna" && <p className="text-[9px] font-black text-slate-400 mb-1 ml-1">Anna</p>}
                  <div className={`rounded-2xl px-3 py-2 max-w-[200px] text-xs font-semibold leading-relaxed ${
                    msg.from === "anna"
                      ? "bg-slate-100 text-slate-700 rounded-tl-sm"
                      : "bg-blue-600 text-white rounded-tr-sm ml-auto"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {/* Quick reply buttons — only if not yet replied */}
            {!quickReplied && (
              <div className="space-y-2 pt-1">
                {["I have an accessiBe account", "I want my website more accessible"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleQuickReply(opt)}
                    className="w-full text-xs font-semibold text-blue-600 border border-blue-300 rounded-full py-2 px-4 hover:bg-blue-50 transition-colors cursor-pointer bg-white text-left"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="border-t border-slate-100 p-3 flex items-center gap-2 bg-white shrink-0">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Type a message"
              className="flex-1 border border-blue-300 rounded-full px-4 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center border-none cursor-pointer transition-colors shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current stroke-[2.5]">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function InstallPageInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as Tab) || "install";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // Sync if URL changes (e.g. when navigated from billing link)
  useEffect(() => {
    const t = searchParams.get("tab") as Tab;
    if (t) setActiveTab(t);
  }, [searchParams]);

  // These would come from server in a real app; using mock here
  const domain = "yourwebsite.com";
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 7);
  const formattedExpDate = expDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const renderContent = () => {
    switch (activeTab) {
      case "plan":
        return <PlanContent />;
      case "install":
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Install and customize widget
            </h1>

            {/* Trial Expiry Alert Box */}
            <div className="bg-[#eef4ff] border border-blue-100 rounded-3xl p-5 flex items-center gap-4 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.02)_0%,transparent_70%)] pointer-events-none" />
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600 shadow-inner">
                <Rocket className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-blue-900 leading-snug">
                  Your free trial is active and will expire on {formattedExpDate}.
                </h4>
                <p className="text-[10px] text-blue-600/80 font-bold leading-relaxed">
                  Next, install accessWidget on your website and help make it accessible.
                </p>
              </div>
            </div>

            {/* Code Block & Tabs Component */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
              <InstallCodeBlock domain={domain} />
            </div>

            {/* Need Help footer banner */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-left shadow-sm">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400 stroke-[2.5]" />
                <span className="text-xs font-bold text-slate-600">Need help with setup? Check out our step-by-step installation guides</span>
              </div>
              <a href="#" className="flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider">
                Check out guides
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
              </a>
            </div>
          </div>
        );
      case "statement":
        return <AccessibilityStatementContent domain={domain} />;
      case "remediation":
        return <RemediationReportContent />;
      case "audit":
        return <AuditReportContent />;
      case "owner":
        return <LicenseOwnerContent />;
      case "proof":
        return <ProofOfEffortContent />;
      default:
        return null;
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start select-none text-left">

      {/* SIDEBAR NAVIGATION: (3 cols) */}
      <div className="lg:col-span-3 space-y-6">

        {/* All licenses back link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs font-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
          All licenses
        </Link>

        {/* Domain Selector Dropdown Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between cursor-pointer hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100 text-blue-600">
              <Globe className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">Domain</span>
              <span className="block text-xs font-black text-slate-800">{domain}</span>
            </div>
          </div>
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-[2.5] stroke-slate-400 fill-none">
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Sidebar Tab Nav */}
        <nav className="space-y-1 bg-white border border-slate-200/80 rounded-2xl p-2.5 shadow-sm">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-black transition-all cursor-pointer border-none ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[2.5] shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

      </div>

      {/* MAIN CONTENT AREA: (9 cols) */}
      <div className="lg:col-span-9 space-y-6">
        {renderContent()}
      </div>

      {/* Floating Anna chat widget */}
      <AnnaChatWidget />


    </div>
  );
}

export default function InstallPage() {
  return (
    <Suspense fallback={null}>
      <InstallPageInner />
    </Suspense>
  );
}
