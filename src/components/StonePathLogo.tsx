interface StonePathLogoProps {
  className?: string;
  size?: number;
}

/**
 * Foro Agora isotype: a stacked path of stones representing the educational journey.
 * Built with pure SVG. Uses currentColor so it inherits text color
 * (contrasts perfectly in both light and dark mode).
 */
const StonePathLogo = ({ className, size }: StonePathLogoProps) => {
  // Stones: from smallest at top to largest at bottom
  // [cy, rx, ry] positioned within a 200x400 viewBox
  const stones: Array<[number, number, number]> = [
    [40, 22, 9],     // 1 - smallest
    [70, 30, 11],    // 2
    [104, 42, 14],   // 3
    [144, 56, 18],   // 4
    [192, 72, 22],   // 5
    [248, 88, 27],   // 6
    [318, 96, 32],   // 7 - largest
  ];

  return (
    <svg
      viewBox="0 0 200 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size * 2 } : undefined}
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
