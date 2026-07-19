/* ============================================================
   PROCESSO TT-24-07-26 — SCRIPT
   JavaScript puro. Sem frameworks. Movimento sóbrio.
   ------------------------------------------------------------
   ÍNDICE
     0. CONFIGURAÇÃO DO PROCESSO  ← editar apenas este objeto
     1. Utilitários
     2. Autenticação (sóbria) → abrir arquivo
     3. Relógio do sistema
     4. Reveal ao scroll + cronologia
     5. Botão de participação (WhatsApp)
     6. Renderizador de estado (DESAPARECIDO / LOCALIZADO)
     7. PWA service worker
     8. Pré-visualização (tecla "F")
   ============================================================ */

/* -------------------- 0. CONFIGURAÇÃO DO PROCESSO --------------------
   APÓS O LANÇAMENTO: mudar "estado" para "LOCALIZADO" e preencher links.
   O resto atualiza automaticamente. O QR Code não muda. */
const CASE = {
  estado: "DESAPARECIDO",          // "DESAPARECIDO" | "LOCALIZADO"
  artista: "KAYE",
  musica: "TEN TOES",
  cidade: "Rio Tinto, Porto",
  data: "24 de julho de 2026",
  processo: "TT-24-07-26",
  whatsapp: "351900000000",        // ← EDITAR: nº internacional, só dígitos, sem "+"
  spotify: "",                     // ← EDITAR após lançamento
  appleMusic: "",                  // ← EDITAR após lançamento
  youtube: ""                      // ← EDITAR após lançamento
};

/* -------------------- 1. UTILITÁRIOS -------------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("locked");

/* -------------------- 2. AUTENTICAÇÃO (SÓBRIA) -------------------- */
const AUTH_STEPS = [
  "A estabelecer ligação...",
  "A autenticar utilizador...",
  "A carregar processo...",
  "A abrir arquivo..."
];

async function runAuth() {
  const status = $("#authStatus");
  const fill = $("#authFill");
  const pct = $("#authPct");
  let percent = 0;

  for (let i = 0; i < AUTH_STEPS.length; i++) {
    status.textContent = AUTH_STEPS[i];
    const target = Math.round(((i + 1) / AUTH_STEPS.length) * 100);
    while (percent < target) {
      percent++;
      fill.style.width = percent + "%";
      pct.textContent = percent + "%";
      await sleep(12);
    }
    await sleep(360);
  }
  await sleep(400);
  openArchive();
}

function openArchive() {
  if (openArchive.done) return;
  openArchive.done = true;
  const auth = $("#auth");
  auth.classList.add("is-hidden");                    // fade subtil (sem glitch)
  setTimeout(() => { auth.style.display = "none"; }, 600);
  document.body.classList.remove("locked");
  $("#archive").classList.add("is-live");
  requestAnimationFrame(() => $$(".reveal").forEach((el, i) => {
    if (i < 3) el.classList.add("is-in");
  }));
}
$("#authSkip").addEventListener("click", openArchive);

/* -------------------- 3. RELÓGIO DO SISTEMA -------------------- */
function tickClock() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  $("#clock").textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  $("#footSync").textContent = `${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
setInterval(tickClock, 1000);
tickClock();

/* -------------------- 4. REVEAL AO SCROLL + CRONOLOGIA -------------------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  });
}, { threshold: 0.14 });
$$(".reveal").forEach((el) => io.observe(el));

const tlIo = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      $$(".tl__item").forEach((it, i) => setTimeout(() => it.classList.add("is-in"), i * 140));
      tlIo.disconnect();
    }
  });
}, { threshold: 0.2 });
if ($("#timelineList")) tlIo.observe($("#timelineList"));

/* -------------------- 5. BOTÃO DE PARTICIPAÇÃO (WHATSAPP) -------------------- */
function wireCTA() {
  const btn = $("#joinBtn");
  const msg = `Olá. Gostaria de participar na investigação ${CASE.processo}.`;
  const url = `https://wa.me/${CASE.whatsapp}?text=${encodeURIComponent(msg)}`;
  btn.href = url;
  // Transição de "canal seguro" (~1s) antes de abrir o WhatsApp
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const ov = $("#secure");
    ov.classList.add("is-active");
    ov.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      window.open(url, "_blank", "noopener");
      ov.classList.remove("is-active");
      ov.setAttribute("aria-hidden", "true");
    }, 1100);
  });
}

/* Estado de consulta subtil: "Hoje às HH:MM" */
function setLastUpdate() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  const t = `Hoje às ${p(d.getHours())}:${p(d.getMinutes())}`;
  const a = $("#lastUpdate"); if (a) a.textContent = t;
  const m = $("#metaSync"); if (m) m.textContent = t;
}

/* Atividade do sistema: "há N minutos" (arquivo já sincronizado) */
const syncStart = Date.now() - 2 * 60000;
function setSyncAgo() {
  const el = $("#lastSync");
  if (!el) return;
  const mins = Math.floor((Date.now() - syncStart) / 60000);
  el.textContent = mins <= 0 ? "agora mesmo" : `há ${mins} minuto${mins === 1 ? "" : "s"}`;
}

/* -------------------- 6. RENDERIZADOR DE ESTADO -------------------- */
function renderState() {
  $("#dName").textContent = CASE.artista;
  $("#dCity").textContent = CASE.cidade;
  $("#dDate").textContent = CASE.data;

  const found = CASE.estado.toUpperCase() === "LOCALIZADO";
  const statusLabel = found ? "LOCALIZADO(A)" : "DESAPARECIDO(A)";

  $("#statusText").textContent = statusLabel;
  $("#stampText").textContent = found ? "LOCALIZADO" : "DESAPARECIDO";
  $("#dStatus").textContent = found ? "ENCERRADO · RESOLVIDO" : "EM INVESTIGAÇÃO · ATIVO";

  const tag = $("#statusTag");
  const stamp = $("#stamp");
  if (found) {
    tag.classList.add("status-tag--found");
    stamp.classList.add("stamp--found");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#1b3a1e");
  }

  $("#dDesc").textContent = found
    ? `Processo encerrado. Indivíduo localizado. Esta investigação integrou a campanha de lançamento de “${CASE.musica}”.`
    : "O paradeiro do indivíduo permanece desconhecido. Caso disponha de informações relevantes para o processo, poderá colaborar através do canal seguro abaixo.";

  const missing = $("#ctaMissing");
  const release = $("#release");
  if (found) {
    missing.hidden = true;
    release.hidden = false;
    release.setAttribute("aria-hidden", "false");
    $(".release__song").textContent = CASE.musica;
    $(".release__by").textContent = `${CASE.artista} — DISPONÍVEL AGORA`;
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
    a.href = l.url || "#";
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("data-testid", "stream-" + l.name.toLowerCase().replace(/\s/g, "-"));
    a.textContent = l.url ? l.name : l.name + " · BREVE";
    if (!l.url) {
      a.setAttribute("aria-disabled", "true");
      a.style.opacity = ".5";
      a.addEventListener("click", (e) => e.preventDefault());
    }
    wrap.appendChild(a);
  });
}

/* -------------------- 7. PWA SERVICE WORKER -------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}

/* -------------------- 8. PRÉ-VISUALIZAÇÃO (TECLA "F") -------------------- */
// Premir "F" alterna o estado LOCALIZADO/lançamento sem editar a configuração.
addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "f") {
    CASE.estado = CASE.estado.toUpperCase() === "LOCALIZADO" ? "DESAPARECIDO" : "LOCALIZADO";
    location.hash = "estado=" + CASE.estado;
    location.reload();
  }
});
if (location.hash.includes("estado=LOCALIZADO")) CASE.estado = "LOCALIZADO";
addEventListener("hashchange", () => {
  CASE.estado = location.hash.includes("estado=LOCALIZADO") ? "LOCALIZADO" : "DESAPARECIDO";
  location.reload();
});

/* -------------------- ARRANQUE -------------------- */
renderState();
wireCTA();
setLastUpdate();
setSyncAgo();
setInterval(() => { setLastUpdate(); setSyncAgo(); }, 30000);
const skipIntro = prefersReduced || location.search.includes("nointro");
if (skipIntro) {
  $("#auth").style.display = "none";
  openArchive();
} else {
  runAuth();
}
