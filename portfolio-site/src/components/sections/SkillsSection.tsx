"use client";

import type { SkillCategory } from "@/types/resume";
import { motion, useReducedMotion } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";

interface SkillsSectionProps {
  skills: SkillCategory[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

const chipContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 350, damping: 18 } },
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="skills" className="section-shell py-12" aria-labelledby="skills-heading">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedHeading id="skills-heading" text="Professional Skills" className="section-heading" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {skills.map((skill, index) => (
            <motion.article
              key={skill.category}
              className="premium-panel p-5"
              {...(!shouldReduceMotion && {
                variants: cardVariants,
                custom: index,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.2 },
              })}
            >
              <h3 className="text-xl font-semibold text-[var(--ink)]">{skill.category}</h3>
              <motion.ul
                className="mt-4 flex flex-wrap gap-2"
                {...(!shouldReduceMotion && {
                  variants: chipContainer,
                  initial: "hidden",
                  whileInView: "visible",
                  viewport: { once: true, amount: 0.2 },
                })}
              >
                {skill.skills.map((item) => (
                  <motion.li
                    key={item}
                    className="skill-chip cursor-default"
                    {...(!shouldReduceMotion && { variants: chipVariants, whileHover: { scale: [1, 1.12, 0.95, 1.05, 1], transition: { duration: 0.4 } } })}
                  >
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
