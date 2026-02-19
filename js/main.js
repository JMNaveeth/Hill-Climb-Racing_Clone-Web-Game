// main.js — Game controller and main loop
// Enhanced version — 100% original code, free to publish (no copyright claims)

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

/* ─── Game state enum ───────────────────────────────── */
export const GAME_STATE = {
  IDLE:     "idle",
  RUNNING:  "running",
  PAUSED:   "paused",
  GAMEOVER: "gameover",
};

/* ─── Canvas setup ──────────────────────────────────── */
const canvas = document.getElementById("game-canvas");
const ctx    = canvas.getContext("2d");

/* ─── Core singletons ───────────────────────────────── */
let engine;
let world;
let renderer;
let hud;
let input;
let storage;
let audioManager;
let particles;
let platform;

/* ─── Game state ─────────────────────────────────────── */
let currentState    = GAME_STATE.IDLE;
let currentLevelId  = 1;
let currentVehicleId= getDefaultVehicleId();

let lastTimestamp = 0;
let cameraX = 0;
let cameraY = 0;
let runData = null;

/* ─── Restore last saved selections ──────────────────── */
function restoreSelections() {
  const saved = storage.getAll();
  if (saved.lastSelectedVehicle) currentVehicleId = saved.lastSelectedVehicle;
  if (saved.lastSelectedLevel)   currentLevelId   = saved.lastSelectedLevel;
}

/* ─── Apply per-vehicle upgrade boosts ───────────────── */
function applyUpgrades(vehicle, st) {
  const eLv = st.getUpgradeLevel(vehicle.id, 'engine');
  const sLv = st.getUpgradeLevel(vehicle.id, 'suspension');
  const tLv = st.getUpgradeLevel(vehicle.id, 'tires');
  const fLv = st.getUpgradeLevel(vehicle.id, 'fuel');
  return {
    ...vehicle,
    stats: {
      ...vehicle.stats,
      torque:         vehicle.stats.torque         * (1 + 0.13 * eLv),
      fuelCapacity:   vehicle.stats.fuelCapacity    * (1 + 0.15 * fLv),
      fuelEfficiency: vehicle.stats.fuelEfficiency  * (1 + 0.08 * fLv),
    },
    wheelRadius:      vehicle.wheelRadius      * (1 + 0.06 * tLv),
    wheelYOffset:     vehicle.wheelYOffset     * (1 + 0.06 * tLv),
    suspensionLength: vehicle.suspensionLength * (1 + 0.10 * sLv),
  };
}

/* ─── Canvas resize ──────────────────────────────────── */
function resizeCanvas() {
  const dpr  = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (renderer) renderer.resize(rect.width, rect.height);
}

/* ─── Core initialisation ────────────────────────────── */
async function initCore() {
  try {
    engine       = createEngine();
    world        = createWorld(engine);
    storage      = new Storage(window.localStorage);
    audioManager = new AudioManager();
    particles    = new ParticleSystem();
    platform     = new PlatformIntegration();

    // Platform SDK init (Poki / CrazyGames) — non-blocking
    platform.init(audioManager).catch(err => {
      console.warn('Platform SDK init failed (non-critical):', err);
    });

    renderer = new GameRenderer(ctx, world, particles);
    hud      = new Hud();
    input    = new InputManager(canvas);

    restoreSelections();

    initUI({
      startRun,
      restartRun,
      quitToMenu,
      selectLevel,
      selectVehicle,
      getProgress:        () => storage.getAll(),
      getVehicles:        () => vehicles,
      getLevels:          () => levels,
      getCurrentSelection:() => ({ levelId: currentLevelId, vehicleId: currentVehicleId }),
      storage,
      platform,
    });

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    console.log('Game initialised successfully');
  } catch (error) {
    console.error('Failed to initialise game:', error);
    alert('Game initialisation failed. Please check console for details.');
  }
}

/* ─── Start a run ────────────────────────────────────── */
function startRun({ levelId, vehicleId }) {
  try {
    currentLevelId   = levelId   ?? currentLevelId;
    currentVehicleId = vehicleId ?? currentVehicleId;

    const level = getLevelById(currentLevelId);
    if (!level) { console.error('Level not found:', currentLevelId); return; }

    const vehicle = vehicles.find(v => v.id === currentVehicleId) || vehicles[0];
    if (!vehicle) { console.error('Vehicle not found:', currentVehicleId); return; }

    setWorldGravity(world, level.gravity);

    const { terrainBodies, coinBodies, fuelBodies, boostBodies, finishX } =
      createTerrainForLevel(world, level);

    const upgV            = applyUpgrades(vehicle, storage);
    const vehicleInstance = attachVehicleToWorld(world, upgV, level);

    runData = {
      level,
      vehicle: upgV,
      terrainBodies,
      coinBodies,
      fuelBodies,
      boostBodies,
      finishX,
      vehicleInstance,
      fuel:           upgV.stats.fuelCapacity,
      boost:          0,
      rpm:            0,
      coinsCollected: 0,
      distance:       0,
      bestDistance:   storage.getBestDistance(currentLevelId) || 0,
      isFinished:     false,
      causeOfEnd:     null,
    };

    cameraX       = vehicleInstance.chassis.position.x;
    cameraY       = vehicleInstance.chassis.position.y;
    lastTimestamp = performance.now();

    audioManager.startEngine();
    audioManager.startMusic(level.theme);

    if (platform) platform.gameplayStart();

    currentState = GAME_STATE.RUNNING;
    console.log('Game started successfully');
  } catch (error) {
    console.error('Error starting run:', error);
    alert('Failed to start game: ' + error.message);
  }
}

/* ─── Restart / Quit ─────────────────────────────────── */
function restartRun() {
  clearWorld();
  startRun({ levelId: currentLevelId, vehicleId: currentVehicleId });
}

function quitToMenu() {
  clearWorld();
  audioManager.stopEngine();
  audioManager.stopMusic();
  currentState = GAME_STATE.IDLE;
  if (platform) platform.gameplayStop();
}

function selectLevel(levelId)   { currentLevelId   = levelId; }
function selectVehicle(vehicleId) {
  currentVehicleId = vehicleId;
  storage.setLastSelected(currentLevelId, vehicleId);
}

/* ─── Clear physics world ────────────────────────────── */
function clearWorld() {
  if (!world || typeof Matter === 'undefined') return;
  try {
    const allBodies = Matter.Composite.allBodies(world);
    for (const b of allBodies) Matter.World.remove(world, b);
  } catch (error) { console.warn('Error clearing world:', error); }
}

/* ─── Per-frame update ───────────────────────────────── */
function update(dt) {
  if (!runData || currentState !== GAME_STATE.RUNNING) return;

  const v            = runData.vehicleInstance;
  const gas          = input.isGasPressed();
  const brake        = input.isBrakePressed();
  const boostPressed = input.isBoostPressed();

  const control = { gas, brake, boost: boostPressed && runData.boost > 0 };
  const result  = stepPhysics(engine, world, v, runData, control, dt);

  runData.rpm            = result.rpm;
  runData.fuel           = result.fuel;
  runData.boost          = result.boost;
  runData.coinsCollected+= result.collectedCoins;
  runData.distance       = Math.max(runData.distance, result.distance);

  if (control.gas && runData.rpm > 80) {
    particles.spawnExhaust(v.wheelB.position.x, v.wheelB.position.y);
  }

  hud.setLowFuel(!!result.lowFuel);

  // Smooth camera follow
  cameraX += (v.chassis.position.x - cameraX) * 0.10;
  cameraY += (v.chassis.position.y - cameraY) * 0.05;

  hud.update({
    coins:       storage.getCoins() + runData.coinsCollected,
    distance:    runData.distance,
    bestDistance:Math.max(runData.bestDistance, runData.distance),
    rpm:         runData.rpm,
    fuel:        runData.fuel,
    fuelMax:     runData.vehicle.stats.fuelCapacity,
    boost:       runData.boost,
    boostMax:    100,
  });

  renderer.update(dt, {
    cameraX,
    cameraY,
    levelTheme: runData.level.theme,
    vehicle:    runData.vehicle,
  });

  audioManager.updateEngine(runData.rpm, gas);

  // Feedback effects
  if (result.collectedCoins > 0) {
    particles.spawnSparkle(v.chassis.position.x, v.chassis.position.y - 40);
    audioManager.playCoin();
  }
  if (result.collectedFuel) audioManager.playFuel();
  if (result.usedBoost)     audioManager.playBoost();

  if (result.ended) handleRunEnd(result);
}

/* ─── Run end handler ────────────────────────────────── */
function handleRunEnd(result) {
  currentState = GAME_STATE.GAMEOVER;
  audioManager.stopEngine();
  audioManager.stopMusic();

  const totalCoins = storage.getCoins() + runData.coinsCollected;
  storage.setCoins(totalCoins);

  const newBest = Math.max(runData.bestDistance, runData.distance);
  storage.setBestDistance(currentLevelId, newBest);

  let stars = 1;
  if (runData.distance >= runData.finishX * 0.8) stars = 2;
  if (result.reachedFinish) stars = 3;
  storage.setLevelStars(currentLevelId, Math.max(storage.getLevelStars(currentLevelId) || 0, stars));

  if (result.reachedFinish) audioManager.playWin();
  else                      audioManager.playCrash();

  window.dispatchEvent(
    new CustomEvent("game:run-ended", {
      detail: {
        levelId:       currentLevelId,
        vehicleId:     currentVehicleId,
        distance:      runData.distance,
        bestDistance:  newBest,
        coinsEarned:   runData.coinsCollected,
        stars,
        reachedFinish: result.reachedFinish,
        cause:         result.cause,
      },
    })
  );
}

/* ─── Main loop ──────────────────────────────────────── */
function loop(timestamp) {
  requestAnimationFrame(loop);

  if (!lastTimestamp) lastTimestamp = timestamp;
  let dt = (timestamp - lastTimestamp) / 1000;
  if (dt > 0.05) dt = 0.05; // cap at 50 ms to avoid spiral of death
  lastTimestamp = timestamp;

  if (currentState === GAME_STATE.RUNNING) {
    update(dt);
  } else {
    renderer.clearFrame();
  }
}

/* ─── Global event listeners ─────────────────────────── */
window.addEventListener("game:pause",   () => {
  if (currentState === GAME_STATE.RUNNING) { currentState = GAME_STATE.PAUSED; audioManager.suspend(); }
});
window.addEventListener("game:resume",  () => {
  if (currentState === GAME_STATE.PAUSED) { currentState = GAME_STATE.RUNNING; audioManager.resume(); }
});
window.addEventListener("game:restart", () => restartRun());
window.addEventListener("game:quit",    () => quitToMenu());

/* ─── Entry point ────────────────────────────────────── */
window.addEventListener("DOMContentLoaded", () => {
  // Guard: file:// protocol
  if (window.location.protocol === 'file:') {
    document.body.innerHTML = `
      <div style="padding:40px;text-align:center;font-family:sans-serif;background:#060b1a;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;">
        <div>
          <h1 style="color:#f97316;font-size:2rem;margin-bottom:16px;">⚠️ Web Server Required</h1>
          <p style="font-size:1.1rem;margin-bottom:24px;opacity:0.8;">This game must be run from a web server, not directly from file://</p>
          <div style="background:rgba(255,255,255,0.05);padding:24px;border-radius:14px;text-align:left;max-width:580px;margin:0 auto;border:1px solid rgba(255,255,255,0.1);">
            <p style="margin:10px 0;"><strong>Python:</strong> <code style="background:#1a2540;padding:4px 10px;border-radius:6px;">python -m http.server 8000</code></p>
            <p style="margin:10px 0;"><strong>Node.js:</strong> <code style="background:#1a2540;padding:4px 10px;border-radius:6px;">npx serve</code></p>
            <p style="margin:10px 0;"><strong>VS Code:</strong> Install the "Live Server" extension</p>
            <p style="margin-top:18px;opacity:0.6;">Then open: <code style="background:#1a2540;padding:4px 10px;border-radius:6px;">http://localhost:8000/index.html</code></p>
          </div>
        </div>
      </div>`;
    return;
  }

  // Guard: Matter.js
  if (typeof Matter === 'undefined') {
    console.error('Matter.js not loaded!');
    document.body.innerHTML = '<div style="padding:20px;color:#f97316;"><h1>Error</h1><p>Matter.js physics library failed to load. Please check your internet connection.</p></div>';
    return;
  }

  // Guard: canvas
  if (!canvas || !ctx) { console.error('Canvas not found!'); return; }

  console.log('Starting game initialisation...');
  initCore().catch(error => {
    console.error('Critical initialisation error:', error);
    alert('Game failed to initialise. Please check console for details.');
  });
  requestAnimationFrame(loop);
});