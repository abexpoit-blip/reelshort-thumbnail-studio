export type AspectRatioId = '16:9' | '9:16' | '4:5' | '1:1';

export type ThemePresetId =
  | 'luxury-gold'
  | 'crimson-cinema'
  | 'neon-reel'
  | 'clean-editorial';

export type EpBadgeStyle = 'gold-pill' | 'crimson-tag' | 'glass-dark' | 'minimal-outline';
export type EpBadgePosition = 'top-left' | 'above-title' | 'bottom-left';
export type BrandPresetId =
  | 'reelshorthd-color'
  | 'reelshorthd-white'
  | 'custom-logo'
  | 'custom-text';
export type BrandPosition = 'top-right' | 'bottom-right';

export type SeriesFontId =
  | 'Bebas Neue'
  | 'Anton'
  | 'Oswald'
  | 'Cinzel'
  | 'Playfair Display'
  | 'Cormorant Garamond'
  | 'Montserrat'
  | 'Poppins'
  | 'Raleway'
  | 'Syne'
  | 'Righteous'
  | 'Teko'
  | 'Fjalla One'
  | 'Russo One'
  | 'Black Ops One'
  | 'Abril Fatface'
  | 'Bungee'
  | 'Creepster'
  | 'Lora'
  | 'Noto Sans Bengali';

export interface FontOption {
  id: SeriesFontId;
  genre: string;
}

export type InbuiltSceneId =
  | 'billionaire-penthouse'
  | 'crimson-thriller'
  | 'royal-palace'
  | 'neon-cyber'
  | 'golden-romance'
  | 'midnight-horror';

export interface InbuiltSceneSpec {
  id: InbuiltSceneId;
  name: string;
  genre: string;
  accent: string;
  suggestedSeries: string;
  suggestedTagline: string;
  suggestedFont: SeriesFontId;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';

export interface AspectRatioSpec {
  id: AspectRatioId;
  label: string;
  subtitle: string;
  width: number;
  height: number;
}

export interface ThumbnailConfig {
  aspectRatio: AspectRatioId;
  theme: ThemePresetId;

  // Background image framing & grading
  zoom: number;
  panX: number;
  panY: number;
  brightness: number;
  contrast: number;
  saturation: number;
  vignette: number;
  bottomScrim: number;

  // Episode badge
  epLabel: string;
  epNumber: string;
  epStyle: EpBadgeStyle;
  epPosition: EpBadgePosition;
  epScale: number;
  showEpBadge: boolean;

  // Series Name (bottom)
  seriesName: string;
  seriesTagline: string;
  seriesFont: SeriesFontId;
  seriesSize: number;
  seriesColor: string;
  seriesUppercase: boolean;
  seriesAccentBar: boolean;

  // Right-side Branding
  brandPreset: BrandPresetId;
  brandPosition: BrandPosition;
  brandScale: number;
  brandOpacity: number;
  brandBackdrop: boolean;
  customBrandText: string;
  customBrandAccent: string;
}
