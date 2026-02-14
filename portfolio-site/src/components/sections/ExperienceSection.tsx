"use client";

import type { ExperienceItem } from "@/types/resume";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";

interface ExperienceSectionProps {
  experience: ExperienceItem[];
}

/* ── card entrance — scale + blur ── */
const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
      delay: i * 0.12,
    },
  }),
};

/* ── accent bar draws top-to-bottom ── */
const barDraw = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 },
  },
};

/* ── highlights stagger in one-by-one ── */
const listStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};

const listItem = {
  hidden: { opacity: 0, x: -16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── bullet dot pops in ── */
const dotPop = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 500, damping: 20 },
  },
};

export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="experience" className="section-shell py-12" aria-labelledby="experience-heading">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedHeading id="experience-heading" text="Professional Experience" className="section-heading" />

        <div className="mt-6 grid gap-5">
          {experience.map((item, index) => (
            <motion.article
              key={`${item.company}-${item.period}`}
              className="premium-panel group relative overflow-hidden p-6 md:p-7"
              {...(!shouldReduceMotion && {
                variants: cardVariants,
                custom: index,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.15 },
                whileHover: { y: -3, transition: { duration: 0.25 } },
              })}
            >
              {/* Accent bar — draws itself top-to-bottom */}
              <motion.span
                aria-hidden="true"
                className="experience-accent origin-top"
                {...(!shouldReduceMotion && {
                  variants: barDraw,
                  initial: "hidden",
                  whileInView: "visible",
                  viewport: { once: true, amount: 0.15 },
                })}
              />

              {/* Hover glow that follows the card */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(600px circle at 50% 50%, rgba(114, 167, 255, 0.05), transparent 40%)",
                }}
              />

              <header className="flex flex-wrap items-start justify-between gap-4 pl-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">{item.role}</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--brand-strong)]">
                    {item.company}
                  </p>
                </div>
                <div className="text-left text-sm text-[var(--muted)] md:text-right">
                  <p>{item.location}</p>
                  <p className="mt-1 font-semibold text-[var(--ink)]">{item.period}</p>
                </div>
              </header>

              {/* Highlights with staggered entry */}
              <motion.ul
                className="mt-5 grid gap-3 pl-4 text-sm leading-7 text-[var(--muted)]"
                {...(!shouldReduceMotion && {
                  variants: listStagger,
                  initial: "hidden",
                  whileInView: "visible",
                  viewport: { once: true, amount: 0.1 },
                })}
              >
                {item.highlights.map((highlight) => (
                  <motion.li
                    key={highlight}
                    className="flex gap-3"
                    {...(!shouldReduceMotion && { variants: listItem })}
                  >
                    <motion.span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
                      {...(!shouldReduceMotion && { variants: dotPop })}
                    />
                    <span>{highlight}</span>
                  </motion.li>
                ))}
              </motion.ul>

              {/* Bottom gradient line that draws on scroll */}
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--hero-accent-start), var(--hero-accent-end))",
                  }}
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.35 + index * 0.1,
                  }}
                />
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
