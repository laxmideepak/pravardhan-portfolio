"use client";

import { useEffect, useMemo, useState, createContext, useContext } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ── helpers ── */

function timezoneToCity(timezone: string): string {
  if (!timezone) return "Local";
  const parts = timezone.split("/");
  const raw = parts[parts.length - 1] ?? "Local";
  return raw.replace(/_/g, " ");
}

function safeText(value: string | null | undefined): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function formatTime(timezone: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  }).format(new Date());
}

function formatTimezoneShort(timezone: string): string {
  const formatter = new Intl.DateTimeFormat(undefined, {
    timeZone: timezone,
    timeZoneName: "short",
  });
  const parts = formatter.formatToParts(new Date());
  const tz = parts.find((p) => p.type === "timeZoneName");
  return tz?.value ?? timezone;
}

/* ── shared state via context ── */

interface LocationData {
  city: string;
  timeText: string;
  tzShort: string;
  tempDisplay: string | null;
}

const LocationContext = createContext<LocationData | null>(null);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const fallbackTimezone = useMemo(
    () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"),
    [],
  );
  const fallbackCity = useMemo(() => timezoneToCity(fallbackTimezone), [fallbackTimezone]);

  const [city, setCity] = useState(fallbackCity);
  const [timezone, setTimezone] = useState(fallbackTimezone);
  const [temperatureC, setTemperatureC] = useState<number | null>(null);
  const [timeText, setTimeText] = useState("");

  useEffect(() => {
    setTimeText(formatTime(timezone));
    const timer = setInterval(() => setTimeText(formatTime(timezone)), 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  useEffect(() => {
    let mounted = true;
    async function fetchIp() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = (await res.json()) as {
          latitude?: number; longitude?: number;
          city?: string; region?: string; timezone?: string;
        };
        if (!mounted) return;
        setCity([safeText(data.city), safeText(data.region)].filter(Boolean).join(", ") || fallbackCity);
        setTimezone(safeText(data.timezone) ?? fallbackTimezone);
        if (typeof data.latitude === "number" && typeof data.longitude === "number") {
          try {
            const url = new URL("https://api.open-meteo.com/v1/forecast");
            url.searchParams.set("latitude", String(data.latitude));
            url.searchParams.set("longitude", String(data.longitude));
            url.searchParams.set("current", "temperature_2m");
            url.searchParams.set("timezone", "auto");
            const wRes = await fetch(url.toString());
            if (wRes.ok) {
              const w = (await wRes.json()) as { current?: { temperature_2m?: number } };
              if (typeof w.current?.temperature_2m === "number" && mounted) {
                setTemperatureC(w.current.temperature_2m);
              }
            }
          } catch { /* swallow */ }
        }
      } catch { /* swallow */ }
    }
    void fetchIp();
    return () => { mounted = false; };
  }, [fallbackCity, fallbackTimezone]);

  const tzShort = formatTimezoneShort(timezone);
  const tempDisplay = temperatureC != null ? `${Math.round(temperatureC)}°C` : null;

  return (
    <LocationContext.Provider value={{ city, timeText, tzShort, tempDisplay }}>
      {children}
    </LocationContext.Provider>
  );
}

/* ── Pill UI (reusable) ── */

function Pill({ compact }: { compact?: boolean }) {
  const data = useContext(LocationContext);
  if (!data) return null;

  return (
    <div className={`flex items-center rounded-full border border-[var(--line)] bg-[var(--surface)]/80 shadow-md backdrop-blur-md ${compact ? "gap-1.5 px-3 py-1.5" : "gap-3 px-5 py-2.5"}`}>
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <p className={`flex min-w-0 items-center font-medium text-[var(--muted)] ${compact ? "gap-1.5 text-[11px]" : "gap-2.5 text-[13px]"}`} suppressHydrationWarning>
        <span className="truncate text-[var(--ink)]">{data.city}</span>
        <span>•</span>
        <span className="tabular-nums text-[var(--brand-strong)]">{data.timeText || "--:--"}</span>
        {!compact && <span>{data.tzShort}</span>}
        {data.tempDisplay && (
          <>
            <span>•</span>
            <span>{data.tempDisplay}</span>
          </>
        )}
      </p>
    </div>
  );
}

/* ── Desktop: fixed floating pill (hidden on mobile) ── */

export function LocationWidget() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed left-1/2 top-[70px] z-40 hidden -translate-x-1/2 sm:block"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.8 }}
    >
      <Pill />
    </motion.div>
  );
}

/* ── Mobile: inline pill (rendered inside hero section) ── */

export function LocationPillMobile() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-4 flex justify-center sm:hidden"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }}
    >
      <Pill compact />
    </motion.div>
  );
}
