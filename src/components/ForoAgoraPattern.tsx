/**
 * Foro Agora visual pattern component
 * Creates stacked oval decorative elements representing growth and hierarchy
 */

interface ForoAgoraPatternProps {
  className?: string;
  ovals?: number;
  animated?: boolean;
  color?: 'blue' | 'cyan' | 'black' | 'gradient';
}

const ForoAgoraPattern = ({
  className = '',
  ovals = 6,
  animated = false,
  color = 'gradient',
}: ForoAgoraPatternProps) => {
  const colorMap = {
    blue: '#2563EB',
    cyan: '#48D1C5',
    black: '#111111',
    gradient: 'url(#foroGradient)',
  };

  const getOvalWidth = (index: number) => {
    // Larger ovals at bottom, smaller at top
    const widths = [24, 32, 40, 56, 72, 88];
    return widths[Math.min(index, widths.length - 1)];
  };

  const getOvalHeight = (index: number) => {
    const heights = [8, 10, 14, 18, 22, 28];
    return heights[Math.min(index, heights.length - 1)];
  };

  return (
    <svg
      viewBox="0 0 120 280"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="foroGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#48D1C5', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {Array.from({ length: ovals }).map((_, i) => {
        const y = 20 + i * 40;
        const width = getOvalWidth(i);
        const height = getOvalHeight(i);
        const isAnimated = animated && i > 0;

        return (
          <ellipse
            key={i}
            cx="60"
            cy={y}
            rx={width / 2}
            ry={height / 2}
            fill={colorMap[color]}
            opacity={0.85 + i * 0.02}
            className={isAnimated ? 'animate-pulse-glow' : ''}
            style={isAnimated ? { animationDelay: `${i * 0.15}s` } : undefined}
          />
        );
      })}
    </svg>
  );
};

export default ForoAgoraPattern;
