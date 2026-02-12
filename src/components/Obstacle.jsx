export default function Obstacle({ type, position }) {
  const obstacleIcons = {
    wrong_path: { icon: "🚫", label: "Jalan Salah" },
    dead_end: { icon: "🚧", label: "Jalan Buntu" },
    blocked_road: { icon: "⛔", label: "Jalan Tertutup" },
  };

  const obstacle = obstacleIcons[type] || obstacleIcons.wrong_path;

  return (
    <div className={`obstacle obstacle-${type}`} style={{ right: `${position}px` }}>
      <div className="obstacle-icon">{obstacle.icon}</div>
      <div className="obstacle-label">{obstacle.label}</div>
    </div>
  );
}
