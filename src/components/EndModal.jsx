export default function EndModal({ gameState, onRestart }) {
  const isWin = gameState === "finished";

  return (
    <div className="modal">
      <div className="modal-content">
        {isWin ? (
          <>
            <div className="confetti">
              <span>🎉</span>
              <span>🎁</span>
              <span>🗺️</span>
              <span>🎯</span>
              <span>🏆</span>
            </div>
            {/* <h2>🎉 Hadiah Berhasil DIdapatkan!</h2> */}
            <div className="message">
              {/* <p>
                📍 <strong>Lokasi ditemukan!</strong><br />
                Kang Gojek berhasil sampai ke lokasi Aisya dengan selamat!
              </p> */}
              <p>
                🎁 Hadiah Valentine berhasil diantar!<br />
                Kemampuan navigasi kamu luar biasa! 🧭
              </p>
              <p className="romantic">
                🍫 Hadiah coklatnya nanti kita ambil di Indomaret ya,<br />
                lagi diskon katanya! 😄
              </p>
            </div>
          </>
        ) : (
          <>
            <h2>🗺️ Bukan Salah Aisya Tapi...</h2>
            <p className="game-over-text">
              Google Maps nya lagi ngambek dan satelit GPS nya lagi ngopi bareng alien! 🤷♀️
            </p>
            <p className="encouragement">Pokoknya bukan salah cewe ya! Teknologi aja yang error!</p>
          </>
        )}

        <button className="btn-primary" onClick={onRestart}>
          {isWin ? "🗺️ Jelajahi Lagi" : "🔄 Reset GPS"}
        </button>
      </div>
    </div>
  );
}
