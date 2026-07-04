"use client";
import { useState } from "react";
import { KeyRound, Plus, Copy, Eye, EyeOff, Trash2 } from "lucide-react";

export default function ApiKeysPage() {
  const [keys] = useState<{ id: string; name: string; key: string; created: string }[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">API Keys</h1>
          <p className="text-gray-400 mt-1">Manage API keys for integrating 2all.ai into your workflow.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
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
          <div className="text-center py-10">
            <div className="w-14 h-14 bg-gray-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-7 h-7 text-gray-400" />
            </div>
            <h3 className="text-white font-medium mb-1">No API keys yet</h3>
            <p className="text-sm text-gray-400">Generate a key to start using the 2all.ai API.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {keys.map((k) => (
              <div key={k.id} className="flex items-center gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{k.name}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {showKey === k.id ? k.key : k.key.slice(0, 8) + "•".repeat(24)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowKey(showKey === k.id ? null : k.id)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    {showKey === k.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
