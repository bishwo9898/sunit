"use client";
import { useRef, useState } from "react";

export default function BeforeAfter({
  before,
  after,
  alt,
}: {
  before: string;
  after: string;
  alt?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(50);

  const onMove = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setX(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl aspect-[16/9] select-none"
      onMouseMove={(e) => onMove(e.clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      <img
        src={after}
        alt={alt || "after"}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}
      >
        <img
          src={before}
          alt={alt || "before"}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="absolute inset-y-0" style={{ left: `${x}%` }}>
        <div className="h-full w-[2px] bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,.3)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 rounded-full bg-white text-black text-xs">
          Drag
        </div>
      </div>
    </div>
  );
}
