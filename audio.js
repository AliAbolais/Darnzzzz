/**
 * Cute Web Audio API Sound Synthesizer
 * 100% self-contained: no external MP3 dependencies, no broken links!
 */

class CuteSoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.initialized = true;
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  // Helper to create soft sine wave tones
  playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1, delay = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio policy ignore
      }
    }, delay * 1000);
  }

  // Click / Button Pop
  playPop() {
    this.playTone(600, 'triangle', 0.08, 0.12);
  }

  // Catch a falling heart in Game 1
  playCatch() {
    this.playTone(587.33, 'sine', 0.12, 0.15); // D5
    this.playTone(880, 'sine', 0.18, 0.12, 0.06); // A5
  }

  // Miss / Raincloud catch
  playOops() {
    this.playTone(280, 'sine', 0.15, 0.1);
    this.playTone(220, 'sine', 0.2, 0.1, 0.08);
  }

  // Card Flip in Game 2
  playFlip() {
    this.playTone(420, 'sine', 0.06, 0.08);
  }

  // Pair Matched
  playMatch() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.25, 0.12, idx * 0.08);
    });
  }

  // Scratch action
  playScratch() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    // A tiny gentle chirp
    this.playTone(800 + Math.random() * 300, 'triangle', 0.04, 0.04);
  }

  // Grand Fanfare / Stamp Unlock / Vault Open
  playFanfare() {
    const melody = [
      { f: 523.25, d: 0.12, t: 0.00 }, // C5
      { f: 659.25, d: 0.12, t: 0.10 }, // E5
      { f: 783.99, d: 0.12, t: 0.20 }, // G5
      { f: 1046.50, d: 0.35, t: 0.30 }, // C6
      { f: 880.00, d: 0.15, t: 0.50 }, // A5
      { f: 1046.50, d: 0.55, t: 0.65 }, // C6
      { f: 1318.51, d: 0.70, t: 0.85 }  // E6
    ];

    melody.forEach(item => {
      this.playTone(item.f, 'sine', item.d, 0.16, item.t);
    });
  }

  // Big Love Explosion
  playLoveSparkle() {
    const notes = [659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98];
    notes.forEach((f, idx) => {
      this.playTone(f, 'sine', 0.3, 0.14, idx * 0.07);
    });
  }
}

// Global instance
const cuteAudio = new CuteSoundManager();
