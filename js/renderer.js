// renderer.js - Canvas rendering for world, vehicle, terrain, pickups

const { Composite } = Matter;

export class GameRenderer {
  constructor(ctx, world, particles) {
    this.ctx = ctx;
    this.world = world;
    this.particles = particles;
    this.width = ctx.canvas.clientWidth || ctx.canvas.width;
    this.height = ctx.canvas.clientHeight || ctx.canvas.height;
  }

  _drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  clearFrame() {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    this._drawBackground({ theme: "pastelFields", cameraX: 0, cameraY: 0 });
  }

  update(dt, { cameraX, cameraY, levelTheme }) {
    const ctx = this.ctx;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);

    this._drawBackground({ theme: levelTheme, cameraX, cameraY });

    ctx.save();
    ctx.translate(this.width / 2, this.height * 0.6);
    ctx.scale(1, 1);

    const allBodies = Composite.allBodies(this.world);

    ctx.fillStyle = "#202633";
    for (const body of allBodies) {
      if (!body.isStatic || body.isSensor) continue;
      ctx.save();
      ctx.translate(body.position.x - cameraX, body.position.y - cameraY);
      ctx.rotate(body.angle);
      const w = body.bounds.max.x - body.bounds.min.x;
      const h = body.bounds.max.y - body.bounds.min.y;
      this._drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 8);
      ctx.fill();
      ctx.restore();
    }

    for (const body of allBodies) {
      if (body.isStatic && !body.isSensor) continue;
      if (!body.label) continue;
      const x = body.position.x - cameraX;
      const y = body.position.y - cameraY;
      if (body.label === "coin") {
        this._drawCoin(ctx, x, y);
      } else if (body.label === "fuel") {
        this._drawFuel(ctx, x, y);
      } else if (body.label === "boost") {
        this._drawBoost(ctx, x, y);
      } else if (body.label === "finish") {
        this._drawFinishFlag(ctx, x, y);
      }
    }

    const vehicleBodies = allBodies.filter(
      (b) => b.label === "chassis" || b.label === "wheel"
    );
    this._drawVehicle(ctx, vehicleBodies, cameraX, cameraY);

    this.particles.update(dt);
    this.particles.draw(ctx, cameraX, cameraY);

    ctx.restore();
  }

  _drawBackground({ theme, cameraX }) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const t = Date.now() / 1000;

    switch (theme) {
      // ── EASY THEMES ──────────────────────────────────────────────
      case 'pastelFields': case 'pastelHills': case 'farm':
      case 'meadow': case 'plains': case 'orchard':
        this._sky(ctx, w, h, '#b8f0ff', '#d4aaff', '#a8e6c4');
        this._sun(ctx, w * 0.82, h * 0.12, 38, '#fff9c4', '#ffdd00');
        this._clouds(ctx, w, h, cameraX, 0.06, [[0.10,0.12,80,30],[0.35,0.08,100,25],[0.65,0.18,70,22],[0.85,0.10,90,28]], '#ffffffcc');
        this._hillLayer(ctx, w, h, cameraX * 0.15, h * 0.68, 70, 1.4, '#6fcf97');
        this._hillLayer(ctx, w, h, cameraX * 0.28, h * 0.76, 45, 2.1, '#27ae60');
        break;

      case 'beach':
        this._sky(ctx, w, h, '#87ceeb', '#c8e8f8', '#f0d870');
        this._sun(ctx, w * 0.75, h * 0.10, 42, '#fff9c4', '#ffd700');
        this._clouds(ctx, w, h, cameraX, 0.05, [[0.15,0.12,110,28],[0.55,0.09,85,22],[0.78,0.16,95,24]], '#ffffffbb');
        { const og = ctx.createLinearGradient(0, h * 0.54, 0, h * 0.72);
          og.addColorStop(0, '#40c9e0'); og.addColorStop(1, '#1e7ab8');
          ctx.fillStyle = og; ctx.fillRect(0, h * 0.54, w, h * 0.18); }
        this._hillLayer(ctx, w, h, cameraX * 0.20, h * 0.72, 30, 1.5, '#f5cba0');
        break;

      case 'cliffs':
        this._sky(ctx, w, h, '#87afd4', '#b8d0e8', '#6898b8');
        this._sun(ctx, w * 0.80, h * 0.13, 35, '#fff9c4', '#fbbf2e');
        this._clouds(ctx, w, h, cameraX, 0.07, [[0.12,0.14,100,30],[0.50,0.10,80,25],[0.80,0.17,90,26]], '#ffffffcc');
        this._hillLayer(ctx, w, h, cameraX * 0.12, h * 0.58, 90, 0.8, '#5d7a8a');
        this._hillLayer(ctx, w, h, cameraX * 0.22, h * 0.70, 55, 1.3, '#4a6175');
        break;

      case 'lake':
        this._sky(ctx, w, h, '#6bb8e8', '#a8d4f0', '#80b8d8');
        this._sun(ctx, w * 0.78, h * 0.11, 36, '#fff9c4', '#ffd700');
        this._clouds(ctx, w, h, cameraX, 0.05, [[0.10,0.11,95,26],[0.45,0.08,75,22],[0.72,0.15,85,24]], '#ffffffcc');
        { const lg = ctx.createLinearGradient(0, h * 0.60, 0, h * 0.76);
          lg.addColorStop(0, 'rgba(110,185,230,0.85)'); lg.addColorStop(1, 'rgba(50,120,180,0.70)');
          ctx.fillStyle = lg; ctx.fillRect(0, h * 0.60, w, h * 0.16); }
        this._hillLayer(ctx, w, h, cameraX * 0.18, h * 0.72, 50, 1.6, '#4e8a68');
        break;

      case 'forest': case 'jungle': case 'rainforest': {
        const jungle = theme !== 'forest';
        this._sky(ctx, w, h, jungle ? '#1a5c3a' : '#2c7a4b', jungle ? '#2e8b57' : '#3a9a5e', '#1a3d28');
        ctx.save(); ctx.globalAlpha = 0.2;
        { const mg = ctx.createLinearGradient(0, h * 0.5, 0, h);
          mg.addColorStop(0, 'transparent'); mg.addColorStop(1, '#a8d8a8');
          ctx.fillStyle = mg; ctx.fillRect(0, 0, w, h); }
        ctx.restore();
        this._treeSilhouette(ctx, w, h, cameraX, 0.12, h * 0.45, 60, 30, '#1a4a28', false);
        this._treeSilhouette(ctx, w, h, cameraX, 0.22, h * 0.55, 50, 25, '#0f3a1e', false);
        break;
      }

      // ── NORMAL THEMES ─────────────────────────────────────────────
      case 'mountain':
        this._sky(ctx, w, h, '#4a6fa5', '#7bb3d4', '#c8dce8');
        this._sun(ctx, w * 0.70, h * 0.10, 30, '#fff9c4', '#ffd700');
        this._clouds(ctx, w, h, cameraX, 0.08, [[0.20,0.12,100,30],[0.60,0.09,80,24],[0.85,0.16,90,26]], '#ffffffaa');
        this._mountainLayer(ctx, w, h, cameraX * 0.10, h * 0.50, 130, 0.6, '#8eaec4', '#f5f5f5');
        this._mountainLayer(ctx, w, h, cameraX * 0.20, h * 0.64, 90, 0.9, '#6a8ea8', null);
        break;

      case 'desert':
        this._sky(ctx, w, h, '#f5a623', '#ffd27f', '#fff0b3');
        this._sun(ctx, w * 0.85, h * 0.09, 48, '#fff9c4', '#ff9900');
        ctx.save(); ctx.globalAlpha = 0.07 + Math.sin(t * 3) * 0.04;
        ctx.fillStyle = '#ff8800'; ctx.fillRect(0, h * 0.55, w, h * 0.15); ctx.restore();
        this._hillLayer(ctx, w, h, cameraX * 0.15, h * 0.72, 40, 0.8, '#c79a60');
        this._hillLayer(ctx, w, h, cameraX * 0.28, h * 0.80, 25, 1.2, '#d4a96a');
        break;

      case 'snow':
        this._sky(ctx, w, h, '#b0c8e8', '#d8e8f5', '#eef4fb');
        this._sun(ctx, w * 0.72, h * 0.11, 30, '#ffffffaa', '#c8ddf0');
        this._clouds(ctx, w, h, cameraX, 0.06, [[0.10,0.10,110,35],[0.45,0.08,90,30],[0.75,0.15,100,28]], '#fff');
        this._snowflakes(ctx, w, h, cameraX, t, 60);
        this._mountainLayer(ctx, w, h, cameraX * 0.10, h * 0.55, 110, 0.7, '#d8ecf8', '#ffffff');
        this._mountainLayer(ctx, w, h, cameraX * 0.20, h * 0.68, 75, 1.1, '#c0daf0', null);
        break;

      case 'arctic':
        this._sky(ctx, w, h, '#80b4d8', '#b8d8f0', '#ddeeff');
        ctx.save(); ctx.globalAlpha = 0.16 + Math.sin(t * 0.8) * 0.07;
        { const ag = ctx.createLinearGradient(0, 0, w, h * 0.5);
          ag.addColorStop(0, '#00ff88'); ag.addColorStop(0.5, '#00ccff'); ag.addColorStop(1, '#aa00ff');
          ctx.fillStyle = ag; ctx.fillRect(0, 0, w, h * 0.5); }
        ctx.restore();
        this._snowflakes(ctx, w, h, cameraX, t, 40);
        this._mountainLayer(ctx, w, h, cameraX * 0.08, h * 0.52, 120, 0.5, '#a8d0e8', '#ffffff');
        break;

      case 'canyon':
        this._sky(ctx, w, h, '#e8a050', '#c05020', '#802000');
        this._sun(ctx, w * 0.15, h * 0.10, 35, '#fff9c4', '#ff6600');
        this._hillLayer(ctx, w, h, cameraX * 0.10, h * 0.42, 120, 0.5, '#8b4513');
        this._hillLayer(ctx, w, h, cameraX * 0.18, h * 0.58, 80, 0.7, '#a0522d');
        this._hillLayer(ctx, w, h, cameraX * 0.28, h * 0.72, 50, 1.0, '#cd853f');
        break;

      case 'volcano':
        this._sky(ctx, w, h, '#1a0500', '#4d1200', '#8b2500');
        { const lg = ctx.createLinearGradient(0, h * 0.6, 0, h);
          lg.addColorStop(0, 'transparent'); lg.addColorStop(1, 'rgba(255,60,0,0.55)');
          ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h); }
        this._volcanoShape(ctx, w, h, cameraX * 0.12, '#3a1000');
        this._ashParticles(ctx, w, h, cameraX, t, '#555555');
        break;

      case 'swamp':
        this._sky(ctx, w, h, '#2a3318', '#3b4a20', '#546230');
        ctx.save(); ctx.globalAlpha = 0.18 + Math.sin(t * 0.5) * 0.05;
        ctx.fillStyle = '#8fba6e'; ctx.fillRect(0, h * 0.45, w, h * 0.55); ctx.restore();
        this._treeSilhouette(ctx, w, h, cameraX, 0.14, h * 0.48, 50, 12, '#1e2c10', true);
        this._treeSilhouette(ctx, w, h, cameraX, 0.24, h * 0.60, 40, 10, '#162209', true);
        break;

      case 'storm':
        this._sky(ctx, w, h, '#1a1e2a', '#2c3040', '#3e4555');
        { const flash = Math.pow(Math.max(0, Math.sin(t * 0.7 + 1.5)), 20);
          if (flash > 0.1) { ctx.save(); ctx.globalAlpha = flash * 0.4; ctx.fillStyle = '#aaaaff'; ctx.fillRect(0, 0, w, h); ctx.restore(); } }
        this._clouds(ctx, w, h, cameraX, 0.09, [[0.05,0.05,200,60],[0.40,0.08,180,55],[0.70,0.04,160,50]], '#222530cc');
        this._hillLayer(ctx, w, h, cameraX * 0.15, h * 0.65, 60, 1.0, '#2c3040');
        break;

      // ── HARD THEMES ───────────────────────────────────────────────
      case 'space': case 'asteroid':
        this._sky(ctx, w, h, '#020510', '#04071a', '#06091f');
        this._stars(ctx, w, h, cameraX, 180, t);
        { const px = w * 0.80 - cameraX * 0.01, py = h * 0.18, pr = 45;
          const pg = ctx.createRadialGradient(px - 12, py - 12, 5, px, py, pr);
          const c1 = theme === 'space' ? '#4060c0' : '#806040';
          const c2 = theme === 'space' ? '#203080' : '#604020';
          pg.addColorStop(0, c1); pg.addColorStop(0.6, c2); pg.addColorStop(1, '#101010');
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
          if (theme === 'asteroid') {
            ctx.save(); ctx.strokeStyle = 'rgba(180,140,80,0.55)'; ctx.lineWidth = 8;
            ctx.beginPath(); ctx.ellipse(px, py, pr * 1.8, pr * 0.35, 0.15 * Math.PI, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          } }
        break;

      case 'moon':
        this._sky(ctx, w, h, '#030308', '#050510', '#0a0a18');
        this._stars(ctx, w, h, cameraX, 220, t);
        { const ex = w * 0.20 - cameraX * 0.008, ey = h * 0.15, er = 50;
          const eg = ctx.createRadialGradient(ex - 14, ey - 14, 6, ex, ey, er);
          eg.addColorStop(0, '#4488ff'); eg.addColorStop(0.4, '#2255cc'); eg.addColorStop(1, '#0d2255');
          ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill(); }
        break;

      case 'cave': case 'nightmare':
        this._sky(ctx, w, h, '#050508', '#0a0a10', '#080810');
        ctx.save(); ctx.globalAlpha = 0.12 + Math.sin(t * 0.6) * 0.04;
        ctx.fillStyle = theme === 'nightmare' ? '#800000' : '#00004a'; ctx.fillRect(0, 0, w, h); ctx.restore();
        this._stalactites(ctx, w, h, cameraX, theme === 'nightmare' ? '#1a0000' : '#0a0a1a');
        break;

      case 'underwater':
        this._sky(ctx, w, h, '#001a2e', '#00304d', '#00426a');
        ctx.save(); ctx.globalAlpha = 0.06 + Math.sin(t * 2) * 0.03;
        for (let i = 0; i < 8; i++) {
          const rx = ((w * 0.13 * i - cameraX * 0.03) % (w * 1.1) + w * 1.1) % (w * 1.1) - w * 0.05;
          ctx.fillStyle = '#80e0ff';
          ctx.beginPath(); ctx.moveTo(rx, 0); ctx.lineTo(rx - 20, h * 0.65); ctx.lineTo(rx + 20, h * 0.65); ctx.closePath(); ctx.fill();
        }
        ctx.restore();
        this._bubbles(ctx, w, h, cameraX, t);
        break;

      case 'lava':
        this._sky(ctx, w, h, '#100000', '#300500', '#600800');
        { const lg = ctx.createLinearGradient(0, h * 0.5, 0, h);
          lg.addColorStop(0, 'transparent'); lg.addColorStop(1, 'rgba(255,80,0,0.55)');
          ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h); }
        this._volcanoShape(ctx, w, h, cameraX * 0.14, '#1a0800');
        this._ashParticles(ctx, w, h, cameraX, t, '#ff4400');
        break;

      // ── ADVANCED THEMES ───────────────────────────────────────────
      case 'inferno':
        this._sky(ctx, w, h, '#0a0000', '#220400', '#440800');
        { const ig = ctx.createLinearGradient(0, h * 0.4, 0, h);
          ig.addColorStop(0, 'transparent'); ig.addColorStop(1, 'rgba(255,30,0,0.65)');
          ctx.fillStyle = ig; ctx.fillRect(0, 0, w, h); }
        this._ashParticles(ctx, w, h, cameraX, t, '#ff3300');
        this._ashParticles(ctx, w, h, cameraX, t + Math.PI, '#ff8800');
        break;

      case 'chaos': case 'final':
        this._sky(ctx, w, h, '#08000f', '#120520', '#1e0830');
        this._stars(ctx, w, h, cameraX, 100, t);
        ctx.save(); ctx.globalAlpha = 0.14 + Math.sin(t * 1.2) * 0.07;
        { const wg = ctx.createLinearGradient(0, 0, w, h);
          wg.addColorStop(0, '#ff00ff'); wg.addColorStop(0.5, '#0080ff'); wg.addColorStop(1, '#ff4400');
          ctx.fillStyle = wg; ctx.fillRect(0, 0, w, h); }
        ctx.restore();
        break;

      default:
        this._sky(ctx, w, h, '#5ee7df', '#b490ca', '#355c7d');
        this._sun(ctx, w * 0.80, h * 0.12, 36, '#fff9c4', '#ffd700');
        this._clouds(ctx, w, h, cameraX, 0.06, [[0.15,0.12,90,26],[0.55,0.09,75,22],[0.80,0.16,85,24]], '#ffffffcc');
        this._hillLayer(ctx, w, h, cameraX * 0.15, h * 0.68, 60, 1.4, '#6fcf97');
    }
  }

  // ── Background helper methods ─────────────────────────────────────

  _sky(ctx, w, h, top, mid, bot) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top); g.addColorStop(0.55, mid); g.addColorStop(1, bot);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }

  _sun(ctx, x, y, r, innerColor, outerColor) {
    const glow = ctx.createRadialGradient(x, y, r * 0.3, x, y, r * 2.8);
    glow.addColorStop(0, outerColor + '66'); glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, r * 2.8, 0, Math.PI * 2); ctx.fill();
    const disc = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    disc.addColorStop(0, innerColor); disc.addColorStop(1, outerColor);
    ctx.fillStyle = disc; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  _stars(ctx, w, h, cameraX, count, t) {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const s = i * 9973.3;
      const sx = (((s * 0.137 % 1) * w * 3 - cameraX * 0.02) % (w * 3) + w * 3) % (w * 3) - w;
      const sy = (s * 0.251 % 1) * h * 0.88;
      const sr = 0.7 + (s * 0.07 % 1) * 1.5;
      ctx.globalAlpha = (0.4 + Math.sin(t * (1 + s * 0.001) + s) * 0.4) * 0.95;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  _clouds(ctx, w, h, cameraX, parallax, defs, color) {
    ctx.save(); ctx.fillStyle = color;
    for (const [xf, yf, cw, ch] of defs) {
      const cx = (((xf * w * 2 - cameraX * parallax) % (w * 1.6)) + w * 1.6) % (w * 1.6) - w * 0.1;
      const cy = h * yf;
      ctx.save(); ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(cx, cy, cw * 0.5, ch * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx - cw * 0.30, cy + ch * 0.15, cw * 0.35, ch * 0.40, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx + cw * 0.32, cy + ch * 0.18, cw * 0.38, ch * 0.42, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  _hillLayer(ctx, w, h, offsetX, baseY, amplitude, freq, color) {
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const ox = x + offsetX;
      const y = baseY - Math.abs(Math.sin(ox * 0.008 * freq) * amplitude + Math.sin(ox * 0.013 * freq + 1.2) * amplitude * 0.4);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
  }

  _mountainLayer(ctx, w, h, offsetX, baseY, amplitude, freq, color, snowColor) {
    const pts = [];
    ctx.beginPath();
    for (let x = 0; x <= w; x += 4) {
      const ox = x + offsetX;
      const y = baseY - Math.abs(Math.sin(ox * 0.005 * freq) * amplitude + Math.cos(ox * 0.009 * freq + 0.5) * amplitude * 0.55);
      pts.push({ x, y });
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    if (snowColor) {
      const threshold = baseY - amplitude * 0.72;
      ctx.beginPath(); let inSnow = false;
      for (const { x, y } of pts) {
        if (y < threshold) { if (!inSnow) { ctx.moveTo(x, threshold); inSnow = true; } ctx.lineTo(x, y); }
        else if (inSnow) { ctx.lineTo(x, threshold); inSnow = false; }
      }
      ctx.fillStyle = snowColor + 'cc'; ctx.fill();
    }
  }

  _treeSilhouette(ctx, w, h, cameraX, parallax, baseY, treeH, treeW, color, dead) {
    ctx.fillStyle = color;
    const offset = cameraX * parallax;
    const spacing = treeW * 2.6;
    const count = Math.ceil(w / spacing) + 5;
    for (let i = 0; i < count; i++) {
      const tx = ((i * spacing * 1.35 - offset) % (w * 1.6) + w * 1.6) % (w * 1.6) - w * 0.1;
      if (dead) {
        ctx.fillRect(tx - treeW * 0.1, baseY - treeH, treeW * 0.2, treeH);
        ctx.fillRect(tx - treeW * 0.4, baseY - treeH * 0.7, treeW * 0.8, treeW * 0.15);
        ctx.fillRect(tx - treeW * 0.25, baseY - treeH * 0.45, treeW * 0.5, treeW * 0.12);
      } else {
        ctx.beginPath(); ctx.moveTo(tx, baseY - treeH); ctx.lineTo(tx - treeW * 0.55, baseY); ctx.lineTo(tx + treeW * 0.55, baseY); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(tx, baseY - treeH * 1.25); ctx.lineTo(tx - treeW * 0.4, baseY - treeH * 0.35); ctx.lineTo(tx + treeW * 0.4, baseY - treeH * 0.35); ctx.closePath(); ctx.fill();
      }
    }
  }

  _volcanoShape(ctx, w, h, offsetX, color) {
    const vx = ((w * 0.70 - offsetX) % (w * 1.5) + w * 1.5) % (w * 1.5);
    ctx.beginPath();
    ctx.moveTo(vx - w * 0.36, h); ctx.lineTo(vx - 28, h * 0.30); ctx.lineTo(vx + 28, h * 0.30); ctx.lineTo(vx + w * 0.36, h);
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }

  _stalactites(ctx, w, h, cameraX, color) {
    ctx.fillStyle = color;
    const offset = cameraX * 0.25;
    const count = Math.ceil(w / 60) + 4;
    for (let i = 0; i < count; i++) {
      const sx = ((i * 72 + (i % 3) * 18 - offset) % (w * 1.5) + w * 1.5) % (w * 1.5) - 20;
      const sh = 40 + (i * 37 % 62);
      ctx.beginPath(); ctx.moveTo(sx - 18, 0); ctx.lineTo(sx + 18, 0); ctx.lineTo(sx, sh); ctx.closePath(); ctx.fill();
    }
  }

  _snowflakes(ctx, w, h, cameraX, t, count) {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const s = i * 7919.1;
      const sx = (((s * 0.23 % 1) * w * 2 - cameraX * 0.04 + t * (28 + s * 0.002 % 20)) % (w * 1.3) + w * 1.3) % (w * 1.3) - w * 0.1;
      const sy = ((s * 0.17 % 1) * h + t * (18 + s * 0.001 % 30)) % h;
      ctx.globalAlpha = 0.35 + (s * 0.1 % 1) * 0.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(sx, sy, 1 + (s * 0.05 % 1) * 2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  _ashParticles(ctx, w, h, cameraX, t, color) {
    ctx.save(); ctx.fillStyle = color;
    for (let i = 0; i < 35; i++) {
      const s = i * 6547.3;
      const ax = (((s * 0.31 % 1) * w * 1.5 - cameraX * 0.05 + t * (14 + s * 0.001 % 24)) % (w * 1.4) + w * 1.4) % (w * 1.4) - w * 0.15;
      const ay = h - ((s * 0.19 % 1) * h * 0.8 + t * (22 + s * 0.002 % 38)) % h;
      ctx.globalAlpha = 0.2 + (s * 0.07 % 1) * 0.5;
      ctx.beginPath(); ctx.arc(ax, ay, 1.5 + (s * 0.04 % 1) * 2.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  _bubbles(ctx, w, h, cameraX, t) {
    ctx.save();
    for (let i = 0; i < 22; i++) {
      const s = i * 8431.7;
      const bx = (s * 0.25 % 1) * w;
      const by = h - ((s * 0.13 % 1) * h * 0.9 + t * (28 + s * 0.002 % 48)) % h;
      ctx.globalAlpha = 0.25 + (s * 0.08 % 1) * 0.3;
      ctx.strokeStyle = '#80e0ff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(bx, by, 2 + (s * 0.06 % 1) * 5, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  _drawCoin(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const r = 10;
    const grd = ctx.createRadialGradient(-4, -4, 2, 0, 0, r);
    grd.addColorStop(0, "#fff9c4");
    grd.addColorStop(0.4, "#ffe082");
    grd.addColorStop(1, "#fbc02d");
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r - 2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  _drawFuel(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.1);
    ctx.fillStyle = "#ff7043";
    this._drawRoundedRect(ctx, -12, -18, 24, 30, 4);
    ctx.fill();
    ctx.fillStyle = "#ffccbc";
    ctx.fillRect(-5, -22, 10, 6);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, -6);
    ctx.lineTo(0, 4);
    ctx.lineTo(6, -6);
    ctx.stroke();
    ctx.restore();
  }

  _drawBoost(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(0.1);
    ctx.fillStyle = "#40c4ff";
    this._drawRoundedRect(ctx, -10, -14, 20, 26, 4);
    ctx.fill();
    ctx.strokeStyle = "#e1f5fe";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-6, 4);
    ctx.lineTo(0, -6);
    ctx.lineTo(6, 4);
    ctx.stroke();
    ctx.restore();
  }

  _drawFinishFlag(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y + 80);
    ctx.fillStyle = "#4e342e";
    ctx.fillRect(-3, -80, 6, 80);
    const flagH = 40;
    const flagW = 40;
    const offset = Math.sin(Date.now() / 250) * 3;
    ctx.translate(0, -70);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(flagW * 0.4, offset, flagW, 6);
    ctx.lineTo(flagW, flagH);
    ctx.lineTo(0, flagH - 2);
    ctx.closePath();
    ctx.clip();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? "#ffffff" : "#000000";
        ctx.fillRect((flagW / 4) * i, (flagH / 4) * j, flagW / 4, flagH / 4);
      }
    }
    ctx.restore();
  }

  _drawVehicle(ctx, bodies, cameraX, cameraY) {
    const chassis = bodies.find((b) => b.label === "chassis");
    const wheels = bodies.filter((b) => b.label === "wheel");
    if (!chassis) return;

    for (const wheel of wheels) {
      ctx.save();
      ctx.translate(wheel.position.x - cameraX, wheel.position.y - cameraY);
      ctx.rotate(wheel.angle);
      const r = wheel.circleRadius;
      ctx.fillStyle = "#212121";
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#b0bec5";
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#eceff1";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(r * 0.7, 0);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(chassis.position.x - cameraX, chassis.position.y - cameraY);
    ctx.rotate(chassis.angle);
    const w = chassis.bounds.max.x - chassis.bounds.min.x;
    const h = chassis.bounds.max.y - chassis.bounds.min.y;

    ctx.fillStyle = "#ff8a65";
    this._drawRoundedRect(ctx, -w / 2, -h / 2, w, h, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    this._drawRoundedRect(ctx, -w * 0.15, -h * 0.9, w * 0.6, h * 0.8, 4);
    ctx.fill();

    ctx.fillStyle = "#263238";
    this._drawRoundedRect(ctx, -w * 0.3, -h * 0.1, w * 0.3, h * 0.3, 3);
    ctx.fill();

    ctx.fillStyle = "#ffca28";
    ctx.beginPath();
    ctx.arc(w * 0.52 - w / 2, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

