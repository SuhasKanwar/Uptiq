"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Globe, Zap, Shield } from "lucide-react";

const features = [
  {
    title: "Global Edge Network",
    description: "Deploy probes worldwide. Know exactly how your app performs in Tokyo while you sleep in San Francisco.",
    icon: Globe,
    color: "from-[#2ca58d] to-[#0f0f19]",
  },
  {
    title: "Sub-second Polling",
    description: "Don't wait for 5-minute cron jobs. We poll your endpoints multiple times per second for instant anomaly detection.",
    icon: Zap,
    color: "from-[#f59e0b] to-[#0f0f19]",
  },
  {
    title: "Deep Analytics",
    description: "Dive into TTFB, DNS resolution times, and TLS handshake latency with beautiful, interactive charts.",
    icon: Activity,
    color: "from-[#8b5cf6] to-[#0f0f19]",
  },
  {
    title: "Advanced Rules",
    description: "Set complex assertions. Ensure the body contains specific JSON, or headers match your security policies.",
    icon: Shield,
    color: "from-[#ec4899] to-[#0f0f19]",
  },
];

export default function FeaturesSection() {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-(--background-color)">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]),
            scale: useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.5, 0.8])
          }}
          className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--primary-color) opacity-20 blur-[120px] pointer-events-none"
        />

        <div className="absolute left-8 md:left-24 top-24 max-w-xl z-10 pointer-events-none">
          <motion.h2
            style={{ opacity: useTransform(scrollYProgress, [0, 0.05, 1], [1, 0, 0]) }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-(--white-color)"
          >
            Capabilities that scale.
          </motion.h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-8 pl-[10vw] md:px-24 md:pl-[40vw] pt-32 pb-16 h-full items-center">
          {features.map((feature, index) => {
            return (
              <div
                key={index}
                className="group relative h-[60vh] min-h-[400px] w-[85vw] max-w-[600px] shrink-0 overflow-hidden rounded-3xl border border-white/10 bg-[#16162a]/80 p-8 md:p-12 backdrop-blur-xl transition-all hover:border-white/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />

                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                    <feature.icon className="h-10 w-10 text-(--white-color)" />
                  </div>

                  <div>
                    <div className="text-sm font-mono text-white/50 mb-4">0{index + 1}</div>
                    <h3 className="mb-4 text-4xl md:text-5xl font-semibold tracking-tight text-(--white-color)">
                      {feature.title}
                    </h3>
                    <p className="text-xl md:text-2xl text-(--secondary-color) leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-[60px] group-hover:bg-white/20 transition-colors duration-500" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}