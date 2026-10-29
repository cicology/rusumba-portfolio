"use client";

/**
 * A tiny shared scroll state. The DOM side (chapters, sticky text) and the
 * WebGL side (camera rig) both read from here. Written once per frame by
 * SmoothScroll, read in useFrame without re-rendering React.
 */
export const scrollState = {
  /** 0 at the top of the page, 1 at the bottom. */
  progress: 0,
  /** Pixels scrolled. */
  y: 0,
  /** Velocity in px per frame, smoothed. */
  velocity: 0,
  /** Which chapter is in view, by index into CHAPTERS (-1 = hero). */
  chapter: -1,
  /** Hovered or focused part of the structure (Chapter II). */
  focus: null as null | "foundation" | "frame" | "head",
  /** Pointer position in normalized device coordinates. */
  pointer: { x: 0, y: 0 },
};

type Listener = () => void;
const listeners = new Set<Listener>();
export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
export function notify() {
  listeners.forEach((l) => l());
}
