// Physics and terrain setup using Matter.js

const {
  Engine,
  World,
  Bodies,
  Body,
  Composite,
  Constraint,
  Events,
} = Matter;

export function createEngine() {
  const engine = Engine.create();
  engine.timing.timeScale = 1;
  return engine;
}

export function createWorld(engine) {
  return engine.world;
}

export function setWorldGravity(world, gravity) {
  world.gravity.y = gravity;
}

export function createTerrainForLevel(world, level) {
  const segments = [];
  const coins = [];
  const fuels = [];
  const boosts = [];

  const length = level.length;
  const step = 40;
  const baseY = 400;

  let x = 0;
  let lastY = baseY;

  const rng = makeRng(level.seed);

  while (x < length) {
    const nx = x / length;
    const noise =
      perlin1D(nx * level.terrainFrequency, rng) * level.terrainAmplitude;
    const y = baseY + noise;

    const body = Bodies.rectangle(
      x + step / 2,
      (lastY + y) / 2,
      step * 1.1,
      Math.abs(y - lastY) + 20,
      {
        isStatic: true,
        friction: 0.9,
        render: { visible: false },
      }
    );

    Body.rotate(
      body,
      Math.atan2(y - lastY, step)
    );

    World.add(world, body);
    segments.push(body);

    if (rng() < level.coinDensity && x > 100 && x < length - 200) {
      const cy = Math.min(lastY, y) - 40 - rng() * 30;
      const coin = Bodies.circle(x + step / 2, cy, 10, {
        isSensor: true,
        isStatic: true,
        label: "coin",
      });
      World.add(world, coin);
      coins.push(coin);
    }

    if (rng() < level.fuelDensity && x > 200 && x < length - 400) {
      const fy = Math.min(lastY, y) - 30;
      const fuel = Bodies.rectangle(x + step / 2, fy, 24, 32, {
        isSensor: true,
        isStatic: true,
        label: "fuel",
      });
      World.add(world, fuel);
      fuels.push(fuel);
    }

    if (rng() < level.boostDensity && x > 200 && x < length - 400) {
      const by = Math.min(lastY, y) - 30;
      const boost = Bodies.rectangle(x + step / 2, by, 24, 24, {
        isSensor: true,
        isStatic: true,
        label: "boost",
      });
      World.add(world, boost);
      boosts.push(boost);
    }

    lastY = y;
    x += step;
  }

  const finishX = length;
  const finish = Bodies.rectangle(finishX, baseY - 120, 20, 200, {
    isStatic: true,
    isSensor: true,
    label: "finish",
  });
  World.add(world, finish);

  return {
    terrainBodies: segments,
    coinBodies: coins,
    fuelBodies: fuels,
    boostBodies: boosts,
    finishX,
  };
}

export function attachVehicleToWorld(world, vehicle, level) {
  const x = 80;
  const y = 350;

  const chassis = Bodies.rectangle(x, y, vehicle.bodyWidth, vehicle.bodyHeight, {
    density: vehicle.physics.density,
    friction: 0.8,
    frictionAir: 0.02,
    restitution: 0.1,
    label: "chassis",
  });

  const wheelOffsetX = vehicle.wheelBase / 2;
  const wheelRadius = vehicle.wheelRadius;

  const wheelA = Bodies.circle(x - wheelOffsetX, y + vehicle.wheelYOffset, wheelRadius, {
    friction: 1.0,
    restitution: 0.1,
    label: "wheel",
  });

  const wheelB = Bodies.circle(x + wheelOffsetX, y + vehicle.wheelYOffset, wheelRadius, {
    friction: 1.0,
    restitution: 0.1,
    label: "wheel",
  });

  const suspensionStiffness = 0.8;

  const springA = Constraint.create({
    bodyA: chassis,
    pointA: { x: -wheelOffsetX, y: vehicle.wheelYOffset },
    bodyB: wheelA,
    stiffness: suspensionStiffness,
    damping: 0.3,
    length: vehicle.suspensionLength,
  });

  const springB = Constraint.create({
    bodyA: chassis,
    pointA: { x: wheelOffsetX, y: vehicle.wheelYOffset },
    bodyB: wheelB,
    stiffness: suspensionStiffness,
    damping: 0.3,
    length: vehicle.suspensionLength,
  });

  World.add(world, [chassis, wheelA, wheelB, springA, springB]);

  return {
    chassis,
    wheelA,
    wheelB,
    springA,
    springB,
  };
}

export function stepPhysics(engine, world, vehicleInstance, runData, control, dt) {
  const { chassis, wheelA, wheelB } = vehicleInstance;
  const vehicle = runData.vehicle;

  const torqueBase = vehicle.stats.torque;
  const gasTorque = control.gas ? torqueBase : 0;
  const brakeTorque = control.brake ? -torqueBase * 0.6 : 0;
  const boostTorque = control.boost ? torqueBase * 1.5 : 0;

  const totalTorque = gasTorque + brakeTorque + boostTorque;

  Body.applyForce(wheelA, wheelA.position, {
    x: totalTorque / wheelA.circleRadius,
    y: 0,
  });
  Body.applyForce(wheelB, wheelB.position, {
    x: totalTorque / wheelB.circleRadius,
    y: 0,
  });

  const rpm =
    (Math.abs(wheelA.angularVelocity) + Math.abs(wheelB.angularVelocity)) * 20;

  const slopeFactor = Math.sin(chassis.angle);
  const fuelDrain =
    (Math.abs(totalTorque) * 0.00004 +
      0.03 * (1 + Math.abs(slopeFactor))) /
    vehicle.stats.fuelEfficiency;
  let fuel = Math.max(0, runData.fuel - fuelDrain * (dt * 60));

  let boost = runData.boost;
  let usedBoost = false;
  if (control.boost && boost > 0) {
    boost = Math.max(0, boost - 20 * dt);
    usedBoost = true;
  }

  Engine.update(engine, dt * 1000);

  let collectedCoins = 0;
  let collectedFuel = false;
  let collectedBoost = false;
  let ended = false;
  let reachedFinish = false;
  let cause = null;

  const vehicleX = chassis.position.x;
  const vehicleY = chassis.position.y;

  const bodies = Composite.allBodies(world);
  for (const body of bodies) {
    if (!body.isSensor) continue;
    const dx = body.position.x - vehicleX;
    const dy = body.position.y - vehicleY;
    const dist2 = dx * dx + dy * dy;
    if (dist2 > 60 * 60) continue;

    if (body.label === "coin") {
      World.remove(world, body);
      body.label = "collected";
      collectedCoins += 1;
    } else if (body.label === "fuel") {
      World.remove(world, body);
      body.label = "collected";
      fuel = Math.min(vehicle.stats.fuelCapacity, fuel + 30);
      collectedFuel = true;
    } else if (body.label === "boost") {
      World.remove(world, body);
      body.label = "collected";
      boost = Math.min(100, boost + 40);
      collectedBoost = true;
    } else if (body.label === "finish") {
      reachedFinish = true;
      ended = true;
      cause = "finish";
    }
  }

  const headPoint = {
    x: chassis.position.x,
    y: chassis.position.y - vehicle.bodyHeight / 2,
  };
  if (headPoint.y > 460 || chassis.angle > Math.PI * 0.8 || chassis.angle < -Math.PI * 0.8) {
    ended = true;
    cause = "flip";
  }

  if (fuel <= 0 && !ended) {
    ended = true;
    cause = "fuel";
  }

  const distance = Math.max(0, vehicleX);

  return {
    rpm,
    fuel,
    boost,
    collectedCoins,
    collectedFuel,
    collectedBoost,
    usedBoost,
    lowFuel: fuel < vehicle.stats.fuelCapacity * 0.2,
    distance,
    ended,
    reachedFinish,
    cause,
    finishX: runData.finishX,
  };
}

function makeRng(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function perlin1D(x, rng) {
  const x0 = Math.floor(x);
  const x1 = x0 + 1;
  const t = x - x0;
  const g0 = gradient(x0, rng);
  const g1 = gradient(x1, rng);
  const v0 = g0 * (x - x0);
  const v1 = g1 * (x - x1);
  const w = t * t * (3 - 2 * t);
  return v0 * (1 - w) + v1 * w;
}

const gradientCache = new Map();
function gradient(xi, rng) {
  if (gradientCache.has(xi)) return gradientCache.get(xi);
  const g = (rng() * 2 - 1);
  gradientCache.set(xi, g);
  return g;
}

