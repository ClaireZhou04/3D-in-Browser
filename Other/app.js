// ====== Visual SVG generators (copyright-safe) ======
function svgToDataUri(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function makeWaveSVG(mode="freeze") {
  // mode: freeze | crash | slowpush
  const title = mode === "freeze" ? "FREEZE" : (mode === "crash" ? "CRASH" : "SLOW PUSH");
  const accent = mode === "freeze" ? "rgba(10,200,185,.9)" : (mode === "crash" ? "rgba(200,170,110,.95)" : "rgba(159,179,200,.95)");
  const curve = mode === "freeze"
    ? "M40 86 C 80 86, 110 86, 160 86"
    : mode === "crash"
      ? "M40 96 C 90 64, 120 44, 160 22"
      : "M40 96 C 90 90, 120 72, 160 58";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <linearGradient id="line" x1="0" x2="1">
        <stop offset="0" stop-color="rgba(10,200,185,.2)"/>
        <stop offset="0.5" stop-color="${accent}"/>
        <stop offset="1" stop-color="rgba(240,230,210,.35)"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge>
          <feMergeNode in="b"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <g opacity=".35">
      <path d="M0 70 H520" stroke="rgba(255,255,255,.06)"/>
      <path d="M0 120 H520" stroke="rgba(255,255,255,.05)"/>
      <path d="M0 170 H520" stroke="rgba(255,255,255,.04)"/>
    </g>

    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      WAVE STATE
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      ${title} • wave control decision cue
    </text>

    <g transform="translate(18,86)">
      <rect x="0" y="0" width="484" height="150" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>
      <path d="${curve}" transform="translate(30,40) scale(2.6)" stroke="url(#line)" stroke-width="5" fill="none" filter="url(#glow)"/>
      <circle cx="96" cy="170" r="6" fill="rgba(10,200,185,.85)"/>
      <circle cx="250" cy="170" r="6" fill="rgba(200,170,110,.85)"/>
      <circle cx="410" cy="170" r="6" fill="rgba(240,230,210,.75)"/>
      <text x="70" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Your side</text>
      <text x="210" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Mid</text>
      <text x="380" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Enemy side</text>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

function makeMapSVG(kind="tracking") {
  // Just a stylized “mini-map” with lanes + prio markers (not LoL map)
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      MAP & TRACKING
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      Prio • pathing • gank window
    </text>

    <g transform="translate(18,78)">
      <rect x="0" y="0" width="484" height="166" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>

      <!-- lanes -->
      <path d="M30 24 L454 142" stroke="rgba(63,85,104,.65)" stroke-width="6" opacity=".7"/>
      <path d="M30 142 L454 24" stroke="rgba(63,85,104,.55)" stroke-width="6" opacity=".7"/>
      <path d="M242 12 L242 154" stroke="rgba(63,85,104,.40)" stroke-width="5" opacity=".7"/>

      <!-- prio dots -->
      <circle cx="120" cy="62" r="10" fill="rgba(10,200,185,.85)" filter="url(#glow)"/>
      <circle cx="250" cy="88" r="10" fill="rgba(200,170,110,.85)" filter="url(#glow)"/>
      <circle cx="390" cy="112" r="10" fill="rgba(211,75,75,.75)" filter="url(#glow)"/>

      <text x="104" y="46" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Top prio</text>
      <text x="238" y="74" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Mid</text>
      <text x="366" y="132" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Bot prio (enemy)</text>

      <!-- path arrows -->
      <path d="M90 130 C 150 110, 170 100, 220 92" stroke="rgba(10,200,185,.75)" stroke-width="4" fill="none" filter="url(#glow)"/>
      <polygon points="220,92 208,88 210,98" fill="rgba(10,200,185,.75)"/>

      <path d="M430 40 C 380 62, 330 78, 285 88" stroke="rgba(211,75,75,.55)" stroke-width="4" fill="none"/>
      <polygon points="285,88 297,84 295,94" fill="rgba(211,75,75,.55)"/>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

function makeTempoSVG(label="Crash → Ward → Reset") {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="1">
        <stop offset="0" stop-color="rgba(10,200,185,.35)"/>
        <stop offset="0.5" stop-color="rgba(200,170,110,.85)"/>
        <stop offset="1" stop-color="rgba(240,230,210,.7)"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      TEMPO
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      ${label}
    </text>

    <g transform="translate(18,78)">
      <rect x="0" y="0" width="484" height="166" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>

      <path d="M34 88 H450" stroke="rgba(63,85,104,.55)" stroke-width="8" stroke-linecap="round"/>
      <path d="M34 88 H450" stroke="url(#gold)" stroke-width="6" stroke-linecap="round" opacity=".9"/>

      <circle cx="110" cy="88" r="12" fill="rgba(200,170,110,.85)"/>
      <circle cx="250" cy="88" r="12" fill="rgba(10,200,185,.78)"/>
      <circle cx="390" cy="88" r="12" fill="rgba(240,230,210,.72)"/>

      <text x="86" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Crash</text>
      <text x="230" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Ward</text>
      <text x="372" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Reset</text>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

// Call this whenever a new question is rendered
function renderVisuals(q) {
  // Pick visuals based on concept keywords
  const concept = (q.concept || "").toLowerCase();

  let waveMode = "slowpush";
  let tempoLabel = "Crash → Ward → Reset";

  if (concept.includes("freeze")) waveMode = "freeze";
  if (concept.includes("crash") || concept.includes("reset") || concept.includes("tempo")) waveMode = "crash";
  if (concept.includes("wave")) waveMode = "freeze";

  if (concept.includes("tempo") || concept.includes("reset")) tempoLabel = "Crash → Ward → Reset";
  if (concept.includes("tracking")) tempoLabel = "Track → Cover → Punish";

  document.getElementById("imgWave").src = makeWaveSVG(waveMode);
  document.getElementById("imgMap").src = makeMapSVG("tracking");
  document.getElementById("imgTempo").src = makeTempoSVG(tempoLabel);

  // Small captions
  document.getElementById("vizWaveLabel").textContent =
    waveMode === "freeze" ? "Freeze near tower" : (waveMode === "crash" ? "Crash for reset" : "Build slow push");

  document.getElementById("vizMapLabel").textContent = "Prio • Pathing • Window";
  document.getElementById("vizTempoLabel").textContent = tempoLabel;
}

function svgToDataUri(svg) {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}

function makeWaveSVG(mode="freeze") {
  const title = mode === "freeze" ? "FREEZE" : (mode === "crash" ? "CRASH" : "SLOW PUSH");
  const accent = mode === "freeze" ? "rgba(10,200,185,.9)" : (mode === "crash" ? "rgba(200,170,110,.95)" : "rgba(159,179,200,.95)");
  const curve = mode === "freeze"
    ? "M40 86 C 80 86, 110 86, 160 86"
    : mode === "crash"
      ? "M40 96 C 90 64, 120 44, 160 22"
      : "M40 96 C 90 90, 120 72, 160 58";

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <linearGradient id="line" x1="0" x2="1">
        <stop offset="0" stop-color="rgba(10,200,185,.2)"/>
        <stop offset="0.5" stop-color="${accent}"/>
        <stop offset="1" stop-color="rgba(240,230,210,.35)"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <g opacity=".35">
      <path d="M0 70 H520" stroke="rgba(255,255,255,.06)"/>
      <path d="M0 120 H520" stroke="rgba(255,255,255,.05)"/>
      <path d="M0 170 H520" stroke="rgba(255,255,255,.04)"/>
    </g>

    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      WAVE STATE
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      ${title} • wave control decision cue
    </text>

    <g transform="translate(18,86)">
      <rect x="0" y="0" width="484" height="150" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>
      <path d="${curve}" transform="translate(30,40) scale(2.6)" stroke="url(#line)" stroke-width="5" fill="none" filter="url(#glow)"/>
      <circle cx="96" cy="170" r="6" fill="rgba(10,200,185,.85)"/>
      <circle cx="250" cy="170" r="6" fill="rgba(200,170,110,.85)"/>
      <circle cx="410" cy="170" r="6" fill="rgba(240,230,210,.75)"/>
      <text x="70" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Your side</text>
      <text x="210" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Mid</text>
      <text x="380" y="145" fill="rgba(159,179,200,.9)" font-family="Inter, sans-serif" font-size="12">Enemy side</text>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

function makeMapSVG() {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.6" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      MAP & TRACKING
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      Prio • pathing • gank window
    </text>

    <g transform="translate(18,78)">
      <rect x="0" y="0" width="484" height="166" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>
      <path d="M30 24 L454 142" stroke="rgba(63,85,104,.65)" stroke-width="6" opacity=".7"/>
      <path d="M30 142 L454 24" stroke="rgba(63,85,104,.55)" stroke-width="6" opacity=".7"/>
      <path d="M242 12 L242 154" stroke="rgba(63,85,104,.40)" stroke-width="5" opacity=".7"/>

      <circle cx="120" cy="62" r="10" fill="rgba(10,200,185,.85)" filter="url(#glow)"/>
      <circle cx="250" cy="88" r="10" fill="rgba(200,170,110,.85)" filter="url(#glow)"/>
      <circle cx="390" cy="112" r="10" fill="rgba(211,75,75,.75)" filter="url(#glow)"/>

      <path d="M90 130 C 150 110, 170 100, 220 92" stroke="rgba(10,200,185,.75)" stroke-width="4" fill="none" filter="url(#glow)"/>
      <polygon points="220,92 208,88 210,98" fill="rgba(10,200,185,.75)"/>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

function makeTempoSVG(label="Crash → Ward → Reset") {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="520" height="260" viewBox="0 0 520 260">
    <defs>
      <linearGradient id="bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#0b141e"/>
        <stop offset="1" stop-color="#071018"/>
      </linearGradient>
      <linearGradient id="gold" x1="0" x2="1">
        <stop offset="0" stop-color="rgba(10,200,185,.35)"/>
        <stop offset="0.5" stop-color="rgba(200,170,110,.85)"/>
        <stop offset="1" stop-color="rgba(240,230,210,.7)"/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="520" height="260" fill="url(#bg)"/>
    <text x="18" y="34" fill="rgba(240,230,210,.9)" font-family="Cinzel, serif" font-size="22" letter-spacing=".8">
      TEMPO
    </text>
    <text x="18" y="58" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="14">
      ${label}
    </text>

    <g transform="translate(18,78)">
      <rect x="0" y="0" width="484" height="166" rx="16" fill="rgba(7,16,24,.55)" stroke="rgba(63,85,104,.55)"/>
      <path d="M34 88 H450" stroke="rgba(63,85,104,.55)" stroke-width="8" stroke-linecap="round"/>
      <path d="M34 88 H450" stroke="url(#gold)" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      <circle cx="110" cy="88" r="12" fill="rgba(200,170,110,.85)"/>
      <circle cx="250" cy="88" r="12" fill="rgba(10,200,185,.78)"/>
      <circle cx="390" cy="88" r="12" fill="rgba(240,230,210,.72)"/>
      <text x="86" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Crash</text>
      <text x="230" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Ward</text>
      <text x="372" y="128" fill="rgba(159,179,200,.92)" font-family="Inter, sans-serif" font-size="12">Reset</text>
    </g>
  </svg>`;
  return svgToDataUri(svg);
}

function renderVisuals(q){
  const waveImg = document.getElementById("imgWave");
  const mapImg = document.getElementById("imgMap");
  const tempoImg = document.getElementById("imgTempo");

  // If any are missing, fail silently (avoids breaking the whole app)
  if(!waveImg || !mapImg || !tempoImg) return;

  const concept = (q?.concept || "").toLowerCase();

  let waveMode = "slowpush";
  let tempoLabel = "Crash → Ward → Reset";

  if (concept.includes("wave")) waveMode = "freeze";
  if (concept.includes("crash") || concept.includes("reset") || concept.includes("tempo")) waveMode = "crash";
  if (concept.includes("tracking")) tempoLabel = "Track → Cover → Punish";

  waveImg.src = makeWaveSVG(waveMode);
  mapImg.src = makeMapSVG();
  tempoImg.src = makeTempoSVG(tempoLabel);

  const w = document.getElementById("vizWaveLabel");
  const m = document.getElementById("vizMapLabel");
  const t = document.getElementById("vizTempoLabel");
  if(w) w.textContent = waveMode === "freeze" ? "Freeze near tower" : (waveMode === "crash" ? "Crash for reset" : "Build slow push");
  if(m) m.textContent = "Prio • Pathing • Window";
  if(t) t.textContent = tempoLabel;
}
