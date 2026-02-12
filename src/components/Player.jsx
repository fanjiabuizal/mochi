export default function Player({ jump, playerBottom, playerLeft = 40 }) {
  return (
    <div
      className={`player ${jump ? "jump" : ""}`}
      style={{ bottom: `${playerBottom}px`, left: `${playerLeft}px` }}
    >
      <img 
        src="/images/1000121688.png" 
        alt="Aisya" 
        className="player-character"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.parentElement.innerHTML += '<div style="font-size: 70px;">👧</div>';
        }}
      />
    </div>
  );
}
