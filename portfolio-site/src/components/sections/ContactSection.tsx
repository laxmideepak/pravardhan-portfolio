"use client";

import { useState, useEffect, useRef } from "react";
import type { ContactInfo } from "@/types/resume";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { MagneticButton } from "@/components/MagneticButton";

interface ContactSectionProps {
  contact: ContactInfo;
}

/* ── animations ── */
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ── typing text ── */
function TypingText({ text, inView, delay = 0 }: { text: string; inView: boolean; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      setDisplayed(text);
      return;
    }

    let idx = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        idx++;
        setDisplayed(text.slice(0, idx));
        if (idx >= text.length) clearInterval(interval);
      }, 35);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [inView, text, delay, shouldReduceMotion]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && <span className="animate-pulse">▊</span>}
    </>
  );
}

/* ── copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-auto shrink-0 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--ink)]"
      aria-label={`Copy ${text}`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

/* ── main ── */
export function ContactSection({ contact }: ContactSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="contact" className="section-shell py-12" aria-labelledby="contact-heading">
      <div className="mx-auto w-full max-w-6xl">
        <AnimatedHeading id="contact-heading" text="Let's Connect" className="section-heading" />
        <motion.p
          className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base"
          {...(!shouldReduceMotion && {
            initial: { opacity: 0, y: 10 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5, delay: 0.2 },
          })}
        >
          Always open to interesting conversations, collaborations, and new opportunities.
        </motion.p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
          {/* ── Left: Terminal-style card ── */}
          <motion.div
            ref={ref}
            className="overflow-hidden rounded-2xl border border-[var(--line)] shadow-lg"
            style={{ background: "var(--surface)" }}
            {...(!shouldReduceMotion && {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.2 },
            })}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-[var(--line)] px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-[11px] font-medium text-[var(--muted)]">contact.sh</span>
            </div>

            {/* Terminal body */}
            <div className="space-y-3 p-5 font-mono text-sm">
              {/* Email */}
              <motion.div className="flex items-center gap-3" {...(!shouldReduceMotion && { variants: itemVariants })}>
                <span className="text-[var(--brand-strong)]">$</span>
                <span className="text-[var(--muted)]">email</span>
                <span className="text-[var(--ink)]">
                  <TypingText text={contact.email} inView={inView} delay={200} />
                </span>
                <CopyButton text={contact.email} />
              </motion.div>

              {/* Phone */}
              <motion.div className="flex items-center gap-3" {...(!shouldReduceMotion && { variants: itemVariants })}>
                <span className="text-[var(--brand-strong)]">$</span>
                <span className="text-[var(--muted)]">phone</span>
                <span className="text-[var(--ink)]">
                  <TypingText text={contact.phone} inView={inView} delay={1200} />
                </span>
                <CopyButton text={contact.phone} />
              </motion.div>

              {/* Status */}
              <motion.div className="flex items-center gap-3" {...(!shouldReduceMotion && { variants: itemVariants })}>
                <span className="text-[var(--brand-strong)]">$</span>
                <span className="text-[var(--muted)]">status</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <TypingText text="Open to opportunities" inView={inView} delay={2400} />
                </span>
              </motion.div>

              {/* Cursor blink line */}
              <div className="mt-2 flex items-center gap-3">
                <span className="text-[var(--brand-strong)]">$</span>
                <span className="animate-pulse text-[var(--ink)]">▊</span>
              </div>
            </div>
          </motion.div>

          {/* ── Right: Quick action buttons ── */}
          <motion.div
            className="flex flex-col gap-4"
            {...(!shouldReduceMotion && {
              variants: containerVariants,
              initial: "hidden",
              whileInView: "visible",
              viewport: { once: true, amount: 0.2 },
            })}
          >
            {/* Email CTA — big card */}
            <motion.div {...(!shouldReduceMotion && { variants: itemVariants })}>
              <MagneticButton className="block w-full">
                <a
                  href={`mailto:${contact.email}`}
                  className="group relative block overflow-hidden rounded-2xl border border-[var(--line)] p-6 transition hover:border-[var(--brand)]"
                  style={{
                    background: "linear-gradient(145deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-strong) 86%, transparent))",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-xl transition group-hover:border-[var(--brand)]">
                      ✉️
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Send an email</p>
                      <p className="mt-0.5 text-base font-semibold text-[var(--ink)]">{contact.email}</p>
                    </div>
                    <svg className="ml-auto h-5 w-5 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(400px circle at 50% 50%, rgba(125, 228, 210, 0.08), transparent 50%)",
                    }}
                  />
                </a>
              </MagneticButton>
            </motion.div>

            {/* Phone CTA */}
            <motion.div {...(!shouldReduceMotion && { variants: itemVariants })}>
              <MagneticButton className="block w-full">
                <a
                  href={`tel:${contact.phone}`}
                  className="group relative block overflow-hidden rounded-2xl border border-[var(--line)] p-6 transition hover:border-[var(--brand)]"
                  style={{
                    background: "linear-gradient(145deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-strong) 86%, transparent))",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-xl transition group-hover:border-[var(--brand)]">
                      📞
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Give a call</p>
                      <p className="mt-0.5 text-base font-semibold text-[var(--ink)]">{contact.phone}</p>
                    </div>
                    <svg className="ml-auto h-5 w-5 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(400px circle at 50% 50%, rgba(114, 167, 255, 0.08), transparent 50%)",
                    }}
                  />
                </a>
              </MagneticButton>
            </motion.div>

            {/* Resume CTA */}
            <motion.div {...(!shouldReduceMotion && { variants: itemVariants })}>
              <MagneticButton className="block w-full">
                <a
                  href={contact.resumePath}
                  className="group relative block overflow-hidden rounded-2xl border border-[var(--line)] p-6 transition hover:border-[var(--brand)]"
                  style={{
                    background: "linear-gradient(145deg, color-mix(in srgb, var(--surface) 92%, transparent), color-mix(in srgb, var(--surface-strong) 86%, transparent))",
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] text-xl transition group-hover:border-[var(--brand)]">
                      📄
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Download</p>
                      <p className="mt-0.5 text-base font-semibold text-[var(--ink)]">Resume / CV</p>
                    </div>
                    <svg className="ml-auto h-5 w-5 text-[var(--muted)] transition group-hover:translate-x-1 group-hover:text-[var(--brand)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: "radial-gradient(400px circle at 50% 50%, rgba(125, 228, 210, 0.06), transparent 50%)",
                    }}
                  />
                </a>
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
