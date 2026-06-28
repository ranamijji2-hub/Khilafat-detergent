const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const COLORS = {
  primary: '#0b3a8a',
  primaryDark: '#062357',
  secondary: '#1e88e5',
  accent: '#f2b705',
  white: '#ffffff',
  ink: '#0c1b33',
};

const SIZES = [
  { key: '50g', label: '50g', price: '20', badge: '#f2b705', badgeText: '#0c1b33' },
  { key: '100g', label: '100g', price: '35', badge: '#ff8a3d', badgeText: '#ffffff' },
  { key: '500g', label: '500g', price: '120', badge: '#1e88e5', badgeText: '#ffffff' },
  { key: '1kg', label: '1kg', price: '220', badge: '#e23b3b', badgeText: '#ffffff' },
  { key: '5kg', label: '5kg', price: '990', badge: '#6a3bd6', badgeText: '#ffffff' },
];

function packSVG({ label, badge, badgeText, w = 760, h = 900 }) {
  const cx = w / 2;
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLORS.secondary}"/>
      <stop offset="55%" stop-color="${COLORS.primary}"/>
      <stop offset="100%" stop-color="${COLORS.primaryDark}"/>
    </linearGradient>
    <linearGradient id="sunburst" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="${COLORS.ink}" flood-opacity="0.28"/>
    </filter>
  </defs>

  <!-- pouch body -->
  <g filter="url(#soft)">
    <path d="M ${cx - 240} 130
             Q ${cx - 260} 60 ${cx - 150} 50
             L ${cx + 150} 50
             Q ${cx + 260} 60 ${cx + 240} 130
             L ${cx + 270} 760
             Q ${cx + 270} 840 ${cx + 190} 850
             L ${cx - 190} 850
             Q ${cx - 270} 840 ${cx - 270} 760
             Z"
          fill="url(#bodyGrad)" stroke="${COLORS.primaryDark}" stroke-width="4"/>
    <!-- sunburst rays -->
    <g clip-path="url(#clip)">
      ${Array.from({ length: 16 })
        .map((_, i) => {
          const angle = (i * 360) / 16;
          return `<rect x="${cx - 6}" y="${h * 0.38}" width="12" height="420" fill="url(#sunburst)" transform="rotate(${angle} ${cx} ${h * 0.55})"/>`;
        })
        .join('')}
    </g>
    <ellipse cx="${cx}" cy="${h * 0.34}" rx="260" ry="130" fill="url(#glow)"/>
    <!-- top fold -->
    <path d="M ${cx - 150} 50 L ${cx + 150} 50 Q ${cx + 260} 60 ${cx + 240} 130 L ${cx - 240} 130 Q ${cx - 260} 60 ${cx - 150} 50 Z"
          fill="${COLORS.primaryDark}" opacity="0.55"/>
  </g>

  <!-- white badge ribbon: Advance Cleaning Powder -->
  <g>
    <rect x="${cx - 190}" y="172" width="380" height="56" rx="28" fill="#ffffff"/>
    <text x="${cx}" y="208" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="${COLORS.primary}" text-anchor="middle">ADVANCE CLEANING POWDER</text>
  </g>

  <!-- shield emblem with wordmark -->
  <g transform="translate(${cx}, 380)">
    <path d="M -150 -150 L 150 -150 L 150 60 Q 150 170 0 230 Q -150 170 -150 60 Z"
          fill="#ffffff" stroke="${COLORS.accent}" stroke-width="6"/>
    <text x="0" y="-55" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="${COLORS.primaryDark}" text-anchor="middle" letter-spacing="2">KHILAFAT</text>
    <line x1="-90" y1="-25" x2="90" y2="-25" stroke="${COLORS.accent}" stroke-width="4"/>
    <text x="0" y="35" font-family="Georgia, 'Times New Roman', serif" font-size="58" font-weight="700" fill="${COLORS.primary}" text-anchor="middle">Khilafat</text>
    <text x="0" y="80" font-family="Arial, Helvetica, sans-serif" font-size="20" font-weight="600" fill="${COLORS.ink}" text-anchor="middle" letter-spacing="3">DETERGENT</text>
  </g>

  <!-- bottom ribbon -->
  <g>
    <path d="M ${cx - 270} 700 Q ${cx} 760 ${cx + 270} 700 L ${cx + 260} 760 Q ${cx} 815 ${cx - 260} 760 Z" fill="${COLORS.accent}"/>
    <text x="${cx}" y="745" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="800" fill="${COLORS.ink}" text-anchor="middle">DETERGENT POWDER</text>
  </g>

  <!-- size badge -->
  <g transform="translate(${cx - 250}, 120)">
    <circle cx="0" cy="0" r="74" fill="${badge}" stroke="#ffffff" stroke-width="6"/>
    <text x="0" y="8" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="800" fill="${badgeText}" text-anchor="middle">${label}</text>
  </g>
</svg>`;
}

function heroPackSVG() {
  return packSVG({ label: '1kg', badge: '#e23b3b', badgeText: '#ffffff', w: 900, h: 1080 });
}

function sunLogoSVG({ size = 512 } = {}) {
  const cx = size / 2;
  const r = size * 0.22;
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sun" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffd84d"/>
      <stop offset="100%" stop-color="${COLORS.accent}"/>
    </radialGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="${COLORS.primary}"/>
  <g transform="translate(${cx},${cx})">
    ${Array.from({ length: 12 })
      .map((_, i) => {
        const angle = (i * 360) / 12;
        return `<rect x="-${size * 0.018}" y="-${r * 1.55}" width="${size * 0.036}" height="${r * 0.6}" fill="url(#sun)" rx="${size * 0.018}" transform="rotate(${angle})"/>`;
      })
      .join('')}
    <circle r="${r}" fill="url(#sun)"/>
  </g>
  <text x="${cx}" y="${size * 0.86}" font-family="Arial, Helvetica, sans-serif" font-size="${size * 0.1}" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="1">RH &amp; SONS</text>
</svg>`;
}

function ogImageSVG() {
  const w = 1200, h = 630;
  return `
<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLORS.secondary}"/>
      <stop offset="100%" stop-color="${COLORS.primaryDark}"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  ${Array.from({ length: 10 })
    .map((_, i) => {
      const r = 14 + (i % 4) * 10;
      const x = 60 + i * 115;
      const y = 80 + ((i * 53) % 470);
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" opacity="0.08"/>`;
    })
    .join('')}
  <text x="80" y="230" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Khilafat Detergent</text>
  <text x="80" y="295" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600" fill="${COLORS.accent}">Advance Cleaning Power, For A Brighter &amp; Cleaner Tomorrow</text>
  <text x="80" y="360" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#e6eefc">By RH &amp; Sons — Cash on Delivery across Pakistan</text>
</svg>`;
}

async function main() {
  const outDirProducts = path.join(__dirname, '..', 'public', 'images', 'products');
  const outDirBrand = path.join(__dirname, '..', 'public', 'images', 'brand');
  fs.mkdirSync(outDirProducts, { recursive: true });
  fs.mkdirSync(outDirBrand, { recursive: true });

  for (const s of SIZES) {
    const svg = packSVG({ label: s.label, badge: s.badge, badgeText: s.badgeText });
    await sharp(Buffer.from(svg)).webp({ quality: 92 }).toFile(path.join(outDirProducts, `khilafat-${s.key}.webp`));
    console.log('generated', `khilafat-${s.key}.webp`);
  }

  await sharp(Buffer.from(heroPackSVG())).webp({ quality: 95 }).toFile(path.join(outDirBrand, 'hero-pack.webp'));
  await sharp(Buffer.from(sunLogoSVG({ size: 512 }))).png().toFile(path.join(outDirBrand, 'logo.png'));
  await sharp(Buffer.from(sunLogoSVG({ size: 256 }))).resize(180, 180).png().toFile(path.join(outDirBrand, 'icon.png'));
  await sharp(Buffer.from(ogImageSVG())).jpeg({ quality: 90 }).toFile(path.join(outDirBrand, 'og-image.jpg'));

  console.log('All brand images generated.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
