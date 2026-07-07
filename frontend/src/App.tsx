import { useEffect, useRef } from 'react';
import { computeMandelbrot } from './engine/fractals/mandelbrot';
import { renderMatrix, vaporwave } from './engine/renderer';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const matrix = computeMandelbrot({
      width: 800,
      height: 600,
      maxIterations: 100,
      centerX: -0.75,
      centerY: 0,
      zoom: 1
    });

    renderMatrix(canvas, matrix, 100, vaporwave);
  }, []);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <canvas ref={canvasRef} width={800} height={600} />
    </div>
  );
}

export default App;