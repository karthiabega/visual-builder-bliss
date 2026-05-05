/**
 * Generates public/light_food_bg.png
 * Pure Node.js — no external deps (uses built-in zlib)
 * Run: node scripts/gen-light-bg.mjs
 */
import zlib from 'node:zlib';
import fs   from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const W = 1440, H = 900;
const px = new Uint8ClampedArray(W * H * 3); // RGB

/* ── 1. Warm cream base gradient ─────────────────── */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const ty = y / H, tx = x / W;
    // Diagonal cream: top-left #fdf8f0 → bottom-right #f5e8d0
    const r = Math.round(253 - ty * 8  - tx * 4);
    const g = Math.round(248 - ty * 22 - tx * 8);
    const b = Math.round(240 - ty * 32 - tx * 14);
    const i = (y * W + x) * 3;
    px[i] = r; px[i+1] = g; px[i+2] = b;
  }
}

/* ── 2. Soft radial bokeh blend ──────────────────── */
function bokeh(cx, cy, r, cr, cg, cb, strength) {
  const x0 = Math.max(0, Math.ceil(cx - r));
  const x1 = Math.min(W - 1, Math.floor(cx + r));
  const y0 = Math.max(0, Math.ceil(cy - r));
  const y1 = Math.min(H - 1, Math.floor(cy + r));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx, dy = y - cy;
      const d  = Math.sqrt(dx * dx + dy * dy) / r;
      if (d >= 1) continue;
      // smooth quintic falloff — genuine soft bokeh look
      const t = 1 - d;
      const a = strength * t * t * t * (t * (6 * t - 15) + 10);
      const i = (y * W + x) * 3;
      px[i]   = Math.round(px[i]   * (1 - a) + cr * a);
      px[i+1] = Math.round(px[i+1] * (1 - a) + cg * a);
      px[i+2] = Math.round(px[i+2] * (1 - a) + cb * a);
    }
  }
}

//             cx    cy    r     R    G    B    strength
bokeh(         160,  110,  420, 255, 240, 180, 0.52 ); // saffron glow — top-left
bokeh(        1300,  140,  360, 255, 210, 130, 0.48 ); // amber — top-right
bokeh(         720,  860,  430, 170, 220, 130, 0.42 ); // sage green — bottom-centre
bokeh(        1380,  700,  310, 255, 195, 120, 0.44 ); // warm peach — right
bokeh(          60,  600,  360, 255, 225, 140, 0.40 ); // golden — left
bokeh(         720,   60,  260, 255, 250, 210, 0.55 ); // bright cream — top-centre
bokeh(         160,  850,  340, 195, 235, 155, 0.36 ); // cool green — bottom-left
bokeh(        1100,  460,  240, 255, 228, 165, 0.32 ); // honey — centre-right
bokeh(         480,  700,  220, 255, 245, 195, 0.30 ); // cream — centre-left
bokeh(         860,  380,  200, 255, 218, 150, 0.28 ); // warm mid
bokeh(         400,  200,  180, 255, 252, 220, 0.34 ); // pale lemon — upper-mid
bokeh(        1050,  780,  200, 220, 245, 170, 0.30 ); // light sage — lower-right

/* ── 3. Very subtle vignette (darken corners slightly) */
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const nx = (x / W - 0.5) * 2, ny = (y / H - 0.5) * 2;
    const d  = Math.sqrt(nx * nx + ny * ny) / 1.414;
    const dark = 0.08 * d * d; // max 8% corner darkening — keeps it bright
    const i = (y * W + x) * 3;
    px[i]   = Math.round(px[i]   * (1 - dark));
    px[i+1] = Math.round(px[i+1] * (1 - dark));
    px[i+2] = Math.round(px[i+2] * (1 - dark));
  }
}

/* ── 4. Encode PNG ───────────────────────────────── */
// CRC-32 table
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const lenBuf  = Buffer.allocUnsafe(4); lenBuf.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const payload = Buffer.concat([typeBuf, data]);
  const crcBuf  = Buffer.allocUnsafe(4); crcBuf.writeUInt32BE(crc32(payload));
  return Buffer.concat([lenBuf, payload, crcBuf]);
}

const ihdr = Buffer.allocUnsafe(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8]=8; ihdr[9]=2; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // 8-bit RGB

// Build raw scanlines (filter byte 0 = None, then RGB)
const raw = Buffer.allocUnsafe(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  const row = y * (1 + W * 3);
  raw[row] = 0;
  for (let x = 0; x < W; x++) {
    const src = (y * W + x) * 3, dst = row + 1 + x * 3;
    raw[dst] = px[src]; raw[dst+1] = px[src+1]; raw[dst+2] = px[src+2];
  }
}

const compressed = zlib.deflateSync(raw, { level: 7 });

const png = Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]), // PNG signature
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', compressed),
  pngChunk('IEND', Buffer.alloc(0)),
]);

const out = path.join(__dirname, '..', 'public', 'light_food_bg.png');
fs.writeFileSync(out, png);
console.log(`✓ Generated ${out}  (${(png.length/1024).toFixed(0)} KB)`);
