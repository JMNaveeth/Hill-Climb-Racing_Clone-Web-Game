// Main game controller and loop

import { createEngine, createWorld, setWorldGravity, stepPhysics, createTerrainForLevel, attachVehicleToWorld } from "./physics.js";
import { GameRenderer } from "./renderer.js";
import { vehicles, getDefaultVehicleId } from "./vehicles.js";
import { levels, getLevelById } from "./levels.js";
import { Hud } from "./hud.js";
import { initUI } from "./ui.js";
import { InputManager } from "./input.js";
import { Storage } from "./storage.js";
import { AudioManager } from "./audio.js";
import { ParticleSystem } from "./particles.js";
import { PlatformIntegration } from "./platform.js";

export const GAME_STATE = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused",
  GAMEOVER: "gameover",
};

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

let engine;
let world;
let renderer;
let hud;
let input;
let storage;
let audioManager;
let particles;
let platform;

let currentState = GAME_STATE.IDLE;
let currentLevelId = 1;
let currentVehicleId = getDefaultVehicleId();

let lastTimestamp = 0;
let cameraX = 0;
let cameraY = 0;

let runData = null;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (renderer) {
    renderer.resize(rect.width, rect.height);
  }
}

async function initCore() {
  try {
    engine = createEngine();
    world = createWorld(engine);
    storage = new Storage(window.localStorage);
    audioManager = new AudioManager();
    particles = new ParticleSystem();
    platform = new PlatformIntegration();

    // Initialize platform SDK (Poki/CrazyGames) - don't block on this
    platform.init(audioManager).catch(err => {
      console.warn('Platform SDK init failed (non-critical):', err);
    });

    renderer = new GameRenderer(ctx, world, particles);
    hud = new Hud();
    input = new InputManager(canvas);

    initUI({
      startRun,
      restartRun,
      quitToMenu,
      selectLevel,
      selectVehicle,
      getProgress: () => storage.getAll(),
      getVehicles: () => vehicles,
      getLevels: () => levels,
      getCurrentSelection: () => ({ levelId: currentLevelId, vehicleId: currentVehicleId }),
      storage,
      platform,
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('Game initialization failed. Please check console for details.');
  }
}

function startRun({ levelId, vehicleId }) {
  currentLevelId = levelId ?? currentLevelId;
  currentVehicleId = vehicleId ?? currentVehicleId;

  const level = getLevelById(currentLevelId);
  const vehicle = vehicles.find(v => v.id === currentVehicleId) || vehicles[0];

  setWorldGravity(world, level.gravity);

  const { terrainBodies, coinBodies, fuelBodies, boostBodies, finishX } =
    createTerrainForLevel(world, level);

  const vehicleInstance = attachVehicleToWorld(world, vehicle, level);

  runData = {
    level,
    vehicle,
    terrainBodies,
    coinBodies,
    fuelBodies,
    boostBodies,
    finishX,
    vehicleInstance,
    fuel: vehicle.stats.fuelCapacity,
    boost: 0,
    rpm: 0,
    coinsCollected: 0,
    distance: 0,
    bestDistance: storage.getBestDistance(currentLevelId) || 0,
    isFinished: false,
    causeOfEnd: null,
  };

  cameraX = vehicleInstance.chassis.position.x;
  cameraY = vehicleInstance.chassis.position.y;
  lastTimestamp = performance.now();

  audioManager.startEngine();

  // Notify platform SDK that gameplay started
  if (platform) {
    platform.gameplayStart();
  }

  currentState = GAME_STATE.RUNNING;
}

function restartRun() {
  clearWorld();
  startRun({ levelId: currentLevelId, vehicleId: currentVehicleId });
}

function quitToMenu() {
  clearWorld();
  currentState = GAME_STATE.IDLE;
  
  // Notify platform SDK that gameplay stopped
  if (platform) {
    platform.gameplayStop();
  }
}

function selectLevel(levelId) {
  currentLevelId = levelId;
}

function selectVehicle(vehicleId) {
  currentVehicleId = vehicleId;
}

function clearWorld() {
  if (!world) return;
  const allBodies = Matter.Composite.allBodies(world);
  for (const b of allBodies) {
    Matter.World.remove(world, b);
  }
}

function update(dt) {
  if (!runData || currentState !== GAME_STATE.RUNNING) return;

  const v = runData.vehicleInstance;

  const gas = input.isGasPressed();
  const brake = input.isBrakePressed();
  const boostPressed = input.isBoostPressed();

  const control = {
    gas,
    brake,
    boost: boostPressed && runData.boost > 0,
  };

  const result = stepPhysics(engine, world, v, runData, control, dt);

  runData.rpm = result.rpm;
  runData.fuel = result.fuel;
  runData.boost = result.boost;
  runData.coinsCollected += result.collectedCoins;
  runData.distance = Math.max(runData.distance, result.distance);

  if (control.gas && runData.rpm > 80) {
    particles.spawnExhaust(v.wheelB.position.x, v.wheelB.position.y);
  }

  if (result.lowFuel) {
    hud.setLowFuel(true);
  } else {
    hud.setLowFuel(false);
  }

  cameraX += (v.chassis.position.x - cameraX) * 0.1;
  cameraY += (v.chassis.position.y - cameraY) * 0.05;

  hud.update({
    coins: storage.getCoins() + runData.coinsCollected,
    distance: runData.distance,
    bestDistance: Math.max(runData.bestDistance, runData.distance),
    rpm: runData.rpm,
    fuel: runData.fuel,
    fuelMax: runData.vehicle.stats.fuelCapacity,
    boost: runData.boost,
    boostMax: 100,
  });

  renderer.update(dt, {
    cameraX,
    cameraY,
    levelTheme: runData.level.theme,
  });

  audioManager.updateEngine(runData.rpm, gas);

  if (result.collectedCoins > 0) {
    particles.spawnSparkle(v.chassis.position.x, v.chassis.position.y - 40);
    audioManager.playCoin();
  }
  if (result.collectedFuel) {
    audioManager.playFuel();
  }
  if (result.usedBoost) {
    audioManager.playBoost();
  }

  if (result.ended) {
    handleRunEnd(result);
  }
}

function handleRunEnd(result) {
  currentState = GAME_STATE.GAMEOVER;
  audioManager.stopEngine();

  const totalCoins = storage.getCoins() + runData.coinsCollected;
  storage.setCoins(totalCoins);

  const newBest = Math.max(runData.bestDistance, runData.distance);
  storage.setBestDistance(currentLevelId, newBest);

  let stars = 1;
  if (runData.distance >= runData.finishX * 0.8) stars = 2;
  if (result.reachedFinish) stars = 3;
  storage.setLevelStars(currentLevelId, Math.max(storage.getLevelStars(currentLevelId) || 0, stars));

  if (result.reachedFinish) {
    audioManager.playWin();
  } else {
    audioManager.playCrash();
  }

  window.dispatchEvent(
    new CustomEvent("game:run-ended", {
      detail: {
        levelId: currentLevelId,
        vehicleId: currentVehicleId,
        distance: runData.distance,
        bestDistance: newBest,
        coinsEarned: runData.coinsCollected,
        stars,
        reachedFinish: result.reachedFinish,
        cause: result.cause,
      },
    })
  );
}

function loop(timestamp) {
  requestAnimationFrame(loop);

  if (!lastTimestamp) lastTimestamp = timestamp;
  let dt = (timestamp - lastTimestamp) / 1000;
  if (dt > 0.05) dt = 0.05;
  lastTimestamp = timestamp;

  if (currentState === GAME_STATE.RUNNING) {
    update(dt);
  } else {
    renderer.clearFrame();
  }
}

window.addEventListener("game:pause", () => {
  if (currentState === GAME_STATE.RUNNING) {
    currentState = GAME_STATE.PAUSED;
    audioManager.suspend();
  }
});

window.addEventListener("game:resume", () => {
  if (currentState === GAME_STATE.PAUSED) {
    currentState = GAME_STATE.RUNNING;
    audioManager.resume();
  }
});

window.addEventListener("game:restart", () => {
  restartRun();
});

window.addEventListener("game:quit", () => {
  quitToMenu();
});

window.addEventListener("DOMContentLoaded", () => {
  initCore();
  requestAnimationFrame(loop);
});

