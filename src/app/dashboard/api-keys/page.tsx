"use client";

import { useState } from "react";
import { KeyRound, Plus, Copy, Eye, EyeOff, Trash2, X, Check } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "default_live_key",
      name: "Default Live Key",
      key: "2all_live_hdv7lo501n4riilwhnh4xh",
      created: "Jul 4, 2026",
    }
  ]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");

  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    // Generate random secure token
    const tokenPart1 = Math.random().toString(36).substring(2, 15);
    const tokenPart2 = Math.random().toString(36).substring(2, 15);
    const generatedKey = `2all_live_${tokenPart1}${tokenPart2}`;

    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(2, 9),
      name: keyName.trim(),
      key: generatedKey,
      created: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    setKeys([newKey, ...keys]);
    setKeyName("");
    setIsModalOpen(false);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.filter((k) => k.id !== id));
    if (showKey === id) setShowKey(null);
  };

  const handleCopyKey = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <div className="space-y-8 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">Manage API keys for integrating 2all.ai into your workflow.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all border-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-300">
            API keys grant full access to your account. Keep them secret and never commit them to source code.
          </p>
        </div>

        {keys.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-gray-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-1">No API keys yet</h3>
            <p className="text-sm text-gray-400">Generate a key to start using the 2all.ai API.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-4 py-4 text-left">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{k.name}</p>
                    <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md font-medium">Created {k.created}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1.5 break-all bg-black/20 p-2 rounded-lg border border-white/5 max-w-xl">
                    {showKey === k.id ? k.key : k.key.slice(0, 12) + "•".repeat(24)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => setShowKey(showKey === k.id ? null : k.id)} 
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer"
                  >
                    {showKey === k.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleCopyKey(k.id, k.key)} 
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all border-none bg-transparent cursor-pointer flex items-center justify-center"
                  >
                    {copiedId === k.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleRevokeKey(k.id)} 
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GENERATE KEY MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200 text-left">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Generate API Key</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-transparent border-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleGenerateKey} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Key Name
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Production Web Application"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2.5 bg-[#004bff] hover:bg-[#003edd] text-white font-extrabold text-xs rounded-xl cursor-pointer uppercase tracking-wider border-none"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
