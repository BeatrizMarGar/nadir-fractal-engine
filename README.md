# ✦ NADIR FRACTAL ENGINE

---
🔴 **Demo en vivo:** [beatrizmargar.github.io/nadir-fractal-engine](https://beatrizmargar.github.io/nadir-fractal-engine/)

---
## 🇪🇸 Español

Una plataforma web para generar arte matemático interactivo: fractales, patrones geométricos y autómatas celulares que responden en tiempo real a los controles de la interfaz.

La estética importa tanto como el código: una consola de laboratorio ciberpunk retro-futurista, con controles pixel-art y un lienzo central que hipnotiza.

Este proyecto es la evolución natural de [Nadir AudioMixer](https://github.com/BeatrizMarGar/Nadir-AudioMixer) — misma filosofía de arquitectura limpia y código desacoplado, pero dando el salto a fullstack.

### ¿Por qué este stack?

Cada tecnología hace exactamente lo que mejor sabe hacer y nada más:

- **Web Components nativos** → controles de UI completamente aislados, sin dependencia de ningún framework
- **React + TypeScript** → interfaz reactiva con tipado fuerte que garantiza que los datos del backend encajan perfectamente en el canvas
- **HTML5 Canvas** → renderizado directo píxel a píxel, sin intermediarios
- **Python + FastAPI** → cálculo matemático puro en el backend, donde Python es el rey
- **Vitest + Pytest** → testing en ambas capas porque el código no testeado es código que no funciona

### Estado del proyecto

- [x] Scaffold Vite + React + TypeScript
- [x] Estructura de carpetas y Git
- [x] Web Component `<nfe-fader>`
- [x] Web Component `<nfe-knob>`
- [x] Renderizado Mandelbrot en Canvas
- [x] Autómata celular (Game of Life)
- [x] UI consola ciberpunk — responsive y táctil
- [x] Tests unitarios (Vitest) + CI/CD con GitHub Actions

### Arrancar en local

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Backend (próximamente)
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
```

---

## 🇬🇧 English

A web platform for interactive mathematical art: fractals, geometric patterns and cellular automata that respond in real time to the interface controls.

The aesthetics matter as much as the code: a retro-futuristic cyberpunk lab console, pixel-art controls and a hypnotic central canvas.

This project is the natural evolution of [Nadir AudioMixer](https://github.com/BeatrizMarGar/Nadir-AudioMixer) — same philosophy of clean architecture and decoupled design, but taking the leap into fullstack.

### Why this stack?

Each technology does exactly what it does best and nothing else:

- **Native Web Components** → fully encapsulated UI controls, zero framework dependency
- **React + TypeScript** → reactive UI with strong typing ensuring backend data fits the canvas perfectly
- **HTML5 Canvas** → direct pixel-level rendering, no abstractions in between
- **Python + FastAPI** → pure mathematical computation on the backend, where Python shines
- **Vitest + Pytest** → testing on both layers, because untested code is broken code

### Project status

- [x] Vite + React + TypeScript scaffold
- [x] Folder structure and Git setup
- [x] `<nfe-fader>` Web Component
- [x] `<nfe-knob>` Web Component
- [x] Mandelbrot set Canvas renderer
- [x] Cellular automaton (Game of Life)
- [ ] FastAPI backend + fractal algorithms
- [ ] REST + WebSockets integration
- [ ] Full UI — cyberpunk console aesthetic

### Run locally

```bash
# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Backend (coming soon)
cd backend
python -m venv .venv
source .venv/bin/activate  # Mac/Linux
.venv\Scripts\activate     # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000
```

---

**Beatriz Martín Garrido** · Fullstack Creative Developer
[GitHub](https://github.com/BeatrizMarGar) · [LinkedIn](www.linkedin.com/in/beatrizmartingarrido)
