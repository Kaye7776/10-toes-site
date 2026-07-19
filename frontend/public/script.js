/* ============================================================
   CASE TT-24-07-26 — SCRIPT
   Pure vanilla JS. No frameworks.
   ------------------------------------------------------------
   CONTENTS
     0. CASE CONFIG  ← edit this single object after release
     1. Utilities
     2. Boot / loading sequence
     3. Glitch → Access granted → open archive
     4. Live clock + node stamp
     5. Ambient particle field (canvas)
     6. Mouse spotlight
     7. Scroll reveal + timeline
     8. Hero parallax
     9. WhatsApp CTA
    10. State renderer (MISSING / FOUND)
    11. Subtle audio engine (muted by default)
    12. PWA service worker
    13. Dev preview toggle (press "F")
   ============================================================ */

/* -------------------- 0. CASE CONFIG --------------------
   AFTER RELEASE: change status to "FOUND" and fill the links.
   Everything else updates automatically. QR code never changes. */
const CASE = {
  status: "MISSING",              // "MISSING" | "FOUND"
  artist: "KAYE",
  song: "TEN TOES",
  city: "Rio Tinto, Porto",
  date: "24 July 2026",
  caseId: "TT-24-07-26",
  whatsapp: "351900000000",       // ← EDIT: full intl number, digits only, no "+"
  spotify: "",                    // ← EDIT after release
  appleMusic: "",                 // ← EDIT after release
  youtube: ""                     // ← EDIT after release
};

/* -------------------- 1. UTILITIES -------------------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => Math.random() * (b - a) + a;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("locked");

/* -------------------- 2. BOOT / LOADING SEQUENCE -------------------- */
const BOOT_MESSAGES = [
  "ESTABLISHING SECURE CONNECTION",
  "HANDSHAKE / TLS 1.3 ......... OK",
  "CONNECTING TO CENTRAL DATABASE",
  "VERIFYING NODE INTEGRITY ..... OK",
  "DECRYPTING FILE CONTAINER",
  "AES-256 KEY EXCHANGE ......... OK",
  "AUTHORIZING ACCESS / CLEARANCE L4",
  "LOADING CASE FILE " + CASE.caseId
];

async function runBoot() {
  const log = $("#bootLog");
  const typed = $("#bootLine");
  const fill = $("#bootFill");
  const pct = $("#bootPercent");
  const hex = $("#bootHex");

  // Type each message line-by-line
  let percent = 0;
  for (let i = 0; i < BOOT_MESSAGES.length; i++) {
    const msg = BOOT_MESSAGES[i];
    typed.textContent = "";
    for (let c = 0; c < msg.length && !prefersReduced; c++) {
      typed.textContent += msg[c];
      if (audio.on) audio.tick();
      await sleep(rand(8, 26));
    }
    if (prefersReduced) typed.textContent = msg;

    // Commit line to log with OK/status color
    const done = msg.includes("OK") || msg.includes("L4");
    log.innerHTML += (done ? `<b>${msg}</b>` : msg) + "\n";

    // Advance progress toward target for this step
    const target = Math.round(((i + 1) / BOOT_MESSAGES.length) * 100);
    while (percent < target) {
      percent++;
      fill.style.width = percent + "%";
      pct.textContent = percent + "%";
      hex.textContent = "0x" + percent.toString(16).toUpperCase().padStart(4, "0");
      await sleep(prefersReduced ? 1 : rand(6, 18));
    }
    await sleep(prefersReduced ? 1 : 120);
  }

  typed.textContent = "ACCESS AUTHORIZED";
  await sleep(500);
  enterGranted();
}

/* -------------------- 3. GLITCH → GRANTED → ARCHIVE -------------------- */
async function enterGranted() {
  const boot = $("#boot");
  const granted = $("#granted");

  // Glitch flash transition out of boot
  document.body.classList.add("glitch-flash");
  await sleep(180);
  boot.classList.add("is-hidden");
  document.body.classList.remove("glitch-flash");

  // Show ACCESS GRANTED with glitch on the headline
  granted.setAttribute("aria-hidden", "false");
  granted.classList.add("is-active");
  const title = $(".granted__title");
  title.classList.add("glitching");
  if (audio.on) audio.boot();
  await sleep(1500);
  title.classList.remove("glitching");

  // Fade granted out, reveal the archive
  document.body.classList.add("glitch-flash");
  granted.classList.add("is-out");
  await sleep(220);
  document.body.classList.remove("glitch-flash");
  await sleep(220);
  granted.style.display = "none";

  openArchive();
}

function openArchive() {
  document.body.classList.remove("locked");
  $("#topbar").classList.add("is-in");
  $("#archive").classList.add("is-live");
  // First section reveal immediately
  requestAnimationFrame(() => $$(".reveal")[0]?.classList.add("is-in"));
}

/* -------------------- 4. LIVE CLOCK + NODE STAMP -------------------- */
function tickClock() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  $("#clock").textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  $("#syncTime").textContent = `${p(d.getHours())}:${p(d.getMinutes())}`;
}
setInterval(tickClock, 1000);
tickClock();
$("#ipStamp").textContent =
  "NODE " + String(Math.floor(rand(100, 999))) + "." + String(Math.floor(rand(100, 999)));

/* -------------------- 5. AMBIENT PARTICLE FIELD -------------------- */
(function particles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let w, h, dpr, pts;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.width = innerWidth * dpr;
    h = canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(70, Math.floor(innerWidth / 14));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: rand(-0.15, 0.15) * dpr, vy: rand(-0.15, 0.15) * dpr,
      r: rand(0.4, 1.6) * dpr
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,120,120,0.5)";
      ctx.fill();
      // link nearby particles
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 * dpr) {
          ctx.strokeStyle = `rgba(255,60,60,${0.12 * (1 - dist / (120 * dpr))})`;
          ctx.lineWidth = dpr * 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  resize();
  addEventListener("resize", resize);
  if (!prefersReduced) draw();
})();

/* -------------------- 6. MOUSE SPOTLIGHT -------------------- */
(function mouseGlow() {
  const glow = $("#mouseGlow");
  let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  (function loop() {
    cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
    glow.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
})();

/* -------------------- 7. SCROLL REVEAL + TIMELINE -------------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  });
}, { threshold: 0.16 });
$$(".reveal").forEach((el) => io.observe(el));

const tlIo = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      const items = $$(".tl__item");
      items.forEach((it, i) => setTimeout(() => it.classList.add("is-in"), i * 180));
      tlIo.disconnect();
    }
  });
}, { threshold: 0.25 });
if ($("#timelineList")) tlIo.observe($("#timelineList"));

/* -------------------- 8. HERO PARALLAX -------------------- */
(function parallax() {
  if (prefersReduced) return;
  const el = $("[data-parallax]");
  if (!el) return;
  const factor = parseFloat(el.dataset.parallax) || 0.1;
  addEventListener("scroll", () => {
    el.style.transform = `translateY(${window.scrollY * factor}px)`;
  }, { passive: true });
})();

/* -------------------- 9. WHATSAPP CTA + RIPPLE -------------------- */
function wireCTA() {
  const btn = $("#joinBtn");
  const msg = `Hello. I would like to participate in investigation ${CASE.caseId}.`;
  btn.href = `https://wa.me/${CASE.whatsapp}?text=${encodeURIComponent(msg)}`;
  btn.addEventListener("pointerdown", (e) => {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty("--x", (e.clientX - r.left) + "px");
    btn.style.setProperty("--y", (e.clientY - r.top) + "px");
    btn.classList.remove("rippling"); void btn.offsetWidth; btn.classList.add("rippling");
    if (audio.on) audio.tick();
  });
}

/* -------------------- 10. STATE RENDERER -------------------- */
function renderState() {
  // Fill dossier from config
  $("#dName").textContent = CASE.artist;
  $("#dCity").textContent = CASE.city;
  $("#dDate").textContent = CASE.date;

  const isFound = CASE.status.toUpperCase() === "FOUND";
  const statusText = isFound ? "FOUND" : "MISSING";

  // Status pill + stamp
  $("#statusText").textContent = statusText;
  $("#stampText").textContent = statusText;
  $("#dStatus").textContent = isFound ? "CLOSED — RESOLVED" : "ACTIVE — OPEN";

  const pill = $("#statusPill");
  const stamp = $("#stamp");
  if (isFound) {
    // green theme via inline overrides for the pill
    pill.style.borderColor = "var(--green)";
    pill.style.color = "var(--green)";
    pill.style.background = "rgba(34,255,156,.06)";
    pill.querySelector(".status-pill__blip").style.background = "var(--green)";
    pill.querySelector(".status-pill__blip").style.boxShadow = "0 0 10px var(--green)";
    stamp.classList.add("stamp--found");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#031a12");
  }

  // Description
  $("#dDesc").textContent = isFound
    ? `Case resolved. Subject located. This investigation was part of the campaign for “${CASE.song}”.`
    : "This individual remains missing. If you possess any relevant information, join the investigation.";

  // Toggle CTA vs release block
  const missing = $("#ctaMissing");
  const release = $("#release");
  if (isFound) {
    missing.hidden = true;
    release.hidden = false;
    release.setAttribute("aria-hidden", "false");
    $(".release__song").textContent = CASE.song;
    $(".release__by").textContent = `${CASE.artist} — OUT NOW`;
    buildStreamLinks();
  } else {
    missing.hidden = false;
    release.hidden = true;
  }
}

function buildStreamLinks() {
  const wrap = $("#streamLinks");
  wrap.innerHTML = "";
  const links = [
    { name: "SPOTIFY", url: CASE.spotify },
    { name: "APPLE MUSIC", url: CASE.appleMusic },
    { name: "YOUTUBE", url: CASE.youtube }
  ];
  links.forEach((l) => {
    const a = document.createElement("a");
    a.className = "stream";
    a.textContent = l.name;
    a.href = l.url || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("data-testid", "stream-" + l.name.toLowerCase().replace(/\s/g, "-"));
    if (!l.url) { a.setAttribute("aria-disabled", "true"); a.style.opacity = ".45"; a.textContent = l.name + " · SOON"; }
    wrap.appendChild(a);
  });
}

/* -------------------- 11. SUBTLE AUDIO ENGINE -------------------- */
const audio = {
  ctx: null,
  on: false,
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === "suspended") this.ctx.resume();
  },
  tick() {
    if (!this.on) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = "square"; o.frequency.value = rand(1400, 2100);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.015, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + 0.06);
  },
  boot() {
    if (!this.on) return;
    this.ensure();
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = "sine"; o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(520, t + 0.5);
    g.gain.setValueAtTime(0.0, t);
    g.gain.linearRampToValueAtTime(0.05, t + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + 0.75);
  }
};
(function wireSound() {
  const btn = $("#soundToggle");
  btn.addEventListener("click", () => {
    audio.on = !audio.on;
    btn.setAttribute("aria-pressed", String(audio.on));
    btn.querySelector(".sound-toggle__label").textContent = audio.on ? "AUDIO ON" : "MUTED";
    if (audio.on) { audio.ensure(); audio.tick(); }
  });
})();

/* -------------------- 12. PWA SERVICE WORKER -------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

/* -------------------- 13. DEV PREVIEW TOGGLE -------------------- */
// Press "F" to preview the FOUND / release state without editing config.
addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f") {
    CASE.status = CASE.status.toUpperCase() === "FOUND" ? "MISSING" : "FOUND";
    location.hash = "state=" + CASE.status;
    location.reload();
  }
});
if (location.hash.includes("state=FOUND")) CASE.status = "FOUND";
// Re-render when hash changes programmatically (robustness)
addEventListener("hashchange", () => {
  CASE.status = location.hash.includes("state=FOUND") ? "FOUND" : "MISSING";
  location.reload();
});

/* -------------------- BOOTSTRAP -------------------- */
renderState();
wireCTA();
const skipIntro = prefersReduced || location.search.includes("nointro");
if (skipIntro) {
  // Skip long boot for reduced-motion users
  $("#boot").style.display = "none";
  $("#granted").style.display = "none";
  openArchive();
} else {
  runBoot();
}
