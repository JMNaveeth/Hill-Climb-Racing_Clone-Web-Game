// particles.js - simple particle systems (exhaust, sparkles, dust)

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawnExhaust(x, y) {
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        type: "smoke",
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 4,
        vx: -20 - Math.random() * 10,
        vy: -10 - Math.random() * 10,
        life: 0.6 + Math.random() * 0.4,
        age: 0,
      });
    }
  }

  spawnSparkle(x, y) {
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 40 + Math.random() * 40;
      this.particles.push({
        type: "spark",
        x,
        y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.4 + Math.random() * 0.3,
        age: 0,
      });
    }
  }

  update(dt) {
    const alive = [];
    for (const p of this.particles) {
      p.age += dt;
      if (p.age > p.life) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === "smoke") {
        p.vx *= 0.96;
        p.vy *= 0.96;
      } else {
        p.vy += 60 * dt;
      }
      alive.push(p);
    }
    this.particles = alive;
  }

  draw(ctx, cameraX, cameraY) {
    for (const p of this.particles) {
      const t = p.age / p.life;
      const alpha = 1 - t;
      const x = p.x - cameraX;
      const y = p.y - cameraY;
      if (p.type === "smoke") {
        ctx.fillStyle = `rgba(220,220,220,${alpha * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, 8 + t * 8, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === "spark") {
        ctx.fillStyle = `rgba(255,230,120,${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

