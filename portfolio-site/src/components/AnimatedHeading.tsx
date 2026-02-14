"use client";

import { motion, useReducedMotion } from "framer-motion";

interface AnimatedHeadingProps {
  text: string;
  className?: string;
  id?: string;
  as?: "h1" | "h2" | "h3";
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
    },
  },
};

const charVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function AnimatedHeading({ text, className, id, as: Tag = "h2" }: AnimatedHeadingProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Tag id={id} className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <Tag id={id} className={className}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block">
            {word.split("").map((char, ci) => (
              <motion.span
                key={`${wi}-${ci}`}
                variants={charVariants}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
