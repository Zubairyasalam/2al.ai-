"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface Issue {
  id: string;
  type: string;
  severity: string;
  element: string;
  description: string;
  suggestion: string | null;
}

const SEVERITY_STYLES: Record<string, { badge: string; border: string }> = {
  CRITICAL: {
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
    border: "border-red-500/20 hover:border-red-500/40",
  },
  HIGH: {
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    border: "border-orange-500/20 hover:border-orange-500/40",
  },
  MEDIUM: {
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    border: "border-amber-500/20 hover:border-amber-500/40",
  },
  LOW: {
    badge: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
  },
};

const WCAG_LABELS: Record<string, string> = {
  IMAGE_MISSING_ALT: "WCAG 1.1.1",
  IMAGE_MEANINGLESS_ALT: "WCAG 1.1.1",
  INPUT_MISSING_LABEL: "WCAG 1.3.1",
  LOW_COLOR_CONTRAST: "WCAG 1.4.3",
  MISSING_SKIP_LINK: "WCAG 2.4.1",
  MISSING_PAGE_TITLE: "WCAG 2.4.2",
  MISSING_H1: "WCAG 1.3.1",
  MULTIPLE_H1: "WCAG 1.3.1",
  LINK_EMPTY: "WCAG 2.4.4",
  LINK_NON_DESCRIPTIVE: "WCAG 2.4.4",
  BUTTON_MISSING_NAME: "WCAG 4.1.2",
  MISSING_LANG: "WCAG 3.1.1",
  KEYBOARD_INACCESSIBLE: "WCAG 2.1.1",
  IFRAME_MISSING_TITLE: "WCAG 4.1.2",
};

function formatType(type: string): string {
  return type
    .split("_")
    .map((w) => w[0] + w.slice(1).toLowerCase())
    .join(" ");
}

function IssueCard({ issue }: { issue: Issue }) {
  const [expanded, setExpanded] = useState(false);
  const styles = SEVERITY_STYLES[issue.severity] ?? SEVERITY_STYLES.LOW;

  return (
    <div
      className={`border rounded-xl transition-all ${styles.border} bg-white/[0.02]`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span
          className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full border ${styles.badge} shrink-0`}
        >
          {issue.severity}
        </span>
        <span className="flex-1 text-sm font-medium text-white">
          {formatType(issue.type)}
        </span>
        {WCAG_LABELS[issue.type] && (
          <span className="text-xs text-gray-500 shrink-0 hidden sm:block">
            {WCAG_LABELS[issue.type]}
          </span>
        )}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          {/* Description */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Issue
            </p>
            <p className="text-sm text-gray-200">{issue.description}</p>
          </div>

          {/* Element snippet */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Element
            </p>
            <code className="block text-xs bg-black/30 text-emerald-300 rounded-lg p-3 overflow-x-auto font-mono whitespace-pre-wrap break-all">
              {issue.element}
            </code>
          </div>

          {/* Suggestion */}
          {issue.suggestion && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                How to Fix
              </p>
              <p className="text-sm text-blue-300">{issue.suggestion}</p>
            </div>
          )}

          {/* WCAG link */}
          {WCAG_LABELS[issue.type] && (
            <a
              href={`https://www.w3.org/WAI/WCAG21/quickref/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              View {WCAG_LABELS[issue.type]} guidelines
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function IssueList({ issues }: { issues: Issue[] }) {
  const [filter, setFilter] = useState<string>("ALL");
  const severities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const filtered =
    filter === "ALL" ? issues : issues.filter((i) => i.severity === filter);

  return (
    <div className="space-y-4">
      {/* Severity filter tabs */}
      <div className="flex flex-wrap gap-2">
        {severities.map((s) => {
          const count =
            s === "ALL"
              ? issues.length
              : issues.filter((i) => i.severity === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Issue cards */}
      <div className="space-y-2">
        {filtered.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}
