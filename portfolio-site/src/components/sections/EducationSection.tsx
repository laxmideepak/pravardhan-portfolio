"use client";

import { useRef } from "react";
import type { EducationItem } from "@/types/resume";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";

interface EducationSectionProps {
  education: EducationItem[];
}

/* ── card reveal with 3D tilt ── */
const cardVariants = {
  hidden: { opacity: 0, y: 50, rotateX: 8, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: i * 0.15,
    },
  }),
};

/* ── icon decoration ── */
const icons: Record<string, string> = {
  master: "🎓",
  bachelor: "📜",
};

function getIcon(degree: string): string {
  const lower = degree.toLowerCase();
  if (lower.includes("master")) return icons.master;
  if (lower.includes("bachelor")) return icons.bachelor;
  return "🎓";
}

function EducationCard({ item, index }: { item: EducationItem; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <motion.article
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-[var(--line)] p-6 md:p-8"
      style={{
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--surface) 95%, transparent), color-mix(in srgb, var(--surface-strong) 88%, transparent))",
        boxShadow: "var(--shadow-card)",
        perspective: "800px",
      }}
      {...(!shouldReduceMotion && {
        variants: cardVariants,
        custom: index,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.3 },
        whileHover: { y: -4, boxShadow: "0 20px 44px rgba(4, 8, 20, 0.5)" },
        transition: { duration: 0.3 },
      })}
    >
      {/* Parallax gradient bg */}
      {!shouldReduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background: `radial-gradient(circle at 80% 20%, var(--hero-accent-start), transparent 60%)`,
            y: backgroundY,
          }}
        />
      )}

      <div className="relative flex gap-5">
        {/* Big icon */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-2xl">
          {getIcon(item.degree)}
        </div>

        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight text-[var(--ink)] md:text-2xl">
            {item.degree}
          </h3>
          <p className="mt-1.5 text-sm font-semibold text-[var(--brand-strong)]">{item.institution}</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-[var(--muted)]">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {item.location}
          </p>
        </div>
      </div>

      {/* Bottom gradient line on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, var(--hero-accent-start), var(--hero-accent-end))",
        }}
        initial={{ scaleX: 0 }}
        whileInView={!shouldReduceMotion ? { scaleX: 1 } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.4 + index * 0.15 }}
      />
    </motion.article>
  );
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="section-shell py-12" aria-labelledby="education-heading">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedHeading id="education-heading" text="Education" className="section-heading" />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {education.map((item, index) => (
            <EducationCard key={`${item.institution}-${item.degree}`} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
