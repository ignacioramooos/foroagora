interface StonePathLogoProps {
  className?: string;
  size?: number;
}

/**
 * Foro Agora isotype: stones in perspective representing the educational path.
 * Each stone is a flat ellipse — distant ones (top) are small, near ones (bottom)
 * are wider and more flattened, with growing gaps between them, suggesting
 * a path receding into the horizon.
 *
 * Built with pure SVG, fill="currentColor" → contrasts in light & dark mode.
 */
const StonePathLogo = ({ className, size }: StonePathLogoProps) => {
  // Stones from farthest (top, small & narrow) to nearest (bottom, wide & flat).
  // [cy, rx, ry] inside a 200x600 viewBox. Gaps grow toward the bottom
  // to mimic a path stretching into the distance.
  const stones: Array<[number, number, number]> = [
    [60, 16, 5],     // 1 - farthest, smallest
    [98, 22, 6.5],   // 2
    [144, 32, 9],    // 3
    [202, 48, 13],   // 4
    [276, 68, 18],   // 5
    [368, 88, 23],   // 6
    [486, 96, 28],   // 7 - nearest, widest & flattest
  ];

  return (
    <svg
      viewBox="0 0 200 560"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={size ? { width: size, height: size * 2.8 } : undefined}
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
