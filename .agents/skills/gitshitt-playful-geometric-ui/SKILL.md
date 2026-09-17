---
name: gitshitt-playful-geometric-ui
description: Use when generating or regenerating gitshitt's UI (Home, Git Visualizer, Login, Payment, Profile) so one prompt reproduces the Playful Geometric design system and exact page content.
---

# gitshitt UI — Playful Geometric

This skill packages one design system plus five page specs so that a single prompt ("build gitshitt's UI" / "regenerate the gitshitt mockups") reproduces the same result every time — whether the output is a Design-canvas mockup (Claude's Artifact tool, Design type) or real Next.js/Tailwind code in the gitshitt repo (github.com/gaurav0973/gitshitt).

## Design philosophy

**Playful Geometric**: the antidote to sterile corporate minimalism. Core concept: "Stable grid, wild decoration" — content (text, forms) lives in clean readable areas; the world around it is alive with primitive shapes, hard offset shadows (no blur), pattern fills (dots/stripes), and mixed radii. References the Memphis Group (80s), cleaned up for screens. Vibe: friendly, tactile, pop, energetic — a well-organized sticker book that invites clicking.

## Design tokens

```
background:        #FFFDF5   muted:            #F1F5F9   accent:      #8B5CF6
foreground:        #1E293B   mutedForeground:  #64748B   secondary:   #F472B6
border:            #E2E8F0   accentForeground: #FFFFFF   tertiary:    #FBBF24
input/card:        #FFFFFF   ring:             #8B5CF6   quaternary:  #34D399
```
Use `accent` for primary actions. Rotate `secondary`/`tertiary`/`quaternary` for decorative shapes, card icons, and confetti accents — never all four on one element.

**Typography**: Headings in `"Outfit", system-ui, sans-serif` (weight 700/800). Body in `"Plus Jakarta Sans", system-ui, sans-serif` (weight 400/500/700). Load both via Google Fonts: `family=Outfit:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;700`. Scale: display 60/60/800, heading 18/28/600, body-lg 18/28/400, body 14/20/400, caption 12/16/400, caption-strong 12/16/600 uppercase tracking 0.05em.

**Radius**: sm 8px, md 16px, lg 24px, full 9999px. Chunky 2px borders by default (`--border-width: 2px`).

**Hard "pop" shadow** (no blur, solid offset): rest `4px 4px 0 0 #1E293B`; hover `translate(-2px,-2px)` + `6px 6px 0 0`; active `translate(2px,2px)` + `2px 2px 0 0`. Transition: `cubic-bezier(.34,1.56,.64,1)` (bouncy overshoot).

**Textures**: dot grid (`radial-gradient(var(--border) 2.5px, transparent 2.5px)` at 26px pitch) behind feature/graph sections; dashed lines as connectors; confetti shapes (small triangle/square/circle) absolutely positioned near hero art — never more than 3 per composition.

## Component recipes (CSS, reusable across every page)

- **`.btn-primary`**: pill (`radius-full`), `accent` bg, white text, 700 weight, 2px foreground border, pop-shadow, a white circular icon-chip (26px) holding an accent-colored arrow-right on the trailing edge.
- **`.btn-secondary`**: transparent bg, 2px foreground border, pill, no shadow, `background: tertiary` on hover.
- **`.card`** ("sticker"): white bg, 2px foreground border, `radius-lg`, hover = `rotate(-1deg) scale(1.02)`. A `.card-icon` (56px circle, 2px border) floats half-off the top edge at `top:-26px; left:32px`. A featured/pro card gets `box-shadow: 8px 8px 0 0 var(--secondary)` and a rotated `.badge-star` (108px circle, tertiary bg, 14deg rotation) pinned to a corner.
- **`.input-field`**: white bg, 2px `border` (not foreground), `radius-md`; on focus, border turns `accent` and gains a hard `4px 4px 0 0 accent` shadow. Pair with a `.input-label` (bold, uppercase, 12px, tracking 0.06em).
- **`.eyebrow`**: small pill badge, white bg, 2px foreground border, 3px3px pop-shadow, bold uppercase 13px, used above every section heading.
- **`.pill-tab`**: segmented-control button, 2px border, pill; `.active` = filled foreground bg / background-colored text.
- **`.dot-grid`**: decorative background class for section containers that need texture without noise.

Icons: inline stroke SVG only, 2.5px stroke, round caps/joins — never emoji, never a font-icon library. Primitive/geometric icon shapes (arrow, check, terminal prompt, activity zigzag, shield) fit the philosophy better than literal brand logos.

## Pages to generate (all five, unless the prompt asks for one)

### 1. Home
Nav (logo + Features/Pricing links + Log in + Start practicing). Hero: eyebrow "Practice without fear", H1 "Learn Git without losing your shit.", subhead, two CTAs; right side = big tertiary circle behind a dark sticker-card mock terminal+mini commit graph, plus 2–3 confetti shapes. Features: 3 cards on a dot-grid section, connected by a dashed line, icons alternating accent/secondary/tertiary — "Type real commands", "Watch the graph update live", "Nothing to lose" (copy from the real gitshitt README). Pricing teaser: Free (₹0) vs Pro (₹100 one-time, featured/scaled card with "UNLOCK ALL" badge) — Pro links to Payment. Footer: copyright line + GitHub/Log in links.

### 2. Git Visualizer
Header: Home link, logo, "Free plan · 3 demos" chip, "Upgrade — ₹100" button linking to Payment. Below header, a full-width **"Concept Intuition — First Principles"** banner button (accent icon chip + title + subtitle + "Ask" pill) that toggles a right-hand drawer (real click state, not just a static frame): drawer shows a sample user query bubble, then a structured answer broken into **Definition / Why it happens / Mental model / Try it** sections (each with a small colored dot and a command chip), plus a bottom input row. Main area below the banner: dark terminal sticker-card (colored command/success/error lines) on the left, white graph card on the right with a `Presentation`/`Compact` pill-tab pair, an inline SVG commit graph (nodes + curved edges in accent/secondary/tertiary), and a color-key legend.

### 3. Login (styled for Clerk)
Centered 440px sticker card on a dot-grid background with a tertiary circle + confetti behind it. Contents: small logo lockup, "Welcome back" heading, subhead, two secondary "Continue with GitHub" / "Continue with Google" buttons (generic monogram chips, not literal logos), "or" divider, email field, primary "Continue" button, "New here? Start practicing free" link, and a small "Secured & powered by Clerk" footnote with a lock icon.

### 4. Payment (₹100)
Centered column on a dot-grid background with quaternary/secondary circles behind it. Eyebrow "One-time unlock", H1 "Unlock the full playground", subhead. One featured sticker card: big "₹100 / forever" price, rotated "ONE-TIME" badge, secondary-colored pop-shadow, a 4-item checklist (every command, save & resume, presentation presets, priority requests), primary "Pay ₹100 securely" button, "Powered by Razorpay" footnote. Below the card: a 3-item trust row (secure payment / instant unlock / no subscription) and a "Maybe later" link back to the visualizer.

### 5. Profile
Header matches the visualizer's. Left: sticker profile card — avatar initials in an accent circle, name, email, "Free plan" chip, "Upgrade to Pro" button, "Signed in with GitHub · via Clerk" row, "Sign out" button. Right column: a 3-up stats grid (sessions / commands run / streak, each with a floating card-icon), a "Badges earned" row of 4 circular stickers (First merge, Rebase master, Tag it, Reset hero — accent/secondary/tertiary/quaternary), and a "Saved sessions" section shown **locked** behind a translucent overlay with a lock icon and an "Upgrade — ₹100" CTA (this is a Pro-gated feature; always show it locked unless told the user is on Pro).

## Output format

- **Design mockup requested** ("show me", "mock up", "redesign"): use the Artifact tool's Design (canvas) type — one self-contained `.dc.html` artboard per page, a shared `styles.css` support file carrying the tokens/component recipes above, Google Fonts loaded via a `<link>` inside each artboard's `<helmet>`, real `<a href="Other.dc.html">` links between pages so the whole thing is click-through, and `is_interactive: true` on every artboard. Reuse the copy given above verbatim so re-generations stay consistent.
- **Production code requested** ("build this into the app", "implement", "add to the repo"): translate the tokens into the gitshitt repo's existing conventions (Next.js app router, Tailwind v4 `@theme`/CSS variables, shadcn-style component files under `src/components/ui`) and keep the same copy, layout structure, and component recipes described above — don't reinvent the content, only the implementation technology.

Always keep the overall feel "simple and minimalist" per the product owner's standing preference: playful decoration stays in the margins (hero art, section backgrounds, badges) and never competes with the actual content people read or the controls they use.