import type {
  AspectRatioSpec,
  FontOption,
  InbuiltSceneId,
  InbuiltSceneSpec,
  ThemePresetId,
  ThumbnailConfig,
} from './types';

export const ASPECT_RATIOS: AspectRatioSpec[] = [
  { id: '16:9', label: '16:9', subtitle: 'YouTube / HD', width: 1920, height: 1080 },
  { id: '9:16', label: '9:16', subtitle: 'Reels / Shorts', width: 1080, height: 1920 },
  { id: '4:5', label: '4:5', subtitle: 'FB / IG Feed', width: 1080, height: 1350 },
  { id: '1:1', label: '1:1', subtitle: 'Square', width: 1080, height: 1080 },
];

export const WEB_SERIES_FONTS: FontOption[] = [
  { id: 'Bebas Neue', genre: 'Netflix / Drama' },
  { id: 'Anton', genre: 'Blockbuster' },
  { id: 'Oswald', genre: 'Broadcast / Action' },
  { id: 'Cinzel', genre: 'Royal / Empire' },
  { id: 'Playfair Display', genre: 'Luxury Romance' },
  { id: 'Cormorant Garamond', genre: 'Period Drama' },
  { id: 'Montserrat', genre: 'Modern Thriller' },
  { id: 'Poppins', genre: 'Contemporary' },
  { id: 'Raleway', genre: 'Suspense' },
  { id: 'Syne', genre: 'Avant-Garde' },
  { id: 'Righteous', genre: 'Neo-Noir / Crime' },
  { id: 'Teko', genre: 'Fast Action' },
  { id: 'Fjalla One', genre: 'Editorial Drama' },
  { id: 'Russo One', genre: 'Sci-Fi / Heist' },
  { id: 'Black Ops One', genre: 'Spy / Military' },
  { id: 'Abril Fatface', genre: 'Glamour / Gossip' },
  { id: 'Bungee', genre: 'Comedy / Youth' },
  { id: 'Creepster', genre: 'Horror / Mystery' },
  { id: 'Lora', genre: 'Family / Emotional' },
  { id: 'Noto Sans Bengali', genre: 'Bangla Series' },
];

export const INBUILT_SCENES: InbuiltSceneSpec[] = [
  {
    id: 'billionaire-penthouse',
    name: 'Billionaire CEO',
    genre: 'Luxury Drama',
    accent: '#FECB00',
    suggestedSeries: 'THE SECRET HEIRESS',
    suggestedTagline: 'EXCLUSIVE SERIES • 4K HDR',
    suggestedFont: 'Bebas Neue',
  },
  {
    id: 'crimson-thriller',
    name: 'Crimson Thriller',
    genre: 'Crime / Suspense',
    accent: '#E50914',
    suggestedSeries: 'BLOOD & BETRAYAL',
    suggestedTagline: 'NEW EPISODE • UNCUT',
    suggestedFont: 'Anton',
  },
  {
    id: 'royal-palace',
    name: 'Royal Empire',
    genre: 'Historical / Royal',
    accent: '#F59E0B',
    suggestedSeries: 'CROWN OF SHADOWS',
    suggestedTagline: 'ROYAL SAGA • SEASON 1',
    suggestedFont: 'Cinzel',
  },
  {
    id: 'neon-cyber',
    name: 'Neon Cyber',
    genre: 'Sci-Fi / Heist',
    accent: '#38BDF8',
    suggestedSeries: 'PROTOCOL ZERO',
    suggestedTagline: 'CYBER THRILLER • 4K',
    suggestedFont: 'Russo One',
  },
  {
    id: 'golden-romance',
    name: 'Golden Romance',
    genre: 'Love / Melodrama',
    accent: '#FB7185',
    suggestedSeries: 'WRITTEN IN THE STARS',
    suggestedTagline: 'ROMANTIC DRAMA • DUBBED',
    suggestedFont: 'Playfair Display',
  },
  {
    id: 'midnight-horror',
    name: 'Midnight Mystery',
    genre: 'Horror / Supernatural',
    accent: '#A855F7',
    suggestedSeries: 'THE LAST DOOR',
    suggestedTagline: 'WATCH IF YOU DARE',
    suggestedFont: 'Creepster',
  },
];

export const REELSHORTHD_SVG_COLOR = `<svg width="200" height="56" viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="56" height="56" rx="13" fill="url(#g1)"/>
  <rect x="8" y="12" width="5" height="5" rx="1.2" fill="#090311" fill-opacity="0.75"/>
  <rect x="8" y="25.5" width="5" height="5" rx="1.2" fill="#090311" fill-opacity="0.75"/>
  <rect x="8" y="39" width="5" height="5" rx="1.2" fill="#090311" fill-opacity="0.75"/>
  <path d="M19 16L38 28L19 40V16Z" fill="#090311"/>
  <circle cx="43" cy="13" r="6" fill="#E50914"/>
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FECB00"/>
      <stop offset="1" stop-color="#FF9900"/>
    </linearGradient>
  </defs>
  <text x="68" y="24" font-family="'Arial Black', Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="-0.5">REEL</text>
  <text x="109" y="24" font-family="'Arial Black', Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#FECB00" letter-spacing="-0.5">SHORT</text>
  <rect x="68" y="31" width="24" height="16" rx="4" fill="#E50914"/>
  <text x="80" y="43.5" font-family="'Arial Black', Arial, Helvetica, sans-serif" font-weight="900" font-size="11" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">HD</text>
</svg>`;

export const REELSHORTHD_SVG_WHITE = `<svg width="200" height="56" viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="56" height="56" rx="13" fill="#FFFFFF" fill-opacity="0.18"/>
  <rect x="8" y="12" width="5" height="5" rx="1.2" fill="#FFFFFF" fill-opacity="0.95"/>
  <rect x="8" y="25.5" width="5" height="5" rx="1.2" fill="#FFFFFF" fill-opacity="0.95"/>
  <rect x="8" y="39" width="5" height="5" rx="1.2" fill="#FFFFFF" fill-opacity="0.95"/>
  <path d="M19 16L38 28L19 40V16Z" fill="#FFFFFF"/>
  <circle cx="43" cy="13" r="6" fill="#FFFFFF" fill-opacity="0.95"/>
  <text x="68" y="24" font-family="'Arial Black', Arial, Helvetica, sans-serif" font-weight="900" font-size="20" fill="#FFFFFF" letter-spacing="-0.5">REELSHORT</text>
  <rect x="68" y="31" width="24" height="16" rx="4" fill="#FFFFFF" fill-opacity="0.95"/>
  <text x="80" y="43.5" font-family="'Arial Black', Arial, Helvetica, sans-serif" font-weight="900" font-size="11" fill="#090311" text-anchor="middle" letter-spacing="1">HD</text>
</svg>`;

export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  swatch: [string, string];
  patch: Partial<ThumbnailConfig>;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'luxury-gold',
    name: 'Luxury Noir Gold',
    description: 'Deep cinema scrim with 24K gold EP badge',
    swatch: ['#FECB00', '#090311'],
    patch: {
      theme: 'luxury-gold',
      epStyle: 'gold-pill',
      seriesFont: 'Bebas Neue',
      seriesColor: '#FFFFFF',
      seriesAccentBar: true,
      vignette: 55,
      bottomScrim: 85,
      brandBackdrop: true,
    },
  },
  {
    id: 'crimson-cinema',
    name: 'Crimson Broadcast',
    description: 'High-impact drama red tag & bold title',
    swatch: ['#E50914', '#140507'],
    patch: {
      theme: 'crimson-cinema',
      epStyle: 'crimson-tag',
      seriesFont: 'Oswald',
      seriesColor: '#FFFFFF',
      seriesAccentBar: true,
      vignette: 65,
      bottomScrim: 90,
      brandBackdrop: true,
    },
  },
  {
    id: 'neon-reel',
    name: 'Obsidian Glass',
    description: 'Sleek frosted glass badge & modern geometric type',
    swatch: ['#38BDF8', '#0F172A'],
    patch: {
      theme: 'neon-reel',
      epStyle: 'glass-dark',
      seriesFont: 'Montserrat',
      seriesColor: '#F8FAFC',
      seriesAccentBar: false,
      vignette: 45,
      bottomScrim: 80,
      brandBackdrop: true,
    },
  },
  {
    id: 'clean-editorial',
    name: 'Royal Editorial',
    description: 'Classic serif title with minimal outline badge',
    swatch: ['#F5D061', '#18181B'],
    patch: {
      theme: 'clean-editorial',
      epStyle: 'minimal-outline',
      seriesFont: 'Cinzel',
      seriesColor: '#FFFBEB',
      seriesAccentBar: false,
      vignette: 50,
      bottomScrim: 78,
      brandBackdrop: false,
    },
  },
];

export const DEFAULT_CONFIG: ThumbnailConfig = {
  aspectRatio: '16:9',
  theme: 'luxury-gold',

  zoom: 1.0,
  panX: 0,
  panY: 0,
  brightness: 102,
  contrast: 112,
  saturation: 110,
  vignette: 55,
  bottomScrim: 85,

  epLabel: 'EP',
  epNumber: '1',
  epStyle: 'gold-pill',
  epPosition: 'above-title',
  epScale: 1.0,
  showEpBadge: true,

  seriesName: 'THE SECRET HEIRESS',
  seriesTagline: 'EXCLUSIVE SERIES • 4K HDR',
  seriesFont: 'Bebas Neue',
  seriesSize: 1.0,
  seriesColor: '#FFFFFF',
  seriesUppercase: true,
  seriesAccentBar: true,

  brandPreset: 'reelshorthd-color',
  brandPosition: 'top-right',
  brandScale: 1.0,
  brandOpacity: 100,
  brandBackdrop: true,
  customBrandText: 'REELSHORTHD',
  customBrandAccent: '#FECB00',
};

/**
 * Generates rich 1920x1080 inbuilt cinematic scene backdrops for web-series templates.
 */
export function createInbuiltSceneCanvas(sceneId: InbuiltSceneId): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 1920;
  c.height = 1080;
  const ctx = c.getContext('2d')!;

  if (sceneId === 'billionaire-penthouse') {
    const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
    bg.addColorStop(0, '#090714');
    bg.addColorStop(0.5, '#19142b');
    bg.addColorStop(1, '#080510');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // Skyline silhouette
    ctx.fillStyle = 'rgba(10, 8, 18, 0.9)';
    const heights = [380, 520, 440, 680, 560, 740, 490, 620, 430, 590, 470, 510];
    heights.forEach((h, i) => {
      const bw = 170;
      const bx = i * 165 - 20;
      ctx.fillRect(bx, 1080 - h, bw, h);
      // Warm penthouse window lights
      ctx.fillStyle = 'rgba(254, 203, 0, 0.22)';
      for (let wy = 1080 - h + 30; wy < 960; wy += 48) {
        for (let wx = bx + 22; wx < bx + bw - 26; wx += 32) {
          if ((wx + wy) % 3 !== 0) {
            ctx.fillRect(wx, wy, 14, 22);
          }
        }
      }
      ctx.fillStyle = 'rgba(10, 8, 18, 0.9)';
    });

    // Golden luxury rim light
    const glow = ctx.createRadialGradient(1150, 380, 30, 1150, 380, 720);
    glow.addColorStop(0, 'rgba(254, 203, 0, 0.36)');
    glow.addColorStop(0.5, 'rgba(255, 140, 0, 0.12)');
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1920, 1080);
  } else if (sceneId === 'crimson-thriller') {
    const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
    bg.addColorStop(0, '#140307');
    bg.addColorStop(0.5, '#2b0710');
    bg.addColorStop(1, '#070204');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // Dramatic diagonal searchlights
    ctx.save();
    ctx.globalAlpha = 0.22;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      const x = 220 + i * 420;
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 190, 0);
      ctx.lineTo(x + 560, 1080);
      ctx.lineTo(x + 140, 1080);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? '#E50914' : '#FF6B6B';
      ctx.fill();
    }
    ctx.restore();

    const core = ctx.createRadialGradient(960, 420, 40, 960, 420, 640);
    core.addColorStop(0, 'rgba(229, 9, 20, 0.45)');
    core.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = core;
    ctx.fillRect(0, 0, 1920, 1080);
  } else if (sceneId === 'royal-palace') {
    const bg = ctx.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, '#1a1107');
    bg.addColorStop(0.5, '#2f1f0c');
    bg.addColorStop(1, '#0c0703');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // Palace arches
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 180, 60, 0.24)';
    ctx.lineWidth = 8;
    for (let i = 0; i < 3; i++) {
      const cx = 360 + i * 600;
      ctx.beginPath();
      ctx.arc(cx, 520, 220, Math.PI, 0);
      ctx.lineTo(cx + 220, 1080);
      ctx.moveTo(cx - 220, 520);
      ctx.lineTo(cx - 220, 1080);
      ctx.stroke();
    }
    ctx.restore();

    const sun = ctx.createRadialGradient(960, 460, 30, 960, 460, 680);
    sun.addColorStop(0, 'rgba(254, 203, 0, 0.35)');
    sun.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sun;
    ctx.fillRect(0, 0, 1920, 1080);
  } else if (sceneId === 'neon-cyber') {
    const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
    bg.addColorStop(0, '#040b1a');
    bg.addColorStop(0.5, '#0b1936');
    bg.addColorStop(1, '#040711');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // Perspective cyber grid
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
    ctx.lineWidth = 2;
    for (let y = 560; y <= 1080; y += 52) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1920, y);
      ctx.stroke();
    }
    for (let i = -8; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(960 + i * 70, 560);
      ctx.lineTo(960 + i * 280, 1080);
      ctx.stroke();
    }
    ctx.restore();

    const cyan = ctx.createRadialGradient(1250, 360, 20, 1250, 360, 620);
    cyan.addColorStop(0, 'rgba(56, 189, 248, 0.38)');
    cyan.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cyan;
    ctx.fillRect(0, 0, 1920, 1080);
  } else if (sceneId === 'golden-romance') {
    const bg = ctx.createLinearGradient(0, 0, 1920, 1080);
    bg.addColorStop(0, '#2a1220');
    bg.addColorStop(0.5, '#592338');
    bg.addColorStop(1, '#1a0a14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    const sunset = ctx.createRadialGradient(1120, 440, 40, 1120, 440, 740);
    sunset.addColorStop(0, 'rgba(251, 146, 60, 0.5)');
    sunset.addColorStop(0.45, 'rgba(244, 63, 94, 0.25)');
    sunset.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = sunset;
    ctx.fillRect(0, 0, 1920, 1080);
  } else {
    // midnight-horror
    const bg = ctx.createLinearGradient(0, 0, 0, 1080);
    bg.addColorStop(0, '#070410');
    bg.addColorStop(0.5, '#190d2e');
    bg.addColorStop(1, '#040208');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1920, 1080);

    // Eerie moon
    ctx.save();
    ctx.fillStyle = 'rgba(233, 213, 255, 0.22)';
    ctx.beginPath();
    ctx.arc(1320, 310, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const mist = ctx.createRadialGradient(960, 520, 60, 960, 520, 780);
    mist.addColorStop(0, 'rgba(168, 85, 247, 0.34)');
    mist.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = mist;
    ctx.fillRect(0, 0, 1920, 1080);
  }

  // Soft bokeh lights across all scenes
  for (let i = 0; i < 32; i++) {
    const px = ((i * 211) % 1820) + 50;
    const py = ((i * 139) % 860) + 60;
    const r = 8 + (i % 5) * 9;
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return c;
}
