import logoSrc from "@/assets/stone-trail-logo.png";

interface StonePathLogoProps {
  className?: string;
  size?: number;
}

/**
 * Foro Agora isotype — uses the exact brand asset (PNG with transparent bg).
 * The image is rendered as-is (no re-drawing in SVG).
 *
 * In dark mode, we invert the asset so the black stones become white,
 * preserving contrast across themes without altering the logo's silhouette.
 */
const StonePathLogo = ({ className, size }: StonePathLogoProps) => {
  return (
    <img
      src={logoSrc}
      alt="Foro Agora"
      className={`select-none dark:invert ${className ?? ""}`}
      style={size ? { width: size, height: "auto" } : undefined}
      draggable={false}
    />
  );
};

export default StonePathLogo;
