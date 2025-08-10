"use client";
import { useEffect } from "react";

export default function HashScroll({ id = "book" }: { id?: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === `#${id}`) {
      const el = document.getElementById(id);
      if (el)
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          40
        );
    }
  }, [id]);
  return null;
}
