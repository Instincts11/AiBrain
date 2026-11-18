"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { DualMindsPreview } from "@/components/home/dual-minds-preview";

type ClickStep = {
  x: number;
  y: number;
  label: string;
};

type Scene = {
  title: string;
  caption: string;
  path?: string;
  mode?: "iframe" | "dual-minds";
  steps: ClickStep[];
};

const SCENES: Scene[] = [
  {
    title: "Nexus",
    caption: "Explore the live knowledge graph and open node details",
    path: "/nexus?embed=1",
    mode: "iframe",
    steps: [
      { x: 30, y: 42, label: "Select a knowledge node" },
      { x: 52, y: 36, label: "Follow related links" },
      { x: 84, y: 48, label: "Open inspector" },
      { x: 18, y: 78, label: "Browse side panels" },
    ],
  },
  {
    title: "Intelligence Lab",
    caption: "Configure a real decision session with dual agents",
    path: "/lab?embed=1",
    mode: "iframe",
    steps: [
      { x: 38, y: 28, label: "Define the decision" },
      { x: 70, y: 40, label: "Attach context" },
      { x: 28, y: 62, label: "Set JARVIS focus" },
      { x: 72, y: 62, label: "Set ULTRON critique" },
      { x: 50, y: 84, label: "Run analysis" },
    ],
  },
  {
    title: "Dual Analysis",
    caption: "JARVIS and red ULTRON intelligences move side by side",
    mode: "dual-minds",
    steps: [
      { x: 28, y: 48, label: "JARVIS constructive mind" },
      { x: 72, y: 48, label: "ULTRON critical mind" },
      { x: 50, y: 58, label: "Side-by-side dual pressure" },
      { x: 72, y: 42, label: "Track red ULTRON motion" },
    ],
  },
  {
    title: "Memory Matrix",
    caption: "Navigate the live Memory Matrix vault",
    path: "/vault?embed=1",
    mode: "iframe",
    steps: [
      { x: 48, y: 44, label: "Focus a memory cluster" },
      { x: 62, y: 34, label: "Inspect linked memories" },
      { x: 16, y: 86, label: "Open stats" },
      { x: 84, y: 50, label: "Read memory details" },
    ],
  },
];

const STEP_MS = 2400;
const SCENE_HOLD_MS = 1000;

export function ProductWalkthrough() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [clicking, setClicking] = useState(false);
  const [ready, setReady] = useState(false);
  const [origin, setOrigin] = useState("");
  const sceneIndexRef = useRef(0);
  const stepIndexRef = useRef(0);

  const scene = SCENES[sceneIndex];
  const step = scene.steps[stepIndex] ?? scene.steps[0];

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    sceneIndexRef.current = sceneIndex;
  }, [sceneIndex]);

  useEffect(() => {
    stepIndexRef.current = stepIndex;
  }, [stepIndex]);

  const isDualMinds = scene.mode === "dual-minds";

  const src = useMemo(() => {
    if (!origin || !scene.path) return "";
    return `${origin}${scene.path}`;
  }, [origin, scene.path]);

  useEffect(() => {
    setReady(false);
    if (isDualMinds) {
      setReady(true);
      return;
    }
    if (!src) return;
    const timeout = window.setTimeout(() => setReady(true), 2200);
    return () => window.clearTimeout(timeout);
  }, [src, isDualMinds]);

  useEffect(() => {
    if (!playing || !ready) return;

    const clickTimer = window.setTimeout(() => setClicking(true), 950);
    const clearClick = window.setTimeout(() => setClicking(false), 1300);

    const currentScene = SCENES[sceneIndexRef.current];
    const currentStep = stepIndexRef.current;
    const isLastStep = currentStep >= currentScene.steps.length - 1;
    const delay = STEP_MS + (isLastStep ? SCENE_HOLD_MS : 0);

    const advance = window.setTimeout(() => {
      const s = sceneIndexRef.current;
      const st = stepIndexRef.current;
      const stepsLen = SCENES[s].steps.length;

      if (st < stepsLen - 1) {
        const next = st + 1;
        stepIndexRef.current = next;
        setStepIndex(next);
        return;
      }

      const nextScene = (s + 1) % SCENES.length;
      sceneIndexRef.current = nextScene;
      stepIndexRef.current = 0;
      setSceneIndex(nextScene);
      setStepIndex(0);
    }, delay);

    return () => {
      window.clearTimeout(clickTimer);
      window.clearTimeout(clearClick);
      window.clearTimeout(advance);
    };
  }, [playing, ready, sceneIndex, stepIndex]);

  return (
    <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-cyan/30 bg-[#05070f] shadow-[0_0_40px_rgba(34,211,238,0.18)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan">
            Live app walkthrough
          </p>
          <p className="text-sm font-medium text-ink">{scene.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden font-mono text-xs text-ink-dim sm:inline">
            {String(sceneIndex + 1).padStart(2, "0")} /{" "}
            {String(SCENES.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-ink hover:border-cyan/40 hover:text-cyan"
            aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
          >
            {playing ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="relative h-[320px] overflow-hidden bg-[#05070f] sm:h-[380px] lg:h-[420px]">
        {!ready && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#05070f] text-sm text-ink-muted">
            Loading {scene.title}…
          </div>
        )}

        {isDualMinds ? (
          <DualMindsPreview />
        ) : (
          src && (
            <iframe
              key={src}
              src={src}
              title={`${scene.title} live walkthrough`}
              className="pointer-events-none absolute left-0 top-0 h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-[#05070f]"
              loading="eager"
              onLoad={() => setReady(true)}
            />
          )
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#05070f]/80 via-transparent to-[#05070f]/15" />

        <div
          className="pointer-events-none absolute z-30 transition-all duration-700 ease-out"
          style={{
            left: `${step.x}%`,
            top: `${step.y}%`,
            transform: "translate(-10%, -8%)",
          }}
        >
          <div
            className={cn(
              "absolute -left-3 -top-3 h-10 w-10 rounded-full border-2 border-cyan/70 transition-all duration-200",
              clicking
                ? "scale-75 bg-cyan/30 opacity-100"
                : "scale-100 bg-transparent opacity-45",
            )}
          />
          {clicking && (
            <div className="absolute -left-5 -top-5 h-14 w-14 animate-ping rounded-full border border-cyan/50" />
          )}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            className="relative drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
          >
            <path
              d="M4 3l7.5 17 1.7-6.3L19.5 12 4 3z"
              fill="#e8eef7"
              stroke="#22d3ee"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute z-30 max-w-[220px] transition-all duration-500"
          style={{
            left: `${Math.min(Math.max(step.x, 18), 78)}%`,
            top: `${Math.min(step.y + 8, 86)}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="rounded-full border border-cyan/35 bg-[#05070f]/88 px-3 py-1.5 text-center text-xs font-medium text-cyan shadow-[0_0_18px_rgba(34,211,238,0.25)] backdrop-blur">
            {step.label}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-3 pt-10">
          <p className="text-sm text-ink-muted">{scene.caption}</p>
        </div>
      </div>
    </div>
  );
}
