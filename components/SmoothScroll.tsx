"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { scrollState, notify } from "@/lib/scroll";

/**
 * Lenis smooth scrolling plus the per-frame write into scrollState.
 * Respects prefers-reduced-motion by leaving native scrolling alone.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let lenis: Lenis | null = null;
    let raf = 0;
    let lastY = window.scrollY;

    const write = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const y = window.scrollY;
      scrollState.y = y;
      scrollState.progress = Math.min(1, Math.max(0, y / max));
      scrollState.velocity = scrollState.velocity * 0.85 + (y - lastY) * 0.15;
      lastY = y;
      notify();
    };

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      const loop = (t: number) => {
        lenis!.raf(t);
        write();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    } else {
      const loop = () => {
        write();
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onPointer = (e: PointerEvent) => {
      scrollState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Anchor links go through Lenis so the camera eases with the page.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a || !lenis) return;
      const id = a.getAttribute("href")!.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: 0, duration: 1.4 });
      history.replaceState(null, "", "#" + id);
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("click", onClick);
    };
  }, []);
  return null;
}
