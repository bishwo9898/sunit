"use client";
import { useEffect, useState } from "react";

export default function StickyBook() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      {/* Scroll to top button */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="group relative h-12 w-12 rounded-full bg-neutral-900 text-white shadow-lg shadow-black/30 ring-1 ring-black/30 overflow-hidden hover:bg-black focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_70%)]" />
        <span className="relative flex h-full w-full items-center justify-center text-lg">
          ↑
        </span>
        <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 h-[140%] w-[140%] rotate-45 bg-gradient-to-tr from-white/10 via-white/0 to-white/0" />
      </button>
      <a
        href="#book"
        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black shadow-xl shadow-black/30 ring-1 ring-black/10 hover:bg-neutral-200 backdrop-blur supports-[backdrop-filter]:bg-white/90 mt-10"
      >
        Book Now
      </a>
    </div>
  );
}
