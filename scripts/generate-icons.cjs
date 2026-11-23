const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function makePNG(width, height, pixelFn) {
  const rowBytes = width * 4 + 1;
  const raw = Buffer.alloc(rowBytes * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    raw[rowOffset] = 0; // Filter None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = pixelFn(x, y, width, height);
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }

  function crc32(buf) {
    let crc = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    return (crc ^ -1) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const t = Buffer.from(type, 'ascii');
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
    return Buffer.concat([len, t, data, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Distance to rounded rectangle
function sdRoundBox(px, py, bx, by, r) {
  const qx = Math.abs(px) - bx + r;
  const qy = Math.abs(py) - by + r;
  const outside = Math.sqrt(Math.max(qx, 0) ** 2 + Math.max(qy, 0) ** 2);
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - r;
}

function renderAppIcon(x, y, w, h, isMaskable = false) {
  const nx = x / w; // 0..1
  const ny = y / h; // 0..1
  const cx = x - w / 2;
  const cy = y - h / 2;

  // Background squircle for normal, full bleed for maskable
  let bgAlpha = 255;
  if (!isMaskable) {
    const squircleDist = sdRoundBox(cx, cy, (w * 0.46), (h * 0.46), w * 0.22);
    if (squircleDist > 1) return [0, 0, 0, 0];
    if (squircleDist > 0) bgAlpha = Math.round((1 - squircleDist) * 255);
  }

  // Base background gradient: Luminous sky-blue to deep navy
  const t = (nx * 0.3 + ny * 0.7);
  // Color from (2, 132, 199) -> (3, 105, 161) -> (10, 17, 40)
  let bgR, bgG, bgB;
  if (t < 0.5) {
    const f = t / 0.5;
    bgR = Math.round(2 + (3 - 2) * f);
    bgG = Math.round(132 + (105 - 132) * f);
    bgB = Math.round(199 + (161 - 199) * f);
  } else {
    const f = (t - 0.5) / 0.5;
    bgR = Math.round(3 + (10 - 3) * f);
    bgG = Math.round(105 + (17 - 105) * f);
    bgB = Math.round(161 + (40 - 161) * f);
  }

  // Calendar Card bounds
  const scale = isMaskable ? 0.78 : 1.0;
  const cardW = w * 0.31 * scale;
  const cardH = h * 0.29 * scale;
  const cardYOff = h * 0.04 * scale;
  const cardDist = sdRoundBox(cx, cy - cardYOff, cardW, cardH, w * 0.05 * scale);

  if (cardDist <= 0) {
    // Inside Calendar Card!
    const relY = (cy - cardYOff + cardH) / (cardH * 2); // 0 (top) to 1 (bottom)

    // Header strip (top 26% of calendar)
    if (relY < 0.26) {
      // Header gradient
      const hR = Math.round(2 + (56 - 2) * nx);
      const hG = Math.round(132 + (189 - 132) * nx);
      const hB = Math.round(199 + (248 - 199) * nx);
      return [hR, hG, hB, bgAlpha];
    }

    // Binder clips (3 clips at top)
    const clipW = w * 0.018 * scale;
    const clipH = h * 0.04 * scale;
    const clipTopY = cy - cardYOff + cardH;
    const c1Dist = sdRoundBox(cx + w * 0.16 * scale, clipTopY, clipW, clipH, clipW * 0.8);
    const c2Dist = sdRoundBox(cx, clipTopY, clipW, clipH, clipW * 0.8);
    const c3Dist = sdRoundBox(cx - w * 0.16 * scale, clipTopY, clipW, clipH, clipW * 0.8);
    if (c1Dist <= 0 || c2Dist <= 0 || c3Dist <= 0) {
      return [255, 255, 255, bgAlpha];
    }

    // "2027" Graphic Bars / Pattern in the center
    // Let's draw stylized digit bars for 2 0 2 7
    const inDigitZone = relY > 0.38 && relY < 0.68;
    if (inDigitZone) {
      // Simple stylized grid / numbers lines
      const row = Math.floor((relY - 0.38) * 10);
      if (row % 2 === 0) {
        return [12, 74, 110, bgAlpha]; // Navy text
      }
    }

    // Checkmark dots on bottom
    if (relY > 0.74 && relY < 0.88) {
      const dot1Dist = Math.sqrt((cx + w * 0.12 * scale) ** 2 + (cy - cardYOff - cardH * 0.6) ** 2);
      const dot2Dist = Math.sqrt((cx - w * 0.08 * scale) ** 2 + (cy - cardYOff - cardH * 0.6) ** 2);
      if (dot1Dist < w * 0.026 * scale) return [2, 132, 199, bgAlpha]; // Blue check
      if (dot2Dist < w * 0.026 * scale) return [16, 185, 129, bgAlpha]; // Emerald check
    }

    // Card white background
    const whiteGrad = Math.round(255 - relY * 12);
    return [whiteGrad, whiteGrad, Math.min(255, whiteGrad + 3), bgAlpha];
  }

  // Golden star sparkle in top right
  const starDist = Math.sqrt((cx - w * 0.28 * scale) ** 2 + (cy + h * 0.28 * scale) ** 2);
  if (starDist < w * 0.04 * scale) {
    return [245, 158, 11, bgAlpha]; // Golden Amber
  }

  // Outer border glow for squircle
  if (!isMaskable && cardDist > 0) {
    const edgeDist = Math.abs(sdRoundBox(cx, cy, (w * 0.46), (h * 0.46), w * 0.22));
    if (edgeDist < 3) {
      return [56, 189, 248, Math.round(bgAlpha * 0.7)];
    }
  }

  return [bgR, bgG, bgB, bgAlpha];
}

const outDir = path.join(__dirname, '../public/icons');
fs.mkdirSync(outDir, { recursive: true });

console.log('Generating PNG app icons...');

// 1. 192x192
const png192 = makePNG(192, 192, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);
console.log('Created icon-192.png');

// 2. 512x512
const png512 = makePNG(512, 512, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);
console.log('Created icon-512.png');

// 3. 512x512 Maskable
const pngMaskable = makePNG(512, 512, (x, y, w, h) => renderAppIcon(x, y, w, h, true));
fs.writeFileSync(path.join(outDir, 'icon-maskable-512.png'), pngMaskable);
console.log('Created icon-maskable-512.png');

// 4. Apple Touch Icon (180x180)
const appleTouch = makePNG(180, 180, (x, y, w, h) => renderAppIcon(x, y, w, h, false));
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), appleTouch);
console.log('Created apple-touch-icon.png');

console.log('All icons generated successfully!');
