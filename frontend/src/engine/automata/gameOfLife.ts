import type { CellGrid } from '../types'

export function createEmptyGrid(width:number, height:number): CellGrid {

    const grid: CellGrid = [];

  for (let y = 0; y < height; y++) {
    grid.push(new Array(width).fill(0));
  }

  return grid;
}

export function randomGrid(width: number, height: number, density: number): CellGrid {
  const grid: CellGrid = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      row.push(Math.random() < density ? 1 : 0);
    }
    grid.push(row);
  }

  return grid;
}

export function countNeighbors(grid:CellGrid, x:number, y:number): number{

    const height = grid.length;
    const width = grid[0].length;
    let contador = 0;

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const vecinaX = (x + dx + width) % width
            const vecinaY = (y + dy + height) % height
            contador += grid[vecinaY][vecinaX]
        }
    }
    return contador;
}

export function nextGeneration(grid:CellGrid): CellGrid {
  
    const height = grid.length;
    const width = grid[0].length;
    const newGrid: CellGrid = [];

  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
        const vecinas = countNeighbors(grid, x, y)
        const viva = grid[y][x] === 1
        if (viva && (vecinas === 2 || vecinas === 3)) {
            row.push(1);
            } else if (!viva && vecinas === 3) {
            row.push(1);
            } else {
            row.push(0);
            }
        }
    newGrid.push(row);
  }

  return newGrid;
}