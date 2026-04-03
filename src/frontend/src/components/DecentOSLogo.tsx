/**
 * Canonical DecentOS logo — hexagon with 3-spoke network node.
 * Single source of truth. Use this everywhere.
 */
export function DecentOSLogo({
  size = 32,
  color = "white",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const cx = 20;
  const cy = 20;
  // Hexagon vertices (flat-top orientation, radius 16)
  const r = 16;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  });
  const hex = pts.map((p) => p.join(",")).join(" ");

  // 3 spoke nodes: top, bottom-right, bottom-left
  const spokes = [pts[0], pts[2], pts[4]];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="DecentOS"
    >
      <title>DecentOS</title>
      {/* Outer hexagon */}
      <polygon
        points={hex}
        stroke={color}
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Spokes from center to 3 alternate vertices */}
      {spokes.map(([x, y]) => (
        <line
          key={`spoke-${x}-${y}`}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke={color}
          strokeWidth="1.2"
          strokeOpacity="0.55"
          strokeLinecap="round"
        />
      ))}
      {/* Endpoint dots */}
      {spokes.map(([x, y]) => (
        <circle
          key={`dot-${x}-${y}`}
          cx={x}
          cy={y}
          r="1.8"
          fill={color}
          fillOpacity="0.75"
        />
      ))}
      {/* Center node */}
      <circle cx={cx} cy={cy} r="2.8" fill={color} />
    </svg>
  );
}
