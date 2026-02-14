"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";

/* ── stat data ── */
interface Stat {
  label: string;
  value: number;
  suffix: string;
  format: (n: number) => string;
}

const fmt = (n: number) => Math.round(n).toLocaleString();
const fmtK = (n: number) => `${Math.round(n / 1000)}K`;
const fmtPct = (n: number) => n.toFixed(2);

const mainStats: Stat[] = [
  { label: "PRs Merged", value: 1200, suffix: "+", format: fmt },
  { label: "Deployments", value: 3400, suffix: "+", format: fmt },
  { label: "Lines Shipped", value: 850000, suffix: "+", format: fmtK },
  { label: "Uptime", value: 99.97, suffix: "%", format: fmtPct },
];

const bottomStats: Stat[] = [
  { label: "Microservices", value: 50, suffix: "+", format: fmt },
  { label: "Code Reviews", value: 2800, suffix: "+", format: fmt },
];

/* ── counting number ── */
function CountUp({ stat, inView }: { stat: Stat; inView: boolean }) {
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => `${stat.format(v)}${stat.suffix}`);
  const [text, setText] = useState(`0${stat.suffix}`);

  useEffect(() => {
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [display]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, stat.value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, mv, stat.value]);

  return <span>{text}</span>;
}

/* ── activity bars ── */
function ActivityBars() {
  const shouldReduceMotion = useReducedMotion();
  const barCount = 24;

  // Fixed initial heights to avoid hydration mismatch (no Math.random on first render)
  const initialHeights = Array.from({ length: barCount }, (_, i) => 20 + ((i * 37 + 13) % 60));

  const randomHeights = () =>
    Array.from({ length: barCount }, () => 20 + Math.random() * 80);

  const [heights, setHeights] = useState<number[]>(initialHeights);

  useEffect(() => {
    if (shouldReduceMotion) return;
    // Randomize immediately on mount, then on interval
    setHeights(randomHeights());
    const interval = setInterval(() => {
      setHeights(randomHeights());
    }, 1200);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldReduceMotion]);

  return (
    <div className="flex items-end gap-[3px]" style={{ height: 32 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            background: `linear-gradient(to top, var(--hero-accent-start), var(--hero-accent-end))`,
            opacity: 0.5 + (h / 100) * 0.5,
          }}
          animate={{ height: `${h}%` }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}

/* ── main component ── */
export function DevDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <aside ref={ref} className="premium-panel p-6 md:p-7">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Dev Dashboard</h2>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--brand-strong)]">
          <span className="live-dot relative inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Live
        </span>
      </div>
      <p className="mt-1.5 text-[13px] text-[var(--muted)]">
        What 6+ years of shipping looks like
      </p>

      {/* Main 2x2 grid */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {mainStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[var(--ink)]">
              <CountUp stat={stat} inView={inView} />
            </p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="mt-3 grid grid-cols-2 gap-3">
        {bottomStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {stat.label}
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-[var(--ink)]">
              <CountUp stat={stat} inView={inView} />
            </p>
          </div>
        ))}
      </div>

      {/* Activity bars */}
      <div className="mt-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Recent Commit Activity
        </p>
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-3">
          <ActivityBars />
        </div>
      </div>
    </aside>
  );
}
