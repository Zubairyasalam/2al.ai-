import { auth } from "@/lib/auth";
import { FileText, Download, TrendingUp } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-gray-400 mt-1">Download and view your accessibility audit reports.</p>
      </div>

      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-3">No reports generated yet</h3>
        <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
          Run an accessibility scan on a project to generate detailed PDF and CSV reports.
        </p>
        <div className="flex gap-3 justify-center">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-sm hover:bg-white/10 transition-all">
            <TrendingUp className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
