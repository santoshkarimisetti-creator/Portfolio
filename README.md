# Karimisetti Santosh Kumar – Portfolio

> A high-performance, single-page personal portfolio built with a **Framer-inspired** dark aesthetic, smooth scroll animations, and a fully custom **cyberpunk gun cursor system**.

---

## 🚀 Live Demo

Open `index.html` directly in any modern browser — no build step required.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic) |
| Styling | Vanilla CSS3 (custom properties, glassmorphism, keyframe animations) |
| Animations | [GSAP 3](https://greensock.com/gsap/) + ScrollTrigger, IntersectionObserver API |
| Fonts | Google Fonts — Inter, Roboto Slab, Great Vibes |
| Icons / Assets | Inline SVG (gun cursor), local image assets |
| Deployment | Static — Netlify / GitHub Pages compatible |

> **No frameworks, no build tools, no dependencies beyond GSAP CDN.**

---

## ✨ Features

### Design
- **Dark cyberpunk theme** — near-black `#0a0a0f` base with electric blue `#2E86FF` accents
- **Glassmorphism cards** — `backdrop-filter: blur(12px)` with translucent borders
- **Great Vibes cursive** hero name with GSAP fade-in
- **Radial glow pulse** behind hero section
- **Alternating section backgrounds** for visual rhythm
- **Fully responsive** — mobile layout with hamburger-style compact nav

### Animations
- GSAP hero image scale-in + staggered tagline reveal
- `IntersectionObserver`-based card entrance animations (staggered, reliable on `file://`)
- Scroll-driven section heading reveals (`.reveal` + `.active` CSS class toggle)
- Smooth hero parallax via native scroll event

### Custom Gun Cursor System
The portfolio features a **5-state cyberpunk gun cursor** (desktop only):

| State | Behaviour |
|---|---|
| **Idle** | Gun points right; random bullet fires every 2.5–5 s for fun |
| **Hover** | Gun smoothly lerps (rotates) to aim precisely at hovered element |
| **Click** | Gun performs a full **360° spin** before firing |
| **Fire** | Bullet travels to target with fire trail; muzzle flash + smoke on exit |
| **Impact** | Sparks burst + double shockwave rings at hit point |
| **Redirect** | Original link/button action executes after impact |

Cursor is hidden on mobile (`@media (max-width: 768px)`).

### Dark Mode
- Persists to `localStorage`
- Respects `prefers-color-scheme`
- Toggle button in navbar

---

## 📁 Project Structure

```
Portofolio/
├── index.html              # Single-page app entry point
├── style.css               # All styles (design tokens → components → animations)
├── script.js               # GSAP animations + Gun cursor system
├── resume.pdf              # Downloadable resume
└── assets/
    ├── img/
    │   └── mine-1.jpeg     # Profile photo
    └── Certificates/       # Certificate images (PNG/JPG)
        ├── Prompt Engineering for ChatGPT - Coursera.png
        ├── Data Analysis Using Python - Coursera.png
        ├── Businnes Intelligence&Analytics - NPTEL.png
        ├── Software Engineering -NPTEL.png
        ├── Programming in Modern C++ - NPTEL.png
        ├── Tata Data Visualization internship.png
        ├── Introduction to Generative AI - Coursera.png
        ├── Foundations Data, Data Everywhere - Coursera.png
        ├── Tableau for Beginners.png
        └── Summer Internship @ DataPro.jpg
```

---

## 📋 Sections

| Section | Content |
|---|---|
| **Hero** | Profile photo, name, tagline, location, CTA buttons, social links |
| **About** | Bio paragraphs, skills organised by category (Languages, Web, AI/ML, Databases, Tools) |
| **Projects** | 3 project cards with tech stack pills, description, GitHub/Live links |
| **Certifications** | 10 certification cards with direct links to certificate images |
| **Contact** | Email, phone, LinkedIn, GitHub, Send a Message button |

---

## 🧑‍💻 About Me (Quick Summary)

**Karimisetti Santosh Kumar** — Final-year CSE student at GMR Institute of Technology.

- **AI & Full-Stack Developer** specialising in Python, Flask, Django, React.js, MongoDB
- Built an **AI-powered driver safety system** with real-time ML inference pipeline
- Deployed an **AI resume analyser** on Netlify + Render
- Interned at **DataPro Computers** — shipped production features on a shared codebase
- Holds **10 certifications** from Coursera, NPTEL, and Forage

---

## 🔗 Links

| Platform | URL |
|---|---|
| LinkedIn | https://www.linkedin.com/in/karimisetti-santosh-kumar-78a36a293/ |
| GitHub | https://github.com/santoshkarimisetti-creator |
| Email | santoshkarimisetti@gmail.com |
| AI Resume Analyzer (Live) | https://ai-resume-analyzer-1.netlify.app/ |

---

## 📦 Getting Started

```bash
# No installation required — just open the file
# Option 1: Open directly
start index.html

# Option 2: Use a local dev server (recommended to avoid file:// quirks)
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080` (or `http://localhost:3000` with `serve`).

---


## ⚙️ CSS Custom Properties

Key design tokens in `:root`:

```css
--bg-primary:      #0a0a0f   /* near-black background */
--bg-alt:          #111118   /* alternate section bg  */
--color-primary:   #2E86FF   /* electric blue accent  */
--color-secondary: #00D4FF   /* soft cyan hover       */
--text-white:      #FFFFFF   /* heading text          */
--text-muted:      #A0A8B8   /* body / muted text     */
```

---

## 📄 License

This portfolio is personal work by Karimisetti Santosh Kumar.  
Feel free to use it as inspiration — please don't copy content verbatim.

---

*Built with ❤️ and zero frameworks.*
