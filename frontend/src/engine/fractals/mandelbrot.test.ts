import { escapeTime, computeMandelbrot } from './mandelbrot';

describe('Pruebas unitarias para el motor Mandelbrot', () => {

  test('Test 1: escapeTime con c=0,0 nunca escapa', () => {
    const resultado = escapeTime(0, 0, 100);
    expect(resultado).toBe(-1);
  });

  test('Test 2: escapeTime con c=1,0 escapa en la segunda iteración', () => {
    const resultado = escapeTime(1, 0, 100);
    expect(resultado).toBe(2);
  });

    test('Test 3: escapeTime con c=-1,0 nunca escapa', () => {
        const resultado = escapeTime(-1, 0, 100);
        expect(resultado).toBe(-1);
  });

  test('Test 4: computeMandelbrot devuelve matriz con dimensiones correctas', () => {
    const matriz = computeMandelbrot({
      width: 10,
      height: 8,
      maxIterations: 50,
      centerX: -0.75,
      centerY: 0,
      zoom: 1
    });

    expect(matriz.length).toBe(8);        
    expect(matriz[0].length).toBe(10); 
  });

  test('Test 5: el centro del fractal pertenece al conjunto', () => {
    const matriz = computeMandelbrot({
      width: 10,
      height: 10,
      maxIterations: 50,
      centerX: -0.75,
      centerY: 0,
      zoom: 1
    });

    expect(matriz[5][5]).toBe(-1);
  });

  test('Test 6: una zona lejana al fractal escapa', () => {
    const matriz = computeMandelbrot({
      width: 10,
      height: 10,
      maxIterations: 50,
      centerX: 10,
      centerY: 10,
      zoom: 1
    });

    expect(matriz[5][5]).not.toBe(-1);
  });
});