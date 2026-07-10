import { useEffect, useRef, useState } from 'react';
import { randomGrid, nextGeneration } from './engine/automata/gameOfLife';
import { renderMatrix, vaporwave } from './engine/renderer';
import type { ColorPalette } from './engine/renderer';
import { computeMandelbrot } from './engine/fractals/mandelbrot';
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
  const fractalZoomRef = useRef(1);
  const speedRef = useRef(FRAMES_PER_STEP);
  const [mode, setMode] = useState<'fractal' | 'life'>('life');
  const [renderTick, setRenderTick] = useState(0);
  const iterationsRef = useRef(100);
  const centerXRef = useRef(-0.75);
  const centerYRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    if (mode === 'fractal') {
      const matrix = computeMandelbrot({
        width: GRID_WIDTH,
        height: GRID_HEIGHT,
        maxIterations: iterationsRef.current,
        centerX: centerXRef.current,
        centerY: centerYRef.current,
        zoom: fractalZoomRef.current
      });
      renderMatrix(canvas, matrix, iterationsRef.current, vaporwave);
      return;  
    }
    let frameCount = 0;
    let animationId = 0;

    function animate() {
      frameCount++;

      if (frameCount >= speedRef.current) {
        frameCount = 0;
        gridRef.current = nextGeneration(gridRef.current);
        renderMatrix(canvas!, gridRef.current, 1, gameOfLifePalette);
      }

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [mode, renderTick]);

  const knobCallbackRef = (knob: HTMLElement | null) => {
    if (knob === null) return;

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      speedRef.current = 21 - detail.value;
    };

    knob.addEventListener('nfe-change', handler);
  };

  const zoomCallbackRef = (knob: HTMLElement | null) => {
    if (knob === null) return;
    const handler = (e: Event) => {
      fractalZoomRef.current = (e as CustomEvent).detail.value;
      setRenderTick(t => t + 1); 
    };
    knob.addEventListener('nfe-change', handler);
  };

  const iterCallbackRef = (knob: HTMLElement | null) => {
    if (knob === null) return;
    const handler = (e: Event) => {
      iterationsRef.current = (e as CustomEvent).detail.value;
      setRenderTick(t => t + 1);
    };
    knob.addEventListener('nfe-change', handler);
  };

  const xCallbackRef = (knob: HTMLElement | null) => {
    if (knob === null) return;
    const handler = (e: Event) => {
      centerXRef.current = (e as CustomEvent).detail.value / 100;
      setRenderTick(t => t + 1);
    };
    knob.addEventListener('nfe-change', handler);
  };

  const yCallbackRef = (knob: HTMLElement | null) => {
    if (knob === null) return;
    const handler = (e: Event) => {
      centerYRef.current = (e as CustomEvent).detail.value / 100;
      setRenderTick(t => t + 1);
    };
    knob.addEventListener('nfe-change', handler);
  };

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => setMode('fractal')}>FRACTAL</button>
        <button onClick={() => setMode('life')}>LIFE</button>
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_WIDTH}
        height={GRID_HEIGHT}
        style={{ width: '800px', height: '600px', imageRendering: 'pixelated' }}
      />

      {mode === 'life' && (
        <nfe-knob ref={knobCallbackRef} value="15" min="1" max="20" label="SPEED"></nfe-knob>
      )}

      {mode === 'fractal' && (
        <div style={{ display: 'flex', gap: '16px' }}>
          
        <nfe-knob ref={zoomCallbackRef} min="1" max="50" value="1" label="ZOOM"></nfe-knob>
        <nfe-knob ref={iterCallbackRef} min="50" max="500" value="100" label="ITER"></nfe-knob>
        <nfe-knob ref={xCallbackRef} min="-250" max="100" value="-75" label="POS X"></nfe-knob>
        <nfe-knob ref={yCallbackRef} min="-125" max="125" value="0" label="POS Y"></nfe-knob>

        </div>
      )}
    </div>
  );
}

export default App;