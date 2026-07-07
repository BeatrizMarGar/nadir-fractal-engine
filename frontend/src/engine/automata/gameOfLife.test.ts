import { createEmptyGrid, randomGrid, countNeighbors, nextGeneration } from './gameOfLife';

describe('Pruebas unitarias para el motor Game of Life', () => {

  test('Test 1: createEmptyGrid crea las dimensiones correctas', () => {
    const grid = createEmptyGrid(10, 8);
    expect(grid.length).toBe(8);
    expect(grid[0].length).toBe(10);
  });

  test('Test 2: createEmptyGrid crea todas las celdas muertas', () => {
    const grid = createEmptyGrid(5, 5);
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        expect(grid[y][x]).toBe(0);
      }
    }
  });

  test('Test 3: countNeighbors en tablero vacío devuelve 0', () => {
    const grid = createEmptyGrid(5, 5);
    expect(countNeighbors(grid, 2, 2)).toBe(0);
  });

  test('Test 4: countNeighbors cuenta 3 vecinas correctamente', () => {
    const grid = createEmptyGrid(5, 5);
    grid[1][1] = 1;
    grid[1][2] = 1;
    grid[1][3] = 1;
    expect(countNeighbors(grid, 2, 2)).toBe(3);
  });

  test('Test 5: el mundo toroidal conecta esquinas opuestas', () => {
    const grid = createEmptyGrid(5, 5);
    grid[4][4] = 1;
    expect(countNeighbors(grid, 0, 0)).toBe(1);
  });

  test('Test 6: el blinker oscila de horizontal a vertical', () => {
    const grid = createEmptyGrid(5, 5);
    grid[2][1] = 1;
    grid[2][2] = 1;
    grid[2][3] = 1;

    const next = nextGeneration(grid);

    expect(next[1][2]).toBe(1);
    expect(next[2][2]).toBe(1);
    expect(next[3][2]).toBe(1);
    expect(next[2][1]).toBe(0);
    expect(next[2][3]).toBe(0);
  });

  test('Test 7: una celda sola muere de soledad', () => {
    const grid = createEmptyGrid(5, 5);
    grid[2][2] = 1;

    const next = nextGeneration(grid);

    expect(next[2][2]).toBe(0);
  });

  test('Test 8: un bloque 2x2 es estable', () => {
    const grid = createEmptyGrid(5, 5);
    grid[1][1] = 1;
    grid[1][2] = 1;
    grid[2][1] = 1;
    grid[2][2] = 1;

    const next = nextGeneration(grid);

    expect(next[1][1]).toBe(1);
    expect(next[1][2]).toBe(1);
    expect(next[2][1]).toBe(1);
    expect(next[2][2]).toBe(1);
  });

});