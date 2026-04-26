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
  // Original stones (cx%, cy%, rx%, ry%) extracted from logo bounding boxes.
  // Order: top → bottom (smallest → largest).
  const stones = [
    { cx: 27.49, cy: 1.5, rx: 11.43, ry: 1.5 },
    { cx: 28.27, cy: 9.89, rx: 15.48, ry: 3.7 },
    { cx: 44.53, cy: 22.27, rx: 19.81, ry: 4.3 },
    { cx: 29.19, cy: 37.98, rx: 29.19, ry: 6.49 },
    { cx: 38.07, cy: 59.69, rx: 38.07, ry: 9.15 },
    { cx: 49.93, cy: 87.15, rx: 49.93, ry: 12.78 },
  ];

  const total = stones.length;
  const cycle = 6; // seconds for full advance cycle

  return (
    <div
      className={`relative select-none dark:invert ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full overflow-visible"
      >
        {stones.map((s, i) => {
          // Stagger each stone so they appear to march downward through positions
          const delay = -(i / total) * cycle;
          return (
            <ellipse
              key={i}
              cx={s.cx}
              cy={s.cy}
              rx={s.rx}
              ry={s.ry}
              fill="hsl(var(--foreground))"
              style={{
                transformOrigin: `${s.cx}% ${s.cy}%`,
                animation: `stone-advance ${cycle}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </svg>
      <style>{`
        @keyframes stone-advance {
          0%, 100% { transform: translateY(0); opacity: 1; }
          45% { transform: translateY(2.5%); opacity: 0.92; }
          90% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StoneTrail;
