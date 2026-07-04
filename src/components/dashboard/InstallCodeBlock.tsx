"use client";

import { useState } from "react";
import { Check, Copy, Mail, Code, Sparkles, Maximize2, Minimize2 } from "lucide-react";

export default function InstallCodeBlock({ domain }: { domain: string }) {
  const [activeTab, setActiveTab] = useState<"install" | "customize">("install");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const codeSnippet = `<script>(function(){
var s = document.createElement('script');
var h = document.querySelector('head') || document.body;
s.src = 'https://cdn.2all.ai/widget.js';
s.async = true;
s.onload = function(){
  new TwoAllWidget({
    apiKey: '2all_live_hdv7lo501n4riilwhnh4xh',
    domain: '${domain}'
  });
};
h.appendChild(s);
})();</script>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("install")}
          className="flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px focus:outline-none"
          style={{ borderBottomColor: activeTab === "install" ? "#2563eb" : "transparent", color: activeTab === "install" ? "#2563eb" : "#94a3b8" }}
        >
          <Code className="w-4 h-4 stroke-[2.5]" />
          Install widget
        </button>
        <button
          onClick={() => setActiveTab("customize")}
          className="flex items-center gap-2 px-6 py-3.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 bg-transparent cursor-pointer -mb-px focus:outline-none"
          style={{ borderBottomColor: activeTab === "customize" ? "#2563eb" : "transparent", color: activeTab === "customize" ? "#2563eb" : "#94a3b8" }}
        >
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          Customize widget
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "install" ? (
        <div className="space-y-6">
          <h3 className="text-sm font-black text-slate-800 tracking-tight">Quick installation guide</h3>
          
          <div className="space-y-6 text-left">
            {/* Step 1 */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-slate-200">
                  1
                </div>
                <h4 className="text-xs font-black text-slate-800 pt-0.5">Copy the installation code</h4>
              </div>

              {/* Code Box Container matching Image 1 */}
              <div className="bg-[#f3f7fa] border border-slate-200/60 rounded-2xl p-5 space-y-4">
                
                {/* Code line & Expand */}
                <div className="flex items-center justify-between gap-4">
                  {isExpanded ? (
                    <pre className="font-mono text-[10.5px] text-slate-600 leading-relaxed overflow-x-auto whitespace-pre w-full text-left">
                      {codeSnippet}
                    </pre>
                  ) : (
                    <code className="font-mono text-[11px] text-slate-600 truncate flex-1 text-left select-all">
                      &lt;script&gt; (function()&#123; var s = document.createElement('script'); var h = document.querySelector('head') || document.body; s.src = 'https://cdn.2all.ai/widget.js'; s.async = true; s.onload = function()&#123; new TwoAllWidget(&#123; apiKey: '2all_live_hdv7lo501n4riilwhnh4xh', domain: '{domain}' &#125;); &#125;; h.appendChild(s); &#125;)(); &lt;/script&gt;
                    </code>
                  )}
                  
                  {/* Expand Button */}
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-[11px] font-black text-slate-600 hover:text-slate-800 shrink-0 border-none bg-transparent cursor-pointer select-none focus:outline-none"
                  >
                    {isExpanded ? (
                      <>
                        <Minimize2 className="w-3.5 h-3.5 stroke-[3]" />
                        Collapse
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-3.5 h-3.5 stroke-[3]" />
                        Expand
                      </>
                    )}
                  </button>
                </div>

                {/* Action buttons (Copy / Share) inside the card */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition-all cursor-pointer border-none uppercase tracking-wider"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 stroke-[2.5]" />
                        Copy to Clipboard
                      </>
                    )}
                  </button>
                  <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer uppercase tracking-wider">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2.5]">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Send to developer
                  </button>
                </div>

              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 pt-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shrink-0 border border-slate-200">
                  2
                </div>
                <h4 className="text-xs font-black text-slate-700 pt-0.5 leading-relaxed">
                  Paste the code at the bottom of your HTML file, right before the{" "}
                  <code className="bg-slate-100 text-blue-600 px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200/50">
                    &lt;/body&gt;
                  </code>{" "}
                  tag and the widget will automatically appear on every page.
                </h4>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto" />
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Customize widget is ready!</h4>
          <p className="text-[10px] text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
            Personalize the colors, triggers, placement, and shapes of the widget options on your website to blend perfectly with your brand identity.
          </p>
        </div>
      )}
    </div>
  );
}
