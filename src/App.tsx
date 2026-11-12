import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import {
  ChevronRight,
  Download,
  Film,
  Grid3X3,
  ImagePlus,
  Layers,
  Package,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Type,
  Upload,
  X,
} from 'lucide-react';
import { renderThumbnail } from './canvasRenderer';
import {
  ASPECT_RATIOS,
  createInbuiltSceneCanvas,
  DEFAULT_CONFIG,
  INBUILT_SCENES,
  REELSHORTHD_SVG_COLOR,
  REELSHORTHD_SVG_WHITE,
  svgToDataUrl,
  THEME_PRESETS,
  WEB_SERIES_FONTS,
} from './presets';
import type {
  AspectRatioId,
  BrandPresetId,
  EpBadgePosition,
  EpBadgeStyle,
  ExportFormat,
  InbuiltSceneId,
  SeriesFontId,
  ThumbnailConfig,
} from './types';

const QUICK_EPISODES = ['1', '2', '3', '4', '5', '6', '8', '10', '12'];

function parseEpisodeList(input: string): string[] {
  const parts = input
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const result: string[] = [];
  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start <= end && end - start <= 50) {
        for (let i = start; i <= end; i++) {
          result.push(String(i));
        }
        continue;
      }
    }
    result.push(part);
  }
  return Array.from(new Set(result));
}

export function App() {
  const [config, setConfig] = useState<ThumbnailConfig>(DEFAULT_CONFIG);
  const [showGrid, setShowGrid] = useState(false);
  const [showFontModal, setShowFontModal] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<InbuiltSceneId | 'custom'>(
    'billionaire-penthouse'
  );

  // Main image state
  const [mainImage, setMainImage] = useState<CanvasImageSource | null>(null);
  const [mainImageSize, setMainImageSize] = useState<{ w: number; h: number } | null>(null);
  const [mainImageName, setMainImageName] = useState<string>('Inbuilt: Billionaire CEO');

  // Custom brand logo state
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [brandImage, setBrandImage] = useState<HTMLImageElement | null>(null);

  // Export state
  const [exportFormat, setExportFormat] = useState<ExportFormat>('png');
  const [batchInput, setBatchInput] = useState('1, 2, 4');
  const [isExportingBatch, setIsExportingBatch] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainFileInputRef = useRef<HTMLInputElement | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement | null>(null);
  const dragPanRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origPanX: number;
    origPanY: number;
  }>({ active: false, startX: 0, startY: 0, origPanX: 0, origPanY: 0 });

  const aspectSpec = useMemo(
    () => ASPECT_RATIOS.find((a) => a.id === config.aspectRatio) ?? ASPECT_RATIOS[0],
    [config.aspectRatio]
  );

  // Load initial inbuilt scene
  useEffect(() => {
    const sample = createInbuiltSceneCanvas('billionaire-penthouse');
    setMainImage(sample);
    setMainImageSize({ w: sample.width, h: sample.height });
  }, []);

  // Load brand logo image whenever brandPreset or customLogoUrl changes
  useEffect(() => {
    let src: string | null = null;
    if (config.brandPreset === 'reelshorthd-color') {
      src = svgToDataUrl(REELSHORTHD_SVG_COLOR);
    } else if (config.brandPreset === 'reelshorthd-white') {
      src = svgToDataUrl(REELSHORTHD_SVG_WHITE);
    } else if (config.brandPreset === 'custom-logo' && customLogoUrl) {
      src = customLogoUrl;
    }

    if (!src) {
      setBrandImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => setBrandImage(img);
    img.src = src;
  }, [config.brandPreset, customLogoUrl]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderThumbnail(
      ctx,
      aspectSpec.width,
      aspectSpec.height,
      config,
      mainImage,
      mainImageSize,
      brandImage
    );
  }, [aspectSpec.width, aspectSpec.height, config, mainImage, mainImageSize, brandImage]);

  useEffect(() => {
    redraw();
    document.fonts?.ready.then(() => redraw());
  }, [redraw]);

  const updateConfig = <K extends keyof ThumbnailConfig>(key: K, value: ThumbnailConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSelectInbuiltScene = (sceneId: InbuiltSceneId) => {
    const spec = INBUILT_SCENES.find((s) => s.id === sceneId);
    const canvasScene = createInbuiltSceneCanvas(sceneId);
    setMainImage(canvasScene);
    setMainImageSize({ w: canvasScene.width, h: canvasScene.height });
    setActiveSceneId(sceneId);
    setMainImageName(`Inbuilt: ${spec?.name ?? sceneId}`);
    if (spec) {
      setConfig((prev) => ({
        ...prev,
        zoom: 1,
        panX: 0,
        panY: 0,
        seriesFont: spec.suggestedFont,
        seriesTagline: spec.suggestedTagline,
      }));
    }
  };

  const handleMainImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setMainImage(img);
      setMainImageSize({ w: img.naturalWidth, h: img.naturalHeight });
      setActiveSceneId('custom');
      setMainImageName(file.name);
      setConfig((prev) => ({ ...prev, zoom: 1.0, panX: 0, panY: 0 }));
    };
    img.src = url;
  };

  const handleLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setCustomLogoUrl(url);
    updateConfig('brandPreset', 'custom-logo');
  };

  // Interactive canvas pan & wheel zoom
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragPanRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origPanX: config.panX,
      origPanY: config.panY,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragPanRef.current.active) return;
    const dx = (e.clientX - dragPanRef.current.startX) / 260;
    const dy = (e.clientY - dragPanRef.current.startY) / 260;
    setConfig((prev) => ({
      ...prev,
      panX: Math.max(-1, Math.min(1, dragPanRef.current.origPanX + dx)),
      panY: Math.max(-1, Math.min(1, dragPanRef.current.origPanY + dy)),
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragPanRef.current.active = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.06 : -0.06;
    setConfig((prev) => ({
      ...prev,
      zoom: Math.max(1, Math.min(2.5, Number((prev.zoom + delta).toFixed(2)))),
    }));
  };

  const handleDownloadCurrent = () => {
    const offscreen = document.createElement('canvas');
    offscreen.width = aspectSpec.width;
    offscreen.height = aspectSpec.height;
    const ctx = offscreen.getContext('2d');
    if (!ctx) return;

    renderThumbnail(
      ctx,
      aspectSpec.width,
      aspectSpec.height,
      config,
      mainImage,
      mainImageSize,
      brandImage
    );

    const mime =
      exportFormat === 'png'
        ? 'image/png'
        : exportFormat === 'jpeg'
        ? 'image/jpeg'
        : 'image/webp';
    const quality = exportFormat === 'png' ? 1 : 0.95;
    const dataUrl = offscreen.toDataURL(mime, quality);

    const safeSeries = (config.seriesName || 'Thumbnail')
      .trim()
      .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, '_');
    const epPart = config.showEpBadge ? `_${config.epLabel}${config.epNumber}` : '';
    const link = document.createElement('a');
    link.download = `${safeSeries}${epPart}.${exportFormat === 'jpeg' ? 'jpg' : exportFormat}`;
    link.href = dataUrl;
    link.click();
  };

  const handleBatchExport = async () => {
    const episodes = parseEpisodeList(batchInput);
    if (episodes.length === 0) return;

    setIsExportingBatch(true);
    try {
      const zip = new JSZip();
      const offscreen = document.createElement('canvas');
      offscreen.width = aspectSpec.width;
      offscreen.height = aspectSpec.height;
      const ctx = offscreen.getContext('2d');
      if (!ctx) return;

      const mime =
        exportFormat === 'png'
          ? 'image/png'
          : exportFormat === 'jpeg'
          ? 'image/jpeg'
          : 'image/webp';
      const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat;
      const safeSeries = (config.seriesName || 'Series')
        .trim()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF_-]+/g, '_');

      for (const ep of episodes) {
        const epConfig: ThumbnailConfig = {
          ...config,
          showEpBadge: true,
          epNumber: ep,
        };
        renderThumbnail(
          ctx,
          aspectSpec.width,
          aspectSpec.height,
          epConfig,
          mainImage,
          mainImageSize,
          brandImage
        );

        const blob = await new Promise<Blob | null>((resolve) =>
          offscreen.toBlob(resolve, mime, exportFormat === 'png' ? 1 : 0.95)
        );
        if (blob) {
          zip.file(`${safeSeries}_${config.epLabel}${ep}.${ext}`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeSeries}_Thumbnails_Batch.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsExportingBatch(false);
    }
  };

  return (
    <div className="studio-shell">
      {/* Top Studio Header */}
      <header className="studio-header">
        <div className="brand-mark">
          <div className="brand-badge">
            <Film size={18} strokeWidth={2.5} />
          </div>
          <div className="brand-title">
            <span>ReelShortHD Studio</span>
            <span className="pro-pill">WEB SERIES PRO</span>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => mainFileInputRef.current?.click()}
          >
            <ImagePlus size={14} />
            Upload Image
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleDownloadCurrent}
          >
            <Download size={14} />
            Export {aspectSpec.label} {exportFormat.toUpperCase()}
          </button>
        </div>
      </header>

      {/* Left Control Rail */}
      <aside className="panel panel-left">
        {/* 1. Inbuilt Web-Series Scenes + Upload */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <Upload size={13} /> Scene & Media
            </span>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => {
                updateConfig('zoom', 1);
                updateConfig('panX', 0);
                updateConfig('panY', 0);
              }}
              title="Reset zoom & pan"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>

          <div className="scene-grid">
            {INBUILT_SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                className={`scene-card ${activeSceneId === scene.id ? 'active' : ''}`}
                onClick={() => handleSelectInbuiltScene(scene.id)}
              >
                <span className="scene-dot" style={{ background: scene.accent }} />
                <span className="scene-meta">
                  <span className="scene-name">{scene.name}</span>
                  <span className="scene-genre">{scene.genre}</span>
                </span>
              </button>
            ))}
          </div>

          <div
            className={`dropzone ${isDraggingFile ? 'dragging' : ''}`}
            onClick={() => mainFileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={() => setIsDraggingFile(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleMainImageFile(f);
            }}
          >
            <ImagePlus size={18} color="#E50914" />
            <div className="dropzone-title">Or Upload Your Own Image</div>
            <div className="dropzone-sub">{mainImageName}</div>
            <input
              ref={mainFileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleMainImageFile(f);
              }}
            />
          </div>

          <div className="field">
            <div className="field-label">
              <span>Zoom</span>
              <span className="field-val">{config.zoom.toFixed(2)}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={2.5}
              step={0.02}
              value={config.zoom}
              onChange={(e) => updateConfig('zoom', parseFloat(e.target.value))}
            />
          </div>

          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">
                <span>Bottom Scrim</span>
                <span className="field-val">{config.bottomScrim}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.bottomScrim}
                onChange={(e) => updateConfig('bottomScrim', parseInt(e.target.value, 10))}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">
                <span>Vignette</span>
                <span className="field-val">{config.vignette}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={config.vignette}
                onChange={(e) => updateConfig('vignette', parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">
                <span>Bright</span>
                <span className="field-val">{config.brightness}%</span>
              </div>
              <input
                type="range"
                min={60}
                max={140}
                value={config.brightness}
                onChange={(e) => updateConfig('brightness', parseInt(e.target.value, 10))}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <div className="field-label">
                <span>Contrast</span>
                <span className="field-val">{config.contrast}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={150}
                value={config.contrast}
                onChange={(e) => updateConfig('contrast', parseInt(e.target.value, 10))}
              />
            </div>
          </div>
        </section>

        {/* 2. Episode Badge */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <Layers size={13} /> Episode Badge
            </span>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.showEpBadge}
                onChange={(e) => updateConfig('showEpBadge', e.target.checked)}
              />
              Show
            </label>
          </div>

          <div className="chip-grid">
            {QUICK_EPISODES.map((num) => (
              <button
                key={num}
                type="button"
                className={`chip ${config.epNumber === num ? 'active' : ''}`}
                onClick={() => updateConfig('epNumber', num)}
              >
                EP {num}
              </button>
            ))}
          </div>

          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Prefix</label>
              <input
                className="input"
                value={config.epLabel}
                onChange={(e) => updateConfig('epLabel', e.target.value)}
                placeholder="EP"
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label">Number</label>
              <input
                className="input"
                value={config.epNumber}
                onChange={(e) => updateConfig('epNumber', e.target.value)}
                placeholder="1"
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">Badge Style</label>
            <div className="seg-group">
              {(
                [
                  ['gold-pill', 'Gold Pill'],
                  ['crimson-tag', 'Crimson Tag'],
                  ['glass-dark', 'Obsidian Glass'],
                  ['minimal-outline', 'Gold Outline'],
                ] as [EpBadgeStyle, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`seg-btn ${config.epStyle === id ? 'active' : ''}`}
                  onClick={() => updateConfig('epStyle', id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label className="field-label">Position</label>
            <div className="seg-group cols-3">
              {(
                [
                  ['above-title', 'Above Title'],
                  ['top-left', 'Top Left'],
                  ['bottom-left', 'Bottom'],
                ] as [EpBadgePosition, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`seg-btn ${config.epPosition === id ? 'active' : ''}`}
                  onClick={() => updateConfig('epPosition', id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Badge Size</span>
              <span className="field-val">{Math.round(config.epScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.7}
              max={1.45}
              step={0.05}
              value={config.epScale}
              onChange={(e) => updateConfig('epScale', parseFloat(e.target.value))}
            />
          </div>
        </section>

        {/* 3. Series Name & 20 Web-Series Fonts */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <Type size={13} /> Series Name (Bottom)
            </span>
          </div>

          <div className="field">
            <label className="field-label">Series Title</label>
            <input
              className="input"
              value={config.seriesName}
              onChange={(e) => updateConfig('seriesName', e.target.value)}
              placeholder="Enter Web Series Name..."
            />
          </div>

          <div className="field">
            <label className="field-label">Tagline / Subtitle (Optional)</label>
            <input
              className="input"
              value={config.seriesTagline}
              onChange={(e) => updateConfig('seriesTagline', e.target.value)}
              placeholder="e.g. EXCLUSIVE SERIES • 4K HDR"
            />
          </div>

          <div className="field">
            <label className="field-label">
              <span>20 Web-Series Fonts (Google Fonts)</span>
            </label>
            <button
              type="button"
              className="font-trigger"
              onClick={() => setShowFontModal(true)}
            >
              <span style={{ fontFamily: `'${config.seriesFont}', sans-serif`, fontSize: 16 }}>
                {config.seriesFont}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#E50914', fontWeight: 700 }}>
                Browse 20 <ChevronRight size={14} />
              </span>
            </button>
            <select
              className="select"
              value={config.seriesFont}
              onChange={(e) => updateConfig('seriesFont', e.target.value as SeriesFontId)}
            >
              {WEB_SERIES_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.id} — {f.genre}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Title Scale</span>
              <span className="field-val">{Math.round(config.seriesSize * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.65}
              max={1.5}
              step={0.05}
              value={config.seriesSize}
              onChange={(e) => updateConfig('seriesSize', parseFloat(e.target.value))}
            />
          </div>

          <div className="field-row">
            <div className="color-row">
              <input
                type="color"
                className="color-picker"
                value={config.seriesColor}
                onChange={(e) => updateConfig('seriesColor', e.target.value)}
              />
              <span className="field-label">Title Color</span>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.seriesUppercase}
                onChange={(e) => updateConfig('seriesUppercase', e.target.checked)}
              />
              ALL CAPS
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.seriesAccentBar}
                onChange={(e) => updateConfig('seriesAccentBar', e.target.checked)}
              />
              Bar
            </label>
          </div>
        </section>
      </aside>

      {/* Center Interactive Canvas Stage */}
      <main className="stage-area">
        <div className="stage-toolbar">
          <div className="ratio-pills">
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar.id}
                type="button"
                className={`ratio-btn ${config.aspectRatio === ar.id ? 'active' : ''}`}
                onClick={() => updateConfig('aspectRatio', ar.id as AspectRatioId)}
              >
                <span>{ar.label}</span>
                <span style={{ opacity: 0.65, fontWeight: 400 }}>{ar.subtitle}</span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className={`ratio-btn ${showGrid ? 'active' : ''}`}
              onClick={() => setShowGrid((g) => !g)}
            >
              <Grid3X3 size={13} />
              Safe Grid
            </button>
          </div>
        </div>

        <div className="canvas-viewport">
          <div className="canvas-frame">
            <canvas
              ref={canvasRef}
              width={aspectSpec.width}
              height={aspectSpec.height}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
            />
            {showGrid && <div className="safe-grid-overlay" />}
          </div>
        </div>

        <footer className="stage-footer">
          <span>
            Canvas: {aspectSpec.width} × {aspectSpec.height} px • Drag image to pan • Scroll to zoom
          </span>
          <span>
            Font: {config.seriesFont} •{' '}
            {config.showEpBadge ? `${config.epLabel} ${config.epNumber}` : 'No EP Badge'} •{' '}
            {config.brandPosition === 'top-right' ? 'Brand Top-Right' : 'Brand Bottom-Right'}
          </span>
        </footer>
      </main>

      {/* Right Rail */}
      <aside className="panel panel-right">
        {/* 1. Cinema Look Presets */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <Sparkles size={13} /> Studio Themes
            </span>
          </div>

          <div className="theme-grid">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`theme-card ${config.theme === preset.id ? 'active' : ''}`}
                onClick={() => setConfig((prev) => ({ ...prev, ...preset.patch }))}
              >
                <div className="theme-swatches">
                  <span className="swatch-dot" style={{ background: preset.swatch[0] }} />
                  <span className="swatch-dot" style={{ background: preset.swatch[1] }} />
                </div>
                <div className="theme-name">{preset.name}</div>
              </button>
            ))}
          </div>
        </section>

        {/* 2. Right-Side Branding */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <ShieldCheck size={13} /> Right-Side Branding
            </span>
          </div>

          <div className="field">
            <label className="field-label">Brand Logo</label>
            <div className="seg-group">
              {(
                [
                  ['reelshorthd-color', 'ReelShort Color'],
                  ['reelshorthd-white', 'ReelShort White'],
                  ['custom-logo', 'Custom Logo'],
                  ['custom-text', 'Custom Text'],
                ] as [BrandPresetId, string][]
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  className={`seg-btn ${config.brandPreset === id ? 'active' : ''}`}
                  onClick={() => updateConfig('brandPreset', id)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {config.brandPreset === 'custom-logo' && (
            <div className="field">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => logoFileInputRef.current?.click()}
              >
                <Upload size={13} />
                {customLogoUrl ? 'Change Brand PNG / SVG' : 'Upload Brand PNG / SVG'}
              </button>
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleLogoFile(f);
                }}
              />
            </div>
          )}

          {config.brandPreset === 'custom-text' && (
            <div className="field-row">
              <div className="field" style={{ flex: 1 }}>
                <label className="field-label">Brand Name</label>
                <input
                  className="input"
                  value={config.customBrandText}
                  onChange={(e) => updateConfig('customBrandText', e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label">Color</label>
                <input
                  type="color"
                  className="color-picker"
                  value={config.customBrandAccent}
                  onChange={(e) => updateConfig('customBrandAccent', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="field">
            <label className="field-label">Right-Side Placement</label>
            <div className="seg-group">
              <button
                type="button"
                className={`seg-btn ${config.brandPosition === 'top-right' ? 'active' : ''}`}
                onClick={() => updateConfig('brandPosition', 'top-right')}
              >
                Top Right
              </button>
              <button
                type="button"
                className={`seg-btn ${config.brandPosition === 'bottom-right' ? 'active' : ''}`}
                onClick={() => updateConfig('brandPosition', 'bottom-right')}
              >
                Bottom Right
              </button>
            </div>
          </div>

          <div className="field">
            <div className="field-label">
              <span>Logo Scale</span>
              <span className="field-val">{Math.round(config.brandScale * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.6}
              max={1.6}
              step={0.05}
              value={config.brandScale}
              onChange={(e) => updateConfig('brandScale', parseFloat(e.target.value))}
            />
          </div>

          <div className="field">
            <div className="field-label">
              <span>Opacity</span>
              <span className="field-val">{config.brandOpacity}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={100}
              value={config.brandOpacity}
              onChange={(e) => updateConfig('brandOpacity', parseInt(e.target.value, 10))}
            />
          </div>

          <label className="toggle-row">
            <span>Frosted Pill Backdrop</span>
            <input
              type="checkbox"
              checked={config.brandBackdrop}
              onChange={(e) => updateConfig('brandBackdrop', e.target.checked)}
            />
          </label>
        </section>

        {/* 3. Export & Batch Episode Export */}
        <section className="section-card">
          <div className="section-title">
            <span className="section-title-left">
              <Package size={13} /> Export & Batch
            </span>
          </div>

          <div className="field">
            <label className="field-label">Output Format</label>
            <div className="seg-group cols-3">
              {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  className={`seg-btn ${exportFormat === fmt ? 'active' : ''}`}
                  onClick={() => setExportFormat(fmt)}
                >
                  {fmt === 'jpeg' ? 'JPG' : fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDownloadCurrent}
          >
            <Download size={15} />
            Download Current ({config.showEpBadge ? `${config.epLabel} ${config.epNumber}` : 'HD'})
          </button>

          <div className="field" style={{ marginTop: 6 }}>
            <label className="field-label">
              <span>Batch Episodes (e.g. 1, 2, 4 or 1-5)</span>
            </label>
            <input
              className="input"
              value={batchInput}
              onChange={(e) => setBatchInput(e.target.value)}
              placeholder="1, 2, 4"
            />
          </div>

          <button
            type="button"
            className="btn btn-crimson"
            disabled={isExportingBatch}
            onClick={handleBatchExport}
          >
            <Package size={15} />
            {isExportingBatch
              ? 'Rendering Batch...'
              : `Export Batch ZIP (${parseEpisodeList(batchInput).length} files)`}
          </button>
        </section>
      </aside>

      {/* 20 Web-Series Fonts Live Preview Modal */}
      {showFontModal && (
        <div
          className="font-modal-backdrop"
          onClick={() => setShowFontModal(false)}
        >
          <div className="font-modal" onClick={(e) => e.stopPropagation()}>
            <div className="font-modal-header">
              <div>
                <div style={{ fontSize: 15, fontWeight: 800 }}>
                  20 Web-Series Title Fonts (Google Fonts)
                </div>
                <div style={{ fontSize: 11.5, color: '#64748b' }}>
                  Live preview of "{config.seriesName || 'SERIES NAME'}" — click any font to apply
                </div>
              </div>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowFontModal(false)}
              >
                <X size={15} /> Close
              </button>
            </div>
            <div className="font-modal-grid">
              {WEB_SERIES_FONTS.map((font) => (
                <button
                  key={font.id}
                  type="button"
                  className={`font-card ${config.seriesFont === font.id ? 'active' : ''}`}
                  onClick={() => {
                    updateConfig('seriesFont', font.id);
                    setShowFontModal(false);
                  }}
                >
                  <div
                    className="font-card-preview"
                    style={{
                      fontFamily: `'${font.id}', 'Noto Sans Bengali', sans-serif`,
                    }}
                  >
                    {(config.seriesName || 'THE SECRET HEIRESS').toUpperCase()}
                  </div>
                  <div className="font-card-meta">
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{font.id}</span>
                    <span>{font.genre}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
