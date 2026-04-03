# 🧊 Polyline Editor 3D
### Human–Computer Interaction & Computer Graphics · CS Degree Project

> A fully featured, browser-based vector polyline editor with a Windows 11 Paint–inspired interface and a real-time 3D viewport. Draw polylines in 2D and instantly see them — and edit them — in three-dimensional space.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Tech Stack](#-tech-stack)
3. [Features](#-features)
4. [How It Works — Architecture](#-how-it-works--architecture)
5. [Coordinate System](#-coordinate-system)
6. [3D Rendering Engine](#-3d-rendering-engine)
7. [File Structure](#-file-structure)
8. [Running the Project](#-running-the-project)
9. [Keyboard Shortcuts](#-keyboard-shortcuts)
10. [Challenges & Confusions Faced](#-challenges--confusions-faced)
11. [Concepts Applied from HCI-CG](#-concepts-applied-from-hci-cg)
12. [Screenshots](#-screenshots)
13. [Author](#-author)

---

## 📌 Project Overview

This project was built for the **HCI-CG (Human–Computer Interaction & Computer Graphics)** course. The goal was to implement a polyline editor that demonstrates core CG concepts — vector data structures, 2D rendering, 3D perspective projection, user interaction design — while also exploring HCI principles like discoverability, direct manipulation, and feedback.

The editor works entirely in the **browser** using only vanilla JavaScript and the HTML5 Canvas API — **no libraries, no frameworks, no build tools**. Just three files: `index.html`, `style.css`, and `script.js`.

### What the project does

- Draw multi-point connected lines (polylines) on a 2D canvas
- Edit individual points: move, delete, or insert new ones
- View the same polylines in a **live 3D perspective viewport**
- Push any point forward or backward in 3D space using a depth (Z) slider
- Edit polylines **directly in 3D** using Begin / Delete / Move modes
- Any change in either panel is **instantly reflected in the other** — fully synchronised

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Language** | Vanilla JavaScript (ES2020+) — no frameworks |
| **Rendering (2D)** | HTML5 Canvas API (`CanvasRenderingContext2D`) |
| **Rendering (3D)** | Custom perspective projection engine — pure JS math, same Canvas API |
| **UI / Layout** | HTML5 + CSS3 (Flexbox, CSS Variables, CSS transitions) |
| **Fonts** | Google Fonts — Segoe UI (loaded via `@import`) |
| **Data Persistence** | JSON + Blob API (save drawing as `.json` file — serverless, no backend) |
| **File I/O** | `URL.createObjectURL` / `Blob` for save, `FileReader` API for open |

### Why no frameworks?

The assignment requirement was a **logic-first approach** to demonstrate understanding of the underlying algorithms — projection math, hit-testing, event handling — rather than delegating them to a library. Every rendered pixel, every coordinate transformation, and every mouse event handler is written from scratch.

---

## ✨ Features

### 2D Drawing Canvas
- **Polyline tool** — click to place points, double-click to finish; supports multiple polylines
- **Pencil, Brush** (normal, soft, calligraphy, spray), **Eraser**, **Flood Fill**, **Text tool**, **Eyedropper**
- **Shape tools** — Line, Rectangle, Ellipse, Triangle, Arrow, Star, Diamond, Heart, Hexagon
- **Rubber-band selection** — drag to select a region; supports Cut, Copy, Paste (Ctrl+C/V)
- **Zoom in/out** via slider, buttons, or keyboard
- **Grid overlay** and **ruler display** with tick marks
- **Axis overlay** showing X, Y, and Z=depth directly on the canvas
- **Point colour coding** — each vertex changes colour (cyan → lime → orange) based on its Z depth, giving instant visual feedback

### 3D Viewport
- **Real-time perspective projection** — custom implementation of spherical camera coordinates
- **Orbit camera** — click and drag to rotate freely around the scene
- **Scroll to zoom** — mouse wheel controls camera distance
- **3D editing modes:**
  - **Begin (B)** — click on the 3D floor grid to place new polyline points
  - **Delete (D)** — click a 3D vertex to remove it
  - **Move (M)** — click and drag a vertex to reposition it in 3D space
- **Z depth slider** — always visible at the bottom; select any point and drag to push/pull its depth
- **Axis projection shadows** — dashed lines on the floor and walls show where each polyline falls on each plane
- **Drop lines** — each vertex drops a dashed line to the floor, making depth easy to read
- **Orientation gizmo** — small XYZ cube in the top-right corner rotates with the camera
- **Colour-coded vertices** — same cyan→lime→orange scale as 2D

### Panel Management
- **Side-by-side split view** — 2D canvas and 3D viewport displayed simultaneously
- **Horizontal resize** — drag the ◀▶ divider bar between panels to make either side wider
- **Vertical resize** — drag the ↕ grip handle to make the 3D canvas taller or shorter
- **Live sync** — every edit in either panel immediately updates the other

### General UI
- **Windows 11 Paint–inspired interface** — ribbon toolbar, menu bar, title bar, status bar
- **40-colour palette** — left-click to set foreground, right-click for background
- **Undo/Redo** — 50-level history stack, works across both 2D and 3D edits
- **Save** as JSON (includes full polyline data + canvas image)
- **Print** current canvas
- **Built-in help guide** — 3-tab modal with 2D, 3D, and shortcut references

---

## 🏗 How It Works — Architecture

```
index.html          ← UI structure (ribbon, panels, modals)
style.css           ← All styling (Win11 theme, dark 3D panel, resize handles)
script.js           ← All logic (2D drawing, 3D engine, event handling, sync)
```

### Shared Data Model

Everything lives in one shared array:

```javascript
allPolylines = [
  {
    points: [ { x: 120, y: 80, z: 0 }, { x: 300, y: 200, z: 150 }, ... ],
    color:  '#ed1c24',
    width:  2
  },
  ...
]
```

- `x`, `y` — position on the 2D canvas (set by clicking)
- `z` — depth in 3D space (set by the Z slider; default 0 = flat)

Both the 2D canvas renderer and the 3D engine read from and write to this same array. Any change immediately calls `syncBoth()` which redraws the 2D canvas and re-renders the 3D viewport.

### Undo / Redo

Implemented as a classic **command stack** with deep-copy snapshots:

```javascript
function saveState() {
  history.push({
    polys: JSON.parse(JSON.stringify(allPolylines)),  // deep copy
    img:   ctx.getImageData(0, 0, canvas.width, canvas.height)
  });
  if (history.length > 50) history.shift();  // cap at 50
  redoStack = [];
}
```

Every destructive action (add point, delete, move, depth change) saves a snapshot before modifying the data.

---

## 📐 Coordinate System

A key design decision was mapping the 2D canvas coordinate system onto 3D world space consistently:

| Axis | 2D Canvas | 3D World | Colour |
|------|-----------|----------|--------|
| **X** | Horizontal (left → right) | Horizontal | 🔴 Red |
| **Y** | Vertical (top → bottom) | Vertical | 🔵 Blue |
| **Z** | — (does not exist in 2D) | **Depth** (in/out of screen) | 🟢 Green |

The Z coordinate is the *only* dimension that cannot be set by drawing on the 2D canvas — it is always set via the Z depth slider or the `🎲 Randomize Z` button. This is made clear to the user through axis labels on both panels.

---

## 🔭 3D Rendering Engine

The 3D viewport is built entirely from scratch using a **perspective projection** pipeline. No WebGL, no Three.js — just trigonometry.

### Camera Model

The camera uses **spherical coordinates** centred on a `lookAt` point:

```javascript
this.theta = Math.PI * 0.35;  // azimuth (horizontal rotation)
this.phi   = Math.PI * 0.22;  // elevation (vertical tilt)
this.dist  = 1100;             // distance from scene centre
```

Dragging the 3D canvas rotates `theta` and `phi`. Scrolling changes `dist`.

### Projection Pipeline

For each 3D point `(wx, wy, wz)`:

1. **Translate** to camera space: subtract `lookAt`
2. **Rotate** around world-Y axis by `−theta` (azimuth)
3. **Rotate** around camera-X axis by `−phi` (elevation)
4. **Perspective divide**: `sx = width/2 + (fx / fz) * fov`
5. Return screen coordinates `(sx, sy)` and `depth` for sorting

```javascript
project(wx, wy, wz) {
  // Step 1 — translate
  const x3 = wx - this.lookAt.x;
  // ... azimuth rotation (cT, sT) ...
  // ... elevation rotation (cP, sP) ...
  // Step 4 — perspective divide
  return {
    sx: W/2 + (fx / fz) * fov,
    sy: H/2 - (fy / fz) * fov,
    depth: fz
  };
}
```

### Depth Sorting

All render items (shadows, segments, vertices) are collected into a single array and **sorted back-to-front** before drawing. This is a basic **painter's algorithm** implementation:

```javascript
items.sort((a, b) => b.avgD - a.avgD);
```

### Unprojection (3D Editing)

To place points by clicking on the floor in Begin mode, the screen click must be **unprojected** back into world space. This involves solving the inverse of the projection equations for the floor plane (Z_world = 0):

```
(my − H/2) · (rz · cP + dist) = rz · sP · fov
→ rz = (my − H/2) · dist / (sP · fov − (my − H/2) · cP)
```

Getting this math right was one of the key technical challenges (described below).

---

## 📁 File Structure

```
polyline-editor/
├── index.html      # Application shell — all UI, ribbon, modals, 3D panel
├── style.css       # Styling — Win11 theme, dark 3D panel, resize handles
├── script.js       # All logic (~760 lines) — 2D drawing, 3D engine, sync
└── README.md       # This file
```

No `node_modules`, no `package.json`, no build step. Open `index.html` in a browser and it runs.

---

## 🚀 Running the Project

### Option 1 — Open directly (simplest)
```bash
# Just open index.html in any modern browser
open index.html         # macOS
start index.html        # Windows
xdg-open index.html     # Linux
```

### Option 2 — Local server (avoids any CORS issues)
```bash
# Using Python
python -m http.server 8080

# Using Node
npx serve .

# Then open: http://localhost:8080
```

### Browser compatibility
Works in any modern browser that supports the HTML5 Canvas API:

| Browser | Supported |
|---------|-----------|
| Chrome 90+ | ✅ |
| Firefox 88+ | ✅ |
| Edge 90+ | ✅ |
| Safari 14+ | ✅ |

---

## ⌨ Keyboard Shortcuts

### 2D Canvas

| Key | Action |
|-----|--------|
| `B` | Begin polyline (click to place points, double-click to finish) |
| `M` | Move point mode |
| `D` | Delete point mode |
| `I` | Insert point on a segment |
| `P` | Pencil |
| `L` | Line |
| `E` | Eraser |
| `F` | Flood fill |
| `T` | Text tool |
| `K` | Eyedropper |
| `+` / `-` | Zoom in / out |
| `Esc` | Cancel, return to Pencil |

### 3D Viewport

| Key | Action |
|-----|--------|
| `B` | Begin mode — click floor to place points |
| `D` | Delete mode — click a vertex to remove it |
| `M` | Move mode — drag a vertex to reposition it |
| `↑` / `↓` | Nudge selected point Z depth ±1 |
| `Shift + ↑/↓` | Nudge selected point Z depth ±10 |
| `Esc` | Return to Idle (orbit) mode |

### Global

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+S` | Save as JSON |
| `Ctrl+N` | New canvas |
| `Ctrl+3` | Toggle 3D view |
| `Ctrl+C` | Copy selection |
| `Ctrl+V` | Paste |
| `F1` | Open help guide |

---

## 🧗 Challenges & Confusions Faced

These are real problems encountered during development — documenting them here reflects the iterative, problem-solving nature of the project.

---

### 1. 🧮 Unprojection Math (Placing Points in 3D)

**The problem:** When the user clicks on the floor grid in Begin mode, we need to convert a 2D screen click `(mx, my)` into a 3D world coordinate. The forward projection is straightforward. The *inverse* — given a screen pixel, find which world point maps to it on the floor plane — is significantly harder.

**The confusion:** The initial attempt used `dy = H/2 - my` (signed distance from screen centre to click). This introduced a sign error. When clicking in the lower half of the screen (where the floor actually appears), the formula produced coordinates on the *wrong side* of the scene — points landed far from where you clicked.

**The fix:** Rederiving the formula properly from the projection equations, using `screenDY = my - H/2` consistently:

```javascript
const screenDY = my - H/2;
const denom    = sP * fov - screenDY * cP;
const rz       = (screenDY * this.dist) / denom;
```

**Lesson:** Sign conventions in 3D math are fragile. A single sign flip produces results that *look plausible* but are subtly wrong — which makes debugging harder than an outright crash.

---

### 2. 🖱️ Move Mode — Continuous Dragging Problem

**The problem:** In Move mode, as soon as the user moved the mouse *anywhere* in the 3D viewport, the last selected point would follow the cursor — even without clicking on it first.

**The cause:** The `dragPt` flag was set on `mousedown` and the `onMM` handler moved the point on any mouse movement while `dragPt` was set. Because `dragPt` was never properly cleared when releasing the mouse outside the canvas, it persisted across mouse events.

**The fix:** 
1. Added an explicit `document.addEventListener('mouseup')` safety net (not just the canvas) to always clear `dragPt` and `dragging`.
2. Made move only trigger when the user explicitly clicks *on* a vertex — if the click misses all vertices, it starts an orbit drag instead.

---

### 3. 📐 Axis Naming Inconsistency

**The problem:** The 2D canvas labelled the depth dimension as "Y" (depth), while the 3D panel labelled the same dimension as "Y (depth)" mapped to the 3D engine's internal `pt.z` coordinate. Users (and the developer) kept confusing which axis was which.

**The confusion:** The 3D engine internally uses `pt.z` as the depth coordinate (because it maps to "the third dimension beyond x and y"), but the 2D canvas axes already used X and Y for horizontal/vertical. Calling the depth "Y" in the 3D panel — while Y already meant "vertical" in the 2D panel — caused constant confusion.

**The fix:** Standardised the naming so that both panels agree:
- **X** = horizontal (red)
- **Y** = vertical (blue)  
- **Z** = depth / extrusion (green) ← the slider edits this

---

### 4. 🎨 Dark Colours Invisible on Dark 3D Background

**The problem:** When a user drew a polyline in black (`#000000`) or any very dark colour on the 2D canvas, the same colour would be used to draw the segment in the 3D viewport — which has a dark navy background. Black lines on a dark background are invisible.

**The fix:** A `brightColor(hex)` helper function checks the *luminance* of any colour before rendering it in 3D. If the luminance is below a threshold (too dark), it automatically boosts the colour to a visible brightness:

```javascript
function brightColor(hex) {
  const luma = 0.299*r + 0.587*g + 0.114*b;
  if (luma < 70) {
    const scale = 190 / Math.max(r, g, b);
    return `rgb(${r*scale+65}, ${g*scale+65}, ${b*scale+65})`;
  }
  return hex;
}
```

---

### 5. 📦 Canvas Pixel Scaling vs CSS Display Size

**The problem:** When the user resized the 3D panel using the horizontal splitter, the CSS display size of the `<canvas>` element changed — but the internal pixel dimensions (`canvas.width` / `canvas.height`) did not automatically update. This caused mouse-click coordinates to be offset: you'd click on a vertex visually, but the hit-test would calculate you clicked somewhere else.

**The fix:** A `evtPos(e)` helper divides the raw CSS mouse coordinates by the ratio between canvas internal size and CSS display size:

```javascript
evtPos(e) {
  const r = this.cvs.getBoundingClientRect();
  const scaleX = this.cvs.width  / r.width;
  const scaleY = this.cvs.height / r.height;
  return { mx: (e.clientX - r.left) * scaleX,
           my: (e.clientY - r.top ) * scaleY };
}
```

---

### 6. 🪟 Unwanted Info Popup on Mode Switch

**The problem:** Entering Move or Begin mode in the 3D viewport triggered a large info panel to pop up over the canvas, obscuring the scene and making it impossible to navigate back to the 3D view.

**The fix:** The popup (`pointEditor` div) was permanently removed from the display flow. The Z depth controls were replaced with an always-visible slim bar at the bottom of the panel. The info panel is gone entirely — the toolbar mode buttons and the status text in the mode bar provide all the context needed.

---

### 7. 🔢 Depth-Sorting Artefacts

**The problem:** Early versions rendered all 3D segments and vertices in the order they were stored in `allPolylines`. When two polylines crossed each other in depth, the one drawn later would always appear on top — even if it was geometrically behind the other.

**The fix:** Implemented a basic **painter's algorithm** — collect all render items (shadows, segments, vertices) into a flat array, compute the average camera-space depth of each item, sort the array back-to-front, then draw:

```javascript
items.sort((a, b) => b.avgD - a.avgD);
items.forEach(item => { /* draw */ });
```

---

## 🎓 Concepts Applied from HCI-CG

| Concept | Where Applied |
|---------|--------------|
| **2D Vector Graphics** | Polyline data structure, Canvas path rendering |
| **Perspective Projection** | Custom 3D engine (`project()` function) |
| **Inverse Projection (Unprojection)** | Placing points on the 3D floor (`unprojectFloor()`) |
| **Painter's Algorithm** | Depth-sorting render items before drawing |
| **Affine Transformations** | Rotation matrices for azimuth and elevation |
| **Direct Manipulation** | Drag-to-move vertices, drag-to-resize panels |
| **Immediate Feedback** | Live sync between 2D/3D, colour-coded depth dots |
| **Undo / Redo Stack** | 50-level history with deep-copy snapshots |
| **Hit Testing** | Vertex and segment picking with screen-space distance |
| **Flood Fill Algorithm** | BFS-based pixel fill on the 2D canvas |
| **Color Models** | Hex, RGB, luminance calculation for contrast |
| **Discoverability (HCI)** | Ribbon toolbar, tooltips, status bar, in-app help guide |
| **Consistency (HCI)** | Unified axis names across 2D and 3D panels |
| **Affordance (HCI)** | Resize handles styled as grips, mode buttons with icons |
| **Error Prevention (HCI)** | Undo stack, confirmation dialogs before destructive actions |

---

## 📸 Screenshots

> *(Add your own screenshots here — the editor looks best when a multi-point 3D polyline with mixed Z depths is visible in the right panel)*

**Suggested screenshots to include:**
1. Full app with 3D panel open and a polyline visible in both views
2. The 3D panel orbited to a dramatic angle showing depth shadows
3. A polyline with Randomize Z applied, showing the colour-coded depth dots on the 2D canvas

---

## 👤 Author

**Course:** HCI-CG (Human–Computer Interaction & Computer Graphics)  
**Degree:** Bachelor of Science in Computer Science  
**Project:** Polyline Editor 3D — v4.0  

---

## 📄 License

This project was created for academic purposes. Feel free to study, fork, or reference the code. Attribution appreciated.

---

*Built with , using nothing but HTML, CSS, and vanilla JavaScript.*

