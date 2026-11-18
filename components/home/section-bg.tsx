"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export function SectionBg({
  src,
  overlay = "from-[#05070f]/75 via-[#05070f]/55 to-[#05070f]/90",
  parallax = true,
}: {
  src: string;
  overlay?: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || !parallax ? ["0%", "0%"] : ["0%", "28%"],
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion || !parallax ? [1, 1] : [1.08, 1],
  );

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div style={{ y, scale }} className="absolute inset-[-12%]">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={src.includes("hero-bg") || src.includes("bg-hero")}
        />
      </motion.div>
      <div className={`absolute inset-0 bg-gradient-to-b ${overlay}`} />
    </div>
  );
}
