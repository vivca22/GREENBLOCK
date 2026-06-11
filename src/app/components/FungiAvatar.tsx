import { motion } from "motion/react";
import type { SkinType } from "../context/GameContext";

interface FungiAvatarProps {
  stage?: number;
  skin?: SkinType;
  size?: number;
  equippedItems?: string[];
}

interface Colors { cap: string; stem: string; accent: string; gills: string }

const palettes: Record<string, Colors> = {
  default: { cap: "#F5E6CA", stem: "#C9A87C", accent: "#8B6444", gills: "#D4B896" },
  blue:    { cap: "#B8D9F5", stem: "#5A9FD4", accent: "#1D5FA8", gills: "#7EC8E3" },
  golden:  { cap: "#FFD875", stem: "#CFA020", accent: "#8B5E0A", gills: "#F0B830" },
  rainbow: { cap: "url(#rainbowGrad)", stem: "#9333EA", accent: "#EC4899", gills: "#A78BFA" },
};

function getColors(skin: SkinType): Colors {
  return palettes[skin] ?? palettes.default;
}

// 6 SVG stage designs, all in a 160×180 viewBox
function StageShape({ stage, c, skin }: { stage: number; c: Colors; skin: SkinType }) {
  const ground = <ellipse cx="80" cy="168" rx="58" ry="10" fill="#6B4226" opacity="0.3" />;

  if (stage === 1) return (
    <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
      <circle cx="80" cy="90" r="34" fill={c.cap} opacity="0.15" />
      <circle cx="80" cy="90" r="28" fill={c.cap} />
      <circle cx="68" cy="81" r="4" fill={c.accent} opacity="0.45" />
      <circle cx="88" cy="84" r="3" fill={c.accent} opacity="0.4" />
      <circle cx="76" cy="99" r="3.5" fill={c.accent} opacity="0.4" />
      <circle cx="92" cy="96" r="2.5" fill={c.accent} opacity="0.35" />
      <circle cx="45" cy="68" r="5" fill={c.cap} opacity="0.45" />
      <circle cx="118" cy="110" r="4" fill={c.cap} opacity="0.35" />
      <circle cx="110" cy="55" r="6" fill={c.cap} opacity="0.4" />
      <circle cx="52" cy="118" r="3.5" fill={c.cap} opacity="0.3" />
      <circle cx="130" cy="75" r="4" fill={c.cap} opacity="0.3" />
    </motion.g>
  );

  if (stage === 2) return (
    <motion.g animate={{ opacity: [0.85, 1, 0.85] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
      {ground}
      <line x1="80" y1="168" x2="80" y2="110" stroke={c.stem} strokeWidth="2" opacity="0.8" />
      <line x1="80" y1="145" x2="45" y2="120" stroke={c.stem} strokeWidth="1.5" opacity="0.7" />
      <line x1="80" y1="145" x2="115" y2="122" stroke={c.stem} strokeWidth="1.5" opacity="0.7" />
      <line x1="45" y1="120" x2="25" y2="105" stroke={c.stem} strokeWidth="1.2" opacity="0.6" />
      <line x1="45" y1="120" x2="40" y2="95" stroke={c.stem} strokeWidth="1.2" opacity="0.6" />
      <line x1="115" y1="122" x2="135" y2="105" stroke={c.stem} strokeWidth="1.2" opacity="0.6" />
      <line x1="115" y1="122" x2="118" y2="97" stroke={c.stem} strokeWidth="1.2" opacity="0.6" />
      <line x1="80" y1="128" x2="60" y2="108" stroke={c.stem} strokeWidth="1.2" opacity="0.5" />
      <line x1="80" y1="128" x2="100" y2="106" stroke={c.stem} strokeWidth="1.2" opacity="0.5" />
      {[{x:80,y:110},{x:45,y:120},{x:115,y:122},{x:25,y:105},{x:40,y:95},{x:135,y:105},{x:118,y:97},{x:60,y:108},{x:100,y:106}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={c.cap} opacity="0.7" />
      ))}
    </motion.g>
  );

  if (stage === 3) return (
    <motion.g animate={{ y: [0, -4, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}>
      {ground}
      <line x1="60" y1="168" x2="50" y2="145" stroke={c.stem} strokeWidth="1.2" opacity="0.4" />
      <line x1="80" y1="168" x2="70" y2="150" stroke={c.stem} strokeWidth="1.2" opacity="0.4" />
      <line x1="80" y1="168" x2="95" y2="155" stroke={c.stem} strokeWidth="1.2" opacity="0.4" />
      {/* Pin left small */}
      <rect x="47" y="150" width="5" height="17" rx="2.5" fill={c.stem} />
      <ellipse cx="49.5" cy="149" rx="11" ry="7.5" fill={c.cap} />
      {/* Pin center medium */}
      <rect x="76" y="140" width="7" height="27" rx="3.5" fill={c.stem} />
      <ellipse cx="79.5" cy="139" rx="16" ry="11" fill={c.cap} />
      {/* Pin right tiny */}
      <rect x="100" y="155" width="4" height="12" rx="2" fill={c.stem} />
      <ellipse cx="102" cy="154" rx="8.5" ry="6" fill={c.cap} />
    </motion.g>
  );

  if (stage === 4) return (
    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}>
      {ground}
      {/* Stem */}
      <rect x="74" y="115" width="12" height="52" rx="6" fill={c.stem} />
      {/* Gills hint */}
      <path d="M52,116 Q80,128 108,116" stroke={c.gills} strokeWidth="1.5" fill="none" opacity="0.5" />
      {/* Cap */}
      <ellipse cx="80" cy="113" rx="32" ry="20" fill={c.cap} />
      <ellipse cx="80" cy="113" rx="22" ry="13" fill={c.cap} opacity="0.5" />
    </motion.g>
  );

  if (stage === 5) return (
    <motion.g animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
      {ground}
      {/* Stem */}
      <rect x="72" y="105" width="15" height="62" rx="7" fill={c.stem} />
      {/* Annulus / ring */}
      <ellipse cx="79.5" cy="135" rx="20" ry="5" fill={c.gills} opacity="0.8" />
      {/* Gills */}
      {[-28,-20,-12,-4,4,12,20,28].map((offset, i) => (
        <line key={i} x1={80 + offset} y1="106" x2={80 + offset * 1.6} y2="118" stroke={c.gills} strokeWidth="1.2" opacity="0.5" />
      ))}
      {/* Cap */}
      <path d={`M36,108 Q58,78 80,76 Q102,78 124,108 Q102,122 80,124 Q58,122 36,108 Z`} fill={c.cap} />
      <path d="M55,88 Q68,79 82,77" stroke="white" strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      {skin === "golden" && (
        <>
          <circle cx="65" cy="96" r="3.5" fill={c.accent} opacity="0.5" />
          <circle cx="80" cy="87" r="4" fill={c.accent} opacity="0.5" />
          <circle cx="95" cy="96" r="3.5" fill={c.accent} opacity="0.5" />
        </>
      )}
    </motion.g>
  );

  // Stage 6 - Maduro
  return (
    <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
      {ground}
      {/* Secondary small mushroom */}
      <rect x="108" y="148" width="7" height="20" rx="3" fill={c.stem} opacity="0.8" />
      <ellipse cx="111.5" cy="147" rx="13" ry="9" fill={c.cap} opacity="0.8" />
      {/* Main stem */}
      <rect x="70" y="98" width="19" height="69" rx="9" fill={c.stem} />
      {/* Ring */}
      <ellipse cx="79.5" cy="130" rx="24" ry="6" fill={c.gills} opacity="0.85" />
      {/* Gills */}
      {[-36,-26,-18,-10,-2,6,14,22,30,38].map((offset, i) => (
        <line key={i} x1={80 + offset * 0.6} y1="99" x2={80 + offset} y2="114" stroke={c.gills} strokeWidth="1.4" opacity="0.55" />
      ))}
      {/* Cap */}
      <path d={`M24,102 Q52,62 80,59 Q108,62 136,102 Q108,120 80,123 Q52,120 24,102 Z`} fill={c.cap} />
      {/* Highlight */}
      <path d="M50,78 Q65,66 83,63" stroke="white" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
      {/* Scale dots */}
      <circle cx="59" cy="89" r="4.5" fill={c.accent} opacity="0.45" />
      <circle cx="80" cy="77" r="5.5" fill={c.accent} opacity="0.45" />
      <circle cx="101" cy="88" r="4.5" fill={c.accent} opacity="0.45" />
      <circle cx="68" cy="103" r="3.5" fill={c.accent} opacity="0.35" />
      <circle cx="92" cy="103" r="3.5" fill={c.accent} opacity="0.35" />
    </motion.g>
  );
}

export function FungiAvatar({ stage = 3, skin = "default", size = 200, equippedItems = [] }: FungiAvatarProps) {
  const clampedStage = Math.max(1, Math.min(6, stage)) as 1 | 2 | 3 | 4 | 5 | 6;
  const c = getColors(skin);
  const scale = size / 160;

  return (
    <svg
      viewBox="0 0 160 180"
      width={size}
      height={size * (180 / 160)}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="rainbowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="33%" stopColor="#FFD700" />
          <stop offset="66%" stopColor="#52B788" />
          <stop offset="100%" stopColor="#7C3AED" />
        </radialGradient>
        {skin === "golden" && (
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      <StageShape stage={clampedStage} c={c} skin={skin} />

      {/* Equipped item badges */}
      {equippedItems.includes("watering_can") && (
        <g transform="translate(115, 30)">
          <circle r="12" fill="#D8F3DC" stroke="#52B788" strokeWidth="1.5" />
          <text textAnchor="middle" dominantBaseline="middle" fontSize="12">🪣</text>
        </g>
      )}
      {equippedItems.includes("uv_light") && (
        <motion.g animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <circle cx="28" cy="38" r="10" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1.2" />
          <text x="28" y="38" textAnchor="middle" dominantBaseline="middle" fontSize="10">💜</text>
        </motion.g>
      )}
      {skin === "golden" && (
        <>
          {[[130,25],[20,50],[140,90]].map(([x,y],i) => (
            <motion.text key={i} x={x} y={y} fontSize="11" textAnchor="middle"
              animate={{ opacity: [0,1,0], scale: [0.6,1.1,0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6 }}
            >✨</motion.text>
          ))}
        </>
      )}
    </svg>
  );
}
