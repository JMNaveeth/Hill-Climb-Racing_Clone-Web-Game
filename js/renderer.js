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
      ctx.beginPath();
      ctx.roundRect(-w / 2, -h / 2, w, h, 8);
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

    let top, mid, ground;
    switch (theme) {
      case "desert":
        top = "#ffecd2";
        mid = "#fcb69f";
        ground = "#c79081";
        break;
      case "snow":
        top = "#e0f7ff";
        mid = "#b3d4ff";
        ground = "#f5f7fa";
        break;
      case "volcano":
      case "lava":
        top = "#2c3e50";
        mid = "#4b1248";
        ground = "#f85032";
        break;
      case "moon":
      case "space":
      case "asteroid":
        top = "#050616";
        mid = "#141e30";
        ground = "#3a3d5c";
        break;
      default:
        top = "#5ee7df";
        mid = "#b490ca";
        ground = "#355c7d";
    }

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, top);
    grad.addColorStop(0.5, mid);
    grad.addColorStop(1, ground);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#ffffff";
    const parallax = (cameraX * 0.1) % (w * 2);
    for (let i = -1; i <= 2; i++) {
      const baseX = i * w * 0.8 - parallax;
      ctx.beginPath();
      ctx.moveTo(baseX, h * 0.55);
      ctx.lineTo(baseX + w * 0.4, h * 0.25);
      ctx.lineTo(baseX + w * 0.8, h * 0.55);
      ctx.closePath();
      ctx.fill();
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
    ctx.beginPath();
    ctx.roundRect(-12, -18, 24, 30, 4);
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
    ctx.beginPath();
    ctx.roundRect(-10, -14, 20, 26, 4);
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
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.roundRect(-w * 0.15, -h * 0.9, w * 0.6, h * 0.8, 4);
    ctx.fill();

    ctx.fillStyle = "#263238";
    ctx.beginPath();
    ctx.roundRect(-w * 0.3, -h * 0.1, w * 0.3, h * 0.3, 3);
    ctx.fill();

    ctx.fillStyle = "#ffca28";
    ctx.beginPath();
    ctx.arc(w * 0.52 - w / 2, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

