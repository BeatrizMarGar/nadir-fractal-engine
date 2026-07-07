import type { MandelbrotParams, IterationMatrix } from '../types';

const ESCAPE_RADIUS_SQ = 4;
const BASE_WIDTH = 3.5;
const BASE_HEIGHT = 2.5;
const DEFAULT_CENTER_X = -0.75;
const DEFAULT_CENTER_Y = 0;

export function escapeTime(
  cReal: number,
  cImag: number,
  maxIterations: number
): number {
  let zReal = 0;
  let zImag = 0;

  for (let i = 0; i < maxIterations; i++) {
    const nuevoReal = zReal * zReal - zImag * zImag + cReal;
    const nuevoImag = 2 * zReal * zImag + cImag;
    zReal = nuevoReal;
    zImag = nuevoImag;

    if (zReal * zReal + zImag * zImag > ESCAPE_RADIUS_SQ) {
      return i;
    }
  }

  return -1;
}

export function computeMandelbrot(params: MandelbrotParams): IterationMatrix {
  const { width, height, maxIterations, centerX, centerY, zoom } = params;

  const viewWidth = BASE_WIDTH / zoom;
  const viewHeight = BASE_HEIGHT / zoom;
  const xMin = centerX - viewWidth / 2;
  const xMax = centerX + viewWidth / 2;
  const yMin = centerY - viewHeight / 2;
  const yMax = centerY + viewHeight / 2;

  const matrix: IterationMatrix = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      const cReal = xMin + (x / width) * (xMax - xMin);
      const cImag = yMin + (y / height) * (yMax - yMin);
      row.push(escapeTime(cReal, cImag, maxIterations));
    }
    matrix.push(row);
  }

  return matrix;
}