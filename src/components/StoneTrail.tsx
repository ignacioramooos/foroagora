/**
 * StoneTrail — Símbolo del camino educativo de Foro Agora.
 *
 * Réplica fiel del isotipo: óvalos negros decrecientes hacia arriba,
 * formando un camino vertical en perspectiva. Construido en SVG puro
 * con micro-imperfecciones HARDCODEADAS (no generadas por loop):
 *  - offsets horizontales sutiles (eje no perfecto)
 *  - variaciones de tamaño no proporcionales
 *  - distancias verticales irregulares
 *
 * Anima entrada con stagger de abajo hacia arriba + flotación micro.
 * Usa `currentColor` para heredar `text-foreground` (negro/blanco según tema).
 */

interface StoneTrailProps {
  className?: string;
}

const StoneTrail = ({ className = "" }: StoneTrailProps) => {
  // Cada piedra escrita a mano. NO es un patrón matemático.
  // viewBox: 200 (ancho) x 720 (alto). Eje teórico cx≈100, pero cada piedra se desvía.
  const stones = [
    // 1 — base (la más cercana, más grande, ligeramente a la derecha)
    { cx: 103, cy: 648, rx: 86, ry: 27, delay: 0.0 },
    // 2 — gran salto, bastante grande, leve izquierda
    { cx: 97,  cy: 540, rx: 72, ry: 23, delay: 0.08 },
    // 3 — gap medio, vuelve un toque a la derecha (asimetría)
    { cx: 102, cy: 446, rx: 58, ry: 19, delay: 0.16 },
    // 4 — salto mayor, izquierda otra vez
    { cx: 96,  cy: 360, rx: 44, ry: 15, delay: 0.24 },
    // 5 — la perspectiva se acelera, gap más amplio
    { cx: 101, cy: 282, rx: 32, ry: 11, delay: 0.32 },
    // 6 — ya lejana, casi alineada
    { cx: 99,  cy: 216, rx: 22, ry: 8,  delay: 0.40 },
    // 7 — puntito final, gap más cerrado (efecto horizonte)
    { cx: 100, cy: 168, rx: 14, ry: 5,  delay: 0.48 },
  ];

  return (
    <svg
      viewBox="0 0 200 720"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMax meet"
      className={`overflow-visible ${className}`}
      aria-hidden="true"
      role="presentation"
    >
      <defs>
        <style>
          {`
            @keyframes stone-rise {
              from { opacity: 0; transform: translateY(24px); }
              to   { opacity: 1; transform: translateY(0); }
            }
            @keyframes stone-breathe {
              0%, 100% { transform: translateY(0); }
              50%      { transform: translateY(-3px); }
            }
            .stone-trail-el {
              opacity: 0;
              transform-box: fill-box;
              transform-origin: center;
              animation:
                stone-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards,
                stone-breathe 6s ease-in-out infinite;
            }
          `}
        </style>
      </defs>

      {stones.map((s, i) => (
        <ellipse
          key={i}
          cx={s.cx}
          cy={s.cy}
          rx={s.rx}
          ry={s.ry}
          fill="currentColor"
          className="stone-trail-el"
          style={{
            animationDelay: `${s.delay}s, ${1.4 + s.delay * 0.6}s`,
          }}
        />
      ))}
    </svg>
  );
};

export default StoneTrail;
