import type { ThumbnailConfig } from './types';

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.trim().split(/\s+/);
  if (!words.length || !words[0]) return [];
  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = `${current} ${words[i]}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

export function renderThumbnail(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: ThumbnailConfig,
  mainImage: CanvasImageSource | null,
  mainImageSize: { w: number; h: number } | null,
  brandImage: HTMLImageElement | null
) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);

  // Base dark background
  ctx.fillStyle = '#090311';
  ctx.fillRect(0, 0, width, height);

  // 1. Background Image with cover fit + zoom + pan + color grading
  if (mainImage && mainImageSize && mainImageSize.w > 0 && mainImageSize.h > 0) {
    ctx.save();
    ctx.filter = `brightness(${config.brightness}%) contrast(${config.contrast}%) saturate(${config.saturation}%)`;

    const imgRatio = mainImageSize.w / mainImageSize.h;
    const canvasRatio = width / height;

    let baseW = width;
    let baseH = height;
    if (imgRatio > canvasRatio) {
      baseH = height;
      baseW = height * imgRatio;
    } else {
      baseW = width;
      baseH = width / imgRatio;
    }

    const drawW = baseW * config.zoom;
    const drawH = baseH * config.zoom;

    const maxOffsetX = Math.max(0, (drawW - width) / 2) + width * 0.15;
    const maxOffsetY = Math.max(0, (drawH - height) / 2) + height * 0.15;

    const drawX = (width - drawW) / 2 + config.panX * maxOffsetX;
    const drawY = (height - drawH) / 2 + config.panY * maxOffsetY;

    ctx.drawImage(mainImage, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // 2. Cinematic Vignette
  if (config.vignette > 0) {
    const vAlpha = (config.vignette / 100) * 0.85;
    const cx = width / 2;
    const cy = height * 0.44;
    const outerR = Math.hypot(width, height) * 0.58;
    const vignetteGrad = ctx.createRadialGradient(cx, cy, outerR * 0.35, cx, cy, outerR);
    vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGrad.addColorStop(0.65, `rgba(6, 3, 12, ${vAlpha * 0.35})`);
    vignetteGrad.addColorStop(1, `rgba(4, 2, 10, ${vAlpha})`);
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 3. Bottom Gradient Scrim (ensures series name is always razor sharp)
  if (config.bottomScrim > 0) {
    const sAlpha = (config.bottomScrim / 100) * 0.94;
    const scrimTop = height * 0.38;
    const bottomGrad = ctx.createLinearGradient(0, scrimTop, 0, height);
    bottomGrad.addColorStop(0, 'rgba(6, 3, 12, 0)');
    bottomGrad.addColorStop(0.45, `rgba(6, 3, 12, ${sAlpha * 0.42})`);
    bottomGrad.addColorStop(0.78, `rgba(6, 3, 12, ${sAlpha * 0.85})`);
    bottomGrad.addColorStop(1, `rgba(6, 3, 12, ${sAlpha})`);
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, scrimTop, width, height - scrimTop);
  }

  // Subtle top scrim for top-left EP badge / top-right branding legibility
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.24);
  topGrad.addColorStop(0, 'rgba(6, 3, 12, 0.55)');
  topGrad.addColorStop(1, 'rgba(6, 3, 12, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, height * 0.24);

  // Reference unit for responsive scaling across 16:9, 9:16, 4:5, 1:1
  const minDim = Math.min(width, height);
  const padX = Math.round(minDim * 0.055);
  const padY = Math.round(minDim * 0.052);

  // Subtle luxury inner border for luxury-gold / clean-editorial
  if (config.theme === 'luxury-gold' || config.theme === 'clean-editorial') {
    ctx.save();
    ctx.strokeStyle =
      config.theme === 'luxury-gold'
        ? 'rgba(254, 203, 0, 0.22)'
        : 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = Math.max(2, Math.round(minDim * 0.0022));
    const inset = Math.round(minDim * 0.02);
    drawRoundedRect(ctx, inset, inset, width - inset * 2, height - inset * 2, inset * 0.6);
    ctx.stroke();
    ctx.restore();
  }

  // 4. Right-Side Branding (Top-Right or Bottom-Right)
  const brandReserveWidth = Math.round(minDim * 0.38 * config.brandScale);
  drawBranding(ctx, width, height, minDim, padX, padY, config, brandImage);

  // 5. Series Title & Tagline at the Bottom
  const isBottomRightBrand = config.brandPosition === 'bottom-right';
  const titleMaxWidth = isBottomRightBrand
    ? width - padX * 2 - brandReserveWidth - Math.round(minDim * 0.03)
    : width - padX * 2;

  const baseTitleSize = Math.round(minDim * 0.095 * config.seriesSize);
  const fontFamily =
    config.seriesFont === 'Noto Sans Bengali'
      ? "'Noto Sans Bengali', sans-serif"
      : `'${config.seriesFont}', 'Noto Sans Bengali', sans-serif`;

  const displayTitle = config.seriesUppercase
    ? config.seriesName.toUpperCase()
    : config.seriesName;

  ctx.save();
  ctx.font = `800 ${baseTitleSize}px ${fontFamily}`;
  const titleLines = wrapText(ctx, displayTitle || 'SERIES NAME', titleMaxWidth);
  const lineHeight = Math.round(baseTitleSize * 1.02);
  const totalTitleHeight = titleLines.length * lineHeight;

  const hasTagline = config.seriesTagline.trim().length > 0;
  const taglineSize = Math.round(minDim * 0.024 * Math.min(1.2, config.seriesSize));
  const taglineGap = hasTagline ? Math.round(minDim * 0.014) : 0;
  const taglineBlockH = hasTagline ? taglineSize + taglineGap : 0;

  const titleBottomY = height - padY - taglineBlockH;
  const titleTopY = titleBottomY - totalTitleHeight;

  // Optional left accent bar next to series title
  const accentOffset = config.seriesAccentBar ? Math.round(minDim * 0.022) : 0;
  if (config.seriesAccentBar && titleLines.length > 0) {
    const barW = Math.max(5, Math.round(minDim * 0.0075));
    const barGrad = ctx.createLinearGradient(0, titleTopY, 0, titleBottomY + taglineBlockH);
    if (config.theme === 'crimson-cinema') {
      barGrad.addColorStop(0, '#FF3B30');
      barGrad.addColorStop(1, '#E50914');
    } else if (config.theme === 'neon-reel') {
      barGrad.addColorStop(0, '#38BDF8');
      barGrad.addColorStop(1, '#818CF8');
    } else {
      barGrad.addColorStop(0, '#FECB00');
      barGrad.addColorStop(1, '#FF9900');
    }
    ctx.fillStyle = barGrad;
    drawRoundedRect(
      ctx,
      padX,
      titleTopY + Math.round(baseTitleSize * 0.1),
      barW,
      totalTitleHeight + taglineBlockH - Math.round(baseTitleSize * 0.12),
      barW / 2
    );
    ctx.fill();
  }

  // Draw Series Name lines
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = config.seriesColor;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.88)';
  ctx.shadowBlur = Math.round(minDim * 0.028);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.round(minDim * 0.006);

  titleLines.forEach((line, idx) => {
    const y = titleTopY + idx * lineHeight;
    ctx.fillText(line, padX + accentOffset, y);
  });

  // Draw Tagline / Subtitle below Series Name
  if (hasTagline) {
    ctx.shadowBlur = Math.round(minDim * 0.015);
    ctx.font = `700 ${taglineSize}px Inter, 'Noto Sans Bengali', sans-serif`;
    ctx.fillStyle =
      config.theme === 'crimson-cinema'
        ? '#FCA5A5'
        : config.theme === 'neon-reel'
        ? '#7DD3FC'
        : '#FECB00';
    ctx.fillText(
      config.seriesTagline.toUpperCase(),
      padX + accentOffset,
      titleBottomY + taglineGap * 0.6
    );
  }
  ctx.restore();

  // 6. Episode Badge (EP 1, EP 2, EP 4...)
  if (config.showEpBadge) {
    const badgeText = `${config.epLabel.trim()}${config.epLabel.trim() && config.epNumber.trim() ? ' ' : ''}${config.epNumber.trim()}`.trim();
    if (badgeText) {
      drawEpBadge(ctx, width, height, minDim, padX, padY, titleTopY, config, badgeText);
    }
  }

  ctx.restore();
}

function drawEpBadge(
  ctx: CanvasRenderingContext2D,
  _width: number,
  height: number,
  minDim: number,
  padX: number,
  padY: number,
  titleTopY: number,
  config: ThumbnailConfig,
  text: string
) {
  ctx.save();
  const scale = config.epScale;
  const fontSize = Math.round(minDim * 0.056 * scale);
  ctx.font = `900 ${fontSize}px 'Montserrat', 'Oswald', sans-serif`;
  const metrics = ctx.measureText(text);
  const badgePadX = Math.round(fontSize * 0.56);
  const badgePadY = Math.round(fontSize * 0.28);
  const badgeW = Math.round(metrics.width + badgePadX * 2);
  const badgeH = Math.round(fontSize * 1.05 + badgePadY * 2);
  const radius = Math.round(badgeH * 0.24);

  let bx = padX;
  let by = padY;
  if (config.epPosition === 'above-title') {
    bx = padX;
    by = Math.max(padY, titleTopY - badgeH - Math.round(minDim * 0.022));
  } else if (config.epPosition === 'bottom-left') {
    bx = padX;
    by = height - padY - badgeH;
    // If series title is at bottom, nudge above title
    if (titleTopY < by + badgeH) {
      by = Math.max(padY, titleTopY - badgeH - Math.round(minDim * 0.02));
    }
  }

  // Drop shadow behind badge
  ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
  ctx.shadowBlur = Math.round(minDim * 0.025);
  ctx.shadowOffsetY = Math.round(minDim * 0.008);

  if (config.epStyle === 'gold-pill') {
    const grad = ctx.createLinearGradient(bx, by, bx + badgeW, by + badgeH);
    grad.addColorStop(0, '#FFE14D');
    grad.addColorStop(0.5, '#FECB00');
    grad.addColorStop(1, '#FF9900');
    ctx.fillStyle = grad;
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, radius);
    ctx.fill();

    // Crisp inner highlight
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = Math.max(1.5, Math.round(minDim * 0.002));
    drawRoundedRect(ctx, bx + 1, by + 1, badgeW - 2, badgeH - 2, radius);
    ctx.stroke();

    ctx.fillStyle = '#090311';
  } else if (config.epStyle === 'crimson-tag') {
    const grad = ctx.createLinearGradient(bx, by, bx + badgeW, by + badgeH);
    grad.addColorStop(0, '#FF1E2D');
    grad.addColorStop(1, '#B9050F');
    ctx.fillStyle = grad;
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, Math.round(badgeH * 0.16));
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = Math.max(1.5, Math.round(minDim * 0.002));
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
  } else if (config.epStyle === 'glass-dark') {
    ctx.fillStyle = 'rgba(10, 12, 22, 0.76)';
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, radius);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.34)';
    ctx.lineWidth = Math.max(2, Math.round(minDim * 0.0028));
    ctx.stroke();

    ctx.fillStyle = '#FFFFFF';
  } else {
    // minimal-outline
    ctx.fillStyle = 'rgba(9, 3, 17, 0.45)';
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, radius);
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = '#FECB00';
    ctx.lineWidth = Math.max(2.5, Math.round(minDim * 0.0032));
    ctx.stroke();

    ctx.fillStyle = '#FECB00';
  }

  ctx.shadowColor = 'transparent';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillText(text, bx + badgeW / 2, by + badgeH / 2 + Math.round(fontSize * 0.04));
  ctx.restore();
}

function drawBranding(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  minDim: number,
  padX: number,
  padY: number,
  config: ThumbnailConfig,
  brandImage: HTMLImageElement | null
) {
  ctx.save();
  ctx.globalAlpha = Math.max(0.1, Math.min(1, config.brandOpacity / 100));

  const targetH = Math.round(minDim * 0.072 * config.brandScale);
  const pillPadX = Math.round(targetH * 0.34);
  const pillPadY = Math.round(targetH * 0.22);

  if (config.brandPreset === 'custom-text' || !brandImage) {
    const label = (config.customBrandText || 'REELSHORTHD').trim();
    const fontSize = Math.round(targetH * 0.56);
    ctx.font = `900 ${fontSize}px 'Montserrat', sans-serif`;
    const textW = ctx.measureText(label).width;
    const boxW = Math.round(textW + pillPadX * 2);
    const boxH = Math.round(targetH + pillPadY * 1.4);

    const bx = width - padX - boxW;
    const by =
      config.brandPosition === 'top-right' ? padY : height - padY - boxH;

    if (config.brandBackdrop) {
      ctx.fillStyle = 'rgba(9, 3, 17, 0.72)';
      drawRoundedRect(ctx, bx, by, boxW, boxH, Math.round(boxH * 0.24));
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = Math.max(1.5, Math.round(minDim * 0.002));
      ctx.stroke();
    }

    ctx.fillStyle = config.customBrandAccent || '#FECB00';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = Math.round(minDim * 0.015);
    ctx.fillText(label, bx + boxW / 2, by + boxH / 2 + 1);
    ctx.restore();
    return;
  }

  // Image / SVG Logo
  const naturalW = brandImage.naturalWidth || 200;
  const naturalH = brandImage.naturalHeight || 56;
  const ratio = naturalW / naturalH;
  const logoH = targetH;
  const logoW = Math.round(logoH * ratio);

  const boxW = config.brandBackdrop ? logoW + pillPadX * 2 : logoW;
  const boxH = config.brandBackdrop ? logoH + pillPadY * 2 : logoH;

  const bx = width - padX - boxW;
  const by =
    config.brandPosition === 'top-right' ? padY : height - padY - boxH;

  if (config.brandBackdrop) {
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = Math.round(minDim * 0.025);
    ctx.shadowOffsetY = Math.round(minDim * 0.006);
    ctx.fillStyle = 'rgba(9, 3, 17, 0.68)';
    drawRoundedRect(ctx, bx, by, boxW, boxH, Math.round(boxH * 0.25));
    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = Math.max(1.5, Math.round(minDim * 0.002));
    ctx.stroke();
    ctx.restore();
  }

  const drawX = config.brandBackdrop ? bx + pillPadX : bx;
  const drawY = config.brandBackdrop ? by + pillPadY : by;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
  ctx.shadowBlur = Math.round(minDim * 0.018);
  ctx.drawImage(brandImage, drawX, drawY, logoW, logoH);
  ctx.restore();

  ctx.restore();
}
