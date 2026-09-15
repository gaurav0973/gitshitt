---
name: soft-clay-design
description: Soft Clay / Claymorphism design system for tactile, pastel, 3D UI. Use when building or restyling any page, component, layout, or dashboard in this project. Applies warm cream backgrounds, sage sidebar surfaces, pill radii, volumetric shadows, inset recesses, and rounded sans-serif typography via Tailwind CSS 4 tokens.
---

# Soft Clay Design System

Apply this skill whenever implementing UI in this project. The reference image defines a **Claymorphism** aesthetic: matte plastic/clay surfaces, extreme rounding, soft volumetric depth, and a warm pastel palette. Every screen should feel like one cohesive physical toy dashboard — not a flat SaaS template.

## Design essence (non-negotiables)

1. **No sharp corners** — minimum `rounded-2xl` (16px) on containers; prefer `rounded-3xl`–`rounded-[32px]`; buttons and pills are fully rounded.
2. **Depth via shadows, not borders** — avoid 1px outline borders. Elevation = outer shadow stacks; recess = inset shadows.
3. **Matte pastels only** — desaturated, warm tones. No pure black, no neon, no metallic gradients.
4. **Top-down lighting** — lighter top edge, darker bottom; shadows carry a warm brown tint, not cold gray-black.
5. **Tactile hierarchy** — background (furthest) → cards (raised) → buttons/icons (most raised or inset).
6. **Friendly tone** — rounded sans-serif type, sentence case, conversational copy.

## Quick start workflow

1. Read existing Tailwind entry (`src/app/globals.css`) and extend — do not replace unrelated tokens.
2. Merge tokens from [references/design-tokens.css](references/design-tokens.css) into `@theme inline`.
3. Use component patterns from [references/components.md](references/components.md).
4. Pair with `tailwind-4-docs` skill for utility syntax and `frontend-design` for copy/layout judgment.
5. Before finishing, run the checklist at the bottom of this file.

## Color system

| Token | Hex | Role |
|-------|-----|------|
| `--clay-bg` | `#FAF7F2` | Page background (warm cream) |
| `--clay-bg-alt` | `#FDF6F0` | Alternate page wash |
| `--clay-sidebar` | `#C8D9D2` | Sidebar / nav pillar |
| `--clay-sidebar-active` | `#DDE8E3` | Active nav pill |
| `--clay-text` | `#2D3436` | Primary text (charcoal) |
| `--clay-text-muted` | `#636E72` | Secondary text |
| `--clay-peach` | `#FAD7C5` | Premium cards, warm highlights |
| `--clay-coral` | `#E89A7B` | Primary CTA buttons |
| `--clay-yellow` | `#FCF1D1` | Stat tiles, icon wells |
| `--clay-mint` | `#D4E7D7` | Success / positive stats |
| `--clay-teal` | `#B8D8D8` | Secondary buttons, chart segments |
| `--clay-blue` | `#B8CBD0` | Cool accent, streaks |

**Usage rules:**
- Page = `--clay-bg`. Never pure white `#FFF` as the main canvas.
- Sidebar/nav = `--clay-sidebar` as a floating pillar with large radius on the outer edge.
- Stat/metric cards rotate through peach, yellow, mint, teal — one accent per card.
- Primary actions = `--clay-coral` with pressed shadow state.
- Text always charcoal/muted gray — never `#000`.

## Typography

| Role | Font | Weight | Size (desktop) |
|------|------|--------|----------------|
| Display / page title | Nunito or Quicksand | 700–800 | 28–36px |
| Section heading | same | 700 | 20–24px |
| Body | same | 400–500 | 14–16px |
| Metric number | same | 800 | 28–40px |
| Caption / trend | same | 500 | 12–13px |

Load via `next/font/google` (prefer **Nunito**). Do not mix more than one rounded sans. Avoid monospace for labels unless showing code/terminal content (e.g. gitshitt terminal keeps mono).

## Radius scale

| Token | Value | Use |
|-------|-------|-----|
| `--radius-clay-sm` | 16px | Small chips, tags |
| `--radius-clay-md` | 24px | Inputs, list rows |
| `--radius-clay-lg` | 32px | Cards, sidebar |
| `--radius-clay-xl` | 40px | Hero banners |
| `--radius-clay-pill` | 9999px | Buttons, nav active state, chart bars |

## Shadow system (the "clay" effect)

Three elevation presets — use consistently:

**Raised card** (cards, sidebar, hero):
```css
box-shadow:
  0 4px 0 rgba(45, 52, 54, 0.04),
  0 12px 32px rgba(139, 119, 101, 0.12),
  inset 0 1px 0 rgba(255, 255, 255, 0.6);
```

**Pressable button** (CTAs):
```css
box-shadow:
  0 4px 0 rgba(180, 100, 70, 0.35),
  0 8px 20px rgba(139, 119, 101, 0.18),
  inset 0 1px 0 rgba(255, 255, 255, 0.35);
/* :active → translateY(2px), reduce bottom shadow */
```

**Inset recess** (search, toggles, icon wells):
```css
box-shadow:
  inset 0 2px 6px rgba(45, 52, 54, 0.08),
  inset 0 -1px 0 rgba(255, 255, 255, 0.5);
```

Define these as Tailwind `--shadow-clay-*` tokens (see `references/design-tokens.css`).

## Layout patterns

### App shell
```
┌─────────┬──────────────────────────────────────┐
│ Sidebar │  Header (title + inset search + icons)│
│ (pill   ├──────────────────────────────────────┤
│  pillar)│  Hero card (greeting + CTA)           │
│         ├──────────────────────────────────────┤
│  Nav    │  Stats row (4 pastel tiles)           │
│  items  ├──────────────────────────────────────┤
│         │  Charts / content grid                │
│         ├──────────────────────────────────────┤
│ Premium │  Lists + featured cards               │
│  card   └──────────────────────────────────────┘
└─────────┘
```

- Sidebar: fixed left, `rounded-r-[40px]`, floats with gap from viewport edge.
- Main: `bg-clay-bg`, generous padding (`p-6`–`p-8`), CSS grid for sections.
- Cards never touch edge-to-edge without outer page padding.

### Navigation active state
- Inactive: transparent, icon + label only.
- Active: raised pill (`bg-clay-sidebar-active`, `shadow-clay-raised`, full pill radius).

### Stat tiles
- Vertical card, centered 3D-style icon in a circular recess, bold metric, small trend badge (green up / red down with soft pill background).

### Data viz
- Bar chart: thick rounded pill bars, alternating pastel fills, no sharp gridlines (use faint dashed or none).
- Donut chart: thick ring, rounded segment caps, legend as soft pills.

## Component mapping

| UI need | Pattern |
|---------|---------|
| Primary button | Pill, `bg-clay-coral`, white text, `shadow-clay-button`, active press |
| Secondary button | Pill, `bg-clay-teal`, charcoal text |
| Card | `rounded-clay-lg`, `shadow-clay-raised`, pastel or cream fill |
| Search input | Full-width pill, `shadow-clay-inset`, no border |
| Avatar | Circle, thick soft shadow, optional 3D illustration |
| List row | Rounded thumbnail + title/subtitle + circular inset play/action |
| Badge / notification | Small circle, coral fill, white number |
| Toggle | Inset track, raised circular thumb |

Full Tailwind class recipes: [references/components.md](references/components.md).

## Imagery & icons

- Prefer soft 3D illustrations or clay-style renders for hero/empty states.
- UI icons: thick stroke (2–2.5px), rounded caps, placed inside colored circular/rounded-square wells.
- Decorative objects (plants, crowns, stars) break the grid slightly — use sparingly, one per section max.

## Motion

- Buttons: `translateY(2px)` on active, `150ms ease`.
- Cards on hover: subtle `translateY(-2px)` + slightly deeper shadow — not on mobile.
- Page load: one orchestrated fade-in for hero only; avoid staggered slide-up on every card.
- Respect `prefers-reduced-motion`.

## Accessibility

- Maintain WCAG AA contrast for text on pastel backgrounds (charcoal on peach/yellow may need darker text or lighter fill).
- Visible focus rings: `ring-2 ring-clay-coral ring-offset-2 ring-offset-clay-bg`.
- Touch targets ≥ 44px.
- Do not rely on color alone for trends — include arrow icons or +/- text.

## Adapting to gitshitt specifically

- **Marketing homepage**: full Soft Clay shell — hero, feature cards, CTA.
- **Git visualizer page**: apply clay tokens to panels, settings drawer, and buttons; **keep terminal monospace** and graph SVG readable — clay styling on chrome, not on graph nodes/links.
- **Terminal**: inset recess container, rounded outer frame; command text stays mono with high contrast.

## Anti-patterns (do not use)

- Sharp `rounded-md` or `rounded-lg` as default card radius
- Flat Material-style cards with 1px `#E5E7EB` borders
- Dark mode as default (this system is light-first; dark variant optional later)
- Glassmorphism blur stacks as primary surface treatment
- Generic purple/indigo SaaS gradients
- Identical shadow on every element regardless of elevation
- ALL CAPS labels or tracked eyebrow text

## Pre-ship checklist

- [ ] All containers use clay radius scale (≥16px)
- [ ] Shadows match elevation (raised vs inset vs button)
- [ ] Palette uses clay tokens only — no arbitrary hex outside the system
- [ ] Typography is Nunito/Quicksand with clear hierarchy
- [ ] Primary CTA uses coral with press state
- [ ] Search/inputs use inset shadow, not border
- [ ] Focus states visible
- [ ] Layout matches floating sidebar + padded main grid
- [ ] No generic SaaS/card-kit tells (see `frontend-design` skill)

## Additional resources

- Token source of truth: [references/design-tokens.css](references/design-tokens.css)
- Copy-paste component classes: [references/components.md](references/components.md)
