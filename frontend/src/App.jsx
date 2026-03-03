import { useState, useEffect } from "react";

export default function App() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .dino { animation: float 3s ease-in-out infinite; }
        .bubble {
          animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }
      `}</style>

      {/* Speech bubble */}
      <div className="bubble" style={{
        position: "relative",
        background: "#fff",
        borderRadius: "20px",
        padding: "14px 24px",
        marginBottom: "12px",
        fontSize: "28px",
        fontWeight: "bold",
        color: "#1a1a1a",
        letterSpacing: "0.05em",
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}>
        dajňojóóór!
        {/* Bubble tail */}
        <div style={{
          position: "absolute",
          bottom: "-18px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "20px solid #fff",
        }} />
      </div>

      {/* Dino */}
      <div className="dino">
        <svg width="200" height="240" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="110" cy="180" rx="52" ry="58" fill="#3ecf6e" />
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
          {/* Snout - open mouth */}
          <ellipse cx="110" cy="118" rx="22" ry="14" fill="#4ddf80" />
          {/* Open mouth */}
          <path d="M92 120 Q110 135 128 120" fill="#cc3355" />
          <path d="M92 120 Q110 125 128 120" fill="#ff6688" />
          {/* Teeth */}
          <polygon points="96,120 100,120 98,127" fill="white" />
          <polygon points="104,120 108,120 106,128" fill="white" />
          <polygon points="112,120 116,120 114,128" fill="white" />
          <polygon points="120,120 124,120 122,127" fill="white" />
          {/* Nostrils */}
          <circle cx="103" cy="113" r="2.5" fill="#2a9e4f" />
          <circle cx="117" cy="113" r="2.5" fill="#2a9e4f" />
          {/* Eyes */}
          <ellipse cx="92" cy="96" rx="14" ry="16" fill="white" />
          <ellipse cx="128" cy="96" rx="14" ry="16" fill="white" />
          <ellipse cx="94" cy="98" rx="9" ry="11" fill="#1a1a2e" />
          <ellipse cx="130" cy="98" rx="9" ry="11" fill="#1a1a2e" />
          <circle cx="96" cy="97" r="5" fill="#6644ff" />
          <circle cx="132" cy="97" r="5" fill="#6644ff" />
          <circle cx="99" cy="93" r="2.5" fill="white" />
          <circle cx="135" cy="93" r="2.5" fill="white" />
          {/* Eyelashes */}
          <line x1="82" y1="84" x2="78" y2="78" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="88" y1="81" x2="86" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="95" y1="80" x2="95" y2="73" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="118" y1="81" x2="118" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="125" y1="81" x2="127" y2="74" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="132" y1="84" x2="136" y2="78" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
          {/* Blush */}
          <ellipse cx="80" cy="108" rx="10" ry="6" fill="#ff8faa" opacity="0.5" />
          <ellipse cx="140" cy="108" rx="10" ry="6" fill="#ff8faa" opacity="0.5" />
          {/* Arms - raised up excitedly */}
          <ellipse cx="64" cy="160" rx="14" ry="22" fill="#3ecf6e" transform="rotate(-40 64 160)" />
          <ellipse cx="156" cy="160" rx="14" ry="22" fill="#3ecf6e" transform="rotate(40 156 160)" />
          {/* Claws */}
          <path d="M50 148 Q44 143 47 139" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M56 143 Q52 137 55 133" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M163 148 Q169 143 166 139" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M157 143 Q161 137 158 133" stroke="#2a9e4f" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Legs */}
          <ellipse cx="90" cy="232" rx="18" ry="24" fill="#3ecf6e" />
          <ellipse cx="130" cy="232" rx="18" ry="24" fill="#3ecf6e" />
          <ellipse cx="88" cy="253" rx="22" ry="9" fill="#2eb85c" />
          <ellipse cx="130" cy="253" rx="22" ry="9" fill="#2eb85c" />
          {/* Bow */}
          <path d="M95 70 Q105 60 110 68 Q115 60 125 70 Q115 75 110 70 Q105 75 95 70Z" fill="#ff6b9d" />
          <circle cx="110" cy="70" r="4" fill="#ff3d7f" />
          {/* Sparkles */}
          <text x="162" y="75" fontSize="16" fill="#ffdd00">✦</text>
          <text x="28" y="100" fontSize="11" fill="#ffdd00">✦</text>
          <text x="170" y="130" fontSize="9" fill="#ff88cc">★</text>
          <text x="22" y="145" fontSize="9" fill="#ff88cc">★</text>
        </svg>
      </div>
    </div>
  );
}