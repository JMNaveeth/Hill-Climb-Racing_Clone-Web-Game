// hud.js - HUD gauges and text overlays

export class Hud {
  constructor() {
    this.coinEl = document.getElementById("hud-coin-count");
    this.distCurrentEl = document.getElementById("hud-distance-current");
    this.distBestEl = document.getElementById("hud-distance-best");

    this.rpmCanvas = document.getElementById("gauge-rpm");
    this.fuelCanvas = document.getElementById("gauge-fuel");
    this.boostCanvas = document.getElementById("gauge-boost");

    this.rpmCtx = this.rpmCanvas.getContext("2d");
    this.fuelCtx = this.fuelCanvas.getContext("2d");
    this.boostCtx = this.boostCanvas.getContext("2d");

    this.lowFuel = false;
  }

  setLowFuel(enabled) {
    this.lowFuel = enabled;
    const hud = document.getElementById("hud");
    if (hud) {
      hud.classList.toggle("flash-low-fuel", enabled);
    }
  }

  update({ coins, distance, bestDistance, rpm, fuel, fuelMax, boost, boostMax }) {
    if (this.coinEl) this.coinEl.textContent = Math.floor(coins).toString();
    if (this.distCurrentEl) this.distCurrentEl.textContent = `${distance.toFixed(1)} m`;
    if (this.distBestEl) this.distBestEl.textContent = `Best: ${bestDistance.toFixed(1)} m`;

    this.drawGauge(this.rpmCtx, this.rpmCanvas, rpm / 600, "RPM");
    this.drawGauge(this.fuelCtx, this.fuelCanvas, fuel / (fuelMax || 1), "Fuel");
    this.drawGauge(this.boostCtx, this.boostCanvas, boost / (boostMax || 1), "Boost");
  }

  drawGauge(ctx, canvas, value, label) {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(w, h) / 2 - 6;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.beginPath();
    ctx.arc(0, 0, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 5;
    ctx.stroke();

    const clamped = Math.max(0, Math.min(1, value));
    ctx.beginPath();
    ctx.arc(
      0,
      0,
      r,
      Math.PI * 0.75,
      Math.PI * 0.75 + clamped * Math.PI * 1.5
    );
    const grad = ctx.createLinearGradient(-r, 0, r, 0);
    grad.addColorStop(0, "#4facfe");
    grad.addColorStop(1, "#00f2fe");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 6;
    ctx.stroke();

    const needleAngle = Math.PI * 0.75 + clamped * Math.PI * 1.5;
    ctx.rotate(needleAngle);
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(r - 6, 0);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.rotate(-needleAngle);

    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, 0, r * 0.35);

    ctx.restore();
  }
}

