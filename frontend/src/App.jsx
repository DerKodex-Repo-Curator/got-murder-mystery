import { useState } from "react";

const API = "http://localhost:8000";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --parch:     #f5ead6;
  --parch2:    #ede0c4;
  --parch3:    #e4d3b0;
  --cream:     #fdf6e8;
  --ink:       #1c1209;
  --ink2:      #2e1f0e;
  --ink3:      #3d2b14;
  --brown:     #6b4c28;
  --brown2:    #8b6535;
  --crimson:   #8b1a1a;
  --crimson2:  #b22222;
  --gold:      #b8860b;
  --gold2:     #d4a017;
  --gold3:     #e8b830;
  --rust:      #a0522d;
  --sage:      #4a5e3a;
  --muted:     #7a5c3a;
  --border:    rgba(107,76,40,0.25);
  --border2:   rgba(107,76,40,0.15);
  --shadow:    rgba(28,18,9,0.12);
}

html { scroll-behavior: smooth; }
body {
  background: var(--parch2);
  color: var(--ink);
  font-family: 'Cormorant Garamond', serif;
  font-size: 17px;
  line-height: 1.75;
  overflow-x: hidden;
  min-height: 100vh;
}

/* ── Parchment texture background ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 20% 10%, rgba(184,134,11,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 80% 90%, rgba(139,26,26,0.06) 0%, transparent 60%),
    repeating-linear-gradient(
      105deg,
      transparent 0px, transparent 80px,
      rgba(107,76,40,0.025) 80px, rgba(107,76,40,0.025) 81px
    ),
    repeating-linear-gradient(
      15deg,
      transparent 0px, transparent 120px,
      rgba(107,76,40,0.015) 120px, rgba(107,76,40,0.015) 121px
    );
}

/* Vignette edges */
body::after {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 60%, rgba(107,76,40,0.18) 100%);
}

.app {
  position: relative; z-index: 1;
  min-height: 100vh;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 1.25rem 6rem;
}

/* ══ HEADER ══════════════════════════════════════ */
.header {
  width: 100%; max-width: 1000px;
  text-align: center;
  padding: 3.5rem 1rem 2rem;
}

.header-crest {
  display: inline-flex; align-items: center; justify-content: center;
  width: 80px; height: 80px;
  background: linear-gradient(135deg, var(--crimson) 0%, #6b1010 100%);
  border-radius: 50%;
  border: 3px solid var(--gold2);
  box-shadow: 0 4px 20px rgba(139,26,26,0.3), 0 0 0 6px rgba(184,134,11,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
  font-size: 2.2rem;
  margin-bottom: 1.2rem;
  animation: crest-glow 4s ease-in-out infinite;
}
@keyframes crest-glow {
  0%,100% { box-shadow: 0 4px 20px rgba(139,26,26,0.3), 0 0 0 6px rgba(184,134,11,0.15); }
  50%      { box-shadow: 0 6px 32px rgba(139,26,26,0.45), 0 0 0 8px rgba(184,134,11,0.25); }
}

.title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(2rem, 5.5vw, 3.8rem);
  font-weight: 900;
  color: var(--ink);
  letter-spacing: 0.05em;
  line-height: 1.1;
  text-shadow: 1px 2px 0 rgba(107,76,40,0.2), 0 0 40px rgba(184,134,11,0.15);
}
.title span { color: var(--crimson); }

.subtitle {
  font-family: 'Cinzel', serif;
  font-size: 0.72rem; letter-spacing: 0.55em;
  color: var(--brown2); margin-top: 0.6rem; text-transform: uppercase;
}

.header-ornament {
  display: flex; align-items: center; gap: 1rem;
  margin-top: 1.8rem;
  color: var(--gold2); font-size: 0.8rem; letter-spacing: 0.3em;
}
.header-ornament::before, .header-ornament::after {
  content: '';
  flex: 1; height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold2), var(--crimson), var(--gold2), transparent);
  border-radius: 1px;
}

/* ══ CARD ════════════════════════════════════════ */
.card {
  width: 100%; max-width: 940px; margin-top: 2rem;
  animation: card-in 0.5s cubic-bezier(0.22,1,0.36,1);
}
@keyframes card-in {
  from { opacity:0; transform:translateY(18px); }
  to   { opacity:1; transform:translateY(0); }
}

.card-inner {
  background: linear-gradient(158deg, var(--cream) 0%, var(--parch) 100%);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2.8rem 3.2rem;
  position: relative;
  box-shadow:
    0 2px 0 rgba(255,255,255,0.7) inset,
    0 -1px 0 var(--border) inset,
    0 8px 40px var(--shadow),
    0 2px 8px rgba(107,76,40,0.08);
}

/* Top illuminated bar */
.card-inner::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg,
    transparent, var(--crimson) 15%, var(--gold2) 35%,
    var(--gold3) 50%, var(--gold2) 65%, var(--crimson) 85%, transparent);
  border-radius: 6px 6px 0 0;
}

.corner { position: absolute; font-size: 1rem; color: rgba(184,134,11,0.4); line-height: 1; }
.corner-tl{top:.8rem;left:1rem;} .corner-tr{top:.8rem;right:1rem;}
.corner-bl{bottom:.8rem;left:1rem;} .corner-br{bottom:.8rem;right:1rem;}

/* ══ LANDING ═════════════════════════════════════ */
.landing { text-align: center; }

.landing-seal {
  display: inline-block;
  width: 56px; height: 56px; line-height: 56px;
  background: radial-gradient(circle, var(--crimson) 0%, #6b1010 100%);
  border-radius: 50%;
  border: 2px solid var(--gold2);
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 3px 12px rgba(139,26,26,0.25);
}

.scroll-banner {
  position: relative;
  background: linear-gradient(180deg, rgba(228,211,176,0.6) 0%, rgba(213,193,152,0.5) 100%);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2rem 2.5rem;
  margin: 1.5rem auto 2.2rem;
  max-width: 580px;
}
.scroll-banner::before, .scroll-banner::after {
  content: '— ✦ —';
  display: block; text-align: center;
  font-size: 0.75rem; color: var(--gold2); letter-spacing: 0.3em;
}
.scroll-banner::before { margin-bottom: 1rem; }
.scroll-banner::after  { margin-top: 1rem; }

.landing-body {
  font-size: 1.1rem; color: var(--ink2);
  font-style: italic; line-height: 2;
}

.rules-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(175px,1fr));
  gap: 1rem; margin: 1.5rem 0 2.5rem;
}
.rule-item {
  background: rgba(255,255,255,0.55);
  border: 1px solid var(--border2);
  border-radius: 4px; padding: 1.1rem;
  text-align: center;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;
  box-shadow: 0 1px 4px var(--shadow);
}
.rule-item:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(184,134,11,0.35);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--shadow);
}
.rule-icon { font-size: 1.8rem; margin-bottom: 0.4rem; display: block; }
.rule-text { font-size: 0.85rem; color: var(--brown); font-style: italic; line-height: 1.6; }

/* ══ BUTTONS ═════════════════════════════════════ */
.btn-start {
  position: relative; padding: 1.1rem 3.5rem;
  background: linear-gradient(135deg, var(--crimson) 0%, #6b1010 100%);
  border: none; border-radius: 4px; cursor: pointer;
  font-family: 'Cinzel Decorative', serif; font-size: 0.88rem;
  letter-spacing: 0.12em; color: var(--parch);
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(139,26,26,0.35), 0 1px 0 rgba(255,255,255,0.1) inset;
  border: 1px solid rgba(184,134,11,0.3);
}
.btn-start:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--crimson2) 0%, #8b1515 100%);
  box-shadow: 0 6px 28px rgba(139,26,26,0.5), 0 1px 0 rgba(255,255,255,0.15) inset;
  transform: translateY(-2px); color: #fff8e8;
  border-color: rgba(184,134,11,0.5);
}
.btn-start:disabled { opacity: 0.45; cursor: not-allowed; }

.btn-accuse {
  width: 100%; padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(139,26,26,0.08) 0%, rgba(107,16,16,0.15) 100%);
  border: 1.5px solid rgba(139,26,26,0.25);
  border-radius: 4px; color: var(--crimson);
  font-family: 'Cinzel', serif; font-size: 0.82rem;
  letter-spacing: 0.22em; text-transform: uppercase;
  cursor: pointer; transition: all 0.25s ease;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 4px var(--shadow);
}
.btn-accuse:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--crimson) 0%, #8b1515 100%);
  border-color: var(--crimson);
  color: var(--parch);
  box-shadow: 0 4px 16px rgba(139,26,26,0.3);
  transform: translateY(-1px);
}
.btn-accuse:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-inner { display: flex; align-items: center; justify-content: center; gap: 0.6rem; }

/* ══ SCENE ═══════════════════════════════════════ */
.eyebrow {
  font-family: 'Cinzel', serif; font-size: 0.6rem;
  letter-spacing: 0.5em; color: var(--crimson2);
  text-transform: uppercase; margin-bottom: 0.3rem;
}
.scene-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.1rem, 2.8vw, 1.8rem);
  color: var(--ink); margin-bottom: 1.5rem; line-height: 1.2;
}
.scene-title span { color: var(--crimson); }

.details-grid {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border);
  border-radius: 4px; overflow: hidden; margin-bottom: 2rem;
}
@media(max-width:560px){.details-grid{grid-template-columns:1fr;}}

.detail-cell {
  background: rgba(255,255,255,0.6);
  padding: 1.1rem 1.3rem;
  transition: background 0.2s;
}
.detail-cell:hover { background: rgba(255,255,255,0.85); }
.d-icon { font-size: 1.3rem; margin-bottom: 0.3rem; display: block; }
.d-label {
  font-family: 'Cinzel', serif; font-size: 0.52rem;
  letter-spacing: 0.35em; color: var(--brown2);
  text-transform: uppercase; margin-bottom: 0.3rem;
}
.d-value { font-size: 0.95rem; color: var(--ink2); font-style: italic; font-weight: 500; }

/* ══ CLUE ════════════════════════════════════════ */
.clue-section { margin-bottom: 2rem; }
.clue-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.7rem; }
.clue-label {
  font-family: 'Cinzel', serif; font-size: 0.6rem;
  letter-spacing: 0.4em; color: var(--gold);
  text-transform: uppercase;
  display: flex; align-items: center; gap: 0.5rem;
}
.clue-label::before { content:''; display:inline-block; width:16px; height:1px; background:var(--gold); opacity:.6; }

.pips { display: flex; gap: 5px; }
.pip {
  width: 28px; height: 4px; border-radius: 2px;
  background: var(--parch3);
  border: 1px solid var(--border);
  transition: all 0.4s ease;
}
.pip.done { background: var(--brown2); border-color: var(--brown2); }
.pip.active {
  background: linear-gradient(90deg, var(--gold), var(--gold3));
  border-color: var(--gold2);
  box-shadow: 0 0 8px rgba(184,134,11,0.5);
  animation: pip-pulse 2s ease-in-out infinite;
}
@keyframes pip-pulse {
  0%,100%{box-shadow:0 0 8px rgba(184,134,11,0.5);}
  50%    {box-shadow:0 0 14px rgba(184,134,11,0.85);}
}

.clue-box {
  position: relative;
  background: linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,234,214,0.6) 100%);
  border: 1px solid var(--border);
  border-left: 4px solid var(--crimson);
  padding: 1.4rem 1.6rem 1.4rem 2rem;
  border-radius: 0 4px 4px 0;
  font-size: 1.05rem; color: var(--ink2);
  font-style: italic; line-height: 1.95;
  box-shadow: 0 2px 12px var(--shadow);
  animation: clue-slide 0.5s ease-out;
}
.clue-box::before {
  content: '"';
  position: absolute; top: -0.3rem; left: 0.8rem;
  font-size: 2.8rem; color: rgba(139,26,26,0.2);
  font-family: 'Cormorant Garamond', serif; line-height: 1;
}
@keyframes clue-slide {
  from { opacity:0; transform:translateX(-8px); }
  to   { opacity:1; transform:translateX(0); }
}

/* ══ BANNER ══════════════════════════════════════ */
.banner {
  padding: 0.95rem 1.3rem; border-radius: 4px;
  font-size: 0.95rem; line-height: 1.7;
  margin-bottom: 1.6rem; border-left: 4px solid;
  display: flex; align-items: flex-start; gap: 0.75rem;
  animation: banner-in 0.3s ease-out;
}
@keyframes banner-in { from{opacity:0;transform:translateY(-5px);}to{opacity:1;transform:translateY(0);} }
.b-icon { font-size: 1.1rem; flex-shrink: 0; margin-top: 0.15rem; }
.banner.info    { background: rgba(255,255,255,0.65); border-color: var(--gold2); color: var(--ink2); }
.banner.success { background: rgba(220,240,220,0.7);  border-color: var(--sage); color: #2a4a2a; }
.banner.error   { background: rgba(255,235,235,0.75); border-color: var(--crimson); color: var(--crimson); }

/* ══ DIVIDER ═════════════════════════════════════ */
.divider {
  display: flex; align-items: center; gap: 1rem; margin: 1.5rem 0;
  font-family: 'Cinzel', serif; font-size: 0.62rem;
  letter-spacing: 0.4em; color: var(--brown2); text-transform: uppercase;
}
.divider::before,.divider::after {
  content:''; flex:1; height:1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}

/* ══ SUSPECTS ════════════════════════════════════ */
.suspects-bar {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;
}
.suspects-label {
  font-family: 'Cinzel', serif; font-size: 0.6rem;
  letter-spacing: 0.4em; color: var(--gold);
  text-transform: uppercase;
  display: flex; align-items: center; gap: 0.5rem;
}
.suspects-label::before { content:''; display:inline-block; width:16px; height:1px; background:var(--gold); opacity:.6; }
.suspects-count {
  font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.2em;
  color: var(--brown2); background: rgba(255,255,255,0.6);
  border: 1px solid var(--border); padding: 0.2rem 0.65rem; border-radius: 20px;
}

.suspects-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(230px,1fr));
  gap: 0.85rem; margin-bottom: 2rem;
}

.suspect-card {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(245,234,214,0.55) 100%);
  border: 1.5px solid var(--border2);
  border-radius: 4px; padding: 1.15rem 1.2rem;
  cursor: pointer; transition: all 0.22s ease;
  box-shadow: 0 1px 6px var(--shadow);
}
.suspect-card:hover:not(.elim):not(.sel) {
  border-color: rgba(184,134,11,0.4);
  background: rgba(255,255,255,0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107,76,40,0.15);
}
.suspect-card.sel {
  border-color: var(--crimson);
  background: linear-gradient(135deg, #fff5f5 0%, #ffeaea 100%);
  box-shadow: 0 0 0 3px rgba(139,26,26,0.12), 0 6px 20px rgba(139,26,26,0.1);
}
.sel-badge {
  position: absolute; top: 0.5rem; right: 0.65rem;
  color: var(--crimson); font-size: 0.75rem;
  animation: badge-pop 0.2s cubic-bezier(.34,1.56,.64,1);
}
@keyframes badge-pop { from{opacity:0;transform:scale(.4) rotate(-20deg);}to{opacity:1;transform:scale(1) rotate(0);} }
.suspect-card.elim {
  opacity: 0.35; cursor: not-allowed; filter: grayscale(0.7);
  transform: none !important; pointer-events: none;
}
.elim-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(245,234,214,0.55);
}
.elim-label {
  font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.3em;
  color: var(--crimson); border: 1.5px solid var(--crimson);
  padding: 0.2rem 0.55rem; transform: rotate(-10deg);
  background: rgba(255,255,255,0.85);
}

.s-name { font-family:'Cinzel',serif; font-size:0.9rem; color:var(--ink); margin-bottom:0.3rem; font-weight:600; }
.s-rule { height:1px; background:linear-gradient(90deg,var(--border),transparent); margin-bottom:0.4rem; }
.s-ml { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.28em; color:var(--brown2); text-transform:uppercase; margin-bottom:0.2rem; }
.s-motive { font-size:0.84rem; color:var(--brown); font-style:italic; line-height:1.5; }

/* ══ HISTORY ═════════════════════════════════════ */
.history { margin-top: 1.5rem; }
.history-label {
  font-family: 'Cinzel', serif; font-size: 0.58rem;
  letter-spacing: 0.38em; color: var(--brown2);
  text-transform: uppercase; margin-bottom: 0.7rem;
  display: flex; align-items: center; gap: 0.5rem;
}
.history-label::before { content:''; display:inline-block; width:14px; height:1px; background:var(--brown2); opacity:.5; }
.h-item {
  display: flex; gap: 0.7rem; align-items: flex-start;
  background: rgba(255,255,255,0.45);
  border-left: 2px solid var(--border);
  padding: 0.6rem 0.85rem; margin-bottom: 0.4rem;
  border-radius: 0 3px 3px 0;
}
.h-num { font-family:'Cinzel',serif; font-size:.58rem; color:var(--gold); letter-spacing:.18em; flex-shrink:0; margin-top:.15rem; }
.h-text { font-size:.83rem; color:var(--brown); font-style:italic; line-height:1.5; }

/* ══ LOADING ═════════════════════════════════════ */
.loading-wrap { text-align: center; padding: 5rem 2rem; }
.loading-dragon {
  font-size: 4rem; display: inline-block; margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 12px rgba(139,26,26,0.4));
  animation: dragon-fly 2.8s ease-in-out infinite;
}
@keyframes dragon-fly { 0%,100%{transform:translateY(0) rotate(-3deg);}50%{transform:translateY(-14px) rotate(3deg);} }
.loading-dots { display:flex; justify-content:center; gap:.45rem; margin-bottom:1rem; }
.ld {
  width:7px; height:7px; border-radius:50%;
  background: var(--crimson); animation: ldp 1.4s ease-in-out infinite;
}
.ld:nth-child(2){animation-delay:.2s;background:var(--gold2);}
.ld:nth-child(3){animation-delay:.4s;background:var(--crimson);}
@keyframes ldp { 0%,80%,100%{transform:scale(.55);opacity:.3;}40%{transform:scale(1);opacity:1;} }
.loading-text {
  font-family: 'Cinzel', serif; font-size: 0.72rem;
  letter-spacing: 0.4em; color: var(--brown); text-transform: uppercase;
}

/* ══ OUTCOME ═════════════════════════════════════ */
.outcome { text-align: center; padding: 2rem 1rem; }
.outcome-icon {
  font-size: 5rem; display: inline-block; margin-bottom: 1rem;
  animation: o-appear 0.6s cubic-bezier(.34,1.56,.64,1);
  filter: drop-shadow(0 4px 16px rgba(139,26,26,0.3));
}
@keyframes o-appear { from{transform:scale(0) rotate(-20deg);opacity:0;}to{transform:scale(1) rotate(0);opacity:1;} }
.outcome-title {
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(1.5rem, 4vw, 2.4rem);
  margin-bottom: 0.5rem;
  animation: fade-up 0.5s ease-out 0.3s both;
}
.outcome-title.win  { color: var(--sage); }
.outcome-title.loss { color: var(--crimson); }
@keyframes fade-up { from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);} }

.reveal-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1rem; margin: 2rem 0; text-align: left;
}
@media(max-width:480px){.reveal-grid{grid-template-columns:1fr;}}
.reveal-card {
  background: rgba(255,255,255,0.65);
  border: 1px solid var(--border);
  border-radius: 4px; padding: 1.2rem;
  box-shadow: 0 2px 8px var(--shadow);
}
.r-label { font-family:'Cinzel',serif; font-size:.54rem; letter-spacing:.33em; color:var(--brown2); text-transform:uppercase; margin-bottom:.4rem; }
.r-value { font-size:1.08rem; color:var(--ink2); font-style:italic; font-weight:500; }

/* ══ RESPONSIVE ══════════════════════════════════ */
@media(max-width:640px){
  .card-inner { padding: 2rem 1.5rem; }
  .suspects-grid { grid-template-columns: 1fr; }
}
`;

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [gameState, setGameState] = useState(null);
  const [currentClue, setCurrentClue] = useState("");
  const [clueHistory, setClueHistory] = useState([]);
  const [message, setMessage] = useState(null);
  const [selected, setSelected] = useState(null);
  const [eliminated, setEliminated] = useState([]);
  const [loadingGuess, setLoadingGuess] = useState(false);

  const startGame = async () => {
    setPhase("loading");
    setEliminated([]); setClueHistory([]); setSelected(null); setMessage(null);
    try {
      const res = await fetch(`${API}/new-game`, { method: "POST" });
      const data = await res.json();
      setGameState(data.game_state);
      setCurrentClue(data.current_clue);
      setClueHistory([{ n: 1, text: data.current_clue }]);
      setMessage({ text: data.message, type: "info" });
      setPhase("playing");
    } catch {
      setMessage({ text: "The ravens could not deliver the message. Is the backend running on port 8000?", type: "error" });
      setPhase("landing");
    }
  };

  const submitGuess = async () => {
    if (!selected || loadingGuess) return;
    setLoadingGuess(true);
    try {
      const res = await fetch(`${API}/guess`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ game_state: gameState, guess: selected }),
      });
      const data = await res.json();
      setGameState(data.game_state);
      setMessage({ text: data.message, type: data.correct ? "success" : "error" });
      if (!data.correct) {
        setEliminated(e => [...e, selected]);
        if (data.new_clue) {
          setClueHistory(h => [...h, { n: h.length + 1, text: data.new_clue }]);
          setCurrentClue(data.new_clue);
        }
      }
      if (data.game_state.game_over) setPhase("over");
      setSelected(null);
    } catch {
      setMessage({ text: "The raven was lost. Try again.", type: "error" });
    }
    setLoadingGuess(false);
  };

  const scenario = gameState?.scenario;
  const remaining = gameState?.remaining_suspects ?? [];
  const totalClues = scenario?.clues?.length ?? 4;
  const bIcon = t => t === "success" ? "👑" : t === "error" ? "🗡" : "📜";
  const corners = ["corner-tl","corner-tr","corner-bl","corner-br"];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* ── Header ── */}
        <header className="header">
          <div className="header-crest">⚔️</div>
          <h1 className="title">Murder in <span>Westeros</span></h1>
          <p className="subtitle">A Game of Thrones · Murder Mystery</p>
          <div className="header-ornament">✦ ✦ ✦</div>
        </header>

        {/* ── Landing ── */}
        {phase === "landing" && (
          <div className="card">
            <div className="card-inner">
              {corners.map(c => <span key={c} className={`corner ${c}`}>✦</span>)}
              <div className="landing">
                <div className="eyebrow">A Dark Conspiracy Awaits</div>
                <div className="scroll-banner">
                  <p className="landing-body">
                    In the kingdoms of Westeros, treachery lurks behind every throne.
                    A murder most foul has been committed. Five suspects stand before you,
                    each with reason to kill. Use your wit to name the killer
                    before the trail runs cold.
                  </p>
                </div>
                <div className="rules-grid">
                  {[
                    { icon:"🕯", text:"One clue at a time — each more revealing than the last" },
                    { icon:"⚔️", text:"Each wrong accusation eliminates a suspect and unlocks a new clue" },
                    { icon:"💀", text:"Unmask the killer before only two suspects remain" },
                  ].map(r => (
                    <div key={r.icon} className="rule-item">
                      <span className="rule-icon">{r.icon}</span>
                      <p className="rule-text">{r.text}</p>
                    </div>
                  ))}
                </div>
                <button className="btn-start" onClick={startGame}>
                  ⚔ Begin the Investigation
                </button>
                {message?.type === "error" && (
                  <div className="banner error" style={{ marginTop:"1.5rem", textAlign:"left" }}>
                    <span className="b-icon">⚠</span><span>{message.text}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Loading ── */}
        {phase === "loading" && (
          <div className="card">
            <div className="card-inner">
              <div className="loading-wrap">
                <div className="loading-dragon">🐉</div>
                <div className="loading-dots">{[0,1,2].map(i=><div key={i} className="ld"/>)}</div>
                <div className="loading-text">The ravens carry dark tidings across the realm...</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Playing ── */}
        {phase === "playing" && scenario && (
          <div className="card">
            <div className="card-inner">
              {corners.map(c => <span key={c} className={`corner ${c}`}>✦</span>)}

              <div className="eyebrow">The Crime Scene</div>
              <div className="scene-title">The Death of <span>{scenario.victim}</span></div>

              <div className="details-grid">
                {[
                  { icon:"⚰️", label:"Victim",         value: scenario.victim },
                  { icon:"🏰", label:"Location",       value: scenario.place },
                  { icon:"🗡️", label:"Cause of Death", value: scenario.murder_method },
                ].map(d => (
                  <div key={d.label} className="detail-cell">
                    <span className="d-icon">{d.icon}</span>
                    <div className="d-label">{d.label}</div>
                    <div className="d-value">{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Clue */}
              <div className="clue-section">
                <div className="clue-top">
                  <div className="clue-label">Current Clue</div>
                  <div className="pips">
                    {Array.from({ length: totalClues }).map((_,i) => (
                      <div key={i} className={`pip ${i < clueHistory.length-1 ? "done" : i === clueHistory.length-1 ? "active" : ""}`} />
                    ))}
                  </div>
                </div>
                <div className="clue-box">{currentClue}</div>
              </div>

              {message && (
                <div className={`banner ${message.type}`}>
                  <span className="b-icon">{bIcon(message.type)}</span>
                  <span>{message.text}</span>
                </div>
              )}

              <div className="divider">The Accused</div>

              <div className="suspects-bar">
                <div className="suspects-label">Five Suspects</div>
                <div className="suspects-count">{remaining.length} Remaining</div>
              </div>

              <div className="suspects-grid">
                {scenario.suspects.map(s => {
                  const isElim = eliminated.includes(s.name);
                  const isSel  = selected === s.name;
                  return (
                    <div key={s.name}
                      className={`suspect-card ${isElim?"elim":""} ${isSel?"sel":""}`}
                      onClick={() => !isElim && setSelected(isSel ? null : s.name)}
                    >
                      {isElim && <div className="elim-overlay"><span className="elim-label">Eliminated</span></div>}
                      {isSel  && <span className="sel-badge">⚔</span>}
                      <div className="s-name">{s.name}</div>
                      <div className="s-rule" />
                      <div className="s-ml">Motive</div>
                      <div className="s-motive">{s.motive}</div>
                    </div>
                  );
                })}
              </div>

              <button className="btn-accuse" disabled={!selected || loadingGuess} onClick={submitGuess}>
                <div className="btn-inner">
                  <span>⚔</span>
                  <span>{loadingGuess ? "Consulting the Grand Maester..." : selected ? `Accuse ${selected}` : "Select a Suspect First"}</span>
                </div>
              </button>

              {clueHistory.length > 1 && (
                <div className="history">
                  <div className="history-label">Previous Clues</div>
                  {clueHistory.slice(0,-1).map(c => (
                    <div key={c.n} className="h-item">
                      <span className="h-num">#{c.n}</span>
                      <span className="h-text">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Game Over ── */}
        {phase === "over" && scenario && (
          <div className="card">
            <div className="card-inner">
              {corners.map(c => <span key={c} className={`corner ${c}`}>✦</span>)}
              <div className="outcome">
                <div className="outcome-icon">{gameState.won ? "👑" : "💀"}</div>
                <div className={`outcome-title ${gameState.won ? "win" : "loss"}`}>
                  {gameState.won ? "Justice is Served" : "The Killer Escapes"}
                </div>
                {message && (
                  <div className={`banner ${message.type}`} style={{ textAlign:"left", marginTop:"1.5rem" }}>
                    <span className="b-icon">{bIcon(message.type)}</span>
                    <span>{message.text}</span>
                  </div>
                )}
                <div className="reveal-grid">
                  <div className="reveal-card">
                    <div className="r-label">⚔ The True Killer</div>
                    <div className="r-value">{scenario.killer}</div>
                  </div>
                  <div className="reveal-card">
                    <div className="r-label">🗡 Their Motive</div>
                    <div className="r-value">{scenario.killer_motive}</div>
                  </div>
                </div>
                <button className="btn-start" onClick={startGame}>
                  🐉 Begin New Investigation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}