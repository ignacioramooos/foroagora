import logoSrc from "@/assets/stone-trail-logo.png";

interface StoneTrailProps {
  className?: string;
}

/**
 * Large decorative stone-trail for the hero section.
 * Uses the exact brand asset (PNG, transparent background).
 * Inverts in dark mode for contrast.
 */
const StoneTrail = ({ className = "" }: StoneTrailProps) => {
  return (
    <img
      src={logoSrc}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`select-none dark:invert ${className}`}
    />
  );
};

export default StoneTrail;
