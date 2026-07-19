# PRD — CASE TT-24-07-26 (KAYE / TEN TOES cinematic PWA)

## Original problem statement
Build a premium, cinematic, installable PWA that impersonates a confidential police/government
investigation database. Marketing campaign for artist KAYE; QR codes on "Wanted" posters lead here.
Users initially believe it's a real investigation archive; on release the case flips to FOUND and reveals
the song TEN TOES with streaming links. Constraint: PURE HTML/CSS/vanilla JS, NO frameworks. Deliver
index.html, style.css, script.js, manifest.json, service-worker.js, README.md.

## Architecture / decisions
- Static site lives in `/app/frontend/public/` (served at site root by CRA dev server). React renders
  nothing into a hidden `#root` so it never interferes. All routes are non-/api → served by frontend.
- No backend/database used. No auth.
- Single source of truth: `CASE` config object at top of `script.js` (status, artist, song, whatsapp, links).
- Assets: `/assets/photo.jpg` (AI-generated evidence photo, optimized ~126KB), `/assets/icon.png` (512px, ~225KB).

## User personas
- Curious passer-by who scans the poster QR (mobile-first, first-time visitor).
- Fan revisiting after release to get streaming links.

## Core requirements (static)
- Cinematic boot/loading sequence → glitch → ACCESS GRANTED → archive.
- Confidential top bar, kinetic CASE FILE hero, rotating status stamp, evidence frame, dossier, timeline, CTA, footer.
- WhatsApp "JOIN THE INVESTIGATION" CTA with pre-filled message.
- MISSING (red) vs FOUND (green → CASE CLOSED + TEN TOES + stream buttons) driven by one config flag.
- PWA: installable, manifest, offline service worker, muted-by-default synthesized audio.

## Implemented (2026-06)
- [x] Boot loader: typed terminal lines, animated bar + %, hex, blinking cursor (reaches 100% ~12s).
- [x] Glitch transition + ACCESS GRANTED screen.
- [x] Ambient bg: moving gradient, breathing glow, canvas particle field, grain, scanlines, vignette, mouse spotlight.
- [x] Hero masked line-by-line reveal + scroll parallax + rotating stamp.
- [x] Evidence frame (scan sweep, corners, redaction, CCTV timestamp), dossier grid, scroll-animated timeline.
- [x] WhatsApp CTA (placeholder number 351900000000) + ripple; sound toggle (WebAudio, muted default).
- [x] MISSING/FOUND state engine + streaming links builder; dev `F` key + `#state=FOUND` + `?nointro=1` helpers.
- [x] manifest.json, offline-first service-worker.js (same-origin cache), README.md.
- [x] Optimized images. Tested by testing agent: 100% frontend pass, no bugs, no console errors, responsive.

## Backlog
- P1: Replace placeholder WhatsApp number + real streaming URLs (user to provide).
- P2: Swap generated photo for the official KAYE photo once uploaded.
- P2: Optional maskable 192px icon variant for stricter Lighthouse PWA score.

## Next tasks
- Await user's real WhatsApp number, streaming links, and KAYE photo, then flip `CASE.estado` to LOCALIZADO at release.

## Redesign — Polícia Judiciária authentic dossier (2026-06)
- [x] Rebuilt entire experience as an authentic Portuguese **Polícia Judiciária** digital case-file (paper dossier), replacing the futuristic FBI/terminal look.
- [x] Portuguese (pt-PT) throughout; institutional navy + gold; official letterhead (REPÚBLICA PORTUGUESA / POLÍCIA JUDICIÁRIA), CONFIDENCIAL classification band, carimbo, dossier fields, cronologia.
- [x] Cinematics reduced ~70%: removed particle canvas, scanlines, breathing glow, mouse glow, glitch transitions and audio; kept a sober auth screen + subtle scroll reveals + stamp press-in. Added "Saltar" skip link.
- [x] New AI-generated PJ-style emblem + app icon; config keys localized (`estado`, `artista`, `musica`...); DESAPARECIDO↔LOCALIZADO engine in Portuguese.
- [x] manifest (pt-PT, navy), service-worker v3. Tested by testing agent: 100% frontend pass (11/11), zero JS errors, responsive.

## Refinement — fictional identity + realism pass (2026-06)
- [x] Replaced real "Polícia Judiciária" identity/emblem with a fictional **ARQUIVO DE INVESTIGAÇÃO** (Arquivo Central Confidencial · Unidade de Processos) + new generic navy/gold seal & app icon. Removed all real-institution references (site + README + manifest).
- [x] New natural, non-cropped photo placeholder (neutral anonymous silhouette; frame now object-fit:contain).
- [x] Loading screen: black background, messages "A estabelecer ligação…/A autenticar acesso…/A carregar processo…/A abrir arquivo…", bar + %, subtle glitch on transition (~3s).
- [x] Secure-channel overlay ("CANAL SEGURO ENCRIPTADO / A REDIRECIONAR…") for ~1.1s before opening WhatsApp.
- [x] Realistic ink carimbo (SVG-noise mask = uneven/faded ink, multiply blend with paper, slight rotation).
- [x] Slimmer red CONFIDENCIAL bar; added subtle live "PROCESSO CONSULTADO RECENTEMENTE · Última atualização: Hoje às HH:MM" near footer. service-worker → v4.
