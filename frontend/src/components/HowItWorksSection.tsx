"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const text = "Uptiq ensures zero downtime. Our edge network instantly filters false positives, and when incidents occur, we contain them before your customers ever notice.";

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  const words = text.split(" ");

  return (
    <section ref={containerRef} className="relative w-full bg-(--background-color) py-[20vh]">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="flex flex-wrap gap-x-3 gap-y-4 text-4xl font-medium leading-snug tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + (1 / words.length);

            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>

        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0.8, 1], [0, 1]),
            y: useTransform(scrollYProgress, [0.8, 1], [100, 0]),
            scale: useTransform(scrollYProgress, [0.8, 1], [0.9, 1])
          }}
          className="mt-32 relative mx-auto max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-(--primary-color) opacity-10 blur-[100px]" />

          <div className="flex h-[400px] w-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#0b1015]">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-6 py-4">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>

            <div className="flex-1 p-6 grid grid-cols-3 gap-6">
              <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.01] p-6 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-(--primary-color)/20 to-transparent" />
                <svg className="absolute bottom-0 left-0 w-full h-full preserve-aspect-ratio-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0 100 C 20 80, 40 90, 60 40 C 80 -10, 100 50, 100 50 L 100 100 Z" fill="rgba(44, 165, 141, 0.1)" stroke="var(--primary-color)" strokeWidth="0.5" />
                </svg>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-center flex-col">
                  <div className="text-4xl font-light text-(--white-color)">99.99<span className="text-xl text-white/40">%</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Uptime</div>
                </div>
                <div className="flex-1 rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-center flex-col">
                  <div className="text-4xl font-light text-(--white-color)">12<span className="text-xl text-white/40">ms</span></div>
                  <div className="text-xs uppercase tracking-widest text-white/40 mt-2">Avg Latency</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function Word({ children, progress, range }: { children: string, progress: any, range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="text-(--white-color)">
      {children}
    </motion.span>
  );
}