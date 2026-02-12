export default function StartModal({ onStart }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h1>💝 Hadiah Valentine untuk Aisya</h1>
        <p className="subtitle">Bantu Kang Gojek menemukan hadiah tersembunyi!</p>
        <div className="message">
          <p>🏍️ <strong>Misi:</strong> Kang Gojek lagi bawa hadiah Valentine spesial buat Aisya</p>
          <p>🚧 <strong>Tantangan:</strong> Hindari rintangan di jalan buat tau hadiahnya apa</p>
          {/* <p>🎁 <strong>Tujuan:</strong> Lewati 14 rintangan untuk sampai ke lokasi Aisya</p> */}
        </div>
        <p className="hint">💡 Tekan tombol JUMP untuk melompati rintangan!</p>
        <button className="btn-primary" onClick={onStart}>
          🚀 Mulai Petualangan
        </button>
      </div>
    </div>
  );
}
