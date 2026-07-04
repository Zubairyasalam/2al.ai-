"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScanSearch, Loader2 } from "lucide-react";

export default function ScanButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setStatus("Crawling website…");

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(`Error: ${data.message ?? "Scan failed"}`);
      } else {
        setStatus(
          data.status === "FAILED"
            ? `Scan failed: ${data.error ?? "Unknown error"}`
            : `✓ Done! Score: ${data.score}/100 — ${data.issuesCount} issues`
        );
        router.refresh();
      }
    } catch {
      setStatus("Network error. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={handleScan}
        disabled={scanning}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
      >
        {scanning ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ScanSearch className="w-4 h-4" />
        )}
        {scanning ? "Scanning…" : "Run Scan"}
      </button>
      {status && (
        <p
          className={`text-xs ${
            status.startsWith("Error") || status.includes("failed")
              ? "text-red-400"
              : status.startsWith("✓")
              ? "text-emerald-400"
              : "text-gray-400"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
