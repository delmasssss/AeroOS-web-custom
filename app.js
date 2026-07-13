'use strict';

/* ============================================================
   ICON LIBRARY (inline SVG, stroke-based, 24x24)
   ============================================================ */
const ICONS = {
  devlogs: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h6M9 9h1"/>`,
  monitor: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  terminal: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 9l4 3-4 3M13 15h4"/>`,
  files: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.36.5.6.9.6H21a2 2 0 0 1 0 4h-.09c-.4 0-.76.24-.9.6z"/>`,
  about: `<circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/>`,
  start: `<path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/>`,
  min: `<path d="M6 12h12"/>`,
  max: `<rect x="5" y="5" width="14" height="14" rx="2"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
  folder: `<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  doc: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>`,
};
function svg(name, extra=''){
  return `<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[name]}</svg>`;
}

/* ============================================================
   APP REGISTRY
   ============================================================ */
const APPS = [
  { id:'devlogs',  title:'Devlogs',          icon:'devlogs',  w:520, h:520, render: renderDevlogs },
  { id:'monitor',  title:'Resource Monitor', icon:'monitor',  w:460, h:520, render: renderMonitor },
  { id:'terminal', title:'Terminal',         icon:'terminal', w:560, h:400, render: renderTerminal, onOpen: initTerminal },
  { id:'files',    title:'Files',            icon:'files',    w:480, h:380, render: renderFiles },
  { id:'settings', title:'Settings',         icon:'settings', w:420, h:380, render: renderSettings },
  { id:'about',    title:'About This OS',    icon:'about',    w:380, h:360, render: renderAbout },
];

/* ============================================================
   BOOT SEQUENCE
   ============================================================ */
window.addEventListener('load', () => {
  buildDesktopIcons();
  buildStartMenu();
  startClock();
  startMonitorLoop();
  setTimeout(() => { document.getElementById('boot').classList.add('hide'); }, 1000);
});

/* ============================================================
   DESKTOP ICONS
   ============================================================ */
function buildDesktopIcons(){
  const wrap = document.getElementById('icons');
  APPS.forEach(app => {
    const el = document.createElement('div');
    el.className = 'icon';
    el.innerHTML = `<div class="glyph">${svg(app.icon)}</div><span>${app.title}</span>`;
    el.addEventListener('click', (e) => {
      document.querySelectorAll('.icon.selected').forEach(i=>i.classList.remove('selected'));
      el.classList.add('selected');
      e.stopPropagation();
    });
    el.addEventListener('dblclick', () => openApp(app.id));
    wrap.appendChild(el);
  });
  document.getElementById('desktop').addEventListener('click', () => {
    document.querySelectorAll('.icon.selected').forEach(i=>i.classList.remove('selected'));
  });
}

function buildStartMenu(){
  const list = document.getElementById('sm-list');
  APPS.forEach(app => {
    const el = document.createElement('div');
    el.className = 'sm-item';
    el.innerHTML = `${svg(app.icon)}<span>${app.title}</span>`;
    el.addEventListener('click', () => { openApp(app.id); toggleStart(false); });
    list.appendChild(el);
  });
  document.getElementById('start-btn').addEventListener('click', (e)=>{ e.stopPropagation(); toggleStart(); });
  document.addEventListener('click', (e)=>{
    const menu = document.getElementById('start-menu');
    if(!menu.contains(e.target)) toggleStart(false);
  });
}
function toggleStart(force){
  const menu = document.getElementById('start-menu');
  const btn = document.getElementById('start-btn');
  const open = force !== undefined ? force : !menu.classList.contains('open');
  menu.classList.toggle('open', open);
  btn.classList.toggle('open', open);
}

/* ============================================================
   WINDOW MANAGER
   ============================================================ */
const WM = { windows:{}, zTop:10, activeId:null };
let cascadeOffset = 0;

function openApp(appId){
  const app = APPS.find(a=>a.id===appId);
  if(!app) return;

  if(WM.windows[appId]){
    const w = WM.windows[appId];
    if(w.minimized) restoreWindow(appId); else focusWindow(appId);
    return;
  }

  const layer = document.getElementById('windows-layer');
  const el = document.createElement('div');
  el.className = 'window';
  const left = 90 + (cascadeOffset % 6) * 34;
  const top = 60 + (cascadeOffset % 6) * 28;
  cascadeOffset++;
  el.style.left = left + 'px';
  el.style.top = top + 'px';
  el.style.width = app.w + 'px';
  el.style.height = app.h + 'px';

  el.innerHTML = `
    <div class="titlebar">
      <div class="t-icon">${svg(app.icon)}</div>
      <div class="t-title">${app.title}</div>
      <div class="wbtns">
        <div class="wbtn min" title="Minimize">${''}</div>
        <div class="wbtn max" title="Maximize">${''}</div>
        <div class="wbtn close" title="Close">${''}</div>
      </div>
    </div>
    <div class="wcontent themed-scroll"></div>
    <div class="resize-handle"></div>
  `;
  layer.appendChild(el);
  el.querySelector('.wcontent').innerHTML = app.render();

  WM.windows[appId] = { el, minimized:false, maximized:false, prevRect:null, app };

  wireWindow(appId);
  addTaskbarEntry(appId, app);

  requestAnimationFrame(()=>{ el.classList.add('opening'); });
  focusWindow(appId);

  if(app.onOpen) app.onOpen(el);
}

function wireWindow(appId){
  const w = WM.windows[appId];
  const el = w.el;
  const titlebar = el.querySelector('.titlebar');

  el.addEventListener('mousedown', ()=> focusWindow(appId));

  // ---- dragging (pure JS pointer events) ----
  let dragging=false, sx=0, sy=0, ox=0, oy=0;
  titlebar.addEventListener('pointerdown', (e)=>{
    if(e.target.closest('.wbtn')) return;
    if(w.maximized) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    const rect = el.getBoundingClientRect();
    ox = rect.left; oy = rect.top;
    el.classList.add('dragging');
    titlebar.setPointerCapture(e.pointerId);
    focusWindow(appId);
  });
  titlebar.addEventListener('pointermove', (e)=>{
    if(!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    let nx = ox+dx, ny = oy+dy;
    ny = Math.max(0, ny);
    el.style.left = nx+'px';
    el.style.top = ny+'px';
  });
  function endDrag(e){
    if(!dragging) return;
    dragging=false;
    el.classList.remove('dragging');
    try{ titlebar.releasePointerCapture(e.pointerId); }catch(err){}
  }
  titlebar.addEventListener('pointerup', endDrag);
  titlebar.addEventListener('pointercancel', endDrag);

  // ---- resizing ----
  const handle = el.querySelector('.resize-handle');
  let resizing=false, rsx=0, rsy=0, rw=0, rh=0;
  handle.addEventListener('pointerdown', (e)=>{
    resizing = true; rsx=e.clientX; rsy=e.clientY;
    const rect = el.getBoundingClientRect();
    rw=rect.width; rh=rect.height;
    handle.setPointerCapture(e.pointerId);
    e.stopPropagation();
  });
  handle.addEventListener('pointermove', (e)=>{
    if(!resizing) return;
    const nw = Math.max(340, rw + (e.clientX-rsx));
    const nh = Math.max(220, rh + (e.clientY-rsy));
    el.style.width = nw+'px';
    el.style.height = nh+'px';
  });
  handle.addEventListener('pointerup', (e)=>{ resizing=false; try{handle.releasePointerCapture(e.pointerId);}catch(err){} });

  // ---- controls ----
  el.querySelector('.wbtn.close').addEventListener('click', (e)=>{ e.stopPropagation(); closeWindow(appId); });
  el.querySelector('.wbtn.min').addEventListener('click', (e)=>{ e.stopPropagation(); minimizeWindow(appId); });
  el.querySelector('.wbtn.max').addEventListener('click', (e)=>{ e.stopPropagation(); toggleMaximize(appId); });
  titlebar.addEventListener('dblclick', ()=> toggleMaximize(appId));
}

function focusWindow(appId){
  const w = WM.windows[appId];
  if(!w) return;
  document.querySelectorAll('.window.active').forEach(el=>el.classList.remove('active'));
  WM.zTop += 1;
  w.el.style.zIndex = WM.zTop;
  w.el.classList.add('active');
  WM.activeId = appId;
  document.querySelectorAll('.tb-app').forEach(t=>t.classList.remove('active'));
  const tb = document.getElementById('tb-'+appId);
  if(tb) tb.classList.add('active');
}

function closeWindow(appId){
  const w = WM.windows[appId];
  if(!w) return;
  w.el.classList.add('closing');
  setTimeout(()=>{
    w.el.remove();
    delete WM.windows[appId];
    const tb = document.getElementById('tb-'+appId);
    if(tb) tb.remove();
  }, 260);
}

function minimizeWindow(appId){
  const w = WM.windows[appId];
  if(!w) return;
  w.minimized = true;
  w.el.classList.remove('opening');
  w.el.classList.add('minimizing');
  setTimeout(()=>{ w.el.style.display='none'; }, 320);
  document.querySelectorAll('.tb-app').forEach(t=>t.classList.remove('active'));
}

function restoreWindow(appId){
  const w = WM.windows[appId];
  if(!w) return;
  w.minimized = false;
  w.el.style.display='flex';
  w.el.classList.remove('minimizing');
  requestAnimationFrame(()=> w.el.classList.add('opening'));
  focusWindow(appId);
}

function toggleMaximize(appId){
  const w = WM.windows[appId];
  if(!w) return;
  const el = w.el;
  if(!w.maximized){
    w.prevRect = { left:el.style.left, top:el.style.top, width:el.style.width, height:el.style.height };
    el.style.left='0px'; el.style.top='0px';
    el.style.width='100vw'; el.style.height=`calc(100vh - var(--taskbar-h))`;
    el.classList.add('maximized');
    w.maximized = true;
  } else {
    el.classList.remove('maximized');
    el.style.left=w.prevRect.left; el.style.top=w.prevRect.top;
    el.style.width=w.prevRect.width; el.style.height=w.prevRect.height;
    w.maximized = false;
  }
  focusWindow(appId);
}

function addTaskbarEntry(appId, app){
  const bar = document.getElementById('tb-apps');
  const el = document.createElement('div');
  el.className = 'tb-app';
  el.id = 'tb-'+appId;
  el.innerHTML = `${svg(app.icon)}<span>${app.title}</span><div class="dot"></div>`;
  el.addEventListener('click', ()=>{
    const w = WM.windows[appId];
    if(!w) return;
    if(w.minimized){ restoreWindow(appId); }
    else if(WM.activeId===appId){ minimizeWindow(appId); }
    else { focusWindow(appId); }
  });
  bar.appendChild(el);
}

/* ============================================================
   RIPPLE (micro-interaction for buttons)
   ============================================================ */
document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.btn');
  if(!btn) return;
  const r = document.createElement('span');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  r.className='ripple';
  r.style.width = r.style.height = size+'px';
  r.style.left = (e.clientX-rect.left-size/2)+'px';
  r.style.top = (e.clientY-rect.top-size/2)+'px';
  btn.appendChild(r);
  setTimeout(()=>r.remove(), 620);
});

/* ============================================================
   CLOCK
   ============================================================ */
function startClock(){
  function tick(){
    const now = new Date();
    document.getElementById('clock-time').textContent =
      now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
    document.getElementById('clock-date').textContent =
      now.toLocaleDateString([], {weekday:'short', month:'short', day:'numeric'});
  }
  tick(); setInterval(tick, 1000);
}

/* ============================================================
   RESOURCE MONITOR — simulated live stats
   ============================================================ */
const SYS = { cpu:34, ram:52, gpu:21 };
function jitter(v, min, max, step){
  let nv = v + (Math.random()*2-1)*step;
  return Math.max(min, Math.min(max, nv));
}
function startMonitorLoop(){
  setInterval(()=>{
    SYS.cpu = jitter(SYS.cpu, 8, 92, 14);
    SYS.ram = jitter(SYS.ram, 20, 88, 8);
    SYS.gpu = jitter(SYS.gpu, 4, 78, 12);
    updateMonitorUI();
  }, 1000);
}
function updateMonitorUI(){
  const cpuEl = document.getElementById('tray-cpu');
  const ramEl = document.getElementById('tray-ram');
  if(cpuEl) cpuEl.style.width = SYS.cpu+'%';
  if(ramEl) ramEl.style.width = SYS.ram+'%';

  ['cpu','ram','gpu'].forEach(key=>{
    const val = Math.round(SYS[key]);
    const circle = document.getElementById('gauge-'+key);
    const label = document.getElementById('gval-'+key);
    const row = document.getElementById('mrow-'+key);
    if(circle){
      const r = 42, c = 2*Math.PI*r;
      circle.style.strokeDasharray = c;
      circle.style.strokeDashoffset = c - (val/100)*c;
    }
    if(label) label.textContent = val+'%';
    if(row){
      row.querySelector('.mr-fill').style.width = val+'%';
      row.querySelector('.mr-val').textContent = val+'%';
    }
  });
}

/* ============================================================
   APP RENDERERS
   ============================================================ */
function renderDevlogs(){
  return `
  <div class="app-pad">
    <h2 class="app-h">Devlogs</h2>
    <p class="app-sub">Build journal · AERO OS v1.0</p>

    <div class="log-entry">
      <span class="log-tag">LOG 01 · STRUCTURE &amp; UI/UX</span>
      <h3>Laying the instrument panel</h3>
      <p>Before writing a line of window logic, the layout was mapped out as three layers: a desktop canvas, a floating window layer, and a persistent taskbar. Keeping these as separate stacking contexts made z-index management predictable later.</p>
      <p>The visual language settled on a HUD/glass cockpit feel — deep navy gradients, a signal-cyan accent, and <code>backdrop-filter: blur()</code> panels — because it reads as "operating system" without copying an existing OS. Type pairing: <code>Orbitron</code> for display numerals, <code>Rajdhani</code> for wide-tracked labels, <code>Inter</code> for body copy, <code>JetBrains Mono</code> for the terminal.</p>
    </div>

    <div class="log-entry">
      <span class="log-tag">LOG 02 · SMOOTH DRAGGING</span>
      <h3>Pointer events over mouse events</h3>
      <p>Dragging uses <code>pointerdown / pointermove / pointerup</code> with <code>setPointerCapture</code> so the drag keeps tracking even if the cursor moves faster than the browser repaints, or leaves the titlebar entirely. Position updates write directly to <code>left/top</code> inside the move handler — no timers, no layout thrashing.</p>
      <p>Every <code>mousedown</code> on a window calls <code>focusWindow()</code>, which bumps a global <code>zTop</code> counter and re-applies <code>z-index</code>. The active window also gets a stronger drop-shadow and a faint cyan glow via a CSS class swap, so "on top" and "in focus" both feel physically true.</p>
    </div>

    <div class="log-entry">
      <span class="log-tag">LOG 03 · POLISH &amp; RESOURCE MONITOR</span>
      <h3>Bringing it to life</h3>
      <p>Opening a window animates <code>scale(.9) → scale(1)</code> with a spring-flavored <code>cubic-bezier</code>; minimizing slides the whole window toward the taskbar and fades it out before hiding it. Closing reverses the open animation.</p>
      <p>The Resource Monitor simulates CPU/RAM/GPU with small randomized "jitter" steps every second, feeding both SVG ring gauges (via <code>stroke-dashoffset</code>) and linear bars — both animated with CSS <code>transition</code>, so the numbers glide instead of jumping. The same values feed two tiny bars in the taskbar tray.</p>
    </div>
  </div>`;
}

function renderMonitor(){
  function ring(id, color){
    const r=42, c=2*Math.PI*r;
    return `<svg width="100" height="100" viewBox="0 0 100 100">
      <circle class="gauge-track" cx="50" cy="50" r="${r}"/>
      <circle id="gauge-${id}" class="gauge-fill" cx="50" cy="50" r="${r}" stroke="${color}" stroke-dasharray="${c}" stroke-dashoffset="${c}"/>
    </svg>`;
  }
  return `
  <div class="app-pad">
    <h2 class="app-h">System Resource Monitor</h2>
    <p class="app-sub">Live simulated telemetry · refresh 1s</p>

    <div class="gauges">
      <div class="gauge">
        ${ring('cpu','#5eead4')}
        <div class="gauge-label-wrap"><div class="gauge-val" id="gval-cpu" style="color:#5eead4">--%</div><div class="gauge-name">CPU</div></div>
      </div>
      <div class="gauge">
        ${ring('ram','#fbbf24')}
        <div class="gauge-label-wrap"><div class="gauge-val" id="gval-ram" style="color:#fbbf24">--%</div><div class="gauge-name">RAM</div></div>
      </div>
      <div class="gauge">
        ${ring('gpu','#fb7185')}
        <div class="gauge-label-wrap"><div class="gauge-val" id="gval-gpu" style="color:#fb7185">--%</div><div class="gauge-name">GPU</div></div>
      </div>
    </div>

    <div class="mon-rows">
      <div class="mon-row" id="mrow-cpu"><div class="mr-label">Core Load</div><div class="mr-track"><div class="mr-fill" style="background:#5eead4;width:0%"></div></div><div class="mr-val">0%</div></div>
      <div class="mon-row" id="mrow-ram"><div class="mr-label">Memory</div><div class="mr-track"><div class="mr-fill" style="background:#fbbf24;width:0%"></div></div><div class="mr-val">0%</div></div>
      <div class="mon-row" id="mrow-gpu"><div class="mr-label">Graphics</div><div class="mr-track"><div class="mr-fill" style="background:#fb7185;width:0%"></div></div><div class="mr-val">0%</div></div>
    </div>

    <div class="mon-meta">
      <div>UPTIME <b id="mon-uptime">00:00:00</b></div>
      <div>PROCESSES <b>127</b></div>
      <div>THREADS <b>842</b></div>
    </div>
  </div>`;
}

function renderTerminal(){
  return `
  <div class="term themed-scroll" id="term-body">
    <div class="line">AERO OS Terminal — type <span style="color:#5eead4">help</span> to see available commands.</div>
    <div id="term-log"></div>
    <div class="term-input-row">
      <span class="prompt">❯</span>
      <input type="text" id="term-input" autocomplete="off" spellcheck="false" placeholder="type a command...">
    </div>
  </div>`;
}
function initTerminal(rootEl){
  const input = rootEl.querySelector('#term-input');
  const log = rootEl.querySelector('#term-log');
  const body = rootEl.querySelector('#term-body');
  const history = []; let hIdx = -1;

  function print(text, cls=''){
    const d = document.createElement('div');
    d.className = 'line '+cls;
    d.textContent = text;
    log.appendChild(d);
    body.scrollTop = body.scrollHeight;
  }
  function printCmd(text){ print(text, 'cmd'); }

  const COMMANDS = {
    help: ()=>`Available commands:
  help        show this list
  about       about AERO OS
  neofetch    system summary
  date        current date & time
  echo <txt>  print text back
  whoami      current user
  clear       clear the terminal
  apps        list installed apps
  open <app>  launch an app (devlogs, monitor, terminal, files, settings, about)`,
    about: ()=>`AERO OS — a pure HTML/CSS/JS desktop environment. No frameworks. No TypeScript. Built for buttery-smooth window management.`,
    neofetch: ()=>`AERO OS v1.0
------------------
OS:      AERO OS (Web Runtime)
Kernel:  vanilla-js 1.0
Uptime:  ${document.getElementById('mon-uptime') ? document.getElementById('mon-uptime').textContent : 'n/a'}
CPU:     ${Math.round(SYS.cpu)}%  RAM: ${Math.round(SYS.ram)}%  GPU: ${Math.round(SYS.gpu)}%
Shell:   aero-sh`,
    date: ()=> new Date().toString(),
    whoami: ()=> 'guest@aero-os',
    apps: ()=> APPS.map(a=>'- '+a.title).join('\n'),
    clear: ()=>{ log.innerHTML=''; return null; },
  };

  input.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){
      const raw = input.value.trim();
      if(raw.length){
        printCmd(raw);
        history.push(raw); hIdx = history.length;
        const [cmd, ...rest] = raw.split(' ');
        if(cmd==='echo'){ print(rest.join(' ')); }
        else if(cmd==='open'){
          const target = rest[0];
          const found = APPS.find(a=>a.id===target);
          if(found){ openApp(found.id); print('Launching '+found.title+'…', 'ok'); }
          else print('open: app not found — try: apps', 'err');
        }
        else if(COMMANDS[cmd]){
          const out = COMMANDS[cmd]();
          if(out !== null && out !== undefined) print(out);
        }
        else if(cmd){
          print(`command not found: ${cmd} (try 'help')`, 'err');
        }
      }
      input.value='';
    } else if(e.key==='ArrowUp'){
      if(hIdx>0){ hIdx--; input.value = history[hIdx]; }
      e.preventDefault();
    } else if(e.key==='ArrowDown'){
      if(hIdx<history.length-1){ hIdx++; input.value = history[hIdx]; } else { hIdx=history.length; input.value=''; }
      e.preventDefault();
    }
  });
  rootEl.addEventListener('click', ()=> input.focus());
  setTimeout(()=>input.focus(), 350);
}

function renderFiles(){
  const items = [
    ['folder','Projects'], ['folder','Devlogs Archive'], ['doc','flight-notes.txt'],
    ['doc','readme.md'], ['folder','Screenshots'], ['doc','todo.txt'],
    ['folder','Downloads'], ['doc','system.log'],
  ];
  return `
  <div class="app-pad">
    <h2 class="app-h">Files</h2>
    <p class="app-sub">/home/guest</p>
    <div class="file-grid">
      ${items.map(([icon,name])=>`
        <div class="file-item">
          <div class="fi-icon">${svg(icon)}</div>
          <span>${name}</span>
        </div>`).join('')}
    </div>
  </div>`;
}

function renderSettings(){
  return `
  <div class="app-pad">
    <h2 class="app-h">Settings</h2>
    <p class="app-sub">Personalize AERO OS</p>

    <div class="set-row">
      <div><div class="sr-label">Accent Color</div><div class="sr-desc">Applied across windows, icons and highlights</div></div>
      <div class="swatches">
        <div class="swatch active" style="background:#5eead4" data-accent="#5eead4;rgba(94,234,212,.16);rgba(94,234,212,.55)"></div>
        <div class="swatch" style="background:#fbbf24" data-accent="#fbbf24;rgba(251,191,36,.16);rgba(251,191,36,.55)"></div>
        <div class="swatch" style="background:#8b9dff" data-accent="#8b9dff;rgba(139,157,255,.16);rgba(139,157,255,.55)"></div>
        <div class="swatch" style="background:#fb7185" data-accent="#fb7185;rgba(251,113,133,.16);rgba(251,113,133,.55)"></div>
      </div>
    </div>

    <div class="set-row">
      <div><div class="sr-label">Reduce Motion</div><div class="sr-desc">Shorten window and hover animations</div></div>
      <div class="toggle" id="motion-toggle"></div>
    </div>

    <div class="set-row">
      <div><div class="sr-label">Window Snap Cascade</div><div class="sr-desc">New windows open in a staggered cascade</div></div>
      <div class="toggle on" id="cascade-toggle"></div>
    </div>

    <div class="set-row" style="border-bottom:none;">
      <button class="btn primary" id="reset-btn">Reset Layout</button>
    </div>
  </div>`;
}

document.addEventListener('click', (e)=>{
  const sw = e.target.closest('.swatch');
  if(sw){
    document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
    sw.classList.add('active');
    const [accent, soft, glow] = sw.dataset.accent.split(';');
    document.documentElement.style.setProperty('--accent', accent);
    document.documentElement.style.setProperty('--accent-soft', soft);
    document.documentElement.style.setProperty('--accent-glow', glow);
  }
  const mt = e.target.closest('#motion-toggle');
  if(mt){
    mt.classList.toggle('on');
    document.documentElement.style.setProperty('--anim-scale', mt.classList.contains('on') ? '0' : '1');
    document.body.style.setProperty('transition-duration', mt.classList.contains('on') ? '0s' : '');
  }
  const ct = e.target.closest('#cascade-toggle');
  if(ct){ ct.classList.toggle('on'); }
  const rb = e.target.closest('#reset-btn');
  if(rb){ Object.keys(WM.windows).forEach(closeWindow); cascadeOffset = 0; }
});

function renderAbout(){
  return `
  <div class="app-pad">
    <div class="about-badge">${svg('about')}</div>
    <h2 class="app-h">AERO OS</h2>
    <p class="app-sub">Version 1.0 · Vanilla Web Runtime</p>
    <p style="font-family:'Inter',sans-serif;font-size:13px;color:var(--text-mid);line-height:1.6;">
      A beginner-friendly web-based operating system built entirely with HTML5, CSS3 and native JavaScript —
      no frameworks, no build step, no TypeScript.
    </p>
    <div class="about-grid">
      <div class="k">Engine</div><div class="v">Vanilla JS (ES6)</div>
      <div class="k">Rendering</div><div class="v">CSS3 / backdrop-filter</div>
      <div class="k">Window Mgmt</div><div class="v">Custom, Pointer Events</div>
      <div class="k">Fonts</div><div class="v">Orbitron · Rajdhani · Inter · JetBrains Mono</div>
    </div>
  </div>`;
}

/* uptime ticker for monitor app meta row */
(function(){
  const bootTime = Date.now();
  setInterval(()=>{
    const el = document.getElementById('mon-uptime');
    if(!el) return;
    const s = Math.floor((Date.now()-bootTime)/1000);
    const hh = String(Math.floor(s/3600)).padStart(2,'0');
    const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    el.textContent = `${hh}:${mm}:${ss}`;
  }, 1000);
})();
