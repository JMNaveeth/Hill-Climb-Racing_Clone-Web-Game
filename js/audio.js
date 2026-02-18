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
    // Music system
    this._musicConfig = null;
    this._musicBeat = 0;
    this._musicNextTime = 0;
    this._musicIntervalId = null;
    this._musicMasterGain = null;
    this._padOscs = null;
    this._padGains = null;

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

  // ─────────────────────────────────────────────────────────────────
  // BACKGROUND MUSIC  (look-ahead Web Audio scheduler)
  // ─────────────────────────────────────────────────────────────────

  startMusic(theme) {
    this.stopMusic();
    if (!this.ctx) this._lazyInit();
    if (!this.ctx || this.suspended) return;

    this._musicConfig = this._getMusicConfig(theme);
    this._musicBeat = 0;
    this._musicNextTime = this.ctx.currentTime + 0.4;

    this._musicMasterGain = this.ctx.createGain();
    this._musicMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this._musicMasterGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2.5);
    this._musicMasterGain.connect(this.ctx.destination);

    this._startMusicPad();
    // Fire every 50 ms, schedule notes 200 ms ahead (classic look-ahead scheduler)
    this._musicIntervalId = setInterval(() => this._musicTick(), 50);
  }

  stopMusic() {
    if (this._musicIntervalId) {
      clearInterval(this._musicIntervalId);
      this._musicIntervalId = null;
    }
    if (this._musicMasterGain && this.ctx) {
      try {
        this._musicMasterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
        const ref = this._musicMasterGain;
        setTimeout(() => { try { ref.disconnect(); } catch(e) {} }, 1200);
      } catch(e) {
        try { this._musicMasterGain.disconnect(); } catch(e2) {}
      }
      this._musicMasterGain = null;
    }
    if (this._padOscs) {
      this._padOscs.forEach(o => { try { o.stop(); o.disconnect(); } catch(e) {} });
      this._padOscs = null;
    }
    if (this._padGains) {
      this._padGains.forEach(g => { try { g.disconnect(); } catch(e) {} });
      this._padGains = null;
    }
    this._musicConfig = null;
  }

  _startMusicPad() {
    if (!this.ctx || !this._musicMasterGain) return;
    const cfg = this._musicConfig;
    this._padOscs = [];
    this._padGains = [];
    cfg.padNotes.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.20 / cfg.padNotes.length, this.ctx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(this._musicMasterGain);
      osc.start();
      this._padOscs.push(osc);
      this._padGains.push(gain);
    });
  }

  _musicTick() {
    if (!this.ctx || !this._musicConfig || !this._musicMasterGain) return;
    if (this.ctx.state === 'suspended') return;
    const lookAhead = 0.2;
    while (this._musicNextTime < this.ctx.currentTime + lookAhead) {
      this._scheduleMusicNote(this._musicNextTime);
      this._musicBeat = (this._musicBeat + 1) % this._musicConfig.notes.length;
      this._musicNextTime += this._musicConfig.tempo;
    }
  }

  _scheduleMusicNote(time) {
    const cfg = this._musicConfig;
    const freq = cfg.notes[this._musicBeat];
    if (!freq || !this._musicMasterGain) return; // 0 = rest
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = cfg.type;
    osc.frequency.value = freq;
    const vel = cfg.velocities[this._musicBeat] || 0.15;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vel, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, time + cfg.tempo * 0.78);
    osc.connect(gain);
    gain.connect(this._musicMasterGain);
    osc.start(time);
    osc.stop(time + cfg.tempo + 0.05);
  }

  _getMusicConfig(theme) {
    const easy   = ['pastelFields','pastelHills','beach','farm','cliffs','meadow','plains','orchard','lake','forest'];
    const normal = ['mountain','desert','jungle','snow','canyon','arctic','rainforest','swamp','storm','volcano'];
    const hard   = ['asteroid','cave','underwater','space','lava'];

    if (easy.includes(theme)) {
      return {
        // C major pentatonic ascending/descending — bright & cheerful
        notes:      [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 0,
                     293.66, 369.99, 440.00, 587.33, 440.00, 369.99, 293.66, 0],
        velocities: [0.18, 0.14, 0.16, 0.20, 0.14, 0.12, 0.16, 0,
                     0.16, 0.12, 0.18, 0.20, 0.14, 0.12, 0.14, 0],
        tempo: 0.28, type: 'sine',
        padNotes: [65.41, 98.00, 130.81],   // C2 G2 C3
      };
    }
    if (normal.includes(theme)) {
      return {
        // D Dorian — adventurous, slightly mysterious
        notes:      [293.66, 0, 369.99, 440.00, 0, 493.88, 440.00, 369.99,
                     329.63, 0, 293.66, 0,  369.99, 440.00, 493.88, 0],
        velocities: [0.20, 0, 0.15, 0.18, 0, 0.16, 0.15, 0.14,
                     0.18, 0, 0.16, 0,  0.14, 0.18, 0.20, 0],
        tempo: 0.34, type: 'triangle',
        padNotes: [73.42, 110.00, 146.83],  // D2 A2 D3
      };
    }
    if (hard.includes(theme)) {
      return {
        // A minor pentatonic — sparse & tense
        notes:      [220.00, 0, 0, 261.63, 0, 293.66, 0, 329.63,
                     0, 0, 220.00, 0,  246.94, 0, 0, 207.65],
        velocities: [0.22, 0, 0, 0.16, 0, 0.18, 0, 0.16,
                     0, 0, 0.20, 0,  0.15, 0, 0, 0.18],
        tempo: 0.42, type: 'triangle',
        padNotes: [55.00, 82.41, 110.00],   // A1 E2 A2
      };
    }
    // Advanced — dark & dramatic (F# diminished feel)
    return {
      notes:      [185.00, 0, 0, 220.00, 0, 207.65, 0, 0,
                   185.00, 0, 174.61, 0,  0, 185.00, 0, 0],
      velocities: [0.22, 0, 0, 0.18, 0, 0.16, 0, 0,
                   0.20, 0, 0.18, 0,  0, 0.14, 0, 0],
      tempo: 0.52, type: 'sawtooth',
      padNotes: [46.25, 69.30, 92.50],      // F#1 C#2 F#2
    };
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

