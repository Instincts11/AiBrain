export function DualmindLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="28"
        height="16"
        viewBox="0 0 56 32"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="dm-inf" x1="0" y1="0" x2="56" y2="32">
            <stop stopColor="#22d3ee" />
            <stop offset="0.5" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#e879f9" />
          </linearGradient>
        </defs>
        <path
          d="M16 16c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12c-2.2 0-4.26-.593-6.04-1.63"
          stroke="url(#dm-inf)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M40 16c0 6.627-5.373 12-12 12S16 22.627 16 16s5.373-12 12-12c2.2 0 4.26.593 6.04 1.63"
          stroke="url(#dm-inf)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
      <span className="text-[13px] font-semibold tracking-[0.2em] text-ink">
        DUALMIND
      </span>
    </span>
  );
}
