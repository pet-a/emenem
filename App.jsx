import { useState, useEffect } from "react";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dino")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d1117",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Courier New', monospace",
      padding: "40px 20px",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-18px) rotate(1deg); }
        }
        @keyframes glitch {
          0% { clip-path: inset(0 0 98% 0); transform: translate(-4px, 0); }
          10% { clip-path: inset(40% 0 50% 0); transform: translate(4px, 0); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
          30% { clip-path: inset(20% 0 70% 0); transform: translate(2px, 0); }
          40% { clip-path: inset(60% 0 30% 0); transform: translate(-4px, 0); }
          100% { clip-path: inset(0 0 98% 0); transform: translate(0, 0); }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-border {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,140,0.4), inset 0 0 30px rgba(0,255,140,0.05); }
          50% { box-shadow: 0 0 0 8px rgba(0,255,140,0), inset 0 0 60px rgba(0,255,140,0.1); }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .dino-wrap {
          animation: float 4s ease-in-out infinite;
          position: relative;
        }
        .dino-wrap::before, .dino-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E");
          pointer-events: none;
        }
        .glitch-text {
          position: relative;
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(52px, 10vw, 96px);
          color: #00ff8c;
          letter-spacing: 4px;
          line-height: 1;
        }
        .glitch-text::before {
          content: attr(data-text);
          position: absolute;
          left: 0; top: 0;
          color: #ff0055;
          animation: glitch 4s infinite steps(1);
          opacity: 0.7;
        }
        .card {
          background: rgba(0,255,140,0.03);
          border: 1px solid rgba(0,255,140,0.2);
          border-radius: 2px;
          padding: 28px 36px;
          animation: pulse-border 3s ease-in-out infinite, fadeUp 0.8s ease forwards;
          animation-delay: 0s, 0.4s;
          opacity: 0;
          max-width: 520px;
          width: 100%;
          position: relative;
        }
        .scanline {
          position: fixed;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(transparent, rgba(0,255,140,0.08), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 10;
        }
        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,140,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,140,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .tag {
          display: inline-block;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #00ff8c;
          border: 1px solid rgba(0,255,140,0.3);
          padding: 2px 8px;
          letter-spacing: 0.15em;
          margin-bottom: 12px;
        }
        .cursor { animation: blink 1s step-end infinite; }
        .endpoint-box {
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(0,255,140,0.15);
          border-radius: 2px;
          padding: 12px 16px;
          margin-top: 20px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: rgba(0,255,140,0.6);
          letter-spacing: 0.05em;
        }
        .method { color: #f0b429; }
        .path { color: #00ff8c; }
      `}</style>

      <div className="grid-bg" />
      <div className="scanline" />

      {/* Dino SVG — a cute anime-style dino girl illustrated in SVG */}
      <div className="dino-wrap" style={{ marginBottom: "36px", animation: "float 4s ease-in-out infinite", opacity: 0, animationFillMode: "forwards" }}
        style={{ marginBottom: "36px", animation: "float 4s ease-in-out infinite", opacity: 1 }}>
        <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="110" cy="180" rx="52" ry="58" fill="#3ecf6e" />
          {/* Belly */}
          <ellipse cx="110" cy="190" rx="32" ry="38" fill="#a8f0c0" />
          {/* Tail */}
          <path d="M158 210 Q200 230 195 260 Q175 240 155 235 Z" fill="#3ecf6e" />
          {/* Back spikes */}
          <polygon points="80,130 72,105 88,120" fill="#00cc55" />
          <polygon points="95,122 89,94 103,114" fill="#00cc55" />
          <polygon points="111,118 107,88 120,112" fill="#00cc55" />
          <polygon points="126,122 124,93 136,116" fill="#00cc55" />
          {/* Neck */}
          <ellipse cx="110" cy="135" rx="28" ry="22" fill="#3ecf6e" />
          {/* Head */}
          <ellipse cx="110" cy="102" rx="42" ry="38" fill="#3ecf6e" />
          {/* Snout */}
          <ellipse cx="110" cy="118" rx="22" ry="14" fill="#4ddf80" />
          {/* Nostril */}
          <circle cx="103" cy="116" r="2.5" fill="#2a9e4f" />
          <circle cx="117" cy="116" r="2.5" fill="#2a9e4f" />
          {/* Eyes - big anime eyes */}
          <ellipse cx="92" cy="96" rx="14" ry="16" fill="white" />
          <ellipse cx="128" cy="96" rx="14" ry="16" fill="white" />
          <ellipse cx="94" cy="98" rx="9" ry="11" fill="#1a1a2e" />
          <ellipse cx="130" cy="98" rx="9" ry="11" fill="#1a1a2e" />
          {/* Pupils */}
          <circle cx="96" cy="97" r="5" fill="#6644ff" />
          <circle cx="132" cy="97" r="5" fill="#6644ff" />
          {/* Eye shine */}
          <circle cx="99" cy="93" r="2.5" fill="white" />
          <circle cx="135" cy="93" r="2.5" fill="white" />
          <circle cx="93" cy="100" r="1.2" fill="white" opacity="0.7" />
          <circle cx="129" cy="100" r="1.2" fill="white" opacity="0.7" />
          {/* Eyelashes */}
          <line x1="82" y1="84" x2="78" y2="78" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="81" x2="86" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="95" y1="80" x2="95" y2="73" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="118" y1="81" x2="118" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="125" y1="81" x2="127" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="132" y1="84" x2="136" y2="78" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="80" cy="108" rx="10" ry="6" fill="#ff8faa" opacity="0.45" />
          <ellipse cx="140" cy="108" rx="10" ry="6" fill="#ff8faa" opacity="0.45" />
          {/* Smile */}
          <path d="M100 122 Q110 130 120 122" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Arms */}
          <ellipse cx="68" cy="172" rx="14" ry="22" fill="#3ecf6e" transform="rotate(-15 68 172)" />
          <ellipse cx="152" cy="172" rx="14" ry="22" fill="#3ecf6e" transform="rotate(15 152 172)" />
          {/* Little claws */}
          <path d="M60 188 Q55 195 58 198" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M66 191 Q63 199 66 202" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M72 190 Q71 198 74 200" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <ellipse cx="90" cy="232" rx="18" ry="24" fill="#3ecf6e" />
          <ellipse cx="130" cy="232" rx="18" ry="24" fill="#3ecf6e" />
          {/* Feet */}
          <ellipse cx="88" cy="253" rx="22" ry="9" fill="#2eb85c" />
          <ellipse cx="130" cy="253" rx="22" ry="9" fill="#2eb85c" />
          {/* Little bow on head */}
          <path d="M95 70 Q105 60 110 68 Q115 60 125 70 Q115 75 110 70 Q105 75 95 70Z" fill="#ff6b9d" />
          <circle cx="110" cy="70" r="4" fill="#ff3d7f" />
          {/* Sparkles */}
          <text x="168" y="85" fontSize="14" fill="#00ff8c" opacity="0.8">✦</text>
          <text x="30" y="110" fontSize="10" fill="#00ff8c" opacity="0.6">✦</text>
          <text x="175" y="145" fontSize="8" fill="#f0b429" opacity="0.7">★</text>
        </svg>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "28px", animation: "fadeUp 0.6s ease forwards" }}>
        <div className="glitch-text" data-text="DINO GIRL">DINO GIRL</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "11px", color: "rgba(0,255,140,0.5)", letterSpacing: "0.3em", marginTop: "8px" }}>
          API v1.0 <span className="cursor">_</span>
        </div>
      </div>

      {/* Card */}
      <div className="card">
        <div className="tag">GET /api/dino</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", color: "rgba(0,255,140,0.8)", lineHeight: 1.8 }}>
          {loading ? (
            <span style={{ opacity: 0.5 }}>fetching dino data<span className="cursor">...</span></span>
          ) : data ? (
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <span style={{ color: "#ff4466" }}>connection failed — is the server running?</span>
          )}
        </div>

        <div className="endpoint-box">
          <span className="method">GET </span>
          <span className="path">/api/dino</span>
          <span style={{ color: "rgba(0,255,140,0.4)", marginLeft: "12px" }}>→ returns dino metadata</span>
        </div>
      </div>

      <div style={{ marginTop: "32px", fontFamily: "'Space Mono', monospace", fontSize: "10px", color: "rgba(0,255,140,0.2)", letterSpacing: "0.15em" }}>
        RAWR XD • FASTAPI + REACT • RAILWAY
      </div>
    </div>
  );
}