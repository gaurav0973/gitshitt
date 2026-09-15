# Soft Clay — Component Recipes

Copy-paste Tailwind compositions. Prefer utility composition in JSX; use `@layer components` classes from `design-tokens.css` when the same pattern repeats 3+ times.

## App shell

```tsx
<div className="flex min-h-screen bg-clay-bg p-4 gap-4">
  <aside className="clay-sidebar hidden w-64 shrink-0 flex-col p-6 lg:flex">
    {/* profile, nav, premium card */}
  </aside>
  <main className="flex-1 space-y-6 p-2 lg:p-4">
    {/* header, hero, grid sections */}
  </main>
</div>
```

## Page header

```tsx
<header className="flex flex-wrap items-center justify-between gap-4">
  <h1 className="text-3xl font-extrabold text-clay-text">Dashboard</h1>
  <div className="flex flex-1 items-center justify-center px-4 max-w-md">
    <input className="clay-input" placeholder="Search..." />
  </div>
  <div className="flex items-center gap-3">
    <button className="clay-icon-well relative bg-clay-yellow">
      {/* bell icon */}
      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-clay-coral text-xs text-white">3</span>
    </button>
  </div>
</header>
```

## Hero banner

```tsx
<section className="relative overflow-hidden rounded-clay-xl bg-clay-peach p-8 shadow-clay-raised">
  <div className="relative z-10 max-w-md space-y-4">
    <p className="text-sm font-medium text-clay-text-muted">Good Morning!</p>
    <h2 className="text-2xl font-extrabold text-clay-text">
      Hope you&apos;re ready for some new music today
    </h2>
    <button className="clay-btn-primary">Play Something</button>
  </div>
  {/* 3D illustration positioned absolute right */}
</section>
```

## Stat tile (rotate accent via prop)

```tsx
const accents = {
  peach: "bg-clay-peach",
  yellow: "bg-clay-yellow",
  mint: "bg-clay-mint",
  teal: "bg-clay-teal",
} as const;

<div className={`clay-stat-tile ${accents.yellow}`}>
  <div className="clay-icon-well bg-clay-surface">{/* icon */}</div>
  <p className="text-3xl font-extrabold text-clay-text">1,248</p>
  <p className="text-sm text-clay-text-muted">Hours Listened</p>
  <span className="rounded-clay-pill bg-clay-mint/60 px-2 py-0.5 text-xs font-semibold text-clay-success">
    ↑ 12%
  </span>
</div>
```

## Sidebar nav item

```tsx
<a
  href="/dashboard"
  className="flex items-center gap-3 rounded-clay-pill px-4 py-3 font-semibold text-clay-text clay-nav-active"
>
  {/* icon */} Dashboard
</a>

<a
  href="/library"
  className="flex items-center gap-3 rounded-clay-pill px-4 py-3 font-medium text-clay-text-muted hover:bg-clay-sidebar-active/50"
>
  {/* icon */} Library
</a>
```

## Premium promo card

```tsx
<div className="mt-auto rounded-clay-lg bg-clay-peach p-5 shadow-clay-raised">
  <div className="mb-3 size-10">{/* crown 3D icon */}</div>
  <p className="font-bold text-clay-text">Go Premium</p>
  <p className="mt-1 text-sm text-clay-text-muted">
    Unlock ad-free listening and offline downloads.
  </p>
  <button className="clay-btn-primary mt-4 w-full text-sm">Upgrade</button>
</div>
```

## List row (recently played)

```tsx
<div className="flex items-center gap-4 rounded-clay-md bg-clay-surface p-3 shadow-clay-raised">
  <img className="size-14 rounded-clay-md object-cover" src="..." alt="" />
  <div className="min-w-0 flex-1">
    <p className="truncate font-semibold text-clay-text">Track Title</p>
    <p className="truncate text-sm text-clay-text-muted">Artist Name</p>
  </div>
  <button className="clay-icon-well size-10 bg-clay-teal">{/* play */}</button>
</div>
```

## Chart bar (CSS/SVG)

For SVG bars, use `rx="12"` minimum on rects. For div bars:

```tsx
<div className="flex h-40 items-end gap-2">
  {values.map((v, i) => (
    <div
      key={i}
      className={`w-8 rounded-t-clay-pill ${i % 2 ? "bg-clay-teal" : "bg-clay-peach"}`}
      style={{ height: `${v}%` }}
    />
  ))}
</div>
```

## Footer CTA banner

```tsx
<section className="flex flex-wrap items-center justify-between gap-4 rounded-clay-xl bg-clay-yellow px-8 py-6 shadow-clay-raised">
  <div>
    <p className="text-xl font-extrabold text-clay-text">Keep the music going!</p>
    <p className="text-clay-text-muted">Discover new artists curated just for you.</p>
  </div>
  <button className="clay-btn-primary">Explore Now</button>
</section>
```

## gitshitt — terminal chrome (preserve mono inside)

```tsx
<div className="overflow-hidden rounded-clay-lg shadow-clay-raised">
  <div className="bg-clay-sidebar px-4 py-2 font-semibold text-clay-text">
    Terminal
  </div>
  <div className="bg-[#1e1e2e] p-4 font-mono text-sm text-green-300 shadow-clay-inset">
    {/* terminal output — high contrast, not pastel */}
  </div>
</div>
```

## gitshitt — settings panel

```tsx
<aside className="clay-card space-y-4 p-5">
  <h3 className="font-bold text-clay-text">Graph Settings</h3>
  {/* form controls use clay-input, clay-btn-secondary */}
</aside>
```
