import { useEffect, useRef, useState } from "react";

const W = 800;
const H = 450;
const GROUND = H - 80;
const GRAVITY = 0.6;
const JUMP_FORCE = -13;
const SPEED = 4;

function DinoSVG({ flipped, walking, frame }) {
  const legSwing = walking ? (frame % 20 < 10 ? 12 : -12) : 0;
  const armSwing = walking ? (frame % 20 < 10 ? -15 : 15) : 0;

  return (
    <svg width="60" height="72" viewBox="0 0 60 72" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flipped ? "scaleX(-1)" : "none", overflow: "visible" }}>
      {/* Spikes */}
      <polygon points="18,20 14,8 22,17" fill="#00cc55" />
      <polygon points="26,16 23,3 31,14" fill="#00cc55" />
      <polygon points="34,16 32,3 40,14" fill="#00cc55" />
      {/* Body */}
      <ellipse cx="30" cy="46" rx="16" ry="18" fill="#3ecf6e" />
      <ellipse cx="30" cy="50" rx="10" ry="12" fill="#a8f0c0" />
      {/* Tail */}
      <path d="M44 54 Q58 60 57 72 Q50 64 43 62 Z" fill="#3ecf6e" />
      {/* Neck */}
      <ellipse cx="30" cy="32" rx="9" ry="7" fill="#3ecf6e" />
      {/* Head */}
      <ellipse cx="30" cy="22" rx="14" ry="13" fill="#3ecf6e" />
      {/* Snout */}
      <ellipse cx="30" cy="28" rx="8" ry="5" fill="#4ddf80" />
      {/* Mouth */}
      <path d="M24 29 Q30 34 36 29" fill="#cc3355" />
      <path d="M24 29 Q30 31 36 29" fill="#ff6688" />
      {/* Nostrils */}
      <circle cx="27" cy="27" r="1.2" fill="#2a9e4f" />
      <circle cx="33" cy="27" r="1.2" fill="#2a9e4f" />
      {/* Eyes */}
      <ellipse cx="23" cy="19" rx="5" ry="6" fill="white" />
      <ellipse cx="37" cy="19" rx="5" ry="6" fill="white" />
      <circle cx="24" cy="20" r="3" fill="#1a1a2e" />
      <circle cx="38" cy="20" r="3" fill="#1a1a2e" />
      <circle cx="25" cy="19" r="1.5" fill="#6644ff" />
      <circle cx="39" cy="19" r="1.5" fill="#6644ff" />
      <circle cx="26" cy="18" r="0.8" fill="white" />
      <circle cx="40" cy="18" r="0.8" fill="white" />
      {/* Lashes */}
      <line x1="18" y1="13" x2="16" y2="10" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="12" x2="21" y2="9" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />
      <line x1="32" y1="12" x2="32" y2="9" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />
      <line x1="36" y1="13" x2="38" y2="10" stroke="#1a1a2e" strokeWidth="1" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="18" cy="24" rx="4" ry="2.5" fill="#ff8faa" opacity="0.5" />
      <ellipse cx="42" cy="24" rx="4" ry="2.5" fill="#ff8faa" opacity="0.5" />
      {/* Bow */}
      <path d="M23 9 Q27 5 30 8 Q33 5 37 9 Q33 12 30 9 Q27 12 23 9Z" fill="#ff6b9d" />
      <circle cx="30" cy="9" r="2" fill="#ff3d7f" />
      {/* Arms */}
      <ellipse cx="14" cy="44" rx="5" ry="8" fill="#3ecf6e"
        transform={`rotate(${armSwing} 14 38)`} />
      <ellipse cx="46" cy="44" rx="5" ry="8" fill="#3ecf6e"
        transform={`rotate(${-armSwing} 46 38)`} />
      {/* Legs */}
      <ellipse cx="23" cy="62" rx="6" ry="9" fill="#3ecf6e"
        transform={`rotate(${legSwing} 23 54)`} />
      <ellipse cx="37" cy="62" rx="6" ry="9" fill="#3ecf6e"
        transform={`rotate(${-legSwing} 37 54)`} />
      {/* Feet */}
      <ellipse cx="23" cy="70" rx="8" ry="3" fill="#2eb85c" />
      <ellipse cx="37" cy="70" rx="8" ry="3" fill="#2eb85c" />
    </svg>
  );
}

function Cloud({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.6">
      <ellipse cx="30" cy="20" rx="30" ry="16" fill="white" />
      <ellipse cx="10" cy="24" rx="16" ry="12" fill="white" />
      <ellipse cx="50" cy="24" rx="16" ry="12" fill="white" />
    </g>
  );
}

function Star({ x, y, size }) {
  return <circle cx={x} cy={y} r={size} fill="white" opacity={Math.random() * 0.5 + 0.3} />;
}

const STARS = Array.from({ length: 40 }, (_, i) => ({
  id: i, x: Math.random() * W, y: Math.random() * (H * 0.6), size: Math.random() * 1.5 + 0.5
}));

const CLOUDS = [
  { id: 0, x: 80, y: 40 },
  { id: 1, x: 320, y: 70 },
  { id: 2, x: 560, y: 30 },
  { id: 3, x: 680, y: 80 },
];

const PLATFORMS = [
  { x: 150, y: GROUND - 90, w: 120 },
  { x: 350, y: GROUND - 150, w: 100 },
  { x: 520, y: GROUND - 100, w: 130 },
  { x: 650, y: GROUND - 60, w: 90 },
];

const COINS = [
  { id: 0, x: 175, y: GROUND - 130, collected: false },
  { id: 1, x: 230, y: GROUND - 130, collected: false },
  { id: 2, x: 375, y: GROUND - 195, collected: false },
  { id: 3, x: 420, y: GROUND - 195, collected: false },
  { id: 4, x: 545, y: GROUND - 145, collected: false },
  { id: 5, x: 400, y: GROUND - 30, collected: false },
  { id: 6, x: 600, y: GROUND - 30, collected: false },
];

function MobileBtn({ onPress, onRelease, label, big }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={(e) => { e.preventDefault(); setPressed(true); onPress(); }}
      onPointerUp={(e) => { e.preventDefault(); setPressed(false); onRelease(); }}
      onPointerLeave={(e) => { e.preventDefault(); setPressed(false); onRelease(); }}
      style={{
        width: big ? "72px" : "60px",
        height: big ? "72px" : "60px",
        borderRadius: "50%",
        border: "2px solid rgba(78,207,110,0.4)",
        background: pressed ? "rgba(78,207,110,0.35)" : "rgba(78,207,110,0.12)",
        color: "#3ecf6e",
        fontSize: big ? "26px" : "22px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none",
        WebkitTapHighlightColor: "transparent",
        transition: "background 0.1s",
        boxShadow: pressed ? "0 0 16px rgba(78,207,110,0.4)" : "none",
      }}
    >
      {label}
    </button>
  );
}

export default function App() {
  const stateRef = useRef({
    x: 100, y: GROUND - 72,
    vx: 0, vy: 0,
    onGround: false,
    flipped: false,
    frame: 0,
    coins: COINS.map(c => ({ ...c })),
    score: 0,
    time: 0,
  });
  const keysRef = useRef({});
  const rafRef = useRef();
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    const onKey = (e) => {
      keysRef.current[e.code] = e.type === "keydown";
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);

    const loop = () => {
      const s = stateRef.current;
      const keys = keysRef.current;

      s.frame++;
      s.time++;

      // Horizontal movement
      if (keys["ArrowLeft"]) { s.vx = -SPEED; s.flipped = true; }
      else if (keys["ArrowRight"]) { s.vx = SPEED; s.flipped = false; }
      else s.vx = 0;

      // Jump
      if ((keys["ArrowUp"] || keys["Space"]) && s.onGround) {
        s.vy = JUMP_FORCE;
        s.onGround = false;
      }

      // Gravity
      s.vy += GRAVITY;
      s.x += s.vx;
      s.y += s.vy;

      // Wall bounds
      s.x = Math.max(0, Math.min(W - 60, s.x));

      // Ground collision
      s.onGround = false;
      if (s.y >= GROUND - 72) {
        s.y = GROUND - 72;
        s.vy = 0;
        s.onGround = true;
      }

      // Platform collisions
      for (const p of PLATFORMS) {
        const dinoBottom = s.y + 72;
        const dinoLeft = s.x + 8;
        const dinoRight = s.x + 52;
        const prevBottom = dinoBottom - s.vy;
        if (
          dinoRight > p.x && dinoLeft < p.x + p.w &&
          dinoBottom >= p.y && prevBottom <= p.y + 4 &&
          s.vy >= 0
        ) {
          s.y = p.y - 72;
          s.vy = 0;
          s.onGround = true;
        }
      }

      // Coin collection
      for (const c of s.coins) {
        if (!c.collected) {
          const dx = (s.x + 30) - c.x;
          const dy = (s.y + 36) - c.y;
          if (Math.sqrt(dx * dx + dy * dy) < 28) {
            c.collected = true;
            s.score += 10;
          }
        }
      }

      setRenderTick(t => t + 1);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  const s = stateRef.current;
  const walking = s.vx !== 0;
  const elapsed = Math.floor(s.time / 60); // Convert frames to seconds (60 FPS)
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a1a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      userSelect: "none",
    }}>
      <style>{`
        @keyframes coinSpin {
          from { transform: scaleX(1); }
          to   { transform: scaleX(-1); }
        }
        .coin { animation: coinSpin 0.8s linear infinite alternate; transform-origin: center; }
      `}</style>

      {/* Score */}
      <div style={{
        color: "#ffdd00", fontSize: "18px", fontWeight: "bold",
        letterSpacing: "0.2em", marginBottom: "10px",
      }}>
        ★ SCORE: {s.score}
      </div>

      {/* Timer */}
      <div style={{
        color: "#ff88ff", fontSize: "18px", fontWeight: "bold",
        letterSpacing: "0.2em", marginBottom: "10px",
      }}>
        ⏱ TIME: {timeString}
      </div>

      {/* Game canvas */}
      <svg width={W} height={H} style={{
        border: "2px solid #2a2a4a",
        borderRadius: "8px",
        display: "block",
        maxWidth: "100%",
      }}>
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a0a2e" />
            <stop offset="100%" stopColor="#1a2a4a" />
          </linearGradient>
          <linearGradient id="ground-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2eb85c" />
            <stop offset="100%" stopColor="#1a6e35" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky)" />

        {/* Stars */}
        {STARS.map(st => <Star key={st.id} {...st} />)}

        {/* Moon */}
        <circle cx={720} cy={60} r={28} fill="#fffde7" opacity="0.9" />
        <circle cx={734} cy={52} r={22} fill="#1a2a4a" />

        {/* Clouds */}
        {CLOUDS.map(c => <Cloud key={c.id} x={c.x} y={c.y} />)}

        {/* Ground */}
        <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="url(#ground-grad)" />
        <rect x={0} y={GROUND} width={W} height={4} fill="#4ddf80" opacity="0.5" />
        {/* Ground details */}
        {Array.from({ length: 16 }).map((_, i) => (
          <ellipse key={i} cx={i * 55 + 20} cy={GROUND + 10} rx={18} ry={5} fill="#3ecf6e" opacity="0.3" />
        ))}

        {/* Platforms */}
        {PLATFORMS.map((p, i) => (
          <g key={i}>
            <rect x={p.x} y={p.y} width={p.w} height={16} rx={6} fill="#2eb85c" />
            <rect x={p.x} y={p.y} width={p.w} height={5} rx={4} fill="#4ddf80" opacity="0.6" />
            <rect x={p.x + 4} y={p.y + 6} width={p.w - 8} height={3} rx={2} fill="#1a6e35" opacity="0.4" />
          </g>
        ))}

        {/* Coins */}
        {s.coins.map(c => !c.collected && (
          <g key={c.id} className="coin" style={{ transformOrigin: `${c.x}px ${c.y}px` }}>
            <circle cx={c.x} cy={c.y} r={10} fill="#ffdd00" />
            <circle cx={c.x} cy={c.y} r={7} fill="#ffaa00" />
            <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize="9" fill="#ffdd00" fontWeight="bold">$</text>
          </g>
        ))}

        {/* Dino */}
        <foreignObject x={s.x} y={s.y} width={60} height={72}>
          <div xmlns="http://www.w3.org/1999/xhtml">
            <DinoSVG flipped={s.flipped} walking={walking} frame={s.frame} />
          </div>
        </foreignObject>

        {/* Shadow */}
        <ellipse
          cx={s.x + 30}
          cy={GROUND + 6}
          rx={20}
          ry={5}
          fill="black"
          opacity={0.15}
        />

        {/* Controls hint - desktop only */}
        <text x={10} y={H - 10} fontSize="11" fill="rgba(255,255,255,0.3)" fontFamily="monospace">
          ← → move  ↑ / space jump  ★ collect coins
        </text>
      </svg>

      {/* Mobile controls */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginTop: "16px",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Left */}
        <MobileBtn
          onPress={() => { keysRef.current["ArrowLeft"] = true; }}
          onRelease={() => { keysRef.current["ArrowLeft"] = false; }}
          label="◀"
        />
        {/* Jump */}
        <MobileBtn
          onPress={() => { keysRef.current["ArrowUp"] = true; }}
          onRelease={() => { keysRef.current["ArrowUp"] = false; }}
          label="▲"
          big
        />
        {/* Right */}
        <MobileBtn
          onPress={() => { keysRef.current["ArrowRight"] = true; }}
          onRelease={() => { keysRef.current["ArrowRight"] = false; }}
          label="▶"
        />
      </div>
    </div>
  );
}