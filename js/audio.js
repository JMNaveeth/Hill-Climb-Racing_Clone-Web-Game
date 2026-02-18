// audio.js - simple Web Audio API sounds

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.engineOsc = null;
    this.engineOsc2 = null;
    this.engineGain = null;
    this.engineGain2 = null;
    this.engineFilter = null;
    this.engineLFO = null;
    this.engineLFOGain = null;
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

    // --- Base oscillator: sawtooth for fundamental engine tone ---
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = "sawtooth";
    this.engineOsc.frequency.value = 55;

    // --- Second oscillator: square wave one octave up for harmonic richness ---
    this.engineOsc2 = this.ctx.createOscillator();
    this.engineOsc2.type = "square";
    this.engineOsc2.frequency.value = 110;

    // --- Low-pass filter to smooth harsh edges and add warmth ---
    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = "lowpass";
    this.engineFilter.frequency.value = 400;
    this.engineFilter.Q.value = 1.5;

    // --- LFO for engine rumble/vibration ---
    this.engineLFO = this.ctx.createOscillator();
    this.engineLFOGain = this.ctx.createGain();
    this.engineLFO.type = "sine";
    this.engineLFO.frequency.value = 8; // 8 Hz rumble
    this.engineLFOGain.gain.value = 6;   // ±6 Hz wobble on base freq
    this.engineLFO.connect(this.engineLFOGain);
    this.engineLFOGain.connect(this.engineOsc.frequency);

    // --- Gain nodes per oscillator ---
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0.0;
    this.engineGain2 = this.ctx.createGain();
    this.engineGain2.gain.value = 0.0;

    // --- Routing ---
    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc2.connect(this.engineGain2);
    this.engineGain2.connect(this.ctx.destination);

    this.engineOsc.start();
    this.engineOsc2.start();
    this.engineLFO.start();
  }

  updateEngine(rpm, gasPressed) {
    if (!this.engineOsc || !this.engineGain || !this.ctx) return;
    const norm = Math.max(0, Math.min(1, rpm / 600));

    // Base freq: 55 Hz idle → 160 Hz at full throttle (rich, low car sound)
    const baseFreq = 55 + norm * 105;
    const harmFreq = baseFreq * 2;

    // Filter opens up as RPM rises, giving that throat-opening sound
    const filterFreq = 300 + norm * 1200;

    // Volume reacts to gas input
    const targetGain  = gasPressed ? 0.28 + norm * 0.14 : 0.10 + norm * 0.06;
    const targetGain2 = gasPressed ? 0.10 + norm * 0.08 : 0.03 + norm * 0.03;

    // LFO rumble intensifies at low RPM, softens at high RPM
    if (this.engineLFO) this.engineLFO.frequency.setTargetAtTime(6 + norm * 10, this.ctx.currentTime, 0.1);
    if (this.engineLFOGain) this.engineLFOGain.gain.setTargetAtTime(8 - norm * 6, this.ctx.currentTime, 0.1);

    const t = this.ctx.currentTime;
    this.engineOsc.frequency.setTargetAtTime(baseFreq, t, 0.04);
    this.engineOsc2.frequency.setTargetAtTime(harmFreq, t, 0.04);
    if (this.engineFilter) this.engineFilter.frequency.setTargetAtTime(filterFreq, t, 0.06);
    this.engineGain.gain.setTargetAtTime(targetGain, t, 0.07);
    this.engineGain2.gain.setTargetAtTime(targetGain2, t, 0.07);
  }

  stopEngine() {
    if (!this.engineOsc) return;
    [this.engineOsc, this.engineOsc2, this.engineLFO].forEach(osc => {
      if (!osc) return;
      try { osc.stop(); } catch { /* ignore */ }
      osc.disconnect();
    });
    [this.engineGain, this.engineGain2, this.engineFilter, this.engineLFOGain].forEach(node => {
      if (!node) return;
      node.disconnect();
    });
    this.engineOsc = null;
    this.engineOsc2 = null;
    this.engineLFO = null;
    this.engineLFOGain = null;
    this.engineFilter = null;
    this.engineGain = null;
    this.engineGain2 = null;
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

