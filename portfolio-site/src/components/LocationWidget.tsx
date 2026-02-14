"use client";

import { useEffect, useMemo, useState } from "react";
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

/* ── state ── */

interface WidgetState {
  city: string;
  timezone: string;
  temperatureC: number | null;
}

/* ── component ── */

export function LocationWidget() {
  const shouldReduceMotion = useReducedMotion();
  const fallbackTimezone = useMemo(
    () => (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC"),
    [],
  );
  const fallbackCity = useMemo(() => timezoneToCity(fallbackTimezone), [fallbackTimezone]);

  const [state, setState] = useState<WidgetState>({
    city: fallbackCity,
    timezone: fallbackTimezone,
    temperatureC: null,
  });

  const [timeText, setTimeText] = useState("");

  // Tick clock every second — only on client
  useEffect(() => {
    setTimeText(formatTime(state.timezone || fallbackTimezone));
    const timer = setInterval(() => {
      setTimeText(formatTime(state.timezone || fallbackTimezone));
    }, 1000);
    return () => clearInterval(timer);
  }, [state.timezone, fallbackTimezone]);

  // Fetch location/weather on mount
  useEffect(() => {
    let mounted = true;

    async function fetchIp() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;
        const data = (await res.json()) as {
          latitude?: number;
          longitude?: number;
          city?: string;
          region?: string;
          country_name?: string;
          timezone?: string;
        };
        if (!mounted) return;

        const city = [safeText(data.city), safeText(data.region)].filter(Boolean).join(", ") || fallbackCity;
        const timezone = safeText(data.timezone) ?? fallbackTimezone;

        let tempC: number | null = null;
        if (typeof data.latitude === "number" && typeof data.longitude === "number") {
          try {
            const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
            weatherUrl.searchParams.set("latitude", String(data.latitude));
            weatherUrl.searchParams.set("longitude", String(data.longitude));
            weatherUrl.searchParams.set("current", "temperature_2m");
            weatherUrl.searchParams.set("timezone", "auto");
            const wRes = await fetch(weatherUrl.toString());
            if (wRes.ok) {
              const wData = (await wRes.json()) as { current?: { temperature_2m?: number } };
              if (typeof wData.current?.temperature_2m === "number") {
                tempC = wData.current.temperature_2m;
              }
            }
          } catch {
            /* swallow weather error */
          }
        }

        if (!mounted) return;
        setState({ city, timezone, temperatureC: tempC });
      } catch {
        /* fetch failed — keep fallback state */
      }
    }

    void fetchIp();
    return () => {
      mounted = false;
    };
  }, [fallbackCity, fallbackTimezone]);

  const tempDisplay = state.temperatureC != null ? `${Math.round(state.temperatureC)}°C` : null;
  const tzShort = formatTimezoneShort(state.timezone);

  return (
    <motion.div
      className="fixed left-1/2 top-[72px] z-40 -translate-x-1/2 sm:top-[70px]"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.95 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.8 }}
    >
      <div className="flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)]/80 px-3 py-1.5 shadow-md backdrop-blur-md sm:gap-3 sm:px-5 sm:py-2.5">
        {/* Pulsing dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>

        <p className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-[var(--muted)] sm:gap-2.5 sm:text-[13px]" suppressHydrationWarning>
          <span className="truncate text-[var(--ink)]">{state.city}</span>
          <span>•</span>
          <span className="tabular-nums text-[var(--brand-strong)]">{timeText || "--:--"}</span>
          <span className="hidden sm:inline">{tzShort}</span>
          {tempDisplay && (
            <>
              <span>•</span>
              <span>{tempDisplay}</span>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}
