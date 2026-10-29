"use client";

import dynamic from "next/dynamic";

/** The WebGL scene is loaded on the client only, after the page has text. */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneMount() {
  return <Scene />;
}
