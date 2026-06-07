"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CallToActionSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-(--background-color) overflow-hidden">
      <motion.div
        style={{ scale, opacity }}
        className="absolute inset-4 md:inset-8 lg:inset-12 rounded-[3rem] bg-[#16162a] overflow-hidden flex flex-col items-center justify-center text-center px-4"
      >
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-(--primary-color) to-transparent skew-x-12 animate-[sweep_8s_ease-in-out_infinite]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-(--primary-color) opacity-20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-(--white-color)">
              Start monitoring.
            </h2>
            <p className="mt-8 mx-auto max-w-2xl text-xl md:text-2xl text-white/60 font-light">
              Don't wait for your customers to tell you your API is down. Get started in less than 60 seconds.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button className="group relative h-16 w-full sm:w-64 overflow-hidden rounded-full bg-(--white-color) text-[#0f0f19] text-lg font-medium transition-transform hover:scale-105 active:scale-95">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Deploy now
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-(--primary-color) to-[#63e0c2] opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <button className="h-16 w-full sm:w-64 rounded-full border border-white/20 bg-white/5 text-lg font-medium text-(--white-color) backdrop-blur-md transition-colors hover:bg-white/10 hover:text-(--white-color)">
              Talk to Sales
            </button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
