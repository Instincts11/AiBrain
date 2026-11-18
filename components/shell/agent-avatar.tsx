import { cn } from "@/lib/utils";

export function AgentAvatar({
  agent,
  size = "md",
}: {
  agent: "jarvis" | "ultron";
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-16 w-16" : "h-12 w-12";
  const isJarvis = agent === "jarvis";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border",
        dims,
        isJarvis
          ? "border-cyan/40 bg-gradient-to-br from-cyan/25 to-cyan/5 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
          : "border-violet/40 bg-gradient-to-br from-violet/25 to-violet/5 shadow-[0_0_20px_rgba(139,92,246,0.25)]",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" className="h-[70%] w-[70%]">
        <ellipse
          cx="32"
          cy="28"
          rx="18"
          ry="20"
          fill="none"
          stroke={isJarvis ? "#22d3ee" : "#a78bfa"}
          strokeWidth="2"
        />
        <circle cx="24" cy="26" r="3" fill={isJarvis ? "#22d3ee" : "#a78bfa"} />
        <circle cx="40" cy="26" r="3" fill={isJarvis ? "#22d3ee" : "#a78bfa"} />
        <path
          d="M22 36c4 4 16 4 20 0"
          fill="none"
          stroke={isJarvis ? "#67e8f9" : "#c4b5fd"}
          strokeWidth="1.5"
        />
        <path
          d="M14 18c2-8 34-8 36 0"
          fill="none"
          stroke={isJarvis ? "#0891b2" : "#7c3aed"}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
