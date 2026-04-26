interface StoneTrailProps {
  className?: string;
}

/**
 * Animated stone-trail isotype.
 * Stones cycle downward continuously while preserving the brand silhouette
 * (positions, sizes and spacing extracted from the original logo asset).
 * Inverts in dark mode.
 */
const StoneTrail = ({ className = "" }: StoneTrailProps) => {
  // Original logo dimensions (px) — used as SVG viewBox to preserve aspect ratio.
  const VB_W = 704;
  const VB_H = 1502;

  // Stones extracted from the original asset (cx, cy, rx, ry in viewBox units).
  // Order: top → bottom (smallest → largest).
  const stones = [
    { cx: 193.5, cy: 22.5, rx: 80.5, ry: 22.5 },
    { cx: 199.0, cy: 148.5, rx: 109, ry: 55.5 },
    { cx: 313.5, cy: 334.5, rx: 139.5, ry: 64.5 },
    { cx: 205.5, cy: 570.5, rx: 205.5, ry: 97.5 },
    { cx: 268.0, cy: 896.5, rx: 268, ry: 137.5 },
    { cx: 351.5, cy: 1309.0, rx: 351.5, ry: 192 },
  ];

  const cycle = 5; // seconds for full advance cycle

  return (
    <div
      className={`relative select-none dark:invert ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {stones.map((s, i) => {
          // Stagger each stone so the trail appears to march downward.
          const delay = -(i / stones.length) * cycle;
          return (
            <ellipse
              key={i}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill="hsl(var(--foreground))"
              style={{
                animation: `stone-advance ${cycle}s ease-in-out ${delay}s infinite`,
                transformBox: "fill-box",
                transformOrigin: "center",
              }}
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes stone-advance {
          0%, 100% { transform: translateY(0); opacity: 1; }
          45%      { transform: translateY(28px); opacity: 0.85; }
          90%      { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StoneTrail;
