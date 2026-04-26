interface StonePathLogoProps {
  className?: string;
  size?: number;
}

/**
 * Foro Agora isotype: 6 stones in perspective forming an educational path.
 * Each stone is a pure flat ellipse. Distant stones (top) are small with tight
 * spacing; near stones (bottom) are wider with growing gaps — a path receding
 * into the horizon.
 *
 * Pure SVG, fill="currentColor" → contrasts in light & dark mode.
 */
const StonePathLogo = ({ className, size }: StonePathLogoProps) => {
  // [cy, rx, ry] inside a 200x560 viewBox. Centered on cx=100.
  // Calibrated against the brand reference: 6 stones, growing exponentially
  // in width and in vertical gap from top to bottom.
  const stones: Array<[number, number, number]> = [
    [60, 18, 7],     // 1 - farthest
    [92, 26, 9],     // 2 - close to #1 (tight gap)
    [142, 40, 13],   // 3
    [212, 58, 18],   // 4
    [310, 78, 24],   // 5
    [440, 92, 30],   // 6 - nearest, widest
  ];

  return (
    <svg
      viewBox="0 0 200 520"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={size ? { width: size, height: size * 2.6 } : undefined}
      aria-label="Foro Agora"
      role="img"
    >
      {stones.map(([cy, rx, ry], i) => (
        <ellipse
          key={i}
          cx={100}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="currentColor"
        />
      ))}
    </svg>
  );
};

export default StonePathLogo;
