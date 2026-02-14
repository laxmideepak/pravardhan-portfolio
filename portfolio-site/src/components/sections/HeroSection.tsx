"use client";

import { useEffect, useState, useCallback } from "react";
import type { ContactInfo } from "@/types/resume";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/MagneticButton";
import { DevDashboard } from "@/components/DevDashboard";

interface HeroSectionProps {
  name: string;
  contact: ContactInfo;
}

/* ── animation variants ── */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const fadeBlurUp = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const springPop = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 400, damping: 15 },
  },
};

const slideRight = {
  hidden: { opacity: 0, x: 60, rotate: 3 },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 },
  },
};

const ctaSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── rotating titles ── */
const titles = [
  "Backend Architect",
  "Microservices Engineer",
  "Cloud Native Builder",
  "Full Stack Developer",
];

function RotatingTitle() {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  if (shouldReduceMotion) {
    return <span className="text-[var(--brand-strong)]">{titles[0]}</span>;
  }

  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ height: "1.15em", verticalAlign: "baseline" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={titles[index]}
          className="inline-block text-[var(--brand-strong)]"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
        >
          {titles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── main component ── */

export function HeroSection({ name, contact }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const M = shouldReduceMotion ? "div" : motion.div;
  const initial = shouldReduceMotion ? undefined : "hidden";
  const animate = shouldReduceMotion ? undefined : "visible";

  const firstName = name.split(" ")[0];
  const lastName = name.split(" ").slice(1).join(" ");
  const fullName = `${firstName}\n${lastName}`;
  const altText = "Software\nEngineer";
  const [isHovered, setIsHovered] = useState(false);
  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  const displayText = isHovered ? altText : fullName;
  const displayLines = displayText.split("\n");

  return (
    <section id="home" className="section-shell pb-14 pt-14 md:pt-20" aria-labelledby="hero-heading">
      <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.45fr_1fr] md:items-center">
        {/* Left column — staggered reveal */}
        <M
          {...(!shouldReduceMotion && {
            variants: stagger,
            initial,
            whileInView: animate,
            viewport: { once: true, amount: 0.2 },
          })}
        >
          {/* Badge — spring pop */}
          <motion.div
            {...(!shouldReduceMotion && { variants: springPop })}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-strong)]">
              Available for opportunities
            </span>
          </motion.div>

          {/* Greeting line */}
          <motion.p
            className="mt-6 text-base font-medium text-[var(--muted)] md:text-lg"
            {...(!shouldReduceMotion && { variants: fadeBlurUp })}
          >
            Hey, I&apos;m
          </motion.p>

          {/* Name — swaps to "Software Engineer" on hover */}
          <motion.h1
            id="hero-heading"
            className="mt-1 cursor-pointer select-none text-4xl font-bold leading-[1.05] tracking-[-0.03em] md:text-6xl lg:text-7xl"
            style={{ perspective: "600px" }}
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            {...(!shouldReduceMotion && {
              variants: { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } },
            })}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={displayText}
                className="inline-block"
                initial={shouldReduceMotion ? undefined : { opacity: 0 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* Line 1 */}
                <span className="inline-block overflow-hidden">
                  {displayLines[0].split("").map((char, i) => (
                    <motion.span
                      key={`a-${i}-${displayText}`}
                      className="inline-block"
                      initial={shouldReduceMotion ? undefined : { y: 40, rotateX: 60, opacity: 0 }}
                      animate={shouldReduceMotion ? undefined : { y: 0, rotateX: 0, opacity: 1 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: i * 0.025,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
                <br />
                {/* Line 2 — gradient accent */}
                <span className="inline-block overflow-hidden hero-accent hero-shimmer">
                  {displayLines[1].split("").map((char, i) => (
                    <motion.span
                      key={`b-${i}-${displayText}`}
                      className="inline-block"
                      initial={shouldReduceMotion ? undefined : { y: 40, rotateX: 60, opacity: 0 }}
                      animate={shouldReduceMotion ? undefined : { y: 0, rotateX: 0, opacity: 1 }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1] as const,
                        delay: (displayLines[0].length + i) * 0.025,
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </span>
              </motion.span>
            </AnimatePresence>
          </motion.h1>

          {/* Rotating title */}
          <motion.p
            className="mt-4 text-xl font-semibold md:text-2xl"
            {...(!shouldReduceMotion && { variants: fadeBlurUp })}
          >
            <RotatingTitle />
          </motion.p>

          {/* Tagline — punchier copy */}
          <motion.p
            className="mt-4 max-w-xl text-base leading-8 text-[var(--muted)] md:text-lg"
            {...(!shouldReduceMotion && { variants: fadeBlurUp })}
          >
            I build systems that don&apos;t break at 3 AM. 6+ years turning complex business logic into clean,
            scalable microservices across banking, insurance &amp; enterprise platforms.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            {...(!shouldReduceMotion && { variants: ctaSlideUp })}
          >
            <MagneticButton>
              <a
                href={contact.resumePath}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--cta-bg)] px-6 py-3 text-sm font-semibold text-[var(--cta-text)] transition hover:brightness-110"
                aria-label="Download resume PDF"
                style={{ color: "var(--cta-text)", WebkitTextFillColor: "var(--cta-text)" }}
              >
                Download Resume
                <svg className="h-4 w-4 transition group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--line-strong)] hover:bg-[var(--surface-strong)]"
                aria-label="Jump to contact section"
              >
                Let&apos;s Talk
                <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </a>
            </MagneticButton>
          </motion.div>
        </M>

        {/* Right column — Dev Dashboard slides in */}
        <motion.div
          {...(!shouldReduceMotion && {
            variants: slideRight,
            initial: "hidden",
            whileInView: "visible",
            viewport: { once: true, amount: 0.2 },
          })}
        >
          <DevDashboard />
        </motion.div>
      </div>
    </section>
  );
}
