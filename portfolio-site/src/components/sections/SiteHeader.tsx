"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "#home", label: "Home" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
] as const;

interface SiteHeaderProps {
  name: string;
}

export function SiteHeader({ name }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection observer for active section tracking
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1));
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-3 sm:px-6 md:px-8 lg:px-10">
      <header
        className={`sarvam-bar mx-auto max-w-[1200px] rounded-2xl transition-shadow duration-300 ${scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.3)]" : "shadow-[0_4px_20px_rgba(0,0,0,0.15)]"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo — left */}
          <a
            href="#home"
            className="shrink-0 text-[15px] font-bold tracking-wide text-white"
            aria-label="Go to top"
          >
            {name.toLowerCase().split(" ")[0]}
          </a>

          {/* Nav links — center with active pill */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-white transition-colors duration-200 hover:text-white"
              >
                {/* Sliding active pill */}
                {activeSection === item.href && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-white/15"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
                <svg
                  className="relative z-10 h-[7px] w-[7px] opacity-60 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  viewBox="0 0 8 12"
                  fill="none"
                >
                  <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </nav>

          {/* Right — CTA buttons + theme toggle */}
          <div className="hidden items-center gap-2 lg:flex">
            <a
              href="#contact"
              className="sarvam-btn-orange whitespace-nowrap rounded-xl px-5 py-2 text-[13px] font-semibold text-white"
            >
              Hire Me
            </a>
            <a
              href="#experience"
              className="sarvam-btn-white whitespace-nowrap rounded-xl border px-5 py-2 text-[13px] font-semibold"
            >
              View Work
            </a>
            <ThemeToggle />
          </div>

          {/* Mobile — hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[2px] w-5 rounded-full bg-white transition-all duration-300 ${isOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
          <div className="border-t border-white/10 px-5 pb-5 pt-3 lg:hidden">
            <ul className="grid gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold uppercase tracking-[0.04em] text-white transition hover:bg-white/10 ${activeSection === item.href ? "bg-white/10" : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                    <svg className="h-[7px] w-[7px] opacity-40" viewBox="0 0 8 12" fill="none">
                      <path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <a href="#contact" className="sarvam-btn-orange flex-1 rounded-xl px-5 py-2.5 text-center text-[13px] font-semibold text-white" onClick={() => setIsOpen(false)}>
                Hire Me
              </a>
              <a href="#experience" className="sarvam-btn-white flex-1 rounded-xl border px-5 py-2.5 text-center text-[13px] font-semibold" onClick={() => setIsOpen(false)}>
                View Work
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
