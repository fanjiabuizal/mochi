// Funny and memeable sound effects using Web Audio API
const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

export const playSound = {
  // Jump sound - Frog ribbit "Ribbit!" 🐸
  jump: () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Frog-like ribbit sound
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.05);
    oscillator.frequency.exponentialRampToValueAtTime(180, audioContext.currentTime + 0.1);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  },

  // Hit obstacle sound - Cartoon "BONK!" 💥
  hit: () => {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Bonk sound
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  },

  // Game over sound - Sad trombone "Wah wah waaah" 📯
  gameOver: () => {
    if (!audioContext) return;
    const notes = [
      { freq: 220, time: 0 },      // A
      { freq: 196, time: 0.2 },    // G
      { freq: 175, time: 0.4 },    // F
      { freq: 147, time: 0.6 }     // D (sad trombone)
    ];
    
    notes.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'triangle';
      
      const startTime = audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.25);
    });
  },

  // Success sound - Victory fanfare "Ta-da!" 🎉
  success: () => {
    if (!audioContext) return;
    // Victory melody
    const melody = [
      { freq: 523, time: 0 },      // C5
      { freq: 659, time: 0.15 },   // E5
      { freq: 784, time: 0.3 },    // G5
      { freq: 1047, time: 0.45 },  // C6
      { freq: 784, time: 0.6 },    // G5
      { freq: 1047, time: 0.75 }   // C6 (ta-da!)
    ];
    
    melody.forEach((note) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = note.freq;
      oscillator.type = 'sine';
      
      const startTime = audioContext.currentTime + note.time;
      gainNode.gain.setValueAtTime(0.25, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
    
    // Add extra "ding" at the end
    setTimeout(() => {
      const ding = audioContext.createOscillator();
      const dingGain = audioContext.createGain();
      
      ding.connect(dingGain);
      dingGain.connect(audioContext.destination);
      
      ding.frequency.value = 2093; // C7 (high ding)
      ding.type = 'sine';
      
      dingGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      dingGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      ding.start(audioContext.currentTime);
      ding.stop(audioContext.currentTime + 0.3);
    }, 900);
  },

  // Background music - Simple looping melody (optional)
  bgMusic: () => {
    if (!audioContext) return;
    // Simple happy background loop
    const bgLoop = [
      523, 587, 659, 587, // C D E D
      523, 587, 659, 784  // C D E G
    ];
    
    let noteIndex = 0;
    const playNote = () => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = bgLoop[noteIndex];
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      
      noteIndex = (noteIndex + 1) % bgLoop.length;
    };
    
    return setInterval(playNote, 400);
  }
};
