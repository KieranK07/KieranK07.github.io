# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static personal portfolio website for Kieran Kelly, hosted on GitHub Pages at **chadnerd.lol**. The entire site lives in a single file: `index.html`.

## Running Locally

No build process — open `index.html` directly in a browser:

```sh
open index.html
```

## Architecture

Everything is self-contained in `index.html`:

- **Styling**: Tailwind CSS from CDN, configured inline via a `tailwind.config` script block. Custom colors: `primary-dark` (#060b14), `accent-neon` (#2dd4bf), `accent-blue` (#38bdf8). All custom CSS lives in a `<style>` block in `<head>`.
- **Typography**: Space Grotesk (display headings), Inter (body), JetBrains Mono (terminal accents), Instrument Serif italic (the "Hardware Hacker" accent and avatar "K").
- **Icons**: Lucide Icons from CDN, initialized via `lucide.createIcons()` on `DOMContentLoaded`.
- **Background**: layered fixed elements — masked dot grid, three slow-drifting aurora gradient blobs (CSS keyframes, transform-only), vignette, and a static SVG film-grain overlay.
- **3D ambient object**: Three.js r128 (CDN) renders a dim wireframe icosahedron with vertex points and two orbital rings on a fixed full-screen canvas (`#ambient-canvas`). It idles slowly and responds to scroll position and mouse parallax (`initAmbient` / `ambientLoop`). Offset right on desktop, centered and dimmer on mobile. Skipped entirely under `prefers-reduced-motion`.
- **Page sections** (in order): Hero → Education → Experience → Expertise (`#skills`) → Projects → Contact → Footer.

## JavaScript Features

All JS is inline at the bottom of `<body>`:

- **Hero load sequence**: per-letter blur-rise animation on the name (`.lt` spans with inline `animation-delay`), staggered `.h-rev` rises for everything else. Pure CSS animations, no JS.
- **Scroll reveal**: `IntersectionObserver` adds `.visible` to `.reveal` elements. Variants: `.from-left`/`.from-right` (timeline entries slide in from their side) and `.zoom` (cards scale up slightly). `.reveal` goes on *wrapper* divs, never directly on `.card` — the two transition declarations would clobber each other. Section-header kickers tighten their letter-spacing and the `.heading-rule` draws its width when the header reveals (CSS child selectors on `.reveal.visible`).
- **Unified scroll handler** (`updateScrollUI`, rAF-throttled): progress bar width, header glass effect (`.scrolled`), scroll-cue fade, ambient canvas fade, hero parallax fade-out (`#hero-inner` drifts down + fades), ghost-numeral parallax (`--py` custom property on `.sec-ghost`), experience timeline line-draw + dot lighting, and active nav link.
- **Cursor FX** (`initCursorFX`, fine pointers only): a large soft glow (`#cursor-glow`) lerps after the cursor, and `#hero-mouse` (wrapper inside `#hero-inner`) shifts a few px opposite the mouse for depth. Scroll fade owns `#hero-inner`'s transform; mouse parallax owns `#hero-mouse`'s — keep them on separate elements.
- **Card tilt**: `initCardFX` combines the spotlight custom properties with a gentle `perspective/rotateX/rotateY` tilt (max ~3.5°) set as an inline transform, including the `-4px` hover lift since inline overrides the CSS hover.
- **Experience timeline**: `#tl-fill` scaleY tracks scroll; `.tl-entry` gets `.lit` when the line reaches its dot. Alternating left/right on md+, single left rail on mobile.
- **Card spotlight**: pointermove sets `--mx`/`--my` per card; CSS `::before` (interior glow) and `::after` (masked 1px border glow) follow the cursor. Note: `.card`'s `::before`/`::after` are both used by this — don't add other pseudo-element decorations to `.card`.
- **Magnetic buttons**: `[data-magnet]` elements translate toward the cursor (fine pointers only). Don't put CSS *animations* with `fill-mode` on magnet elements — filling animations override the inline transform.
- **Skill bars + count-up**: `IntersectionObserver` on `.bar-trigger` elements reads `data-fill`, sets `.skill-bar-fill` width, and animates any `.count-up` span (`data-count`).
- **Physics bubbles** (`PhysicsBubble`): gravity/bounce "Copied!" notification via `copyAndBounce(event, text)`. The rAF loop runs only while bubbles exist.
- **Ripple effect**: clicking the `K.K.` logo while at the top triggers a full-screen teal ripple.

The Expertise cards are `flex flex-col` with `flex-1` descriptions so the proficiency bars bottom-align across the row regardless of text length. There is intentionally no visitor counter (removed June 2026).

`prefers-reduced-motion` disables the hero stagger, reveals, blob drift, shimmer, magnets, cursor glow, card tilt, hero/ghost parallax, and the Three.js canvas.

## Deployment

Pushing to `main` deploys automatically via GitHub Pages. The custom domain is set in `CNAME` (`chadnerd.lol`).
