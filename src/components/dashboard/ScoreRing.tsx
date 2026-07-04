interface ScoreRingProps {
  score: number;
}

export default function ScoreRing({ score }: ScoreRingProps) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";

  const label =
    score >= 80 ? "Good" : score >= 50 ? "Needs Work" : "Poor";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 84 84">
          {/* Background track */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Score arc */}
          <circle
            cx="42"
            cy="42"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white leading-none">{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
