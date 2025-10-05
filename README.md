# Biglight Frontend Challenge

**Oscar Beamish** • 5th October 2025

Modular landing page builder for the George at ASDA challenge. JSON-based CMS with static HTML/CSS output.

## Quick Start

```bash
npm install
npm run build    # generates dist/index.html
npm run dev      # opens at http://localhost:8080
```

## What It Does

Account managers edit Google Sheets, which exports to JSON, then build script generates static HTML/CSS. (For this demo, just using JSON directly.)

Handles:
- Variable layouts (1-3 columns)
- Multiple CTAs per block
- Image zoom + slideshows
- Text overlays

## Tech Stack

- Node.js build script
- Handlebars templates
- SCSS (BEM naming)
- Vanilla JS

## Structure

```
├── data/              # JSON data (modules, blocks, CTAs)
├── src/
│   ├── scripts/       # Build script + slideshow
│   ├── templates/     # Handlebars templates
│   └── styles/        # SCSS with BEM
├── dist/              # Generated HTML/CSS
├── SOLUTION.md        # My architectural approach
└── AI-USAGE.md        # AI transparency
```

## How It Works

Three relational JSON files:
- `modules.json` - Page sections (layouts)
- `blocks.json` - Content blocks (images, text, effects)
- `ctas.json` - Call-to-action buttons

Build script joins them, Handlebars renders HTML, SCSS compiles to CSS.

## Documentation

- **SOLUTION.md** - Full architectural explanation and decision-making
- **AI-USAGE.md** - Transparent AI usage disclosure
