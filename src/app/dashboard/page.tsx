import { auth } from "@/lib/auth";
import Link from "next/link";
import { 
  CheckCircle2, 
  FolderClosed, 
  Code2, 
  Scale, 
  ChevronRight, 
  ChevronLeft,
  ArrowUpRight
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] ?? "Zubairya";
  const userPlan = (session?.user as any)?.plan || "NONE";
  const paymentStatus = (session?.user as any)?.paymentStatus || "UNPAID";

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start select-none">
      
      {/* LEFT COLUMN: Main dashboard widgets (8 cols) */}
      <div className="lg:col-span-9 space-y-8">
        
        {/* Welcome greeting */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {userName}, Welcome to 2all.ai
          </h1>
          {userPlan !== "NONE" && paymentStatus === "PAID" && (
            <span className="px-3.5 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              {userPlan} Active Plan
            </span>
          )}
        </div>

        {/* Promo adjustments card */}
        <div className="flex flex-col md:flex-row bg-[#eef4ff] border border-blue-100 rounded-3xl p-8 justify-between items-center gap-6 relative overflow-hidden shadow-sm">
          {/* Deep glowing background radial flare */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.04)_0%,transparent_70%)] pointer-events-none" />
          
          {/* Text and Actions */}
          <div className="space-y-4 max-w-md text-left z-10">
            <h2 className="text-2xl font-black text-slate-900 leading-snug tracking-tight">
              Make your website accessible with 2allWidget!
            </h2>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
              With 2all.ai's AI-powered solution, you can streamline the process of helping make your website accessible and compliant.
            </p>
            {userPlan !== "NONE" && paymentStatus === "PAID" ? (
              <span className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/10 uppercase tracking-wider text-center inline-block">
                Paid Subscription Active
              </span>
            ) : (
              <Link href="/dashboard/install" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider text-center inline-block">
                Start a 7-day trial
              </Link>
            )}
          </div>

          {/* Widget Adjustments Mockup Panel */}
          <div className="hidden md:block relative w-[270px] bg-white border border-slate-200/50 rounded-2xl shadow-xl p-4 font-sans text-left shrink-0 z-10 select-none">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Accessibility Adjustments</span>
              <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Choose the right profile</span>
              
              {[
                { name: "Seizure Safe Profile", desc: "Eliminates flashes & reduces color" },
                { name: "Vision Impaired Profile", desc: "Enhances visuals & text size" },
                { name: "ADHD Friendly Profile", desc: "Reduces distractions & focus bar" },
                { name: "Cognitive Disability Profile", desc: "Assists reading & focusing" }
              ].map((profile, i) => (
                <div key={profile.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-800">{profile.name}</span>
                    <span className="block text-[7px] text-slate-400 font-bold">{profile.desc}</span>
                  </div>
                  {/* Toggle Switch */}
                  <div className={`w-5 h-3 rounded-full relative cursor-pointer p-0.5 ${i < 2 ? "bg-blue-600" : "bg-slate-200"}`}>
                    <div className={`w-2 h-2 bg-white rounded-full transition-transform ${i < 2 ? "translate-x-2" : "translate-x-0"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "Start a free trial", sub: "with 2allWidget", icon: CheckCircle2, color: "text-blue-600 bg-blue-50 border-blue-100", href: "/dashboard/install" },
            { title: "Get a quote", sub: "Expert services", icon: FolderClosed, color: "text-purple-600 bg-purple-50 border-purple-100", href: "#" },
            { title: "Try 2allFlow", sub: "Developer platform", icon: Code2, color: "text-emerald-600 bg-emerald-50 border-emerald-100", href: "#" },
            { title: "Audit website", sub: "for compliance", icon: Scale, color: "text-orange-600 bg-orange-50 border-orange-100", href: "#" }
          ].map((card) => {
            const Icon = card.icon;
            return (
              <Link 
                key={card.title} 
                href={card.href}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-start gap-4 text-left block"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-800">{card.title}</span>
                  <span className="block text-[10px] text-slate-400 font-bold mt-0.5">{card.sub}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Learn more section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="text-left">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Learn more about accessibility</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">See how accessibility benefits your business</p>
            </div>
            {/* Carousel navigation buttons */}
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button className="w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Carousel Articles Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                title: "Advancing digital accessibility with 2all.ai's expert services", 
                desc: "An overview of 2all.ai's Expert Services and how they can help your accessibility",
                bg: "bg-[#dbeafe]",
                img: "/images/dashboard/expert_services.png",
                badge: "EXPERT SERVICES"
              },
              { 
                title: "ADA compliant businesses are eligible for tax credits", 
                desc: "Information on tax credits for ADA-compliant businesses",
                bg: "bg-[#d1fae5]",
                img: "/images/dashboard/tax_credit.png",
                badge: "TAX CREDIT"
              },
              { 
                title: "How accessibility can improve your SEO and increase traffic", 
                desc: "Discover how accessibility can boost your website's SEO and organic traffic",
                bg: "bg-[#dee2ff]",
                img: "/images/dashboard/seo.png",
                badge: "SEO"
              },
              { 
                title: "ADA, web accessibility & legal requirements", 
                desc: "Understand the importance of the ADA & legal requirements for web accessibility",
                bg: "bg-[#ffedd5]",
                img: "/images/dashboard/wcag.png",
                badge: "WCAG"
              }
            ].map((art) => (
              <div 
                key={art.title}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col h-full cursor-pointer group text-left"
              >
                {/* Graphical Header */}
                <div className="h-28 relative overflow-hidden select-none bg-slate-50 flex items-center justify-center">
                  <img 
                    src={art.img} 
                    alt={art.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-black/5" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[8px] font-black text-slate-800 tracking-wider z-10">
                    {art.badge}
                  </span>
                </div>
                
                {/* Content */}
                <div className="p-4 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1.5 line-clamp-2">
                      {art.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Contact and partner actions (3 cols) */}
      <div className="lg:col-span-3 space-y-6 text-left">
        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">We are here for you:</span>
        
        {/* Support Representative Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center gap-3 select-none">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            <svg viewBox="0 0 24 24" className="w-7 h-7 text-slate-400 mt-1">
              <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 leading-tight">Need a demo?</h4>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Set up a demo with our team!</p>
          </div>
        </div>

        {/* Partner Program Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-lg border border-slate-800 select-none">
          {/* Accent glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
          
          <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 tracking-wider uppercase inline-block mb-4">
            2all.ai | Partner
          </span>

          <h3 className="text-base font-black leading-snug tracking-tight mb-2">
            Agency? Freelancer? Join our partner program!
          </h3>
          
          <p className="text-slate-400 text-[10px] font-medium leading-relaxed mb-6">
            Build or manage websites for a living? Our partner program is made for you.
          </p>

          <button className="w-full py-2.5 border border-white/20 hover:border-white text-white font-extrabold text-[10px] rounded-xl transition-all flex items-center justify-center gap-1 hover:bg-white/5 cursor-pointer uppercase tracking-wider bg-transparent">
            Partner Program Overview
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>

    </div>
  );
}
