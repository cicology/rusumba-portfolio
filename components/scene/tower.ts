import * as THREE from "three";

/**
 * A procedural mine headgear: Johannesburg's own structure. Four tapering
 * legs with rings and bracing, a sheave wheel at the head, a pair of raked
 * back legs down to the winder house, and the rope dropping into the shaft.
 *
 * Returns a graph (nodes and edges) rather than meshes so the same data can
 * drive the line geometry, the joint dots and the packets that travel along
 * the members.
 */

export type Part = "foundation" | "frame" | "head" | "ground";

export interface Graph {
  nodes: THREE.Vector3[];
  /** [a, b, part] */
  edges: [number, number, Part][];
  /** adjacency: node -> edge indices */
  adj: number[][];
}

const H = 8.4; // tower height
const RINGS = 8;
const BASE = 1.7;
const TOP = 0.95;

export function buildTower(): Graph {
  const nodes: THREE.Vector3[] = [];
  const edges: [number, number, Part][] = [];
  const key = new Map<string, number>();

  const node = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    let i = key.get(k);
    if (i === undefined) {
      i = nodes.length;
      nodes.push(new THREE.Vector3(x, y, z));
      key.set(k, i);
    }
    return i;
  };
  const edge = (a: number, b: number, part: Part) => {
    if (a === b) return;
    edges.push([a, b, part]);
  };
  const partAt = (y: number): Part => (y < 2.75 ? "foundation" : y < 6.3 ? "frame" : "head");

  // Main tower: rings of four corners
  const rings: number[][] = [];
  for (let r = 0; r <= RINGS; r++) {
    const t = r / RINGS;
    const y = t * H;
    const w = BASE + (TOP - BASE) * t;
    const corners = [node(-w, y, -w), node(w, y, -w), node(w, y, w), node(-w, y, w)];
    rings.push(corners);
    for (let i = 0; i < 4; i++) edge(corners[i], corners[(i + 1) % 4], partAt(y));
  }
  // Legs
  for (let r = 0; r < RINGS; r++) {
    const y = ((r + 0.5) / RINGS) * H;
    for (let i = 0; i < 4; i++) edge(rings[r][i], rings[r + 1][i], partAt(y));
  }
  // Diagonals, alternating direction panel by panel, X at the base panels
  for (let r = 0; r < RINGS; r++) {
    const y = ((r + 0.5) / RINGS) * H;
    for (let i = 0; i < 4; i++) {
      const a = rings[r][i], b = rings[r][(i + 1) % 4];
      const c = rings[r + 1][i], d = rings[r + 1][(i + 1) % 4];
      if (r < 2) { edge(a, d, partAt(y)); edge(b, c, partAt(y)); }
      else if ((r + i) % 2 === 0) edge(a, d, partAt(y));
      else edge(b, c, partAt(y));
    }
  }
  // Internal horizontal bracing on a couple of rings (floor-like)
  for (const r of [3, 6]) {
    const [a, b, c, d] = rings[r];
    edge(a, c, partAt(nodes[a].y)); edge(b, d, partAt(nodes[b].y));
  }

  // Head frame: a cantilevered rectangle at the top carrying the wheel
  const ty = H;
  const hw = TOP;
  const headBack = -1.9;
  const hb1 = node(-hw, ty, headBack), hb2 = node(hw, ty, headBack);
  const top = rings[RINGS];
  edge(top[0], hb1, "head"); edge(top[1], hb2, "head"); edge(hb1, hb2, "head");
  const hy = ty + 1.2;
  const hu1 = node(-hw, hy, -0.5), hu2 = node(hw, hy, -0.5);
  edge(top[0], hu1, "head"); edge(top[1], hu2, "head"); edge(top[3], hu1, "head"); edge(top[2], hu2, "head");
  edge(hb1, hu1, "head"); edge(hb2, hu2, "head"); edge(hu1, hu2, "head");

  // Sheave wheel: a polygonal ring in the x-y plane at z = -0.5, with spokes
  const wc = new THREE.Vector3(0, hy + 0.05, -0.5);
  const R = 1.05;
  const seg = 28;
  const hub = node(wc.x, wc.y, wc.z);
  let prev = -1, first = -1;
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const n = node(wc.x + Math.cos(a) * R, wc.y + Math.sin(a) * R, wc.z);
    if (prev >= 0) edge(prev, n, "head"); else first = n;
    if (i % 4 === 0) edge(hub, n, "head");
    prev = n;
  }
  edge(prev, first, "head");
  // axle to the head frame
  edge(hub, hu1, "head"); edge(hub, hu2, "head");

  // Back legs: raked from the ground at z = -6 up to the head frame
  const groundZ = -6.2;
  const legSteps = 7;
  const bl: [number, number][] = [];
  for (let s = 0; s <= legSteps; s++) {
    const t = s / legSteps;
    const y = t * ty;
    const z = groundZ + (headBack - groundZ) * t;
    const w = 1.5 + (hw - 1.5) * t;
    bl.push([node(-w, y, z), node(w, y, z)]);
  }
  for (let s = 0; s < legSteps; s++) {
    const p = partAt(((s + 0.5) / legSteps) * ty);
    edge(bl[s][0], bl[s + 1][0], p); edge(bl[s][1], bl[s + 1][1], p);
    edge(bl[s][0], bl[s][1], p);
    if (s % 2 === 0) edge(bl[s][0], bl[s + 1][1], p); else edge(bl[s][1], bl[s + 1][0], p);
  }
  edge(bl[legSteps][0], hb1, "head"); edge(bl[legSteps][1], hb2, "head");
  // Ties from the back legs into the tower at two heights
  for (const s of [3, 5]) {
    const r = Math.round((s / legSteps) * RINGS);
    edge(bl[s][0], rings[r][0], partAt(nodes[bl[s][0]].y));
    edge(bl[s][1], rings[r][1], partAt(nodes[bl[s][1]].y));
  }

  // Winder house: a low box at the foot of the back legs
  const wx = 1.6, wy = 1.1, wz0 = groundZ - 0.6, wz1 = groundZ - 3.2;
  const box = [
    node(-wx, 0, wz0), node(wx, 0, wz0), node(wx, 0, wz1), node(-wx, 0, wz1),
    node(-wx, wy, wz0), node(wx, wy, wz0), node(wx, wy, wz1), node(-wx, wy, wz1),
  ];
  for (let i = 0; i < 4; i++) {
    edge(box[i], box[(i + 1) % 4], "foundation");
    edge(box[4 + i], box[4 + ((i + 1) % 4)], "foundation");
    edge(box[i], box[4 + i], "foundation");
  }
  // Winder drum inside the house: a small ring
  const dc = new THREE.Vector3(0, wy * 0.55, (wz0 + wz1) / 2);
  const dr = 0.42, dseg = 12;
  let dp = -1, df = -1;
  for (let i = 0; i < dseg; i++) {
    const a = (i / dseg) * Math.PI * 2;
    const n = node(dc.x, dc.y + Math.sin(a) * dr, dc.z + Math.cos(a) * dr);
    if (dp >= 0) edge(dp, n, "foundation"); else df = n;
    dp = n;
  }
  edge(dp, df, "foundation");

  // Rope: from the drum, over the wheel, down the shaft
  const ropeA = node(0, wy * 0.55 + dr, (wz0 + wz1) / 2);
  const wheelBack = node(wc.x, wc.y + R * 0.0, wc.z - R * 0.0 - 0.001); // tangent-ish point
  const ropeTop = node(0, wc.y + R, wc.z);
  edge(ropeA, wheelBack, "head");
  edge(wheelBack, ropeTop, "head");
  const shaftTop = node(0, wc.y, wc.z + R);
  edge(ropeTop, shaftTop, "head");
  // Shaft: rope goes down below ground through a collar
  const collar = [node(-0.55, 0, -1.05), node(0.55, 0, -1.05), node(0.55, 0, 0.05), node(-0.55, 0, 0.05)];
  for (let i = 0; i < 4; i++) edge(collar[i], collar[(i + 1) % 4], "foundation");
  const shaftBottom = node(0, -3.5, wc.z + R);
  const cage = node(0, -1.6, wc.z + R);
  edge(shaftTop, cage, "foundation");
  edge(cage, shaftBottom, "foundation");

  // Sort members from the ground up so the structure can be drawn in order
  edges.sort((e1, e2) => (nodes[e1[0]].y + nodes[e1[1]].y) - (nodes[e2[0]].y + nodes[e2[1]].y));

  const adj: number[][] = nodes.map(() => []);
  edges.forEach(([a, b], i) => { adj[a].push(i); adj[b].push(i); });

  return { nodes, edges, adj };
}

/** Flat Float32Array of line segment positions and a parallel part array. */
export function toLineData(g: Graph) {
  const pos = new Float32Array(g.edges.length * 6);
  const parts: Part[] = [];
  g.edges.forEach(([a, b, part], i) => {
    const A = g.nodes[a], B = g.nodes[b];
    pos.set([A.x, A.y, A.z, B.x, B.y, B.z], i * 6);
    parts.push(part);
  });
  return { pos, parts };
}

/** Section grid on the ground plane: graph paper under the structure. */
export function groundGrid(size = 26, step = 1) {
  const lines: number[] = [];
  const h = size / 2;
  for (let i = -h; i <= h; i += step) {
    lines.push(-h, 0, i, h, 0, i);
    lines.push(i, 0, -h, i, 0, h);
  }
  return new Float32Array(lines);
}
