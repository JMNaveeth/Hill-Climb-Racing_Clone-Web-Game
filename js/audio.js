// audio.js - simple Web Audio API sounds

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.suspended = false;

    document.addEventListener("pointerdown", () => this._lazyInit(), {
      once: true,
    });
  }

  _lazyInit() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
  }

  startEngine() {
    if (!this.ctx) this._lazyInit();
    if (!this.ctx) return;
    if (this.engineOsc) return;

    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();
    this.engineOsc.type = "sawtooth";
    this.engineOsc.frequency.value = 80;
    this.engineGain.gain.value = 0.0;

    this.engineOsc.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);
    this.engineOsc.start();
  }

  updateEngine(rpm, gasPressed) {
    if (!this.engineOsc || !this.engineGain || !this.ctx) return;
    const norm = Math.max(0, Math.min(1, rpm / 600));
    const freq = 60 + norm * 260;
    const targetGain = gasPressed ? 0.25 + norm * 0.15 : 0.1 + norm * 0.05;

    this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    this.engineGain.gain.setTargetAtTime(
      targetGain,
      this.ctx.currentTime,
      0.08
    );
  }

  stopEngine() {
    if (!this.engineOsc) return;
    try {
      this.engineOsc.stop();
    } catch {
      // ignore
    }
    this.engineOsc.disconnect();
    this.engineGain.disconnect();
    this.engineOsc = null;
    this.engineGain = null;
  }

  _oneShot({ freq = 440, duration = 0.15, type = "sine", volume = 0.4 }) {
    if (!this.ctx) this._lazyInit();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  playCoin() {
    this._oneShot({ freq: 1200, duration: 0.18, type: "square", volume: 0.3 });
  }

  playFuel() {
    this._oneShot({ freq: 500, duration: 0.25, type: "sawtooth", volume: 0.35 });
  }

  playBoost() {
    this._oneShot({ freq: 900, duration: 0.3, type: "triangle", volume: 0.35 });
  }

  playCrash() {
    this._noiseBurst(0.25, 0.6);
  }

  playWin() {
    if (!this.ctx) this._lazyInit();
    if (!this.ctx) return;
    const notes = [660, 880, 990];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this._oneShot({ freq, duration: 0.18, type: "square", volume: 0.28 });
      }, i * 140);
    });
  }

  _noiseBurst(duration, volume) {
    if (!this.ctx) this._lazyInit();
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.ctx.destination);
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    source.start(t);
    source.stop(t + duration + 0.05);
  }

  suspend() {
    if (!this.ctx) return;
    if (this.ctx.state === "running") {
      this.ctx.suspend();
      this.suspended = true;
    }
  }

  resume() {
    if (!this.ctx) this._lazyInit();
    if (!this.ctx) return;
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
      this.suspended = false;
    }
  }
}

