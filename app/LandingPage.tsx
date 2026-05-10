"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("pulse-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("pulse-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("pulse-theme", "light");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0f0f0f] text-zinc-900 dark:text-zinc-50 transition-colors duration-200">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 bg-zinc-900 dark:bg-zinc-50 rounded-[4px] flex items-center justify-center text-white dark:text-zinc-900 text-[9px]">
            ▲
          </span>
          <span className="font-serif text-xl tracking-tight">Pulse</span>
        </div>
        <button
          onClick={toggleTheme}
          className="text-sm text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 hover:text-zinc-900 dark:hover:text-zinc-50 hover:border-zinc-400 dark:hover:border-zinc-400 transition-colors"
        >
          {dark ? "☀ Light" : "☽ Dark"}
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          Now in beta
        </div>

        {/* Heading */}
        <h1 className="font-serif text-5xl md:text-6xl font-normal leading-[1.1] tracking-tight max-w-2xl mb-5">
          Your users know what
          <br />
          to build{" "}
          <em className="italic text-zinc-400 dark:text-zinc-500">next.</em>
        </h1>

        {/* Subheading */}
        <p className="text-zinc-500 dark:text-zinc-400 text-base leading-relaxed max-w-md mb-10">
          Collect feature requests, let your community vote, and ship what
          actually matters — all in one clean board.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-85 active:scale-95 transition-all"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="bg-transparent text-zinc-900 dark:text-zinc-50 text-sm font-medium px-6 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400 active:scale-95 transition-all"
          >
            Sign in
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-200 dark:border-zinc-800">
        © 2026 Pulse. Built for makers who listen.
      </footer>
    </div>
  );
}
