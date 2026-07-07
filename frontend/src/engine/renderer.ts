import type { IterationMatrix } from './types';

export type ColorPalette = (
  iterations: number,
  maxIterations: number
) => [number, number, number];

export const vaporwave: ColorPalette = (iterations, maxIterations) => {
  if (iterations === -1) return [10, 10, 15];

  const t = iterations / maxIterations;

  const r = Math.round(255 * Math.min(1, t * 2.5));
  const g = Math.round(80 * t);
  const b = Math.round(180 + 75 * t);

  return [r, g, b];
};

export function renderMatrix(
  canvas: HTMLCanvasElement,
  matrix: IterationMatrix,
  maxIterations: number,
  palette: ColorPalette
): void {
  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  const height = matrix.length;
  const width = matrix[0].length;

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = palette(matrix[y][x], maxIterations);
      const indice = (y * width + x) * 4;
      imageData.data[indice] = r;
      imageData.data[indice + 1] = g;
      imageData.data[indice + 2] = b;
      imageData.data[indice + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}