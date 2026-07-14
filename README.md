# AERO OS 🛰️

A complete **web-based operating system**, built entirely with **pure vanilla HTML5, CSS3 and JavaScript** — no frameworks, no build step, no TypeScript. A single, self-contained HTML file implementing a window manager, a desktop, a taskbar, and several working apps.

"HUD/cockpit" aesthetic: glassmorphism, deep blurs, glowing borders, signal-cyan accent on a deep navy background.

![status](https://img.shields.io/badge/status-stable-5eead4) ![tech](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-0f1524) ![license](https://img.shields.io/badge/license-MIT-fbbf24) ![deps](https://img.shields.io/badge/dependencies-0-5eead4)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#️-project-structure)
- [Technical Architecture](#-technical-architecture)
- [Included Apps](#-included-apps)
- [Customization](#-customization)
- [Browser Compatibility](#-browser-compatibility)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🪟 Custom Window Manager (Pure JS)
- Smooth dragging via the **Pointer Events API** (`pointerdown` / `pointermove` / `pointerup`) with `setPointerCapture`, so the drag never "drops" even when the cursor moves fast or leaves the titlebar.
- **Dynamic focus**: clicking or dragging any window instantly brings it to the front through a global `z-index` counter.
- **Active drop-shadow**: the focused or dragged window gets a deeper shadow and a cyan glow, giving it a real "lifted off the desktop" feel.
- Free resizing from the bottom-right corner.
- Fully working **Close**, **Minimize**, and **Maximize/Restore** buttons (also toggleable via double-click on the titlebar).

### 🎨 Pro Max UI/UX
- **Glassmorphism**: semi-transparent panels with `backdrop-filter: blur(20px) saturate(140%)` and thin glowing 1px borders.
- **Micro-interactions**: desktop icons scale up (`scale(1.08)`) and glow on hover; buttons trigger a ripple effect on click.
- **Window animations**: opening scales from `0.9 → 1` on a spring-style `cubic-bezier` curve; minimizing slides smoothly down to the taskbar; closing fades and scales back down.
- Subtle HUD grid on the desktop background plus a radial glow for depth.

### 📓 Devlogs App
A window with a custom themed scrollbar containing **3 detailed logs** documenting the development process:
1. **Structure & UI/UX** — how the layers (desktop, windows, taskbar) and design system were planned.
2. **Smooth Drag & Drop** — implementing dragging with Pointer Events and managing z-index.
3. **Polish & Resource Monitor** — final animation polish and integrating the system monitor.

### 📊 System Resource Monitor (Bonus)
- Animated **circular SVG gauges** for CPU, RAM, and GPU, with `stroke-dashoffset` transitioning smoothly every second.
- Matching linear bars animated via CSS `width` transitions.
- Simulated values with small randomized "jitter" for a realistic feel.
- The same live data also feeds two mini bars in the taskbar tray.
- Live system uptime counter.

### 💻 Working Terminal
- Text input with command history (↑ / ↓ arrows).
- Available commands: `help`, `about`, `neofetch`, `date`, `echo <text>`, `whoami`, `apps`, `open <app>`, `clear`.
- Monospace font (`JetBrains Mono`) for a clean tech look.

### 🧭 Dynamic Taskbar / Dock
- Fully working **Start Menu** listing every installed app.
- Active-app indicators (a glowing dot under running apps in the taskbar).
- Live clock with date.
- No password: instant boot with a 1-second "System Initializing..." splash screen.

### 🗃️ Extra Apps Included
- **Files** — a static file explorer with folder/document icons.
- **Settings** — accent color switcher, "reduce motion" toggle, window layout reset.
- **About This OS** — build info and tech stack overview.

---

## 🚀 Quick Start

No installation, no dependencies to download.

```bash
git clone https://github.com/your-username/aero-os.git
cd aero-os
```

**Option 1 — open directly**
Just double-click `aero-os.html` to open it in your browser.

**Option 2 — run a small local server** (recommended, avoids potential browser security restrictions on local files)
```bash
npx serve .
# or
python3 -m http.server 8080
```
Then go to `http://localhost:8080/aero-os.html`.

---

## 🗂️ Project Structure

```
aero-os/
├── aero-os.html     # the entire project: markup, CSS and JS in a single file
├── README.md        # this file
└── .gitignore
```

The project is intentionally **single-file**: no build tool, bundler, or application server required. Everything — structure, style, and logic — lives inside `aero-os.html`, organized into three clear blocks: `<style>`, HTML markup, `<script>`.

### Internal file organization

```
aero-os.html
├── <style>
│   ├── Design tokens (:root — colors, radius, fonts)
│   ├── Boot screen
│   ├── Desktop & icons
│   ├── Windows (window, titlebar, animations)
│   ├── Taskbar & Start Menu
│   └── Per-app styles (Devlogs, Monitor, Terminal, Files, Settings, About)
│
└── <script>
    ├── Inline SVG icon library
    ├── APPS[]              → registry of installed applications
    ├── Boot sequence
    ├── Desktop icons + Start Menu (rendered dynamically from APPS[])
    ├── Window Manager (WM)  → open / focus / drag / resize / minimize / maximize / close
    ├── Taskbar entries + ripple effect
    ├── Clock
    ├── Resource Monitor loop (simulated data every 1s)
    └── Render functions per app (renderDevlogs, renderMonitor, renderTerminal, ...)
```

---

## 🛠️ Technical Architecture

| Layer      | Technology |
|------------|------------|
| Markup     | Semantic HTML5 |
| Styling    | CSS3 — custom properties, `backdrop-filter`, `cubic-bezier`, `::-webkit-scrollbar` |
| Logic      | Vanilla ES6 JavaScript — Pointer Events API, `requestAnimationFrame`, `setInterval` |
| Fonts      | Orbitron · Rajdhani · Inter · JetBrains Mono (Google Fonts, via CDN) |
| Dependencies | **None** — zero frameworks, zero libraries, zero build step |

**Declarative app registry**: every application is defined as an object in `APPS[]` with an `id`, `title`, icon, default size, and a render function — adding a new app only requires one entry in the array plus a `renderXxx()` function, with no changes needed to the window manager itself.

**Isolated Window Manager**: all window logic (`openApp`, `focusWindow`, `closeWindow`, `minimizeWindow`, `toggleMaximize`) is centralized in a single state object (`WM`), kept separate from individual apps' content.

---

## 🎛️ Included Apps

| App | Description |
|---|---|
| **Devlogs** | 3 detailed development logs |
| **Resource Monitor** | Live CPU / RAM / GPU gauges |
| **Terminal** | Text shell with commands |
| **Files** | Static file explorer |
| **Settings** | Theme customization |
| **About This OS** | Build info & stack overview |

---

## 🎨 Customization

- **Accent color**: changeable live from the Settings app (applied via CSS custom properties `--accent`, `--accent-soft`, `--accent-glow`), or directly in the CSS `:root`.
- **New app**: add an entry to `APPS[]` with a `renderYourApp()` function that returns the window's HTML.
- **Fonts/theme**: all color, radius, and spacing values are centralized as CSS custom properties in `:root`, making them easy to swap out.

---

## 🌐 Browser Compatibility

Requires support for `backdrop-filter` and the Pointer Events API — works in all recent versions of:
- Chrome / Edge
- Firefox
- Safari (macOS/iOS)

---

## 🗺️ Roadmap

- [ ] Window layout persistence (localStorage)
- [ ] Draggable desktop icons
- [ ] Window edge-snapping
- [ ] Multiple desktops / virtual workspaces
- [ ] Light theme

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the project
2. Create a branch (`git checkout -b feature/feature-name`)
3. Commit your changes (`git commit -m 'Add feature-name'`)
4. Push the branch (`git push origin feature/feature-name`)
5. Open a Pull Request

---

## 📄 License

Distributed under the [MIT](LICENSE) license.
