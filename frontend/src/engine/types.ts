export interface MandelbrotParams{
    width: number;
    height: number;
    maxIterations: number;
    centerX: number;
    centerY: number;
    zoom: number
}

export type IterationMatrix = number[][];