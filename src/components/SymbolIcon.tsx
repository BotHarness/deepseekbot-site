import { pixelSymbolCells, type PixelSymbol } from '@botharness/pixel-avatar';
import { pixelPathMarkup } from '@botharness/pixel-morph';
import { useMemo } from 'react';

/** A BotPixel state symbol drawn on its own, as a small pixel icon. */
export function SymbolIcon({
  symbol,
  color,
  size = 24,
}: {
  symbol: PixelSymbol;
  color: string;
  size?: number;
}) {
  const markup = useMemo(() => pixelPathMarkup(pixelSymbolCells(symbol, color)), [symbol, color]);
  return (
    <svg
      className="symbol-icon"
      viewBox="3 3 26 26"
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      // generated locally by pixel-morph, which escapes colours
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
