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

- **Styling**: Tailwind CSS loaded from CDN, configured inline via a `tailwind.config` script block. Custom colors: `primary-dark` (#0f172a), `accent-neon` (#2dd4bf), `accent-blue` (#38bdf8). Additional custom CSS lives in a `<style>` block in `<head>`.
- **Icons**: Lucide Icons loaded from CDN, initialized via `lucide.createIcons()` on `DOMContentLoaded`.
- **3D background**: Three.js r128 (CDN) renders an animated cyber grid with floating points in the Hero section (`#three-container`). Mouse movement drives camera parallax.
- **Page sections** (in order): Hero → Education → Experience → Skills → Projects → Contact → Footer.

## JavaScript Features

All JS is inline at the bottom of `<body>`:

- **Physics bubbles** (`PhysicsBubble` class): gravity/bounce animation for the "Copied!" notification when contact info is clicked. `copyAndBounce(event, text)` is the entry point.
- **Scroll reveal**: `IntersectionObserver` adds `.visible` to `.scroll-reveal` elements as they enter the viewport.
- **Skill bars**: Second `IntersectionObserver` reads `data-percent` from `.skill-card` elements and animates the `.skill-bar-fill` width when cards scroll into view.
- **Active nav tracking**: `setupActiveNavTracking()` highlights `.nav-link` elements based on scroll position.
- **Education cube**: CSS 3D cube background that rotates on scroll (`applyScrollRotation`).
- **Ripple effect**: Clicking the `K.K.` header logo when already at the top triggers a full-screen teal ripple from the logo position.

## Deployment

Pushing to `main` deploys automatically via GitHub Pages. The custom domain is set in `CNAME` (`chadnerd.lol`).
