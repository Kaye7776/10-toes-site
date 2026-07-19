# CASE TT-24-07-26 — Confidential Investigation Archive

A cinematic, installable **Progressive Web App** built as the marketing campaign
for the independent artist **KAYE** and the release of the song **TEN TOES**.

Visitors arrive by scanning a "Wanted" QR code and land inside what looks like a
real confidential police / government investigation database. Only later — when
the case status flips to `FOUND` — does it reveal itself as a music release.

Built with **zero frameworks**: pure HTML, CSS and vanilla JavaScript.

---

## Files

| File | Purpose |
|------|---------|
| `index.html` | Semantic markup for the whole experience |
| `style.css` | All styling, animations and responsive layout |
| `script.js` | Boot sequence, state engine, motion, audio, PWA |
| `manifest.json` | PWA metadata (installable app) |
| `service-worker.js` | Offline-first caching |
| `assets/photo.jpg` | Evidence photograph |
| `assets/icon.png` | App / home-screen icon |

> In this Emergent workspace the files live in `frontend/public/` so they are
> served at the site root (`/`). To deploy elsewhere, copy the contents of
> `frontend/public/` to any static host.

---

## The one thing you edit after release

Everything is driven by a single config object at the top of `script.js`:

```js
const CASE = {
  status: "MISSING",        // change to "FOUND" after release
  artist: "KAYE",
  song: "TEN TOES",
  city: "Rio Tinto, Porto",
  date: "24 July 2026",
  caseId: "TT-24-07-26",
  whatsapp: "351900000000", // full international number, digits only
  spotify: "",              // paste link after release
  appleMusic: "",
  youtube: ""
};
```

### `status: "MISSING"` (before release)
- Red **MISSING** stamp + status pill
- `JOIN THE INVESTIGATION` button → opens WhatsApp with a pre-filled message
- Subject reads as an open case

### `status: "FOUND"` (after release)
- Green **FOUND** stamp, **CASE CLOSED**
- Reveals the **TEN TOES** title + streaming buttons (Spotify / Apple Music / YouTube)
- **The QR code never changes** — only this object does.

---

## Experience

1. **Boot screen** — black terminal, typed status lines, animated bar + percentage, blinking cursor.
2. **Glitch transition** at 100% → **ACCESS GRANTED / CASE TT-24-07-26**.
3. **Archive** — top bar (`CONFIDENTIAL` badge, clearance, live clock, audio toggle),
   kinetic `CASE FILE` hero + rotating stamp, evidence frame with scan sweep,
   subject dossier, scroll-animated timeline, CTA, real-time footer.
4. **Ambient background** — moving gradients, breathing glow, particle field (canvas),
   film grain, scanlines, vignette. **Mouse spotlight** on desktop.

---

## Audio
Subtle synthesized boot tone + terminal clicks via the Web Audio API.
**Muted by default** — toggle from the top-right control (browser autoplay-safe).

---

## Developer shortcuts
- Press **`F`** to preview the `FOUND` / release state instantly (no config edit).
- Respects `prefers-reduced-motion` (skips the long boot, disables heavy motion).

---

## Install as an app
Open the site on mobile → browser menu → **Add to Home Screen**.
Launches standalone (no browser chrome) and works offline after first load.
