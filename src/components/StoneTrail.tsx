interface StoneTrailProps {
  className?: string;
}

/**
 * Animated stone-trail isotype.
 * Each stone-slot stays fixed in space (preserving the brand silhouette).
 * A travelling "wave" makes each stone fade out as it shifts up toward the
 * previous slot, then it reappears at its own slot — producing a one-way
 * downward flow (disappear at top, reappear at bottom).
 */
const StoneTrail = ({ className = "" }: StoneTrailProps) => {
  // Original logo dimensions (px) — preserve aspect ratio via viewBox.
  // Height expanded vs. source asset to allow much larger vertical spacing
  // between stones while keeping their cx/rx/ry intact.
  const VB_W = 704;
  const VB_H = 2400;

  // Stone slots (top → bottom). cx/rx/ry preserved from the brand asset;
  // cy values are spaced out for a more dramatic vertical rhythm.
  const stones = [
    { cx: 193.5, cy: 60,   rx: 80.5,  ry: 22.5 },
    { cx: 199.0, cy: 280,  rx: 109,   ry: 55.5 },
    { cx: 313.5, cy: 600,  rx: 139.5, ry: 64.5 },
    { cx: 205.5, cy: 1000, rx: 205.5, ry: 97.5 },
    { cx: 268.0, cy: 1500, rx: 268,   ry: 137.5 },
    { cx: 351.5, cy: 2150, rx: 351.5, ry: 192 },
  ];

  const cycle = 14; // total seconds per stone to traverse one slot upward
  const n = stones.length;

  return (
    <div
      className={`relative select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        {stones.map((s, i) => {
          // Stones travel UPWARD: each shifts to the previous slot, the top one
          // drifts off the top edge. New stones appear at the bottom slot.
          const prev = i === 0 ? null : stones[i - 1];
          const dy = prev ? prev.cy - s.cy : -(s.cy + s.ry * 2);
          // Stagger top → bottom so the wave reads as one continuous upward flow.
          const delay = -(i / n) * cycle;
          return (
            <ellipse
              key={i}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill="hsl(var(--foreground))"
              style={{
                animation: `stone-flow-${i} ${cycle}s linear ${delay}s infinite`,
                transformBox: "fill-box",
                transformOrigin: "center",
                ['--dy' as never]: `${dy}px`,
              }}
            />
          );
        })}
      </svg>
      <style>{`
        ${stones
          .map(
            (_, i) => `
          @keyframes stone-flow-${i} {
            0%   { transform: translateY(0);            opacity: 0; }
            15%  { transform: translateY(0);            opacity: 1; }
            75%  { transform: translateY(var(--dy));    opacity: 1; }
            100% { transform: translateY(var(--dy));    opacity: 0; }
          }
        `,
          )
          .join('\n')}
      `}</style>
    </div>
  );
};

export default StoneTrail;
