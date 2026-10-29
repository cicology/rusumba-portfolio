"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildTower, toLineData, groundGrid, type Part } from "./tower";
import { scrollState } from "@/lib/scroll";
import { CHAPTERS } from "@/content/site";

const INK = new THREE.Color("#15171b");
const INK_SOFT = new THREE.Color("#8c8f97");
const COBALT = new THREE.Color("#1f3fc6");
const PAPER = new THREE.Color("#e9e8e2");

/* --------------------------------------------------------------------------
   Camera stops. One per chapter plus the hero. Positions are in tower units
   (the tower is 8.4 high). `lift` nudges the target when a structure part
   is focused in chapter II.
   -------------------------------------------------------------------------- */
interface Stop { pos: THREE.Vector3; target: THREE.Vector3 }
const S = (px: number, py: number, pz: number, tx: number, ty: number, tz: number): Stop => ({
  pos: new THREE.Vector3(px, py, pz),
  target: new THREE.Vector3(tx, ty, tz),
});
const STOPS: Record<string, Stop> = {
  hero: S(16, 7.5, 18, -6.2, 4.9, -1.5),
  load: S(10, 2.4, 12, 6.5, 3.4, -1),
  structure: S(-17, 7.5, 17, -6, 4.6, -0.5),
  record: S(2, 17, 17, 0, 3.2, -1),
  person: S(9, 7, -17, -4, 5, -1),
  open: S(1.5, 13.5, 4.5, -2.5, 8.4, -0.6),
};
const FOCUS_Y: Record<NonNullable<typeof scrollState.focus>, number> = { foundation: 1.2, frame: 4.4, head: 8.6 };

/* --------------------------------------------------------------------------
   Structure: lines, joints, and a ground grid
   -------------------------------------------------------------------------- */
function Structure({ graph, lineData, reduced }: { graph: ReturnType<typeof buildTower>; lineData: ReturnType<typeof toLineData>; reduced: boolean }) {
  const colorRef = useRef<THREE.BufferAttribute>(null);
  const colors = useMemo(() => {
    const c = new Float32Array(lineData.parts.length * 6);
    for (let i = 0; i < lineData.parts.length; i++) c.set([INK.r, INK.g, INK.b, INK.r, INK.g, INK.b], i * 6);
    return c;
  }, [lineData]);
  const current = useRef<Float32Array>(colors.slice());
  const tmp = useMemo(() => new THREE.Color(), []);

  const jointPositions = useMemo(() => {
    const arr = new Float32Array(graph.nodes.length * 3);
    graph.nodes.forEach((n, i) => arr.set([n.x, n.y, n.z], i * 3));
    return arr;
  }, [graph]);

  useFrame(() => {
    if (reduced) return;
    const attr = colorRef.current;
    if (!attr) return;
    const focus = scrollState.focus;
    const ch = scrollState.chapter;
    const inStructure = ch === 1;
    const arr = current.current;
    let dirty = false;
    for (let i = 0; i < lineData.parts.length; i++) {
      const part = lineData.parts[i];
      let target: THREE.Color;
      if (inStructure && focus) target = part === focus ? COBALT : INK_SOFT;
      else target = INK;
      const o = i * 6;
      // lerp both vertices
      tmp.setRGB(arr[o], arr[o + 1], arr[o + 2]).lerp(target, 0.08);
      if (Math.abs(tmp.r - arr[o]) > 0.0005 || Math.abs(tmp.g - arr[o + 1]) > 0.0005 || Math.abs(tmp.b - arr[o + 2]) > 0.0005) dirty = true;
      arr[o] = arr[o + 3] = tmp.r; arr[o + 1] = arr[o + 4] = tmp.g; arr[o + 2] = arr[o + 5] = tmp.b;
    }
    if (dirty) {
      (attr.array as Float32Array).set(arr);
      attr.needsUpdate = true;
    }
  });

  const grid = useMemo(() => groundGrid(28, 1), []);
  const geo = useRef<THREE.BufferGeometry>(null);
  const born = useRef<number | null>(null);
  useFrame(({ clock }) => {
    const g = geo.current;
    if (!g) return;
    if (born.current === null) born.current = clock.elapsedTime;
    const total = lineData.parts.length * 2;
    if (reduced) { g.setDrawRange(0, total); return; }
    const t = Math.min(1, (clock.elapsedTime - born.current) / 1.9);
    const e = 1 - Math.pow(1 - t, 3);
    g.setDrawRange(0, Math.floor(total * e));
  });

  return (
    <group>
      <lineSegments>
        <bufferGeometry ref={geo}>
          <bufferAttribute attach="attributes-position" args={[lineData.pos, 3]} />
          <bufferAttribute ref={colorRef} attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.92} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[jointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={INK} size={0.06} sizeAttenuation transparent opacity={0.9} />
      </points>
      <lineSegments position={[0, -0.001, -2]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[grid, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={INK} transparent opacity={0.08} />
      </lineSegments>
    </group>
  );
}

/* --------------------------------------------------------------------------
   Packets: the load, moving along members. Each packet walks the graph,
   picking a new member at every joint. Scroll speed pushes them along.
   -------------------------------------------------------------------------- */
function Packets({ graph, count, reduced }: { graph: ReturnType<typeof buildTower>; count: number; reduced: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const state = useMemo(() => {
    const rnd = mulberry32(7);
    return Array.from({ length: count }, () => {
      const e = Math.floor(rnd() * graph.edges.length);
      return { edge: e, t: rnd(), dir: rnd() > 0.5 ? 1 : -1, speed: 0.004 + rnd() * 0.006, scale: 0.6 + rnd() * 0.6 };
    });
  }, [graph, count]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const a = useMemo(() => new THREE.Vector3(), []);
  const b = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    // Lay out once for the reduced-motion case
    const m = mesh.current;
    if (!m) return;
    state.forEach((p, i) => {
      const [na, nb] = graph.edges[p.edge];
      a.copy(graph.nodes[na]); b.copy(graph.nodes[nb]);
      dummy.position.lerpVectors(a, b, p.t);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [state, graph, dummy, a, b]);

  const t0 = useRef<number | null>(null);
  useFrame(({ clock }, dt) => {
    if (reduced) return;
    const m = mesh.current;
    if (!m) return;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const life = Math.min(1, Math.max(0, (clock.elapsedTime - t0.current - 1.2) / 1.2));
    const boost = 1 + Math.min(3, Math.abs(scrollState.velocity) * 0.08);
    const rnd = Math.random;
    for (let i = 0; i < state.length; i++) {
      const p = state[i];
      p.t += p.dir * p.speed * boost * (dt * 60);
      if (p.t > 1 || p.t < 0) {
        // arrive at a joint, choose the next member
        const [na, nb] = graph.edges[p.edge];
        const at = p.t > 1 ? nb : na;
        const options = graph.adj[at].filter((e) => e !== p.edge);
        const next = options.length ? options[Math.floor(rnd() * options.length)] : p.edge;
        const [xa] = graph.edges[next];
        p.edge = next;
        p.dir = xa === at ? 1 : -1;
        p.t = p.dir === 1 ? 0 : 1;
      }
      const [na, nb] = graph.edges[p.edge];
      a.copy(graph.nodes[na]); b.copy(graph.nodes[nb]);
      dummy.position.lerpVectors(a, b, p.t);
      dummy.scale.setScalar(p.scale * life);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.05, 10, 10]} />
      <meshBasicMaterial color={COBALT} />
    </instancedMesh>
  );
}

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/* --------------------------------------------------------------------------
   Camera rig: measures the chapters, interpolates between stops, eases.
   -------------------------------------------------------------------------- */
function CameraRig({ reduced }: { reduced: boolean }) {
  const { camera, size } = useThree();
  const rects = useRef<{ id: string; top: number; h: number }[]>([]);
  const pos = useMemo(() => STOPS.hero.pos.clone(), []);
  const tgt = useMemo(() => STOPS.hero.target.clone(), []);
  const wantPos = useMemo(() => new THREE.Vector3(), []);
  const wantTgt = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const measure = () => {
      rects.current = ["hero", ...CHAPTERS.map((c) => c.id)]
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { id, top: r.top + window.scrollY, h: r.height };
        })
        .filter(Boolean) as { id: string; top: number; h: number }[];
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 600);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); clearTimeout(t); };
  }, []);

  useFrame(() => {
    const list = rects.current;
    const vh = size.height;
    // Find which chapter the viewport centre is in, and progress to the next stop
    const y = scrollState.y + vh * 0.5;
    let idx = 0;
    for (let i = 0; i < list.length; i++) if (y >= list[i].top) idx = i;
    const cur = list[idx];
    const next = list[idx + 1];
    let f = 0;
    if (cur && next) {
      // Ease through the second half of a chapter so the camera arrives as the next one lands
      const span = next.top - cur.top;
      const local = (y - cur.top) / Math.max(1, span);
      f = smooth(Math.min(1, Math.max(0, (local - 0.45) / 0.55)));
    }
    scrollState.chapter = idx - 1; // hero = -1

    const A = STOPS[cur?.id ?? "hero"] ?? STOPS.hero;
    const B = STOPS[next?.id ?? cur?.id ?? "hero"] ?? A;
    wantPos.lerpVectors(A.pos, B.pos, f);
    wantTgt.lerpVectors(A.target, B.target, f);

    if (cur?.id === "structure" && scrollState.focus) {
      wantTgt.y = THREE.MathUtils.lerp(wantTgt.y, FOCUS_Y[scrollState.focus], 0.3 * (1 - f));
    }

    // Portrait screens: centre the structure, lift it above the text and pull back
    const aspect = size.width / size.height;
    const portrait = aspect < 0.9;
    const k = portrait ? 1.6 : aspect < 1.3 ? 1.3 : 1;
    if (portrait) { wantTgt.x *= 0.15; wantTgt.y -= 2.0; }
    dir.subVectors(wantPos, wantTgt).multiplyScalar(k);
    wantPos.copy(wantTgt).add(dir);

    // Pointer parallax, a few degrees of drift
    if (!reduced) {
      wantPos.x += scrollState.pointer.x * 0.5;
      wantPos.y += scrollState.pointer.y * 0.25;
    }

    const ease = reduced ? 1 : 0.06;
    pos.lerp(wantPos, ease);
    tgt.lerp(wantTgt, ease);
    camera.position.copy(pos);
    camera.lookAt(tgt);
  });
  return null;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

/* --------------------------------------------------------------------------
   Canvas
   -------------------------------------------------------------------------- */
export default function Scene() {
  const graph = useMemo(() => buildTower(), []);
  const lineData = useMemo(() => toLineData(graph), [graph]);
  const [reduced, setReduced] = useState(false);
  const [small, setSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sm = window.matchMedia("(max-width: 720px)");
    const update = () => { setReduced(mq.matches); setSmall(sm.matches); };
    update();
    mq.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => { mq.removeEventListener("change", update); sm.removeEventListener("change", update); };
  }, []);

  return (
    <Canvas
      dpr={[1, small ? 1.25 : 1.75]}
      camera={{ fov: 32, near: 0.1, far: 80, position: STOPS.hero.pos.toArray() }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <fog attach="fog" args={[PAPER, 18, 64]} />
      <Structure graph={graph} lineData={lineData} reduced={reduced} />
      <Packets graph={graph} count={small ? 22 : 54} reduced={reduced} />
      <CameraRig reduced={reduced} />
    </Canvas>
  );
}
