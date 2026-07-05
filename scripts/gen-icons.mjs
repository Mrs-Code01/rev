import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "public", "icons");
mkdirSync(outDir, { recursive: true });

function tileSvg(size, radiusRatio) {
  const r = size * radiusRatio;
  const fontSize = size * 0.58;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${r}" ry="${r}" fill="#c0341d"/>
    <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, 'Times New Roman', serif" font-weight="700"
      font-size="${fontSize}" fill="#fbfaf6">R</text>
  </svg>`;
}

function maskableSvg(size) {
  const fontSize = size * 0.42;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#c0341d"/>
    <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, 'Times New Roman', serif" font-weight="700"
      font-size="${fontSize}" fill="#fbfaf6">R</text>
  </svg>`;
}

const jobs = [
  { name: "icon-192.png", size: 192, svg: tileSvg(192, 0.22) },
  { name: "icon-512.png", size: 512, svg: tileSvg(512, 0.22) },
  { name: "apple-touch-icon.png", size: 180, svg: tileSvg(180, 0.22) },
  { name: "icon-maskable-512.png", size: 512, svg: maskableSvg(512) },
  { name: "favicon-32.png", size: 32, svg: tileSvg(32, 0.22) },
];

for (const job of jobs) {
  await sharp(Buffer.from(job.svg)).png().toFile(path.join(outDir, job.name));
  console.log("wrote", job.name);
}
