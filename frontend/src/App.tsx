import { useEffect, useRef } from 'react';
import { randomGrid, nextGeneration } from './engine/automata/gameOfLife';
import { renderMatrix } from './engine/renderer';
import type { ColorPalette } from './engine/renderer';
import './components/nfe-knob/nfe-knob';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'nfe-knob': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        min?: string;
        max?: string;
        label?: string;
      };
    }
  }
}

const GRID_WIDTH = 200;
const GRID_HEIGHT = 150;
const FRAMES_PER_STEP = 6;

const gameOfLifePalette: ColorPalette = (cell) => {
  if (cell === 1) return [0, 255, 255];
  return [10, 10, 15];
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef(randomGrid(GRID_WIDTH, GRID_HEIGHT, 0.3));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    let frameCount = 0;
    let animationId = 0;

    function animate() {
      frameCount++;

      if (frameCount >= FRAMES_PER_STEP) {
        frameCount = 0;
        gridRef.current = nextGeneration(gridRef.current);
        renderMatrix(canvas!, gridRef.current, 1, gameOfLifePalette);
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
      <canvas
        ref={canvasRef}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        style={{ width: '800px', height: '600px', imageRendering: 'pixelated' }}
      />
      <nfe-knob value="6" min="1" max="20" label="SPEED"></nfe-knob>
    </div>
  );
}

export default App;