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
- **Typography**: Space Grotesk (display headings), Inter (body), JetBrains Mono (terminal accents), Instrument Serif italic (the "Hardware Hacker" accent, the Encogito "actually fit." accent, and the avatar "K").
- **Icons**: Lucide 1.41.0 (pinned on unpkg; `@latest` resolved to it on 2026-09-05), initialized via `lucide.createIcons()` on `DOMContentLoaded`. Lucide dropped its brand icons, so the GitHub and LinkedIn glyphs are inline SVG paths with class `.brand` — don't switch them back to `data-lucide="github"`; it renders nothing.
- **Background**: layered fixed elements — masked dot grid, three slow-drifting aurora gradient blobs (CSS keyframes, transform-only), vignette, and a static SVG film-grain overlay.
- **3D ambient object**: Three.js r128 (CDN) renders a dim wireframe icosahedron with vertex points and two orbital rings on a fixed full-screen canvas (`#ambient-canvas`). It idles slowly and responds to scroll position and mouse parallax (`initAmbient` / `ambientLoop`). The vertex points carry per-vertex colours (`amPtsCol`) and a band of light walks over them each frame — 240 verts, no shader. Offset right on desktop, centered and dimmer on mobile. Skipped entirely under `prefers-reduced-motion`.
- **Page sections** (in order): Hero → Projects (`#projects`) → Experience (`#experience`, includes the education + credentials card) → Encogito (`#encogito`) → Toolkit (`#toolkit`) → Contact → Footer. Ghost numerals and kickers run 01–05 across the five content sections; renumber both if you reorder.

## Content structure

- **Projects** has two tiers. Three *featured* cards (backquest, Nexus, notables — Kieran's pick, in that order) (`.card > .feat`) each pair a visual panel (`.feat-vis`) with copy (`.feat-body`); `.feat.flip` puts the visual on the right on md+. Each featured card ends in a `.status-line` (an honest one-line status) and a `.repo-link`. Below them, a dense index (`.idx-list > a.idx`) — one row per repo with name, language, and a one-sentence description of what it does. Every project links to `https://github.com/KieranK07/<repo>`; repo names are case-sensitive (`Nexus`).
- **Featured visuals** are bespoke inline SVGs, not stock icons. All animation is CSS; the SVG is absolutely positioned inside `.feat-vis` with a 26px strip reserved at the bottom for the `.feat-cap` caption so labels never collide with it.
  - backquest — PC, USB-C link, headset, WiFi arcs. Traffic is two dashed lines animating `stroke-dashoffset` (shared `.flow.flow-r` / `.flow.flow-l` classes); arcs breathe via `.bq-arc` with a `--i` stagger.
  - Nexus — a dashboard window. Tiles (`.nx-tile`) rise in with a `--i` stagger under `.reveal.visible`, the net-worth sparkline (`.nx-spark`) draws itself via `stroke-dashoffset`, and the PTY cursor (`.nx-cur`) reuses the hero's `cur-blink` keyframes.
  - notables — Mac → Windows GPU → vault pipeline. Waveform bars (`.nt-bar`) scale on an alternating loop with negative delays so they're out of phase; hand-offs reuse `.flow.flow-r`; note lines (`.nt-line`) fade in staggered under `.reveal.visible`.
  - loupe is deliberately absent (unfinished; Kieran does not want it presented as shipped). swarf and claudeyes live in the index tier only.
- **Experience** is a reverse-chronological timeline with an HTML comment template above it explaining how to add an entry. Alternate `tl-left` / `tl-right` (with `reveal from-left` / `from-right`) as you go; the line-draw and dot lighting handle any count. `.tl-entry.hot` gives one role the accent border and glow (DUNE). `.tl-date` holds the dates and, for ongoing roles, a `.status-dot` (pinging ring, static under reduced motion). `.tl-tech` is a small mono line for scope keywords. The clinic rebuild entry is deliberately unnamed client work and has no link. Education and the Carbøn Engineer credential share one compact card below the timeline; the ø is written as `&oslash;` on purpose.
- **Encogito** (`.enc`) is a typographic statement card: the verbatim tagline in display type with the serif accent, a short description, a ghost button to encogito.com, and a four-item service list (`.enc-services li`, staggered in via `--i` under `.reveal.visible`). It is intentionally separate from the clinic client work in the timeline — do not merge them or imply one is delivered through the other. Do not add incorporation details.
- **Toolkit** replaces the old percentage skill bars. It is a terminal-window card listing `key = values` rows (`.tk-row`), where every value is a link to a repo or to `#experience`. Rows stagger in via `--i` under `.reveal.visible`. Keep it evidence-based: only list something that has code or a role behind it. There are no proficiency numbers anywhere on the site, and there should not be.
- **Contact** is the terminal-window card: copy-to-clipboard rows for email and phone, a GitHub row, and the LinkedIn button. The footer links the site's own repo. There is intentionally no visitor counter (removed June 2026).

## JavaScript Features

All JS is inline at the bottom of `<body>`:

- **Hero load sequence**: per-letter blur-rise animation on the name (`.lt` spans with inline `animation-delay`), staggered `.h-rev` rises for everything else. Pure CSS animations, no JS.
- **Scroll reveal**: `IntersectionObserver` adds `.visible` to `.reveal` elements. Variants: `.from-left`/`.from-right` (timeline entries slide in from their side) and `.zoom` (cards scale up slightly). `.reveal` goes on *wrapper* divs, never directly on `.card` — the two transition declarations would clobber each other. (`a.idx` rows carry `.reveal` directly; they are not cards, so that is fine.) Section-header kickers tighten their letter-spacing and the `.heading-rule` draws its width when the header reveals. Several child animations key off `.reveal.visible` on the wrapper: `.nx-tile` / `.nx-spark` / `.nx-spark-dot`, `.nt-line`, `.tk-row` toolkit rows, `.enc-services li`.
- **Unified scroll handler** (`updateScrollUI`, rAF-throttled): progress bar width, header glass effect (`.scrolled`), scroll-cue fade, ambient canvas fade, hero parallax fade-out (`#hero-inner` drifts down + fades), ghost-numeral parallax (`--py` custom property on `.sec-ghost`), experience timeline line-draw + dot lighting, and active nav link.
- **Cursor FX** (`initCursorFX`, fine pointers only): a large soft glow (`#cursor-glow`) lerps after the cursor, and `#hero-mouse` (wrapper inside `#hero-inner`) shifts a few px opposite the mouse for depth. Scroll fade owns `#hero-inner`'s transform; mouse parallax owns `#hero-mouse`'s — keep them on separate elements.
- **Card tilt**: `initCardFX` combines the spotlight custom properties with a gentle `perspective/rotateX/rotateY` tilt (max ~3.5°) set as an inline transform, including the `-4px` hover lift since inline overrides the CSS hover.
- **Experience timeline**: `#tl-fill` scaleY tracks scroll; `.tl-entry` gets `.lit` when the line reaches its dot. Alternating left/right on md+, single left rail on mobile.
- **Card spotlight**: pointermove sets `--mx`/`--my` per card; CSS `::before` (interior glow) and `::after` (masked 1px border glow) follow the cursor. Note: `.card`'s `::before`/`::after` are both used by this — don't add other pseudo-element decorations to `.card`. (The `.idx::before` accent bar is on `.idx`, not on a card.)
- **Magnetic buttons**: `[data-magnet]` elements translate toward the cursor (fine pointers only). Don't put CSS *animations* with `fill-mode` on magnet elements — filling animations override the inline transform.
- **Physics bubbles** (`PhysicsBubble`): gravity/bounce "Copied!" notification via `copyAndBounce(event, text)`. The rAF loop runs only while bubbles exist.
- **Ripple effect**: clicking the `K.K.` logo while at the top triggers a full-screen teal ripple.

`prefers-reduced-motion` disables the hero stagger, reveals, blob drift, status-dot ping, magnets, cursor glow, card tilt, hero/ghost parallax, the Three.js canvas, the dashed flow lanes and WiFi arcs, the Nexus tile/sparkline/cursor motion, the notables waveform and note-line stagger, and the toolkit/Encogito row stagger. `<noscript>` forces `.reveal`, `.nx-tile`, `.nx-spark(-dot)`, `.nt-line`, `.tk-row` and `.enc-services li` visible. Init is wrapped so a throwing effect (e.g. no WebGL) can't stop the others; on narrow screens the timeline slide-in offset drops to 16px so it never counts as horizontal overflow.

## Copy rules

The copy follows the same anti-slop rules as the repo READMEs: plain, specific, dry; say what a thing does and how; honest status lines; no proficiency percentages, fake badges, invented metrics or "passionate about" phrasing; no emoji. Banned words include seamless, robust, powerful, comprehensive, cutting-edge, leverage, delve, elevate, unlock, harness, streamline, effortless, elegant. Client work for the clinic stays unnamed (no organisation, domain, pricing, or commentary on their existing site).

## Deployment

Pushing to `main` deploys automatically via GitHub Pages. The custom domain is set in `CNAME` (`chadnerd.lol`).
