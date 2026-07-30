/**
 * Pocketknife Pioneers - Web Audio API Chiptune Synth Sound System
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
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
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playTone(freq, type = 'square', duration = 0.1, gainVal = 0.1) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

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
      console.warn('Audio play error:', e);
    }
  }

  click() {
    this.playTone(600, 'square', 0.04, 0.05);
  }

  buy() {
    this.playTone(523.25, 'triangle', 0.08, 0.1);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.08, 0.1), 80);
    setTimeout(() => this.playTone(783.99, 'square', 0.15, 0.1), 160);
  }

  bid() {
    this.playTone(880, 'sine', 0.06, 0.1);
    setTimeout(() => this.playTone(1174.66, 'sine', 0.08, 0.1), 60);
  }

  gavel() {
    this.playTone(150, 'sawtooth', 0.08, 0.25);
    setTimeout(() => this.playTone(120, 'sawtooth', 0.12, 0.25), 100);
  }

  slice() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {}
  }

  damage() {
    this.playTone(180, 'sawtooth', 0.2, 0.15);
    setTimeout(() => this.playTone(110, 'sawtooth', 0.25, 0.15), 100);
  }

  victory() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'triangle', 0.2, 0.12), i * 150);
    });
  }

  gameover() {
    const notes = [400, 350, 300, 220];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sawtooth', 0.3, 0.15), i * 200);
    });
  }
}

const sounds = new SoundEngine();
