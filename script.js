// const canvas = document.getElementById('editorCanvas');
// const ctx = canvas.getContext('2d');
// const status = document.getElementById('status');

// // Dynamic Canvas Sizing
// function resize() {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight - document.getElementById('controls').offsetHeight;
// }
// window.addEventListener('resize', resize);
// resize();

// let allPolylines = []; 
// let currentPolyline = null;
// let mode = 'IDLE'; 
// let selectedPoint = null;
// // --- NEW STATE MANAGEMENT ---
// let history = []; 
// let redoStack = [];

// // --- CRITICAL FIX: Precise Mouse Coordinates ---
// function getMousePos(e) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//         x: e.clientX - rect.left,
//         y: e.clientY - rect.top
//     };
// }

// const getDist = (p1, p2) => Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);

// function findClosestVertex(mousePos) {
//     let closest = null;
//     let minDist = 12; // 12px "hit box" around the point

//     allPolylines.forEach((poly, polyIdx) => {
//         poly.forEach((point, ptIdx) => {
//             let d = getDist(mousePos, point);
//             if (d < minDist) {
//                 minDist = d;
//                 closest = { polyIdx, ptIdx };
//             }
//         });
//     });
//     return closest;
// }

// // --- RENDERING ---
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
    
//     allPolylines.forEach(poly => {
//         if (poly.length < 1) return;
        
//         ctx.beginPath();
//         ctx.moveTo(poly[0].x, poly[0].y);
//         poly.forEach(pt => ctx.lineTo(pt.x, pt.y));
//         ctx.strokeStyle = '#2ecc71';
//         ctx.lineWidth = 2;
//         ctx.stroke();
        
//         poly.forEach(pt => {
//             ctx.fillStyle = '#e74c3c';
//             ctx.beginPath();
//             ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2); // Circles are easier to "hit" visually
//             ctx.fill();
//         });
//     });
// }

// // --- ACTIONS ---
// function saveToFile() {
//     const data = JSON.stringify(allPolylines, null, 2);
//     const blob = new Blob([data], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = 'my_drawing.json';
//     link.click();
//     status.innerText = "Status: File Saved!";
// }

// function quitProgram() {
//     if(confirm("Are you sure you want to quit? Unsaved progress will be lost.")) {
//         allPolylines = [];
//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         status.innerText = "Status: Program Reset / Exited";
//         mode = 'IDLE';
//     }
// }

// function saveState() {
//     // We must use JSON.parse(JSON.stringify()) to create a "Deep Copy"
//     // otherwise, the history will just point to the same array in memory.
//     history.push(JSON.parse(JSON.stringify(allPolylines)));
//     if (history.length > 50) history.shift(); // Keep memory clean
//     redoStack = []; // Clear redo stack whenever a new action is taken
// }

// function undo() {
//     if (history.length > 0) {
//         redoStack.push(JSON.parse(JSON.stringify(allPolylines)));
//         allPolylines = history.pop();
//         draw();
//         status.innerText = "Status: Undone";
//     }
// }

// function redo() {
//     if (redoStack.length > 0) {
//         history.push(JSON.parse(JSON.stringify(allPolylines)));
//         allPolylines = redoStack.pop();
//         draw();
//         status.innerText = "Status: Redone";
//     }
// }

// // --- EVENT LISTENERS ---
// window.addEventListener('keydown', (e) => {
//     const key = e.key.toLowerCase();
//     if (key === 'b') { mode = 'DRAWING'; currentPolyline = []; allPolylines.push(currentPolyline); status.innerText = "Status: Drawing Mode"; }
//     if (key === 'd') { mode = 'DELETING'; status.innerText = "Status: Delete Mode"; }
//     if (key === 'm') { mode = 'MOVING'; status.innerText = "Status: Move Mode"; }
//     if (key === 'r') { draw(); }
//     if (key === 's') { saveToFile(); }
//     if (key === 'q') { quitProgram(); }

//     // Undo: Ctrl + Z
//     if (e.ctrlKey && e.key === 'z') {
//         e.preventDefault();
//         undo();
//     }
//     // Redo: Ctrl + Y or Ctrl + Shift + Z
//     if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
//         e.preventDefault();
//         redo();
//     }

//     if (key === 'i') { 
//         mode = 'INSERTING'; 
//         status.innerText = "Status: Insert Mode (Click a line to add a point)"; 
//     }
// });

// document.getElementById('undoBtn').onclick = undo;
// document.getElementById('redoBtn').onclick = redo;
// document.getElementById('saveBtn').onclick = saveToFile;
// document.getElementById('quitBtn').onclick = quitProgram;

// canvas.addEventListener('mousedown', (e) => {
//     const mousePos = getMousePos(e); // Using the new precise function

//     if (mode === 'DRAWING' && currentPolyline) {
//         currentPolyline.push(mousePos);
//     } 
//     else if (mode === 'DELETING') {
//         const hit = findClosestVertex(mousePos);
//         if (hit) allPolylines[hit.polyIdx].splice(hit.ptIdx, 1);
//     }
//     else if (mode === 'MOVING') {
//         selectedPoint = findClosestVertex(mousePos);
//     }
//     else if (mode === 'INSERTING') {
//         const segmentHit = findClosestSegment(mousePos);
//         if (segmentHit) {
//             // Use splice to insert the point between the two existing vertices
//             allPolylines[segmentHit.polyIdx].splice(segmentHit.insertAfter + 1, 0, mousePos);
//         }
//     }
//     // For any action that modifies data, saveState() first!
//     if (mode === 'DRAWING' || mode === 'DELETING' || mode === 'INSERTING') {
//         saveState();
//     }
//     // MOVING is special: save the state ONLY when the mouse goes DOWN 
//     // before the drag starts.
//     if (mode === 'MOVING') {
//         const hit = findClosestVertex(mousePos);
//         if (hit) {
//             saveState();
//             selectedPoint = hit;
//         }
//     }
    
//     draw();
// });

// canvas.addEventListener('mousemove', (e) => {
//     if (mode === 'MOVING' && selectedPoint) {
//         allPolylines[selectedPoint.polyIdx][selectedPoint.ptIdx] = getMousePos(e);
//         draw();
//     }
// });

// canvas.addEventListener('mouseup', () => { selectedPoint = null; });


// // --- NEW UTILITY: Distance from Point to Line Segment ---
// function distToSegment(p, v, w) {
//     const l2 = getDist(v, w) ** 2;
//     if (l2 === 0) return getDist(p, v);
//     let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
//     t = Math.max(0, Math.min(1, t));
//     return getDist(p, { 
//         x: v.x + t * (w.x - v.x), 
//         y: v.y + t * (w.y - v.y) 
//     });
// }

// function findClosestSegment(mousePos) {
//     let closest = null;
//     let minDist = 10; // Threshold for "hitting" the line

//     allPolylines.forEach((poly, polyIdx) => {
//         for (let i = 0; i < poly.length - 1; i++) {
//             let d = distToSegment(mousePos, poly[i], poly[i+1]);
//             if (d < minDist) {
//                 minDist = d;
//                 closest = { polyIdx, insertAfter: i };
//             }
//         }
//     });
//     return closest;
// }

















// ═══════════════════════════════════════════════════════════════
//  POLYLINE EDITOR 3D  —  v4.0
//  Resizable panels · Full 3D editing (B/D/M) · Live bidirectional sync
// ═══════════════════════════════════════════════════════════════

const canvas = document.getElementById('mainCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 900;
canvas.height = 600;

// ── SHARED STATE ──────────────────────────────────────────────
let allPolylines    = [];   // { points:[{x,y,z}], color, width }
let currentPolyline = null;
let history   = [];
let redoStack = [];

// ── 2D STATE ──────────────────────────────────────────────────
let mode          = 'PENCIL';
let fgColor       = '#000000';
let bgColor       = '#ffffff';
let lineW         = 1;
let brushType     = 'normal';
let zoom          = 1;
let showRulers    = true;
let showGrid      = false;
let isMouseDown   = false;
let selectedPoint = null;
let textPos       = null;
let shapeStart    = null;
let snapshot      = null;
let show3D        = false;
let selStart      = null;   // for SELECT rubber-band
let selRect       = null;   // {x,y,w,h} current selection
let clipboard     = null;   // ImageData for paste

// ── COLOR PALETTE ─────────────────────────────────────────────
const PALETTE = [
  '#000000','#7f7f7f','#880015','#ed1c24','#ff7f27','#fff200',
  '#22b14c','#00a2e8','#3f48cc','#a349a4',
  '#ffffff','#c3c3c3','#b97a57','#ffaec9','#ffc90e','#efe4b0',
  '#b5e61d','#99d9ea','#7092be','#c8bfe7',
  '#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff',
  '#800000','#008000','#000080','#808000','#800080','#008080',
  '#ff8080','#80ff80','#8080ff','#ff80ff','#80ffff','#ffff80',
  '#404040','#a0a0a0','#804040','#408040','#404080','#804080'
];
const pg = document.getElementById('paletteGrid');
PALETTE.forEach(c => {
  const d = document.createElement('div');
  d.className='pc'; d.style.background=c; d.title=c;
  d.addEventListener('click',e=>{if(e.shiftKey){bgColor=c;document.getElementById('bgSwatch').style.background=c;}else{fgColor=c;document.getElementById('fgSwatch').style.background=c;}});
  d.addEventListener('contextmenu',e=>{e.preventDefault();bgColor=c;document.getElementById('bgSwatch').style.background=c;});
  pg.appendChild(d);
});
document.getElementById('fgSwatch').style.background=fgColor;
document.getElementById('bgSwatch').style.background=bgColor;

// ── HISTORY ───────────────────────────────────────────────────
function saveState(){history.push({polys:JSON.parse(JSON.stringify(allPolylines)),img:ctx.getImageData(0,0,canvas.width,canvas.height)});if(history.length>50)history.shift();redoStack=[];}
function undo(){if(!history.length)return;redoStack.push({polys:JSON.parse(JSON.stringify(allPolylines)),img:ctx.getImageData(0,0,canvas.width,canvas.height)});const s=history.pop();allPolylines=s.polys;ctx.putImageData(s.img,0,0);syncBoth();updateStatus('Undone');}
function redo(){if(!redoStack.length)return;history.push({polys:JSON.parse(JSON.stringify(allPolylines)),img:ctx.getImageData(0,0,canvas.width,canvas.height)});const s=redoStack.pop();allPolylines=s.polys;ctx.putImageData(s.img,0,0);syncBoth();updateStatus('Redone');}

// ── SYNC BOTH VIEWS ───────────────────────────────────────────
function syncBoth(){redrawAll();if(show3D&&view3d)view3d.render();}
function syncAfterEdit(){redrawAll();if(show3D&&view3d){view3d.render();if(view3d.sel)view3d.refreshEditor();}updateStatus2D();}

// ── DEPTH COLOR ───────────────────────────────────────────────
function depthColor(z){
  const t=Math.max(0,Math.min(1,(z+400)/800));
  let r,g,b;
  if(t<0.5){const u=t*2;r=Math.round(20+60*u);g=Math.round(200+55*u);b=Math.round(255-180*u);}
  else{const u=(t-0.5)*2;r=Math.round(80+175*u);g=Math.round(255-80*u);b=Math.round(75-75*u);}
  return{r,g,b,css:`rgb(${r},${g},${b})`};
}
function brightColor(hex){
  if(!hex||hex.length<4)return'#00ddff';
  const r=parseInt(hex.slice(1,3),16)||0,g=parseInt(hex.slice(3,5),16)||0,b=parseInt(hex.slice(5,7),16)||0;
  const luma=0.299*r+0.587*g+0.114*b;
  if(luma<70){const max=Math.max(r,g,b)||1,s=190/max;return`rgb(${Math.min(255,r*s+65)},${Math.min(255,g*s+65)},${Math.min(255,b*s+65)})`;}
  return hex;
}

// ── TOOL MANAGEMENT ───────────────────────────────────────────
function setActiveTool(m){
  mode=m;if(m!=='DRAWING')currentPolyline=null;
  document.querySelectorAll('.rt').forEach(b=>b.classList.remove('active'));
  const map={PENCIL:'t-pencil',FILL:'t-fill',TEXT:'t-text',ERASING:'t-eraser',PICKING:'t-pick',ZOOM:'t-zoom',LINE:'t-line',RECT:'t-rect',ELLIPSE:'t-ellipse',DRAWING:'t-polyline',MOVING:'t-move',DELETING:'t-delete',INSERTING:'t-insert'};
  const el=document.getElementById(map[m]);if(el)el.classList.add('active');
  const curs={PENCIL:'crosshair',FILL:'crosshair',TEXT:'text',ERASING:'cell',PICKING:'crosshair',ZOOM:'zoom-in',DRAWING:'crosshair',LINE:'crosshair',RECT:'crosshair',ELLIPSE:'crosshair',TRIANGLE:'crosshair',ARROW:'crosshair',STAR:'crosshair',DIAMOND:'crosshair',HEART:'crosshair',HEXAGON:'crosshair',MOVING:'move',DELETING:'default',INSERTING:'copy'};
  canvas.style.cursor=curs[m]||'crosshair';updateStatus(m);
}
function setBrush(t){brushType=t;document.querySelectorAll('[id^="b-"]').forEach(b=>b.classList.remove('active'));const bm={normal:'b-norm',soft:'b-soft',calligraphy:'b-calli',spray:'b-spray'};const el=document.getElementById(bm[t]);if(el)el.classList.add('active');}
function selectSize(el,w){document.querySelectorAll('.szRow').forEach(r=>r.classList.remove('active'));el.classList.add('active');lineW=w;}

// ── GEOMETRY HELPERS ──────────────────────────────────────────
function getPos(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom};}
const dist2=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function findVertex(mp){let best=null,bestD=12/zoom;allPolylines.forEach((pl,pi)=>{pl.points.forEach((pt,ti)=>{const d=dist2(mp,pt);if(d<bestD){bestD=d;best={pi,ti};}});});return best;}
function findSegment(mp){let best=null,bestD=10/zoom;allPolylines.forEach((pl,pi)=>{for(let i=0;i<pl.points.length-1;i++){const d=ptSegDist(mp,pl.points[i],pl.points[i+1]);if(d<bestD){bestD=d;best={pi,after:i};}}});return best;}
function ptSegDist(p,v,w){const l2=dist2(v,w)**2;if(!l2)return dist2(p,v);let t=((p.x-v.x)*(w.x-v.x)+(p.y-v.y)*(w.y-v.y))/l2;t=Math.max(0,Math.min(1,t));return dist2(p,{x:v.x+t*(w.x-v.x),y:v.y+t*(w.y-v.y)});}

// ── 2D RENDERING ─────────────────────────────────────────────
function redrawPolylines(){
  const selPi=(show3D&&view3d&&view3d.sel)?view3d.sel.pi:-1;
  const selTi=(show3D&&view3d&&view3d.sel)?view3d.sel.ti:-1;
  allPolylines.forEach((pl,pi)=>drawPolyline2D(pl,pi,pi===selPi,selTi));
}
function drawPolyline2D(pl,pi,isSelected,selTi){
  if(!pl.points||pl.points.length<1)return;
  ctx.save();
  ctx.beginPath();ctx.moveTo(pl.points[0].x,pl.points[0].y);pl.points.forEach(pt=>ctx.lineTo(pt.x,pt.y));
  if(isSelected){ctx.strokeStyle='rgba(0,150,255,0.22)';ctx.lineWidth=(pl.width||1)+12;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();ctx.beginPath();ctx.moveTo(pl.points[0].x,pl.points[0].y);pl.points.forEach(pt=>ctx.lineTo(pt.x,pt.y));ctx.strokeStyle='#1488f0';ctx.lineWidth=(pl.width||1)+2.5;}
  else{ctx.strokeStyle=pl.color;ctx.lineWidth=pl.width||1;}
  ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();
  pl.points.forEach((pt,ti)=>{
    const{css}=depthColor(pt.z||0);const isSelPt=isSelected&&ti===selTi;const r2=isSelPt?8:5;
    if(isSelPt){ctx.beginPath();ctx.arc(pt.x,pt.y,r2+6,0,Math.PI*2);ctx.fillStyle='rgba(255,220,0,0.2)';ctx.fill();}
    ctx.beginPath();ctx.arc(pt.x,pt.y,r2,0,Math.PI*2);
    ctx.fillStyle=isSelPt?'#ffdd00':css;ctx.strokeStyle=isSelPt?'#ffffff':'rgba(255,255,255,0.9)';ctx.lineWidth=isSelPt?2:1.5;ctx.fill();ctx.stroke();
  });
  ctx.restore();
}
function redrawAll(){
  ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
  if(showGrid)drawGrid();
  draw2DAxisOverlay();
  redrawPolylines();
}
function draw2DAxisOverlay(){
  ctx.save();const W=canvas.width,H=canvas.height,ox=40,oy=H-40;
  // X axis (red, horizontal)
  ctx.strokeStyle='rgba(220,50,50,0.5)';ctx.lineWidth=1.5;ctx.setLineDash([7,5]);
  ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(W-16,oy);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(220,50,50,0.7)';ctx.beginPath();ctx.moveTo(W-8,oy);ctx.lineTo(W-22,oy-5);ctx.lineTo(W-22,oy+5);ctx.closePath();ctx.fill();
  ctx.font='bold 12px Segoe UI,sans-serif';ctx.fillStyle='rgba(200,40,40,0.8)';ctx.fillText('X  →',W-42,oy-9);
  // Y axis (blue, vertical)
  ctx.strokeStyle='rgba(30,90,220,0.5)';ctx.lineWidth=1.5;ctx.setLineDash([7,5]);
  ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox,12);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(30,90,220,0.7)';ctx.beginPath();ctx.moveTo(ox,6);ctx.lineTo(ox-5,20);ctx.lineTo(ox+5,20);ctx.closePath();ctx.fill();
  ctx.font='bold 12px Segoe UI,sans-serif';ctx.fillStyle='rgba(20,80,210,0.8)';
  ctx.save();ctx.translate(ox-15,oy-40);ctx.rotate(-Math.PI/2);ctx.fillText('Y  ↑',0,0);ctx.restore();
  // Z = depth label (green, bottom-right) — same name as 3D panel
  ctx.font='bold 11px Segoe UI,sans-serif';ctx.fillStyle='rgba(10,180,70,0.8)';
  ctx.fillText('Z = depth  (edit in 3D view with slider)',W-260,H-11);
  // Origin dot
  ctx.beginPath();ctx.arc(ox,oy,5,0,Math.PI*2);ctx.fillStyle='rgba(80,80,80,0.45)';ctx.fill();
  ctx.font='9px Segoe UI,sans-serif';ctx.fillStyle='rgba(80,80,80,0.65)';ctx.fillText('(0,0)',ox+8,oy+13);
  ctx.restore();
}
function drawGrid(){ctx.save();ctx.strokeStyle='#ddd';ctx.lineWidth=.5;for(let x=0;x<canvas.width;x+=20){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}for(let y=0;y<canvas.height;y+=20){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}ctx.restore();}

// ── SHAPES ────────────────────────────────────────────────────
function drawShape(s,e){
  const dx=e.x-s.x,dy=e.y-s.y;ctx.strokeStyle=fgColor;ctx.lineWidth=lineW;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();
  switch(mode){
    case 'LINE':ctx.moveTo(s.x,s.y);ctx.lineTo(e.x,e.y);break;
    case 'RECT':ctx.rect(s.x,s.y,dx,dy);break;
    case 'ELLIPSE':ctx.ellipse(s.x+dx/2,s.y+dy/2,Math.abs(dx/2),Math.abs(dy/2),0,0,Math.PI*2);break;
    case 'TRIANGLE':{const cx=(s.x+e.x)/2;ctx.moveTo(cx,s.y);ctx.lineTo(e.x,e.y);ctx.lineTo(s.x,e.y);ctx.closePath();break;}
    case 'ARROW':{const ang=Math.atan2(dy,dx),hw=12;ctx.moveTo(s.x,s.y);ctx.lineTo(e.x,e.y);ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-hw*Math.cos(ang-.5),e.y-hw*Math.sin(ang-.5));ctx.moveTo(e.x,e.y);ctx.lineTo(e.x-hw*Math.cos(ang+.5),e.y-hw*Math.sin(ang+.5));break;}
    case 'STAR':{const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2,or=Math.max(Math.abs(dx),Math.abs(dy))/2,ir=or*.4;for(let i=0;i<10;i++){const a=Math.PI/5*i-Math.PI/2,r=i%2?ir:or;i?ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();break;}
    case 'DIAMOND':{const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2;ctx.moveTo(cx,s.y);ctx.lineTo(e.x,cy);ctx.lineTo(cx,e.y);ctx.lineTo(s.x,cy);ctx.closePath();break;}
    case 'HEART':{const cx=(s.x+e.x)/2,w2=Math.abs(dx)/2,h2=Math.abs(dy)/2;ctx.moveTo(cx,s.y+h2*.35);ctx.bezierCurveTo(cx,s.y-h2*.4,e.x+w2*.1,s.y-h2*.4,e.x,s.y+h2*.1);ctx.bezierCurveTo(e.x,s.y+h2*.55,cx,e.y-h2*.1,cx,e.y);ctx.bezierCurveTo(cx,e.y-h2*.1,s.x,s.y+h2*.55,s.x,s.y+h2*.1);ctx.bezierCurveTo(s.x-w2*.1,s.y-h2*.4,cx,s.y-h2*.4,cx,s.y+h2*.35);break;}
    case 'HEXAGON':{const cx=(s.x+e.x)/2,cy=(s.y+e.y)/2,r=Math.min(Math.abs(dx),Math.abs(dy))/2;for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;i?ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a)):ctx.moveTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();break;}
  }
  ctx.stroke();
}

// ── RULERS ────────────────────────────────────────────────────
function drawRulers(){
  const rh=document.getElementById('rulerH'),rv=document.getElementById('rulerV'),sc=document.getElementById('canvasScroll');
  rh.width=sc.clientWidth;rv.height=sc.clientHeight;
  const ch=rh.getContext('2d'),cv=rv.getContext('2d');
  ch.fillStyle='#f3f3f3';ch.fillRect(0,0,rh.width,16);cv.fillStyle='#f3f3f3';cv.fillRect(0,0,16,rv.height);
  ch.strokeStyle=cv.strokeStyle='#999';ch.lineWidth=cv.lineWidth=.5;ch.fillStyle=cv.fillStyle='#555';ch.font=cv.font='8px Segoe UI,sans-serif';
  for(let x=0;x<rh.width;x+=20){ch.beginPath();ch.moveTo(20+x,10);ch.lineTo(20+x,16);ch.stroke();if(x%100===0)ch.fillText(Math.round(x/zoom),22+x,9);}
  for(let y=0;y<rv.height;y+=20){cv.beginPath();cv.moveTo(10,20+y);cv.lineTo(16,20+y);cv.stroke();if(y%100===0){cv.save();cv.translate(9,22+y);cv.rotate(-Math.PI/2);cv.fillText(Math.round(y/zoom),0,0);cv.restore();}}
}
function setZoom(v){zoom=Math.max(.1,Math.min(8,v/100));const outer=document.getElementById('canvasOuter');outer.style.transform=`scale(${zoom})`;outer.style.transformOrigin='top left';outer.style.width=canvas.width+'px';outer.style.height=canvas.height+'px';document.getElementById('zPct').textContent=Math.round(zoom*100)+'%';document.getElementById('zSlider').value=Math.round(zoom*100);if(showRulers)drawRulers();}
function zoomIn(){setZoom(Math.min(800,Math.round(zoom*100)+25));}function zoomOut(){setZoom(Math.max(10,Math.round(zoom*100)-25));}function resetZoom(){setZoom(100);}
function toggleRulers(){showRulers=!showRulers;document.getElementById('mrRuler').textContent=(showRulers?'✓ ':' ')+'Rulers';['rulerH','rulerV','rulerCorner'].forEach(id=>document.getElementById(id).style.display=showRulers?'':'none');}
function toggleGrid(){showGrid=!showGrid;document.getElementById('mrGrid').textContent=(showGrid?'✓':' ')+'Gridlines';redrawAll();}

// ── CANVAS EVENTS ─────────────────────────────────────────────
function pickColor(mp){const px=ctx.getImageData(Math.round(mp.x),Math.round(mp.y),1,1).data;fgColor=`rgb(${px[0]},${px[1]},${px[2]})`;document.getElementById('fgSwatch').style.background=fgColor;}
function floodFill(sx,sy,hex){
  const id=ctx.getImageData(0,0,canvas.width,canvas.height),d=id.data,w=canvas.width;
  const idx=(x,y)=>(y*w+x)*4,si=idx(sx,sy),tR=d[si],tG=d[si+1],tB=d[si+2],tA=d[si+3];
  const fill=hexToRgb(hex);if(!fill)return;if(tR===fill.r&&tG===fill.g&&tB===fill.b)return;
  const stack=[[sx,sy]];while(stack.length){const[x,y]=stack.pop();if(x<0||x>=w||y<0||y>=canvas.height)continue;const i=idx(x,y);if(d[i]!==tR||d[i+1]!==tG||d[i+2]!==tB||d[i+3]!==tA)continue;d[i]=fill.r;d[i+1]=fill.g;d[i+2]=fill.b;d[i+3]=255;stack.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);}ctx.putImageData(id,0,0);
}
function hexToRgb(h){const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:null;}
function openTextAt(mp){textPos=mp;document.getElementById('textOverlay').style.display='flex';document.getElementById('textInput').value='';document.getElementById('textInput').focus();}
function closeTextOverlay(){document.getElementById('textOverlay').style.display='none';textPos=null;}
function placeText(){const txt=document.getElementById('textInput').value.trim();if(!txt||!textPos){closeTextOverlay();return;}saveState();ctx.font=`${document.getElementById('fontSize').value}px ${document.getElementById('fontFamily').value}`;ctx.fillStyle=fgColor;ctx.textBaseline='top';txt.split('\n').forEach((ln,i)=>ctx.fillText(ln,textPos.x,textPos.y+i*(+document.getElementById('fontSize').value+2)));closeTextOverlay();}
function applyBrush(mp){ctx.save();switch(brushType){case 'normal':ctx.beginPath();ctx.arc(mp.x,mp.y,lineW,0,Math.PI*2);ctx.fillStyle=fgColor;ctx.fill();break;case 'soft':{const g=ctx.createRadialGradient(mp.x,mp.y,0,mp.x,mp.y,lineW*4);g.addColorStop(0,fgColor);g.addColorStop(1,'transparent');ctx.beginPath();ctx.arc(mp.x,mp.y,lineW*4,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();break;}case 'calligraphy':ctx.beginPath();ctx.moveTo(mp.x-lineW*2,mp.y-lineW*2);ctx.lineTo(mp.x+lineW*2,mp.y+lineW*2);ctx.strokeStyle=fgColor;ctx.lineWidth=lineW*2;ctx.stroke();break;case 'spray':for(let i=0;i<40;i++){const r=lineW*8,a=Math.random()*Math.PI*2,dd=Math.random()*r;ctx.fillStyle=fgColor;ctx.fillRect(mp.x+dd*Math.cos(a),mp.y+dd*Math.sin(a),1,1);}break;}ctx.restore();}

canvas.addEventListener('mousedown',e=>{
  isMouseDown=true;const mp=getPos(e);
  if(mode==='ZOOM'){e.shiftKey?zoomOut():zoomIn();return;}
  if(mode==='PICKING'){pickColor(mp);return;}
  if(mode==='DRAWING'){if(!currentPolyline){saveState();currentPolyline={points:[],color:fgColor,width:lineW};allPolylines.push(currentPolyline);}currentPolyline.points.push({x:mp.x,y:mp.y,z:0});syncBoth();return;}
  if(mode==='DELETING'){const h=findVertex(mp);if(h){saveState();allPolylines[h.pi].points.splice(h.ti,1);syncBoth();}return;}
  if(mode==='MOVING'){const h=findVertex(mp);if(h){saveState();selectedPoint=h;}return;}
  if(mode==='INSERTING'){const s=findSegment(mp);if(s){saveState();allPolylines[s.pi].points.splice(s.after+1,0,{x:mp.x,y:mp.y,z:0});syncBoth();}return;}
  if(mode==='FILL'){saveState();floodFill(Math.round(mp.x),Math.round(mp.y),fgColor);return;}
  if(mode==='TEXT'){openTextAt(mp);return;}
  if(mode==='SELECT'){selStart=mp;snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);return;}
  saveState();snapshot=ctx.getImageData(0,0,canvas.width,canvas.height);shapeStart=mp;
  if(mode==='PENCIL'||mode==='ERASING'){ctx.beginPath();ctx.moveTo(mp.x,mp.y);}
  if(mode==='BRUSH'){applyBrush(mp);}  // paint on first click too
});
canvas.addEventListener('mousemove',e=>{
  const mp=getPos(e);document.getElementById('sbCoords').textContent=`${Math.round(mp.x)}, ${Math.round(mp.y)} px`;
  if(!isMouseDown)return;
  if(mode==='MOVING'&&selectedPoint){const pt=allPolylines[selectedPoint.pi].points[selectedPoint.ti];pt.x=mp.x;pt.y=mp.y;syncBoth();return;}
  if((mode==='PENCIL'||mode==='ERASING')&&shapeStart){ctx.lineTo(mp.x,mp.y);ctx.strokeStyle=mode==='ERASING'?bgColor:fgColor;ctx.lineWidth=mode==='ERASING'?lineW*8:lineW;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke();ctx.beginPath();ctx.moveTo(mp.x,mp.y);return;}
  if(mode==='BRUSH'){applyBrush(mp);return;}
  if(mode==='SELECT'&&selStart){
    // draw rubber-band selection rectangle
    if(snapshot)ctx.putImageData(snapshot,0,0);
    const x=Math.min(selStart.x,mp.x),y=Math.min(selStart.y,mp.y);
    const w=Math.abs(mp.x-selStart.x),h=Math.abs(mp.y-selStart.y);
    ctx.save();ctx.strokeStyle='#0078d4';ctx.lineWidth=1;ctx.setLineDash([5,4]);
    ctx.strokeRect(x,y,w,h);ctx.fillStyle='rgba(0,120,212,0.08)';ctx.fillRect(x,y,w,h);
    ctx.restore();return;
  }
  const SH=['LINE','RECT','ELLIPSE','TRIANGLE','ARROW','STAR','DIAMOND','HEART','HEXAGON'];
  if(SH.includes(mode)&&snapshot&&shapeStart){ctx.putImageData(snapshot,0,0);redrawPolylines();drawShape(shapeStart,mp);}
});
canvas.addEventListener('mouseup',e=>{
  const mp=getPos(e);isMouseDown=false;selectedPoint=null;
  if(mode==='SELECT'&&selStart){
    const x=Math.min(selStart.x,mp.x),y=Math.min(selStart.y,mp.y);
    const w=Math.abs(mp.x-selStart.x),h=Math.abs(mp.y-selStart.y);
    if(w>4&&h>4){selRect={x:Math.round(x),y:Math.round(y),w:Math.round(w),h:Math.round(h)};clipboard=ctx.getImageData(selRect.x,selRect.y,selRect.w,selRect.h);updateStatus(`Selected ${Math.round(w)}×${Math.round(h)}px — Ctrl+C to copy, Ctrl+V to paste`);}
    else{selRect=null;if(snapshot)ctx.putImageData(snapshot,0,0);}
    selStart=null;snapshot=null;return;
  }
  const SH=['LINE','RECT','ELLIPSE','TRIANGLE','ARROW','STAR','DIAMOND','HEART','HEXAGON'];
  if(SH.includes(mode)&&shapeStart){if(snapshot)ctx.putImageData(snapshot,0,0);redrawPolylines();drawShape(shapeStart,mp);shapeStart=null;snapshot=null;}
  if(mode==='PENCIL'||mode==='ERASING'||mode==='BRUSH')shapeStart=null;
});
canvas.addEventListener('dblclick',e=>{
  if(mode==='DRAWING'&&currentPolyline&&currentPolyline.points.length>1){currentPolyline.points.pop();currentPolyline=null;syncBoth();updateStatus('Polyline complete — press B to start a new one');}
});

// ── COPY / PASTE ──────────────────────────────────────────────
function copySelection(){if(selRect&&clipboard){updateStatus('Copied '+selRect.w+'×'+selRect.h+'px to clipboard');}}
function pasteClipboard(){
  if(!clipboard)return;
  saveState();
  ctx.putImageData(clipboard,selRect?selRect.x:20,selRect?selRect.y:20);
  updateStatus('Pasted');
}
// Hook up ribbon buttons
document.querySelectorAll('.rsm').forEach(btn=>{
  if(btn.textContent.trim().startsWith('✂ Cut')){btn.onclick=()=>{if(selRect&&clipboard){saveState();ctx.fillStyle=bgColor;ctx.fillRect(selRect.x,selRect.y,selRect.w,selRect.h);updateStatus('Cut');}};}
  if(btn.textContent.trim().startsWith('⎘ Copy')){btn.onclick=copySelection;}
});

// ── IMAGE OPS ─────────────────────────────────────────────────
function rotateCanvas(){saveState();const tw=canvas.height,th=canvas.width,tmp=document.createElement('canvas');tmp.width=tw;tmp.height=th;const tc=tmp.getContext('2d');tc.translate(tw/2,th/2);tc.rotate(Math.PI/2);tc.translate(-canvas.width/2,-canvas.height/2);tc.drawImage(canvas,0,0);canvas.width=tw;canvas.height=th;ctx.drawImage(tmp,0,0);allPolylines.forEach(pl=>{if(pl.points)pl.points=pl.points.map(p=>({x:p.y,y:tw-p.x,z:p.z||0}));});syncBoth();}
function flipH(){saveState();const tmp=document.createElement('canvas');tmp.width=canvas.width;tmp.height=canvas.height;const tc=tmp.getContext('2d');tc.translate(canvas.width,0);tc.scale(-1,1);tc.drawImage(canvas,0,0);ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(tmp,0,0);allPolylines.forEach(pl=>{if(pl.points)pl.points=pl.points.map(p=>({x:canvas.width-p.x,y:p.y,z:p.z||0}));});syncBoth();}
function invertColors(){saveState();const id=ctx.getImageData(0,0,canvas.width,canvas.height);for(let i=0;i<id.data.length;i+=4){id.data[i]=255-id.data[i];id.data[i+1]=255-id.data[i+1];id.data[i+2]=255-id.data[i+2];}ctx.putImageData(id,0,0);}
function applyResize(){const nw=+document.getElementById('rsW').value,nh=+document.getElementById('rsH').value;if(nw<1||nh<1)return;const sn=ctx.getImageData(0,0,canvas.width,canvas.height);canvas.width=nw;canvas.height=nh;ctx.fillStyle=bgColor;ctx.fillRect(0,0,nw,nh);ctx.putImageData(sn,0,0);syncBoth();document.getElementById('sbSize').textContent=`▭ ${nw}×${nh}px`;closeModal('resizeModal');}
function newFile(){if(!allPolylines.length||confirm('Discard unsaved changes?')){allPolylines=[];currentPolyline=null;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);redrawAll();if(show3D&&view3d)view3d.render();document.getElementById('docName').textContent='- Untitled';updateStatus('New file');}}
function saveFile(){const data={canvas:{w:canvas.width,h:canvas.height},polylines:allPolylines,image:canvas.toDataURL()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='drawing3d.json';a.click();URL.revokeObjectURL(url);document.getElementById('docName').textContent='- drawing3d.json';updateStatus('Saved');}
function printCanvas(){const w=window.open('','_blank');w.document.write(`<img src="${canvas.toDataURL()}" style="max-width:100%">`);w.document.close();w.print();}
function quitProgram(){if(confirm('Exit?')){allPolylines=[];currentPolyline=null;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);redrawAll();if(show3D&&view3d)view3d.render();}}

// ── COLOR MODAL ───────────────────────────────────────────────
document.getElementById('cPickerInput').addEventListener('input',e=>document.getElementById('hexInput').value=e.target.value);
document.getElementById('hexInput').addEventListener('input',e=>{const v=e.target.value;if(/^#[0-9a-fA-F]{6}$/.test(v))document.getElementById('cPickerInput').value=v;});
function applyColor(){fgColor=document.getElementById('cPickerInput').value;document.getElementById('fgSwatch').style.background=fgColor;closeModal('colorModal');}

// ── MODALS ────────────────────────────────────────────────────
function openModal(id){document.getElementById(id).style.display='flex';}
function closeModal(id){document.getElementById(id).style.display='none';}
function switchTab(tabId,btn){document.querySelectorAll('.helpPanel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.helpTab').forEach(b=>b.classList.remove('active'));document.getElementById(tabId).classList.add('active');btn.classList.add('active');}
document.querySelectorAll('.overlay').forEach(ov=>ov.addEventListener('click',e=>{if(e.target===ov)ov.style.display='none';}));

// ── STATUS ────────────────────────────────────────────────────
function updateStatus(msg){if(msg)document.getElementById('sbMode').textContent=msg;updateStatus2D();}
function updateStatus2D(){const ptCnt=allPolylines.reduce((s,p)=>s+(p.points?p.points.length:0),0);document.getElementById('sbPoly').textContent=`Polylines: ${allPolylines.length} | Pts: ${ptCnt}`;}

// ═══════════════════════════════════════════════════════════════
//  RESIZABLE SPLITTER
// ═══════════════════════════════════════════════════════════════
const splitHandle = document.getElementById('splitHandle');
let splitDragging = false, splitStartX = 0, splitStartW = 0;

splitHandle.addEventListener('mousedown', e => {
  splitDragging = true;
  splitStartX = e.clientX;
  splitStartW = document.getElementById('threeDSide').offsetWidth;
  splitHandle.classList.add('dragging');
  document.body.style.cursor = 'col-resize';
  document.body.style.userSelect = 'none';
  e.preventDefault();
});
document.addEventListener('mousemove', e => {
  if (!splitDragging) return;
  const delta = splitStartX - e.clientX;  // dragging left → 3D gets wider
  const newW  = Math.max(280, Math.min(splitStartW + delta, window.innerWidth - 300));
  document.getElementById('threeDSide').style.width = newW + 'px';
  if (view3d) { view3d.resize(); view3d.render(); }
  drawRulers();
});
document.addEventListener('mouseup', () => {
  if (!splitDragging) return;
  splitDragging = false;
  splitHandle.classList.remove('dragging');
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
});

// ── VERTICAL RESIZE (3D canvas height) ───────────────────────
let vertDragging=false, vertStartY=0, vertStartH=0;
document.addEventListener('DOMContentLoaded', ()=>{
  const vr = document.getElementById('vertResizeHandle');
  if(!vr) return;
  vr.addEventListener('mousedown', e=>{
    vertDragging=true; vertStartY=e.clientY;
    const wrap=document.getElementById('threeDCanvasWrap');
    vertStartH=wrap.offsetHeight;
    vr.classList.add('dragging');
    document.body.style.cursor='ns-resize';
    document.body.style.userSelect='none';
    e.preventDefault();
  });
});
document.addEventListener('mousemove', e=>{
  if(!vertDragging) return;
  const delta=e.clientY-vertStartY;
  const newH=Math.max(80, vertStartH+delta);
  const wrap=document.getElementById('threeDCanvasWrap');
  if(wrap){ wrap.style.height=newH+'px'; }
  if(view3d){ view3d.resize(); view3d.render(); }
});
document.addEventListener('mouseup', ()=>{
  if(!vertDragging) return;
  vertDragging=false;
  const vr=document.getElementById('vertResizeHandle');
  if(vr) vr.classList.remove('dragging');
  document.body.style.cursor='';
  document.body.style.userSelect='';
});
// ═══════════════════════════════════════════════════════════════
class View3D {
  constructor(cvs) {
    this.cvs=cvs; this.ctx=cvs.getContext('2d');
    this.gizmo=document.getElementById('gizmoCanvas'); this.gCtx=this.gizmo.getContext('2d');
    this.theta=Math.PI*.35; this.phi=Math.PI*.22; this.dist=1100;
    this.dragging=false; this.lastMX=0; this.lastMY=0;
    this.sel=null;
    this.mode3D='IDLE';   // IDLE | DRAWING | DELETING | MOVING
    this.current3DPoly=null;
    this.dragPt=null;     // for MOVING in 3D
    this.dragLastPos=null;
    this.resize(); this.bindEvents();
  }

  resize(){
    const wrap=document.getElementById('threeDCanvasWrap');
    this.cvs.width=wrap.clientWidth||480; this.cvs.height=wrap.clientHeight||300;
    this.lookAt={x:canvas.width/2,y:0,z:canvas.height/2};
  }

  // ── Projection ──────────────────────────────────────────────
  project(wx,wy,wz){
    const x3=wx-this.lookAt.x,y3=wy-this.lookAt.y,z3=wz-this.lookAt.z;
    const cT=Math.cos(-this.theta),sT=Math.sin(-this.theta);
    const rx=x3*cT-z3*sT,ry=y3,rz=x3*sT+z3*cT;
    const cP=Math.cos(-this.phi),sP=Math.sin(-this.phi);
    const fx=rx,fy=ry*cP-rz*sP,fz=ry*sP+rz*cP+this.dist;
    if(fz<5)return null;
    const fov=700;
    return{sx:this.cvs.width/2+(fx/fz)*fov,sy:this.cvs.height/2-(fy/fz)*fov,depth:fz,scale:fov/fz};
  }
  ptProj(pt){return this.project(pt.x||0,pt.z||0,pt.y||0);}

  // ── Unproject screen → world floor (Y=0) ───────────────────
  // Returns {x, y(=canvas_y)} world coords on the floor plane
  unprojectFloor(mx,my){
    // Inverse of project() for the floor plane (world Y = 0)
    // With ry=0: fy=-rz*sP, fz=rz*cP+dist
    // sy = H/2 - fy/fz*fov = H/2 + rz*sP*fov/(rz*cP+dist)
    // → (my-H/2)*(rz*cP+dist) = rz*sP*fov
    // → rz = (my-H/2)*dist / (sP*fov - (my-H/2)*cP)
    const W=this.cvs.width,H=this.cvs.height,fov=700;
    const cT=Math.cos(-this.theta),sT=Math.sin(-this.theta);
    const cP=Math.cos(-this.phi),sP=Math.sin(-this.phi);
    const screenDY = my - H/2;
    const denom = sP*fov - screenDY*cP;
    if(Math.abs(denom)<0.001) return null;
    const rz = (screenDY*this.dist) / denom;
    const fz = rz*cP + this.dist;
    if(fz < 5) return null;
    const rx = ((mx - W/2) / fov) * fz;
    // Inverse azimuth rotation (transpose of rotation matrix)
    const x3 = rx*cT + rz*sT;
    const z3 = rz*cT - rx*sT;
    return { x: Math.round(x3 + this.lookAt.x), y: Math.round(z3 + this.lookAt.z) };
  }

  // ── Unproject screen → world keeping existing Y depth ──────
  // Used for MOVING: keeps the point's Y (depth) unchanged, moves X and Z
  unprojectAtDepth(mx,my,worldY){
    // worldY = pt.z (3D Y = world depth)
    const W=this.cvs.width,H=this.cvs.height,fov=700;
    const cT=Math.cos(-this.theta),sT=Math.sin(-this.theta);
    const cP=Math.cos(-this.phi),sP=Math.sin(-this.phi);
    const ry=worldY-this.lookAt.y;
    // fy = ry*cP - rz*sP, fz = ry*sP + rz*cP + dist
    // sy = H/2 - fy/fz*fov
    // dy = H/2-sy = fy/fz*fov = (ry*cP-rz*sP)/(ry*sP+rz*cP+dist)*fov
    // dy*(ry*sP+rz*cP+dist) = (ry*cP-rz*sP)*fov
    // dy*ry*sP + dy*rz*cP + dy*dist = ry*cP*fov - rz*sP*fov
    // rz*(dy*cP + sP*fov) = ry*cP*fov - ry*sP*dy - dy*dist
    const dy=H/2-my;
    const rz=(ry*cP*fov - ry*sP*dy - dy*this.dist)/(dy*cP+sP*fov);
    const fz=ry*sP+rz*cP+this.dist;
    if(fz<5)return null;
    const dx_screen=mx-W/2;
    const rx=(dx_screen/fov)*fz;
    const x3=rx*cT+rz*sT;
    const z3=rz*cT-rx*sT;
    return{x:Math.round(x3+this.lookAt.x),y:Math.round(z3+this.lookAt.z)};
  }

  // ── Render ──────────────────────────────────────────────────
  render(){
    const c=this.ctx,W=this.cvs.width,H=this.cvs.height;
    const bg=c.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*.7);
    bg.addColorStop(0,'#0e2040');bg.addColorStop(1,'#060c18');
    c.fillStyle=bg;c.fillRect(0,0,W,H);
    this.drawFloor(c);this.drawAxes(c);

    // Collect items
    const items=[];
    allPolylines.forEach((pl,pi)=>{
      if(!pl.points||pl.points.length<1)return;
      const selPoly=this.sel&&this.sel.pi===pi;
      const lc=brightColor(pl.color);
      for(let ti=0;ti<pl.points.length-1;ti++){
        const a=pl.points[ti],b=pl.points[ti+1];
        const pa=this.project(a.x,0,a.y),pb=this.project(b.x,0,b.y);
        if(pa&&pb)items.push({type:'shadow',pa,pb,avgD:(pa.depth+pb.depth)/2,selPoly});
        const pa3=this.ptProj(a),pb3=this.ptProj(b);
        if(pa3&&pb3){const selSeg=this.sel&&this.sel.pi===pi&&(this.sel.ti===ti||this.sel.ti===ti+1);items.push({type:'seg',pa:pa3,pb:pb3,color:lc,width:pl.width||1,isSel:selSeg,isPolyHL:selPoly,avgD:(pa3.depth+pb3.depth)/2});}
      }
      pl.points.forEach((pt,ti)=>{
        const p=this.ptProj(pt);if(!p)return;
        const isSel=this.sel&&this.sel.pi===pi&&this.sel.ti===ti;
        items.push({type:'vert',p,pt,pi,ti,isSel,isHL:selPoly&&!isSel,avgD:p.depth});
      });
    });
    items.sort((a,b)=>b.avgD-a.avgD);

    items.forEach(item=>{
      switch(item.type){
        case 'shadow':
          c.beginPath();c.moveTo(item.pa.sx,item.pa.sy);c.lineTo(item.pb.sx,item.pb.sy);
          c.strokeStyle=item.selPoly?'rgba(80,180,255,0.35)':'rgba(60,120,220,0.18)';c.lineWidth=item.selPoly?2:1;c.setLineDash([5,5]);c.stroke();c.setLineDash([]);break;
        case 'seg':{
          const lw=Math.max(2,item.width*item.pa.scale*30);
          if(item.isPolyHL){c.beginPath();c.moveTo(item.pa.sx,item.pa.sy);c.lineTo(item.pb.sx,item.pb.sy);c.strokeStyle='rgba(80,180,255,0.3)';c.lineWidth=lw+10;c.lineJoin='round';c.lineCap='round';c.stroke();}
          if(item.isSel){c.beginPath();c.moveTo(item.pa.sx,item.pa.sy);c.lineTo(item.pb.sx,item.pb.sy);c.strokeStyle='rgba(255,238,68,0.45)';c.lineWidth=lw+14;c.lineJoin='round';c.lineCap='round';c.stroke();}
          c.beginPath();c.moveTo(item.pa.sx,item.pa.sy);c.lineTo(item.pb.sx,item.pb.sy);
          c.strokeStyle=item.isSel?'#ffee44':(item.isPolyHL?'#66ccff':item.color);c.lineWidth=lw;c.lineJoin='round';c.lineCap='round';c.stroke();break;
        }
        case 'vert':{
          const p=item.p,pt=item.pt,z=pt.z||0;const{r,g,b,css}=depthColor(z);
          const radius=item.isSel?11:(item.isHL?9:7);
          const fp=this.project(pt.x,0,pt.y||0);
          if(fp){c.beginPath();c.moveTo(p.sx,p.sy);c.lineTo(fp.sx,fp.sy);c.strokeStyle=item.isSel?'rgba(255,238,68,.6)':(item.isHL?'rgba(100,180,255,.45)':`rgba(${r},${g},${b},.35)`);c.lineWidth=1;c.setLineDash([3,4]);c.stroke();c.setLineDash([]);c.beginPath();c.arc(fp.sx,fp.sy,3,0,Math.PI*2);c.fillStyle=`rgba(${r},${g},${b},.5)`;c.fill();}
          const gR=item.isSel?radius+8:(item.isHL?radius+5:radius+3);
          const grd=c.createRadialGradient(p.sx,p.sy,0,p.sx,p.sy,gR);
          if(item.isSel){grd.addColorStop(0,'rgba(255,240,80,.65)');grd.addColorStop(1,'rgba(255,200,0,0)');}
          else if(item.isHL){grd.addColorStop(0,'rgba(80,180,255,.5)');grd.addColorStop(1,'rgba(60,150,255,0)');}
          else{grd.addColorStop(0,`rgba(${r},${g},${b},.45)`);grd.addColorStop(1,`rgba(${r},${g},${b},0)`);}
          c.beginPath();c.arc(p.sx,p.sy,gR,0,Math.PI*2);c.fillStyle=grd;c.fill();
          c.beginPath();c.arc(p.sx,p.sy,radius,0,Math.PI*2);
          const cg=c.createRadialGradient(p.sx-radius*.35,p.sy-radius*.35,0,p.sx,p.sy,radius);
          if(item.isSel){cg.addColorStop(0,'#ffffff');cg.addColorStop(.45,'#ffee44');cg.addColorStop(1,'#ff9900');}
          else if(item.isHL){cg.addColorStop(0,'#cceeFF');cg.addColorStop(1,'#3399ee');}
          else{cg.addColorStop(0,`rgb(${Math.min(255,r+90)},${Math.min(255,g+55)},${Math.min(255,b+70)})`);cg.addColorStop(1,css);}
          c.fillStyle=cg;c.strokeStyle=item.isSel?'#ffffff':'rgba(255,255,255,.8)';c.lineWidth=item.isSel?2.5:1.5;c.fill();c.stroke();
          if(item.isSel){c.font='bold 11px Segoe UI,monospace';const label=`X:${Math.round(pt.x)}  Y:${Math.round(pt.y||0)}  Z(depth):${Math.round(z)}`;const tw=c.measureText(label).width,lx=p.sx+14,ly=p.sy-8;c.fillStyle='rgba(0,0,0,.8)';c.fillRect(lx-4,ly-2,tw+10,18);c.fillStyle='#ffee88';c.fillText(label,lx,ly+12);}
          else if(z!==0){c.font='bold 9px Segoe UI,sans-serif';const zl=`Z${z>0?'+':''}${z}`,tw2=c.measureText(zl).width;c.fillStyle='rgba(0,0,0,.55)';c.fillRect(p.sx+radius+2,p.sy-8,tw2+4,12);c.fillStyle=css;c.fillText(zl,p.sx+radius+4,p.sy+1);}
          break;
        }
      }
    });
    document.getElementById('camTheta').textContent=Math.round(this.theta*180/Math.PI)+'°';
    document.getElementById('camPhi').textContent=Math.round(this.phi*180/Math.PI)+'°';
    document.getElementById('camDist').textContent=Math.round(this.dist);
    this.drawGizmo();
  }

  drawFloor(c){
    const cx=this.lookAt.x,cz=this.lookAt.z,step=60,n=10;c.save();c.lineWidth=.7;
    for(let i=-n;i<=n;i++){const col=i===0?'rgba(90,130,210,.7)':'rgba(40,70,140,.35)';c.strokeStyle=col;
      const a1=this.project(cx+i*step,0,cz-n*step),b1=this.project(cx+i*step,0,cz+n*step);
      const a2=this.project(cx-n*step,0,cz+i*step),b2=this.project(cx+n*step,0,cz+i*step);
      if(a1&&b1){c.beginPath();c.moveTo(a1.sx,a1.sy);c.lineTo(b1.sx,b1.sy);c.stroke();}
      if(a2&&b2){c.beginPath();c.moveTo(a2.sx,a2.sy);c.lineTo(b2.sx,b2.sy);c.stroke();}
    }
    c.restore();
  }
  drawAxes(c){
    const o={x:this.lookAt.x,y:0,z:this.lookAt.z},len=160;
    // X=red(horizontal), Z=green(depth/extrusion — the slider), Y=blue(vertical)
    const axes=[
      {end:{x:o.x+len,y:0,z:o.z},  color:'#ff4444',label:'X (horiz)'},
      {end:{x:o.x,y:len,z:o.z},    color:'#44ff88',label:'Z (depth)'},
      {end:{x:o.x,y:0,z:o.z+len},  color:'#4488ff',label:'Y (vertical)'},
    ];
    const po=this.project(o.x,o.y,o.z);if(!po)return;c.save();c.lineWidth=3;
    axes.forEach(ax=>{const pe=this.project(ax.end.x,ax.end.y,ax.end.z);if(!pe)return;c.beginPath();c.moveTo(po.sx,po.sy);c.lineTo(pe.sx,pe.sy);c.strokeStyle=ax.color;c.lineCap='round';c.stroke();const ang=Math.atan2(pe.sy-po.sy,pe.sx-po.sx),hs=10;c.beginPath();c.moveTo(pe.sx,pe.sy);c.lineTo(pe.sx-hs*Math.cos(ang-.4),pe.sy-hs*Math.sin(ang-.4));c.lineTo(pe.sx-hs*Math.cos(ang+.4),pe.sy-hs*Math.sin(ang+.4));c.closePath();c.fillStyle=ax.color;c.fill();c.font='bold 12px Segoe UI,sans-serif';const tw=c.measureText(ax.label).width;c.fillStyle='rgba(0,0,0,.6)';c.fillRect(pe.sx+7,pe.sy-13,tw+6,16);c.fillStyle=ax.color;c.fillText(ax.label,pe.sx+10,pe.sy);});
    c.restore();
  }
  drawGizmo(){
    const g=this.gCtx,S=80,C=40;g.clearRect(0,0,S,S);g.fillStyle='rgba(5,12,28,.85)';g.fillRect(0,0,S,S);
    const pG=(x,y,z)=>{const cT=Math.cos(-this.theta),sT=Math.sin(-this.theta);const rx=x*cT-z*sT,ry=y,rz=x*sT+z*cT;const cP=Math.cos(-this.phi),sP=Math.sin(-this.phi);const fx=rx,fy=ry*cP-rz*sP,fz=ry*sP+rz*cP+3;if(fz<.1)return{sx:C,sy:C};const sc=26/fz;return{sx:C+fx*sc,sy:C-fy*sc};};
    const o=pG(0,0,0);
    [{v:[1,0,0],c:'#ff5555',l:'X'},{v:[0,1,0],c:'#55ff88',l:'Z'},{v:[0,0,1],c:'#5599ff',l:'Y'}].forEach(ax=>{const e=pG(...ax.v);g.beginPath();g.moveTo(o.sx,o.sy);g.lineTo(e.sx,e.sy);g.strokeStyle=ax.c;g.lineWidth=2.5;g.lineCap='round';g.stroke();g.beginPath();g.arc(e.sx,e.sy,4,0,Math.PI*2);g.fillStyle=ax.c;g.fill();g.font='bold 9px sans-serif';g.fillStyle=ax.c;g.fillText(ax.l,e.sx+5,e.sy+3);});
  }

  // ── Pick ────────────────────────────────────────────────────
  pickVertex(mx,my){let best=null,bestD=24;allPolylines.forEach((pl,pi)=>{if(!pl.points)return;pl.points.forEach((pt,ti)=>{const p=this.ptProj(pt);if(!p)return;const d=Math.hypot(p.sx-mx,p.sy-my);if(d<bestD){bestD=d;best={pi,ti};}});});return best;}
  pickSegment(mx,my){let best=null,bestD=16;allPolylines.forEach((pl,pi)=>{if(!pl.points||pl.points.length<2)return;for(let ti=0;ti<pl.points.length-1;ti++){const pa=this.ptProj(pl.points[ti]),pb=this.ptProj(pl.points[ti+1]);if(!pa||!pb)continue;const dx=pb.sx-pa.sx,dy=pb.sy-pa.sy,l2=dx*dx+dy*dy;if(l2<1)continue;let t=((mx-pa.sx)*dx+(my-pa.sy)*dy)/l2;t=Math.max(0,Math.min(1,t));const d=Math.hypot(mx-(pa.sx+t*dx),my-(pa.sy+t*dy));if(d<bestD){bestD=d;best={pi,ti};}}});return best;}

  // ── Editor panel ────────────────────────────────────────────
  refreshEditor(){
    // Update the always-visible Z slider — no popup ever
    if(!this.sel)return;
    const pt=allPolylines[this.sel.pi]?.points[this.sel.ti];if(!pt)return;
    const z=pt.z||0;
    document.getElementById('zSlider3D').value=z;
    document.getElementById('zInput3D').value=z;
  }
  hideEditor(){this.sel=null;redrawPolylines();this.render();}

  // ── Events ──────────────────────────────────────────────────
  bindEvents(){
    this.cvs.addEventListener('mousedown',e=>this.onMD(e));
    this.cvs.addEventListener('mousemove',e=>this.onMM(e));
    this.cvs.addEventListener('mouseup',  e=>this.onMU(e));
    // Safety: release drag if mouse leaves canvas or lifts anywhere
    document.addEventListener('mouseup',  ()=>{ this.dragPt=null; this.dragging=false; });
    this.cvs.addEventListener('dblclick', e=>this.onDbl(e));
    this.cvs.addEventListener('wheel',    e=>this.onWheel(e),{passive:false});
    this.cvs.addEventListener('contextmenu',e=>e.preventDefault());
    this.cvs.setAttribute('tabindex','0');
    this.cvs.addEventListener('keydown',  e=>this.onKey(e));
  }

  onKey(e){
    const k=e.key.toLowerCase();
    if(k==='b'){e.preventDefault();set3DMode('DRAWING');}
    else if(k==='d'){e.preventDefault();set3DMode('DELETING');}
    else if(k==='m'){e.preventDefault();set3DMode('MOVING');}
    else if(k==='escape'){e.preventDefault();set3DMode('IDLE');}
    if(this.sel){
      if(e.key==='ArrowUp'){e.preventDefault();nudgeZ(e.shiftKey?10:1);}
      if(e.key==='ArrowDown'){e.preventDefault();nudgeZ(e.shiftKey?-10:-1);}
    }
  }

  // Convert a mouse event to canvas-internal pixel coordinates
  evtPos(e){
    const r=this.cvs.getBoundingClientRect();
    const scaleX=this.cvs.width/r.width, scaleY=this.cvs.height/r.height;
    return{mx:(e.clientX-r.left)*scaleX, my:(e.clientY-r.top)*scaleY};
  }

  onMD(e){
    e.preventDefault();this.cvs.focus();
    const{mx,my}=this.evtPos(e);
    this.lastMX=mx;this.lastMY=my;

    if(this.mode3D==='DRAWING'){
      const wp=this.unprojectFloor(mx,my);if(!wp)return;
      if(!this.current3DPoly){
        saveState();
        this.current3DPoly={points:[],color:fgColor,width:lineW};
        allPolylines.push(this.current3DPoly);
      }
      this.current3DPoly.points.push({x:wp.x,y:wp.y,z:0});
      syncBoth();return;
    }

    if(this.mode3D==='DELETING'){
      const hit=this.pickVertex(mx,my);
      if(hit){saveState();allPolylines[hit.pi].points.splice(hit.ti,1);if(this.sel&&this.sel.pi===hit.pi&&this.sel.ti===hit.ti)this.hideEditor();syncBoth();}
      return;
    }

    if(this.mode3D==='MOVING'){
      const hit=this.pickVertex(mx,my);
      if(hit){
        saveState();this.sel=hit;this.dragPt=hit;
        this.refreshEditor();redrawPolylines();this.render();
      } else {
        // No point hit — start orbit instead of accidentally moving
        this.dragging=true;
      }
      return;
    }

    // IDLE — try vertex or segment selection, then orbit
    const hitV=this.pickVertex(mx,my);
    if(hitV){this.sel=hitV;this.refreshEditor();redrawPolylines();this.render();return;}
    const hitS=this.pickSegment(mx,my);
    if(hitS){this.sel={pi:hitS.pi,ti:hitS.ti};this.refreshEditor();redrawPolylines();this.render();return;}
    this.dragging=true;
  }

  onMM(e){
    const{mx,my}=this.evtPos(e);

    if(this.mode3D==='MOVING'&&this.dragPt){
      const pt=allPolylines[this.dragPt.pi]?.points[this.dragPt.ti];if(!pt)return;
      const wp=this.unprojectAtDepth(mx,my,pt.z||0);
      if(wp){pt.x=wp.x;pt.y=wp.y;syncBoth();}
      if(this.sel)this.refreshEditor();
      return;
    }

    if(!this.dragging)return;
    this.theta-=(mx-this.lastMX)*.007;
    this.phi=Math.max(-Math.PI/2.1,Math.min(Math.PI/2.1,this.phi-(my-this.lastMY)*.005));
    this.lastMX=mx;this.lastMY=my;this.render();
  }

  onMU(e){
    if(this.dragPt){
      this.dragPt=null;
    }
    this.dragging=false;
  }

  onDbl(e){
    if(this.mode3D==='DRAWING'&&this.current3DPoly){
      if(this.current3DPoly.points.length>1)this.current3DPoly.points.pop();
      this.current3DPoly=null;syncBoth();
      document.getElementById('tdModeStatus').textContent='Polyline finished — click Begin to start another';
    }
  }

  onWheel(e){e.preventDefault();this.dist=Math.max(200,Math.min(4000,this.dist+e.deltaY*1.1));this.render();}
}

// ── 3D PANEL ──────────────────────────────────────────────────
let view3d=null;

function toggle3DPanel(){
  show3D=!show3D;
  const side=document.getElementById('threeDSide'),sb3d=document.getElementById('sb3D'),btn=document.getElementById('btn3DToggle'),handle=document.getElementById('splitHandle');
  if(show3D){
    side.style.display='flex';sb3d.style.display='';btn.classList.add('active');
    handle.style.display='flex';
    if(!view3d){view3d=new View3D(document.getElementById('canvas3D'));}else{view3d.resize();}
    view3d.render();redrawPolylines();
  }else{
    side.style.display='none';sb3d.style.display='none';btn.classList.remove('active');
    handle.style.display='none';
    if(view3d)view3d.hideEditor();
    redrawPolylines();
  }
}

function set3DMode(m){
  if(!view3d)return;
  view3d.mode3D=m;
  if(m!=='DRAWING')view3d.current3DPoly=null;
  // Update toolbar buttons
  ['IDLE','DRAWING','DELETING','MOVING'].forEach(mm=>{
    const el=document.getElementById('td-'+mm.toLowerCase());if(el)el.classList.remove('active');
  });
  const el=document.getElementById('td-'+m.toLowerCase());if(el)el.classList.add('active');
  // Update cursor
  const cursors={IDLE:'grab',DRAWING:'crosshair',DELETING:'not-allowed',MOVING:'move'};
  document.getElementById('canvas3D').style.cursor=cursors[m]||'default';
  const statusTxt={IDLE:'Orbit mode — drag to rotate · scroll to zoom',DRAWING:'Begin mode — click floor to place points · double-click to finish',DELETING:'Delete mode — click any point to remove it',MOVING:'Move mode — drag any point to reposition it'};
  document.getElementById('tdModeStatus').textContent=statusTxt[m]||'';
  view3d.render();
}

function resetCameraOnly(){if(!view3d)return;view3d.theta=Math.PI*.35;view3d.phi=Math.PI*.22;view3d.dist=1100;view3d.lookAt={x:canvas.width/2,y:0,z:canvas.height/2};view3d.render();updateStatus('Camera reset');}
function clearAllPolylines(){if(!confirm('Delete all polylines?'))return;saveState();allPolylines=[];currentPolyline=null;redrawAll();if(view3d){view3d.hideEditor();view3d.render();}updateStatus('All polylines cleared');}

// ── Y DEPTH CONTROLS ──────────────────────────────────────────
function onZSlider(val){document.getElementById('zInput3D').value=val;applyYToSelected(+val);}
function onZInput(val){document.getElementById('zSlider3D').value=val;applyYToSelected(+val);}
function applyYToSelected(z){
  if(!view3d||!view3d.sel)return;
  const{pi,ti}=view3d.sel;allPolylines[pi].points[ti].z=z;
  syncBoth();updateStatus(`Z depth: ${z}`);
}
function nudgeZ(delta){
  if(!view3d||!view3d.sel)return;
  const{pi,ti}=view3d.sel,pt=allPolylines[pi].points[ti];
  pt.z=Math.max(-400,Math.min(400,(pt.z||0)+delta));
  document.getElementById('zSlider3D').value=pt.z;
  document.getElementById('zInput3D').value=pt.z;
  syncBoth();updateStatus(`Z depth: ${pt.z}`);
}
function setPolylineY(z){if(!view3d||!view3d.sel)return;const pl=allPolylines[view3d.sel.pi];if(!pl)return;saveState();pl.points.forEach(pt=>pt.z=z);syncBoth();}
function deleteSelected3D(){if(!view3d||!view3d.sel)return;const{pi,ti}=view3d.sel;saveState();allPolylines[pi].points.splice(ti,1);view3d.hideEditor();syncBoth();}
function flattenAll(){saveState();allPolylines.forEach(pl=>{if(pl.points)pl.points.forEach(pt=>pt.z=0);});syncBoth();updateStatus('All Y depths set to 0');}
function extrudeRandom(){saveState();allPolylines.forEach(pl=>{if(!pl.points)return;pl.points.forEach(pt=>{pt.z=Math.round((Math.random()-.5)*400);});});syncBoth();updateStatus('Random Y depths applied');}

// ── KEYBOARD ──────────────────────────────────────────────────
window.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  // If canvas3D has focus, let View3D.onKey handle it
  if(document.activeElement===document.getElementById('canvas3D'))return;
  const k=e.key.toLowerCase();
  if(k==='b'){currentPolyline=null;setActiveTool('DRAWING');}
  else if(k==='d')setActiveTool('DELETING');
  else if(k==='m')setActiveTool('MOVING');
  else if(k==='i')setActiveTool('INSERTING');
  else if(k==='p')setActiveTool('PENCIL');
  else if(k==='l')setActiveTool('LINE');
  else if(k==='e')setActiveTool('ERASING');
  else if(k==='f')setActiveTool('FILL');
  else if(k==='t')setActiveTool('TEXT');
  else if(k==='k')setActiveTool('PICKING');
  else if(k==='+'||k==='=')zoomIn();
  else if(k==='-')zoomOut();
  else if(k==='escape'){currentPolyline=null;setActiveTool('PENCIL');closeTextOverlay();}
  else if(k==='f1'){e.preventDefault();openModal('helpModal');}
  if(e.ctrlKey){
    if(k==='z'){e.preventDefault();undo();}
    else if(k==='y'){e.preventDefault();redo();}
    else if(k==='s'&&!e.shiftKey){e.preventDefault();saveFile();}
    else if(k==='n'){e.preventDefault();newFile();}
    else if(k==='3'){e.preventDefault();toggle3DPanel();}
    else if(k==='+'||k==='='){e.preventDefault();zoomIn();}
    else if(k==='-'){e.preventDefault();zoomOut();}
    else if(k==='c'){e.preventDefault();copySelection();}
    else if(k==='v'){e.preventDefault();pasteClipboard();}
    else if(k==='a'){e.preventDefault();setActiveTool('SELECT');selStart={x:0,y:0};selRect={x:0,y:0,w:canvas.width,h:canvas.height};clipboard=ctx.getImageData(0,0,canvas.width,canvas.height);redrawAll();ctx.save();ctx.strokeStyle='#0078d4';ctx.lineWidth=1;ctx.setLineDash([5,4]);ctx.strokeRect(0,0,canvas.width,canvas.height);ctx.restore();updateStatus('All selected');selStart=null;}
  }
  // Global arrow keys for Y nudge when 3D sel exists
  if(show3D&&view3d&&view3d.sel&&document.activeElement!==document.getElementById('canvas3D')){
    if(e.key==='ArrowUp'){e.preventDefault();nudgeZ(e.shiftKey?10:1);}
    if(e.key==='ArrowDown'){e.preventDefault();nudgeZ(e.shiftKey?-10:-1);}
  }
});

window.addEventListener('resize',()=>{if(show3D&&view3d){view3d.resize();view3d.render();}if(showRulers)drawRulers();});

// ── INIT ──────────────────────────────────────────────────────
ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
redrawAll();setActiveTool('PENCIL');setZoom(100);drawRulers();
updateStatus('Ready — press B to draw polylines · Ctrl+3 to open 3D view');