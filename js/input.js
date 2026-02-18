// input.js - keyboard + touch input handler

export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.gas = false;
    this.brake = false;
    this.boost = false;

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener("keydown", (e) => {
      if (e.code === "ArrowRight" || e.code === "KeyD") this.gas = true;
      if (e.code === "ArrowLeft" || e.code === "KeyA") this.brake = true;
      if (e.code === "Space") this.boost = true;
    });

    window.addEventListener("keyup", (e) => {
      if (e.code === "ArrowRight" || e.code === "KeyD") this.gas = false;
      if (e.code === "ArrowLeft" || e.code === "KeyA") this.brake = false;
      if (e.code === "Space") this.boost = false;
    });

    const btnGas = document.getElementById("btn-gas");
    const btnBrake = document.getElementById("btn-brake");

    const pressGas = (e) => {
      e.preventDefault();
      this.gas = true;
    };
    const releaseGas = (e) => {
      e.preventDefault();
      this.gas = false;
    };
    const pressBrake = (e) => {
      e.preventDefault();
      this.brake = true;
    };
    const releaseBrake = (e) => {
      e.preventDefault();
      this.brake = false;
    };

    if (btnGas) {
      btnGas.addEventListener("touchstart", pressGas);
      btnGas.addEventListener("touchend", releaseGas);
      btnGas.addEventListener("touchcancel", releaseGas);
      btnGas.addEventListener("mousedown", pressGas);
      window.addEventListener("mouseup", releaseGas);
    }
    if (btnBrake) {
      btnBrake.addEventListener("touchstart", pressBrake);
      btnBrake.addEventListener("touchend", releaseBrake);
      btnBrake.addEventListener("touchcancel", releaseBrake);
      btnBrake.addEventListener("mousedown", pressBrake);
      window.addEventListener("mouseup", releaseBrake);
    }

    const onTouch = (e) => {
      if (!this.canvas) return;
      const rect = this.canvas.getBoundingClientRect();
      this.gas = false;
      this.brake = false;
      for (const touch of e.touches) {
        const x = touch.clientX - rect.left;
        if (x < rect.width * 0.4) this.brake = true;
        else if (x > rect.width * 0.6) this.gas = true;
      }
    };
    const clearTouch = () => {
      this.gas = false;
      this.brake = false;
    };

    this.canvas.addEventListener("touchstart", onTouch);
    this.canvas.addEventListener("touchmove", onTouch);
    this.canvas.addEventListener("touchend", clearTouch);
    this.canvas.addEventListener("touchcancel", clearTouch);
  }

  isGasPressed() {
    return this.gas;
  }

  isBrakePressed() {
    return this.brake;
  }

  isBoostPressed() {
    return this.boost;
  }
}

