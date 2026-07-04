"use client";

import { useState } from "react";

export default function AnnaChatWidget() {
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
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 select-none">
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
              <circle cx="12" cy="4" r="2" />
              <path d="M7.5 12h9M12 8v8M10 22v-6h4v6" strokeLinecap="round" />
            </svg>
          </button>
          {/* Chat trigger button */}
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
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
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
                  {msg.from === "anna" && (
                    <p className="text-[9px] font-black text-slate-400 mb-1 ml-1">Anna</p>
                  )}
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

            {/* Quick-reply option buttons */}
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
