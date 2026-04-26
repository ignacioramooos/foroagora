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
  const VB_W = 704;
  const VB_H = 1502;

  // Stone slots extracted from the original asset (top → bottom).
  const stones = [
    { cx: 193.5, cy: 22.5, rx: 80.5, ry: 22.5 },
    { cx: 199.0, cy: 148.5, rx: 109, ry: 55.5 },
    { cx: 313.5, cy: 334.5, rx: 139.5, ry: 64.5 },
    { cx: 205.5, cy: 570.5, rx: 205.5, ry: 97.5 },
    { cx: 268.0, cy: 896.5, rx: 268, ry: 137.5 },
    { cx: 351.5, cy: 1309.0, rx: 351.5, ry: 192 },
  ];

  const cycle = 6; // total seconds per stone to traverse one slot upward
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
          // Distance to the next (below) slot — last (bottom) stone drifts off-canvas.
          const next = i === n - 1 ? null : stones[i + 1];
          const dy = next ? next.cy - s.cy : (VB_H - s.cy) * 1.2;
          // Stagger from bottom → top so the wave reads as a single downward flow.
          const delay = -((n - 1 - i) / n) * cycle;
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
