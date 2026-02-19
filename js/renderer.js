// renderer.js — Canvas rendering for world, vehicle, terrain, pickups
// Enhanced version: each vehicle drawn to match its unique garage artwork
// 100% original code — free to publish (no copyright claims)

const { Composite } = Matter;

// ── Colour helpers (mirror vehicles.js) ──────────────────
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function L(hex, a) {               // lighten
  const c = hexToRgb(hex);
  return `rgb(${Math.min(255,c.r+a)},${Math.min(255,c.g+a)},${Math.min(255,c.b+a)})`;
}
function D(hex, a) {               // darken
  const c = hexToRgb(hex);
  return `rgb(${Math.max(0,c.r-a)},${Math.max(0,c.g-a)},${Math.max(0,c.b-a)})`;
}
function A(hex, op) {              // with alpha
  const c = hexToRgb(hex);
  return `rgba(${c.r},${c.g},${c.b},${op})`;
}

export class GameRenderer {
  constructor(ctx, world, particles) {
    this.ctx      = ctx;
    this.world    = world;
    this.particles= particles;
    this.width    = ctx.canvas.clientWidth  || ctx.canvas.width;
    this.height   = ctx.canvas.clientHeight || ctx.canvas.height;
    this._currentVehicle = null;
    // Cache pre-parsed Image objects for each vehicle id
    this._svgCache = {};
  }

  resize(width, height) {
    this.width  = width;
    this.height = height;
  }

  clearFrame() {
    const ctx = this.ctx;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,this.width,this.height);
    this._drawBackground({ theme:'pastelFields', cameraX:0, cameraY:0 });
  }

  update(dt, { cameraX, cameraY, levelTheme, vehicle }) {
    this._currentVehicle = vehicle || this._currentVehicle;
    const ctx = this.ctx;
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,this.width,this.height);

    this._drawBackground({ theme:levelTheme, cameraX, cameraY });

    ctx.save();
    ctx.translate(this.width/2, this.height*0.6);

    const allBodies = Composite.allBodies(this.world);

    // ── Terrain ────────────────────────────────────────────
    ctx.fillStyle = '#202633';
    for (const body of allBodies) {
      if (!body.isStatic || body.isSensor) continue;
      ctx.save();
      ctx.translate(body.position.x - cameraX, body.position.y - cameraY);
      ctx.rotate(body.angle);
      const w = body.bounds.max.x - body.bounds.min.x;
      const h = body.bounds.max.y - body.bounds.min.y;
      this._drawRoundedRect(ctx, -w/2, -h/2, w, h, 8);
      ctx.fill();
      ctx.restore();
    }

    // ── Pickups / finish ────────────────────────────────────
    for (const body of allBodies) {
      if (body.isStatic && !body.isSensor) continue;
      if (!body.label) continue;
      const x = body.position.x - cameraX;
      const y = body.position.y - cameraY;
      if      (body.label==='coin')   this._drawCoin(ctx, x, y);
      else if (body.label==='fuel')   this._drawFuel(ctx, x, y);
      else if (body.label==='boost')  this._drawBoost(ctx, x, y);
      else if (body.label==='finish') this._drawFinishFlag(ctx, x, y);
    }

    // ── Vehicle ─────────────────────────────────────────────
    const vehicleBodies = allBodies.filter(
      b => b.label==='chassis' || b.label==='wheel'
    );
    this._drawVehicle(ctx, vehicleBodies, cameraX, cameraY, this._currentVehicle);

    this.particles.update(dt);
    this.particles.draw(ctx, cameraX, cameraY);

    ctx.restore();
  }

  // ── Low-level helpers ────────────────────────────────────
  _drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x+radius, y);
    ctx.lineTo(x+width-radius, y);
    ctx.quadraticCurveTo(x+width, y, x+width, y+radius);
    ctx.lineTo(x+width, y+height-radius);
    ctx.quadraticCurveTo(x+width, y+height, x+width-radius, y+height);
    ctx.lineTo(x+radius, y+height);
    ctx.quadraticCurveTo(x, y+height, x, y+height-radius);
    ctx.lineTo(x, y+radius);
    ctx.quadraticCurveTo(x, y, x+radius, y);
    ctx.closePath();
  }

  // ═══════════════════════════════════════════════════════════
  // VEHICLE DRAWING  — unique shape per vehicle id
  // ═══════════════════════════════════════════════════════════

  _drawVehicle(ctx, bodies, cameraX, cameraY, vehicle) {
    const chassis = bodies.find(b => b.label==='chassis');
    const wheels  = bodies.filter(b => b.label==='wheel');
    if (!chassis) return;

    const bod  = vehicle?.palette?.body   || '#888888';
    const acc  = vehicle?.palette?.accent || '#333333';
    const id   = vehicle?.id || '';
    const isBike = vehicle?.type === 'bike';

    // Draw wheels first (they sit behind body visually)
    for (const wheel of wheels) {
      ctx.save();
      ctx.translate(wheel.position.x - cameraX, wheel.position.y - cameraY);
      // Use wheel.angle for rotation (fixes wheel not rotating)
      ctx.rotate(wheel.angle || 0);
      const r = wheel.circleRadius;
      // Make wheels slightly larger for better look
      this._drawWheel(ctx, r * 1.08, acc, id === 'monster_truck' || id === 'jeep_4x4' ||
        id === 'dune_buggy' || id === 'dirt_bike' || id === 'scrambler' ||
        id === 'enduro_bike' || id === 'tank');
      ctx.restore();
    }

    // Draw chassis body with vehicle-specific shape
    ctx.save();
    ctx.translate(chassis.position.x - cameraX, chassis.position.y - cameraY);
    ctx.rotate(chassis.angle);

    // Improve car body proportions for more attractive look
    let w = chassis.bounds.max.x - chassis.bounds.min.x;
    let h = chassis.bounds.max.y - chassis.bounds.min.y;
    // Make cars a bit wider and lower for a sportier look
    if (!isBike) {
      w *= 1.12;
      h *= 0.92;
    }

    switch(id) {
      case 'rusty_hatchback':   this._bodyRustyHatchback(ctx, w, h, bod, acc); break;
      case 'monster_truck':     this._bodyMonsterTruck(ctx, w, h, bod, acc); break;
      case 'rally_racer':       this._bodyRallyRacer(ctx, w, h, bod, acc); break;
      case 'muscle_car':        this._bodyMuscleCar(ctx, w, h, bod, acc); break;
      case 'jeep_4x4':          this._bodyJeep4x4(ctx, w, h, bod, acc); break;
      case 'sports_coupe':      this._bodySportsCoupe(ctx, w, h, bod, acc); break;
      case 'dune_buggy':        this._bodyDuneBuggy(ctx, w, h, bod, acc); break;
      case 'tank':              this._bodyTank(ctx, w, h, bod, acc); break;
      case 'pickup_truck':      this._bodyPickupTruck(ctx, w, h, bod, acc); break;
      case 'electric_car':      this._bodyElectricCar(ctx, w, h, bod, acc); break;
      case 'dirt_bike':         this._bodyDirtBike(ctx, w, h, bod, acc); break;
      case 'chopper':           this._bodyChopper(ctx, w, h, bod, acc); break;
      case 'sport_bike':        this._bodySportBike(ctx, w, h, bod, acc); break;
      case 'scrambler':         this._bodyScrambler(ctx, w, h, bod, acc); break;
      case 'mini_moto':         this._bodyMiniMoto(ctx, w, h, bod, acc); break;
      case 'enduro_bike':       this._bodyEnduroBike(ctx, w, h, bod, acc); break;
      case 'cafe_racer':        this._bodyCafeRacer(ctx, w, h, bod, acc); break;
      case 'bmx':               this._bodyBMX(ctx, w, h, bod, acc); break;
      case 'cruiser_bike':      this._bodyCruiserBike(ctx, w, h, bod, acc); break;
      case 'supermoto':         this._bodySupermoto(ctx, w, h, bod, acc); break;
      default:
        isBike ? this._bodyGenericBike(ctx, w, h, bod, acc)
               : this._bodyGenericCar(ctx, w, h, bod, acc);
    }

    ctx.restore();
  }

  // ── Shared wheel renderer ────────────────────────────────
  _drawWheel(ctx, r, acc, chunky=false) {
    // Tyre
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.arc(0,0,r+2,0,Math.PI*2); ctx.fill();
    if (chunky) {
      // chunky off-road tread dashes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 3;
      ctx.setLineDash([5,4]);
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.stroke();
      ctx.setLineDash([]);
    }
    // Rim
    ctx.fillStyle = acc;
    ctx.beginPath(); ctx.arc(0,0, r*(chunky ? 0.60 : 0.62), 0, Math.PI*2); ctx.fill();
    // Spokes (5)
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = chunky ? 2.5 : 1.8;
    const spokeCount = chunky ? 6 : 5;
    for (let i=0; i<spokeCount; i++) {
      const a = (i/spokeCount)*Math.PI*2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*r*0.18, Math.sin(a)*r*0.18);
      ctx.lineTo(Math.cos(a)*r*(chunky?0.70:0.60), Math.sin(a)*r*(chunky?0.70:0.60));
      ctx.stroke();
    }
    // Hub cap
    ctx.fillStyle = '#eee';
    ctx.beginPath(); ctx.arc(0,0,r*0.18,0,Math.PI*2); ctx.fill();
    // Centre dot
    ctx.fillStyle = acc;
    ctx.beginPath(); ctx.arc(0,0,r*0.09,0,Math.PI*2); ctx.fill();
    // Highlight
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.ellipse(-r*0.12,-r*0.12, r*0.20, r*0.10, -0.5, 0, Math.PI*2);
    ctx.fill();
  }

  // ════════════════════════════════════════════════════════
  // CAR BODIES — drawn relative to chassis centre (0,0)
  // w = chassis width, h = chassis height
  // Right = front of vehicle (positive X)
  // ════════════════════════════════════════════════════════

  _bodyRustyHatchback(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Main body (boxy)
    ctx.fillStyle = b;
    this._drawRoundedRect(ctx,-hw,-hh,w,h,5); ctx.fill();
    // Tall boxy cab top
    ctx.fillStyle = L(b,20);
    this._drawRoundedRect(ctx,-hw*0.25,-hh-h*0.9,w*0.65,h*0.95,4); ctx.fill();
    // Windshield (nearly vertical)
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.25+w*0.18,-hh-h*0.85);
    ctx.lineTo( hw*0.40,       -hh-h*0.85);
    ctx.lineTo( hw*0.40,       -hh);
    ctx.lineTo(-hw*0.25,       -hh);
    ctx.closePath(); ctx.fill();
    // Rear window
    ctx.fillStyle='rgba(160,220,255,0.35)';
    this._drawRoundedRect(ctx,-hw*0.22,-hh-h*0.80,w*0.22,h*0.74,2); ctx.fill();
    // Accent stripe
    ctx.fillStyle=a;
    this._drawRoundedRect(ctx,-hw,hh*0.2,w,h*0.3,3); ctx.fill();
    // Rust spots
    ctx.fillStyle=D(b,40); ctx.globalAlpha=0.6;
    ctx.beginPath(); ctx.ellipse(-hw+8,hh*0.5,5,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hw*0.5,-hh*0.2,4,2,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    // Headlight (square, right/front)
    ctx.fillStyle='rgba(255,255,200,0.95)';
    this._drawRoundedRect(ctx,hw-10,-hh*0.2,8,6,1); ctx.fill();
    // Taillight (left/rear)
    ctx.fillStyle='rgba(220,30,30,0.9)';
    this._drawRoundedRect(ctx,-hw+2,-hh*0.2,9,6,1); ctx.fill();
    // Body outline
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1;
    this._drawRoundedRect(ctx,-hw,-hh,w,h,5); ctx.stroke();
  }

  _bodyMonsterTruck(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Suspension arms (drawn before body)
    ctx.strokeStyle='#555'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.35,hh); ctx.lineTo(-hw*0.35,hh+h*0.45); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( hw*0.35,hh); ctx.lineTo( hw*0.35,hh+h*0.45); ctx.stroke();
    // Axle bar
    ctx.fillStyle='#444';
    this._drawRoundedRect(ctx,-hw*0.45,hh+h*0.35,w*0.90,h*0.14,3); ctx.fill();
    // Body (sits high)
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,60)); grad.addColorStop(1,D(b,30));
    ctx.fillStyle=grad;
    this._drawRoundedRect(ctx,-hw*0.55,-hh,w*1.10,h*0.85,6); ctx.fill();
    // Cab on top
    ctx.fillStyle=L(b,25);
    this._drawRoundedRect(ctx,-hw*0.30,-hh-h*0.65,w*0.60,h*0.70,5); ctx.fill();
    // Windshield
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.25,-hh-h*0.62); ctx.lineTo(hw*0.25,-hh-h*0.62);
    ctx.lineTo(hw*0.22,-hh-h*0.02); ctx.lineTo(-hw*0.22,-hh-h*0.02);
    ctx.closePath(); ctx.fill();
    // Hood scoop
    ctx.fillStyle=D(a,10);
    ctx.beginPath(); ctx.ellipse(hw*0.15,-hh,w*0.22,h*0.22,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#1a1a1a';
    ctx.beginPath(); ctx.ellipse(hw*0.15,-hh,w*0.13,h*0.12,0,0,Math.PI*2); ctx.fill();
    // Exhaust stacks
    ctx.fillStyle='#888';
    this._drawRoundedRect(ctx,-hw*0.28,-hh-h*1.10,5,h*0.50,2); ctx.fill();
    this._drawRoundedRect(ctx,-hw*0.40,-hh-h*1.20,5,h*0.60,2); ctx.fill();
    // Headlights
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.52,-hh*0.15,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,200,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.52,-hh*0.15,4,0,Math.PI*2); ctx.fill();
    // Taillight
    ctx.fillStyle='rgba(220,30,30,0.9)';
    ctx.beginPath(); ctx.arc(-hw*0.52,-hh*0.15,6,0,Math.PI*2); ctx.fill();
  }

  _bodyRallyRacer(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Low wedge body
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw,hh);   ctx.lineTo(-hw*0.82,-hh*0.1);
    ctx.lineTo(-hw*0.30,-hh*0.55); ctx.lineTo(hw*0.55,-hh*0.60);
    ctx.lineTo(hw,    -hh*0.1);  ctx.lineTo(hw,hh);
    ctx.closePath(); ctx.fill();
    // Cab
    ctx.fillStyle=L(b,20);
    ctx.beginPath();
    ctx.moveTo(-hw*0.28,-hh*0.55); ctx.lineTo(-hw*0.25,-hh-h*0.60);
    ctx.lineTo( hw*0.38,-hh-h*0.62); ctx.lineTo(hw*0.40,-hh*0.55);
    ctx.closePath(); ctx.fill();
    // Windshield (raked)
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.20,-hh*0.50); ctx.lineTo(-hw*0.18,-hh-h*0.55);
    ctx.lineTo( hw*0.35,-hh-h*0.57); ctx.lineTo(hw*0.36,-hh*0.50);
    ctx.closePath(); ctx.fill();
    // Side stripe
    ctx.fillStyle=a; ctx.globalAlpha=0.7;
    this._drawRoundedRect(ctx,-hw,hh*0.35,w,h*0.22,2); ctx.fill();
    ctx.globalAlpha=1;
    // Spoiler (rear / left)
    ctx.fillStyle=D(b,20);
    ctx.fillRect(-hw,-hh*0.55,5,h*0.50);
    ctx.fillStyle=D(a,10);
    this._drawRoundedRect(ctx,-hw-8,-hh*0.65,w*0.15,h*0.14,2); ctx.fill();
    // Rally light bar on roof
    ctx.fillStyle='#222';
    this._drawRoundedRect(ctx,-hw*0.08,-hh-h*0.70,w*0.30,h*0.20,2); ctx.fill();
    for(let i=0;i<4;i++) {
      ctx.fillStyle='#ffcc00';
      ctx.beginPath(); ctx.arc(-hw*0.04+i*w*0.075,-hh-h*0.60,2.5,0,Math.PI*2); ctx.fill();
    }
    // Headlights
    ctx.fillStyle=L(a,70);
    ctx.beginPath(); ctx.arc(hw*0.96,-hh*0.25,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,200,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.96,-hh*0.25,3.5,0,Math.PI*2); ctx.fill();
    // Taillight
    ctx.fillStyle='rgba(220,30,30,0.9)';
    ctx.fillRect(-hw+2,-hh*0.30,3,h*0.55);
    // Dual exhausts
    ctx.fillStyle='#777';
    this._drawRoundedRect(ctx,hw*0.55,hh*0.70,w*0.16,h*0.14,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.55,hh*0.88,w*0.16,h*0.14,2); ctx.fill();
  }

  _bodyMuscleCar(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Long body with fastback
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,65)); grad.addColorStop(1,D(b,25));
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(-hw,hh);
    ctx.lineTo(-hw,-hh*0.1);
    ctx.lineTo(-hw*0.55,-hh*0.65);
    ctx.lineTo( hw*0.35,-hh*0.75);
    ctx.lineTo( hw,    -hh*0.1);
    ctx.lineTo( hw,    hh);
    ctx.closePath(); ctx.fill();
    // Long hood
    ctx.fillStyle=L(b,30);
    this._drawRoundedRect(ctx,hw*0.05,-hh,hw*0.94,h*0.50,3); ctx.fill();
    // Hood scoop
    ctx.fillStyle=D(b,15);
    ctx.beginPath(); ctx.ellipse(hw*0.45,-hh,w*0.20,h*0.22,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.ellipse(hw*0.45,-hh,w*0.12,h*0.12,0,0,Math.PI*2); ctx.fill();
    // Fastback cab
    ctx.fillStyle=L(b,18);
    ctx.beginPath();
    ctx.moveTo(-hw*0.55,-hh*0.65); ctx.lineTo(-hw*0.52,-hh-h*0.80);
    ctx.lineTo( hw*0.28,-hh-h*0.82); ctx.lineTo(hw*0.30,-hh*0.70);
    ctx.closePath(); ctx.fill();
    // Windshield
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.48,-hh*0.62); ctx.lineTo(-hw*0.45,-hh-h*0.72);
    ctx.lineTo( hw*0.26,-hh-h*0.76); ctx.lineTo(hw*0.26,-hh*0.65);
    ctx.closePath(); ctx.fill();
    // Classic stripe
    ctx.fillStyle=a; ctx.globalAlpha=0.6;
    this._drawRoundedRect(ctx,-hw,hh*0.25,w,h*0.24,1); ctx.fill();
    ctx.globalAlpha=1;
    // Quad headlights
    ctx.fillStyle=L(a,80);
    ctx.beginPath(); ctx.arc(hw*0.96,-hh*0.22,5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,200,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.96,-hh*0.22,2.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.96,hh*0.06,5,0,Math.PI*2); ctx.fill();
    // Taillight strip
    ctx.fillStyle='rgba(220,40,40,0.9)';
    ctx.fillRect(-hw+2,-hh*0.25,5,h*0.62);
    // Dual side exhaust
    ctx.fillStyle='#888';
    this._drawRoundedRect(ctx,hw*0.10,hh*0.70,w*0.18,h*0.15,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.10,hh*0.88,w*0.18,h*0.15,2); ctx.fill();
  }

  _bodyJeep4x4(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Very boxy body
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,55)); grad.addColorStop(1,D(b,25));
    ctx.fillStyle=grad;
    this._drawRoundedRect(ctx,-hw,-hh,w,h,3); ctx.fill();
    // Flat roof cab (nearly same width)
    ctx.fillStyle=L(b,20);
    this._drawRoundedRect(ctx,-hw*0.88,-hh-h*0.92,w*0.88,h*0.95,2); ctx.fill();
    // Windshield (vertical)
    ctx.fillStyle='rgba(160,220,255,0.45)';
    this._drawRoundedRect(ctx,-hw*0.72,-hh-h*0.86,w*0.72,h*0.88,2); ctx.fill();
    // Windshield divider
    ctx.strokeStyle=D(b,30); ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,-hh-h*0.86); ctx.lineTo(0,-hh); ctx.stroke();
    // Spare tyre on rear (left)
    ctx.fillStyle='#1a1a1a';
    ctx.beginPath(); ctx.arc(-hw*0.86,0,h*0.75,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#555'; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath(); ctx.arc(-hw*0.86,0,h*0.58,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#666';
    ctx.beginPath(); ctx.arc(-hw*0.86,0,h*0.26,0,Math.PI*2); ctx.fill();
    // Roof rack
    ctx.fillStyle=D(b,40);
    this._drawRoundedRect(ctx,-hw*0.82,-hh-h*0.96,w*0.82,h*0.12,2); ctx.fill();
    // Snorkel
    ctx.fillStyle='#555';
    ctx.fillRect(hw*0.72,-hh-h*1.30,5,h*1.20);
    // Headlights (round)
    ctx.fillStyle=L(a,70);
    ctx.beginPath(); ctx.arc(hw*0.80,-hh*0.18,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.80,-hh*0.18,4.5,0,Math.PI*2); ctx.fill();
    // Taillight
    ctx.fillStyle='rgba(220,30,30,0.9)';
    this._drawRoundedRect(ctx,-hw+2,-hh*0.35,9,h*0.42,1); ctx.fill();
    // Bull bar
    ctx.strokeStyle='#666'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.92,-hh); ctx.lineTo(hw*0.92,hh); ctx.stroke();
  }

  _bodySportsCoupe(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Ultra-low wedge
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,70)); grad.addColorStop(1,D(b,15));
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(-hw,hh);
    ctx.lineTo(-hw,-hh*0.05);
    ctx.lineTo(-hw*0.55,-hh*0.55);
    ctx.lineTo( hw*0.62,-hh*0.70);
    ctx.lineTo( hw*0.97,-hh*0.10);
    ctx.lineTo( hw,hh);
    ctx.closePath(); ctx.fill();
    // Sweeping canopy
    ctx.fillStyle=L(b,22);
    ctx.beginPath();
    ctx.moveTo(-hw*0.52,-hh*0.52); ctx.lineTo(-hw*0.45,-hh-h*0.78);
    ctx.lineTo( hw*0.45,-hh-h*0.80); ctx.lineTo(hw*0.50,-hh*0.55);
    ctx.closePath(); ctx.fill();
    // Windshield (very raked)
    ctx.fillStyle='rgba(160,220,255,0.55)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.42,-hh*0.50); ctx.lineTo(-hw*0.38,-hh-h*0.70);
    ctx.lineTo( hw*0.42,-hh-h*0.72); ctx.lineTo(hw*0.45,-hh*0.55);
    ctx.closePath(); ctx.fill();
    // Body shine
    ctx.fillStyle='rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.20,hh*0.05); ctx.lineTo(hw*0.92,-hh*0.22);
    ctx.lineTo(hw*0.92,hh*0.18);  ctx.lineTo(-hw*0.20,hh*0.40);
    ctx.closePath(); ctx.fill();
    // Side air intake
    ctx.fillStyle='#111';
    ctx.fillRect(hw*0.55,-hh*0.25,h*0.40,h*0.44);
    // Headlights (thin aggressive)
    ctx.fillStyle=L(a,80);
    ctx.beginPath();
    ctx.moveTo(hw*0.92,-hh*0.38); ctx.lineTo(hw,-hh*0.28);
    ctx.lineTo(hw,-hh*0.02);      ctx.lineTo(hw*0.92,-hh*0.08);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath();
    ctx.moveTo(hw*0.93,-hh*0.30); ctx.lineTo(hw*0.99,-hh*0.22);
    ctx.lineTo(hw*0.99,-hh*0.05); ctx.lineTo(hw*0.93,-hh*0.10);
    ctx.closePath(); ctx.fill();
    // Taillight strip (LED)
    ctx.fillStyle=a; ctx.globalAlpha=0.9;
    ctx.fillRect(-hw+2,-hh*0.38,3,h*0.48);
    ctx.globalAlpha=1;
    // Rear wing
    ctx.fillStyle=D(b,20);
    ctx.fillRect(-hw*0.88,-hh*0.60,3,h*0.50);
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,-hw*0.96,-hh*0.65,w*0.12,h*0.10,1); ctx.fill();
    // Dual exhausts
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.ellipse(hw*0.30,hh*0.92,5,3,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(hw*0.50,hh*0.92,5,3,0,0,Math.PI*2); ctx.fill();
  }

  _bodyDuneBuggy(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Roll cage tubes
    ctx.strokeStyle=D(b,10); ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.25,hh); ctx.lineTo(-hw*0.25,-hh-h*0.35); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( hw*0.25,hh); ctx.lineTo( hw*0.25,-hh-h*0.35); ctx.stroke();
    ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(-hw*0.25,-hh-h*0.35); ctx.lineTo(hw*0.25,-hh-h*0.35); ctx.stroke();
    // Diagonal braces
    ctx.lineWidth=3; ctx.strokeStyle=D(b,20);
    ctx.beginPath(); ctx.moveTo(-hw*0.25,-hh-h*0.35); ctx.lineTo(hw*0.25,hh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo( hw*0.25,-hh-h*0.35); ctx.lineTo(-hw*0.25,hh); ctx.stroke();
    // Low body pan
    ctx.fillStyle=b;
    this._drawRoundedRect(ctx,-hw*0.55,hh*0.30,w*1.10,h*0.55,3); ctx.fill();
    // Front nose
    ctx.fillStyle=L(b,20);
    ctx.beginPath();
    ctx.moveTo(hw*0.50,hh*0.30); ctx.lineTo(hw,hh*0.15);
    ctx.lineTo(hw,hh*0.70);      ctx.lineTo(hw*0.50,hh*0.75);
    ctx.closePath(); ctx.fill();
    // Exposed rear engine
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,-hw*0.55,-hh*0.30,w*0.28,h*0.76,2); ctx.fill();
    ctx.fillStyle=a; ctx.globalAlpha=0.5;
    this._drawRoundedRect(ctx,-hw*0.52,-hh*0.18,w*0.22,h*0.54,1); ctx.fill();
    ctx.globalAlpha=1;
    // Bucket seats
    ctx.fillStyle=D(b,20);
    this._drawRoundedRect(ctx,-hw*0.20,-hh*0.40,w*0.20,h*0.82,3); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.04,-hh*0.40,w*0.20,h*0.82,3); ctx.fill();
    // Steering wheel
    ctx.strokeStyle='#333'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(hw*0.22,-hh*0.10,9,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.13,-hh*0.10); ctx.lineTo(hw*0.31,-hh*0.10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.22,-hh*0.32); ctx.lineTo(hw*0.22,hh*0.12); ctx.stroke();
    // Headlight
    ctx.fillStyle=L(a,70);
    ctx.beginPath(); ctx.arc(hw*0.96,hh*0.30,7,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.96,hh*0.30,4,0,Math.PI*2); ctx.fill();
    // Flag
    ctx.strokeStyle='#888'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-hw*0.35,hh*0.15); ctx.lineTo(-hw*0.35,-hh-h*0.75); ctx.stroke();
    ctx.fillStyle=a;
    ctx.beginPath(); ctx.moveTo(-hw*0.35,-hh-h*0.75); ctx.lineTo(-hw*0.10,-hh-h*0.65); ctx.lineTo(-hw*0.35,-hh-h*0.55); ctx.fill();
    // Exhaust
    ctx.strokeStyle='#888'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(-hw*0.55,hh*0.10); ctx.quadraticCurveTo(-hw*0.80,hh*0.40,-hw,hh*0.65); ctx.stroke();
  }

  _bodyTank(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Hull
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw*0.92,-hh*0.10); ctx.lineTo(-hw*0.75,-hh);
    ctx.lineTo( hw*0.80,-hh);      ctx.lineTo( hw,    -hh*0.10);
    ctx.lineTo( hw,    hh);
    ctx.lineTo(-hw*0.92,hh);
    ctx.closePath(); ctx.fill();
    // Hull top shine
    ctx.fillStyle='rgba(255,255,255,0.12)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.75,-hh); ctx.lineTo(hw*0.80,-hh);
    ctx.lineTo(hw*0.72,-hh*0.55); ctx.lineTo(-hw*0.68,-hh*0.55);
    ctx.closePath(); ctx.fill();
    // Track (simulate with dark band)
    ctx.fillStyle=D(b,30); ctx.globalAlpha=0.9;
    this._drawRoundedRect(ctx,-hw*0.92,hh*0.25,w*1.84,h*0.55,4); ctx.fill();
    ctx.globalAlpha=1;
    // Road wheels (small circles on track)
    ctx.fillStyle='#333';
    for(let i=0;i<7;i++) {
      const wx = -hw*0.85 + i*w*0.27;
      ctx.beginPath(); ctx.arc(wx,hh*0.55,h*0.35,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#444'; ctx.beginPath(); ctx.arc(wx,hh*0.55,h*0.18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#333';
    }
    // Turret (ellipse)
    ctx.fillStyle=L(b,15);
    ctx.beginPath(); ctx.ellipse(hw*0.08,-hh*0.70,w*0.42,h*0.68,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(b,22);
    ctx.beginPath(); ctx.ellipse(hw*0.08,-hh*0.86,w*0.36,h*0.52,0,0,Math.PI*2); ctx.fill();
    // Hatch
    ctx.fillStyle=D(b,20);
    ctx.beginPath(); ctx.ellipse(hw*0.25,-hh*1.06,w*0.10,h*0.22,0,0,Math.PI*2); ctx.fill();
    // Cannon barrel (pointing right / forward)
    ctx.fillStyle=D(b,15);
    this._drawRoundedRect(ctx,hw*0.35,-hh*0.82,w*0.72,h*0.28,3); ctx.fill();
    ctx.fillStyle=D(b,30);
    this._drawRoundedRect(ctx,hw*0.35,-hh*0.72,w*0.68,h*0.14,2); ctx.fill();
    // Antenna
    ctx.strokeStyle='#888'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-hw*0.10,-hh*0.95); ctx.lineTo(-hw*0.12,-hh*1.50); ctx.stroke();
    // Headlight
    ctx.fillStyle=L(a,70);
    ctx.beginPath(); ctx.arc(-hw*0.70,-hh*0.18,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(-hw*0.70,-hh*0.18,3,0,Math.PI*2); ctx.fill();
  }

  _bodyPickupTruck(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Truck bed (open)
    ctx.fillStyle=D(b,15);
    this._drawRoundedRect(ctx,-hw,-hh,w*0.56,h,3); ctx.fill();
    ctx.fillStyle=D(b,40);
    this._drawRoundedRect(ctx,-hw+2,hh*0.25,w*0.52,h*0.65,1); ctx.fill();
    // Bed rails
    ctx.fillStyle=D(b,20);
    ctx.fillRect(-hw,-hh,4,h);
    ctx.fillRect(-hw*0.92+w*0.54,-hh,4,h);
    // Cab
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,55)); grad.addColorStop(1,D(b,20));
    ctx.fillStyle=grad;
    this._drawRoundedRect(ctx,hw*0.05,-hh,hw*0.94,h,5); ctx.fill();
    // Cab roof
    ctx.fillStyle=L(b,20);
    this._drawRoundedRect(ctx,hw*0.10,-hh-h*0.75,hw*0.84,h*0.80,4); ctx.fill();
    // Windshield
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(hw*0.14,-hh-h*0.70); ctx.lineTo(hw*0.90,-hh-h*0.70);
    ctx.lineTo(hw*0.90,-hh);         ctx.lineTo(hw*0.10,-hh);
    ctx.closePath(); ctx.fill();
    // Hood
    ctx.fillStyle=L(b,25);
    this._drawRoundedRect(ctx,hw*0.72,-hh,hw*0.28,h*0.62,2); ctx.fill();
    // Grille
    ctx.fillStyle='#111';
    ctx.fillRect(hw*0.90,-hh+h*0.08,hw*0.08,h*0.44);
    for(let i=0;i<3;i++) {
      ctx.strokeStyle='#333'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(hw*0.90,-hh+h*0.18+i*h*0.13); ctx.lineTo(hw*0.98,-hh+h*0.18+i*h*0.13); ctx.stroke();
    }
    // Headlights
    ctx.fillStyle=L(a,80);
    this._drawRoundedRect(ctx,hw*0.82,-hh+h*0.10,7,9,2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    this._drawRoundedRect(ctx,hw*0.83,-hh+h*0.12,4,5,1); ctx.fill();
    // Taillight
    ctx.fillStyle='rgba(220,30,30,0.9)';
    ctx.fillRect(-hw+4,-hh+h*0.05,4,h*0.35);
    // Tow hook
    ctx.strokeStyle='#888'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(-hw,-hh*0.10,4,0,Math.PI*2); ctx.stroke();
  }

  _bodyElectricCar(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Aerodynamic teardrop body
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,70)); grad.addColorStop(1,D(b,10));
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(-hw,hh);
    ctx.quadraticCurveTo(-hw,-hh*0.42,-hw*0.55,-hh*0.60);
    ctx.quadraticCurveTo(-hw*0.10,-hh*0.92,hw*0.55,-hh*0.90);
    ctx.quadraticCurveTo(hw*0.90,-hh*0.70,hw,-hh*0.15);
    ctx.lineTo(hw,hh);
    ctx.closePath(); ctx.fill();
    // Smooth canopy integrated
    ctx.fillStyle=L(b,22);
    ctx.beginPath();
    ctx.moveTo(-hw*0.48,-hh*0.58); ctx.quadraticCurveTo(-hw*0.38,-hh-h*0.65,hw*0.36,-hh-h*0.68);
    ctx.lineTo(hw*0.38,-hh*0.62); ctx.closePath(); ctx.fill();
    // Panoramic glass
    ctx.fillStyle='rgba(160,220,255,0.60)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.38,-hh*0.54); ctx.quadraticCurveTo(-hw*0.28,-hh-h*0.58,hw*0.32,-hh-h*0.60);
    ctx.lineTo(hw*0.34,-hh*0.58); ctx.closePath(); ctx.fill();
    // Body shine
    ctx.fillStyle='rgba(255,255,255,0.16)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.20,hh*0.20); ctx.lineTo(hw*0.90,-hh*0.22);
    ctx.lineTo(hw*0.90,hh*0.15);  ctx.lineTo(-hw*0.20,hh*0.52);
    ctx.closePath(); ctx.fill();
    // Charge port
    ctx.fillStyle=a; ctx.globalAlpha=0.8;
    ctx.beginPath(); ctx.arc(-hw*0.90,-hh*0.08,6,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,255,0.7)';
    ctx.beginPath(); ctx.arc(-hw*0.90,-hh*0.08,3,0,Math.PI*2); ctx.fill();
    // LED headlight strip
    ctx.fillStyle=L(a,80); ctx.globalAlpha=0.9;
    ctx.beginPath();
    ctx.moveTo(hw*0.88,-hh*0.38); ctx.lineTo(hw,-hh*0.26);
    ctx.lineTo(hw,-hh*0.02);      ctx.lineTo(hw*0.88,-hh*0.10);
    ctx.closePath(); ctx.fill();
    ctx.globalAlpha=1;
    // LED tail strip
    ctx.strokeStyle=a; ctx.lineWidth=3; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(-hw+2,-hh*0.38); ctx.lineTo(-hw+2,hh*0.52); ctx.stroke();
    ctx.globalAlpha=1;
    // Indicator dots
    ctx.fillStyle=a;
    for(let i=0;i<3;i++) {
      ctx.globalAlpha=0.7-i*0.2;
      ctx.beginPath(); ctx.arc(-hw*0.78+i*w*0.10,-hh*0.35,2,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha=1;
    // Aero underbody
    ctx.fillStyle=D(b,30);
    this._drawRoundedRect(ctx,-hw*0.88,hh*0.80,w*0.90,h*0.14,2); ctx.fill();
  }

  // ════════════════════════════════════════════════════════
  // BIKE BODIES
  // ════════════════════════════════════════════════════════

  _bodyDirtBike(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'dirt');
    // Tank (tall)
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw*0.25,hh);
    ctx.quadraticCurveTo(-hw*0.20,-hh*0.45, hw*0.05,-hh*0.75);
    ctx.quadraticCurveTo( hw*0.35,-hh*0.92,  hw*0.50,-hh*0.60);
    ctx.lineTo(hw*0.50,hh);
    ctx.closePath(); ctx.fill();
    // Seat tall narrow
    ctx.fillStyle=D(b,25);
    this._drawRoundedRect(ctx,-hw*0.44,-hh*0.35,w*0.22,h*1.35,4); ctx.fill();
    // Number plate
    ctx.fillStyle='white'; ctx.globalAlpha=0.9;
    this._drawRoundedRect(ctx,hw*0.42,-hh*0.48,w*0.16,h*0.50,2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle=b; ctx.font=`bold ${Math.max(7,h*0.35)}px Orbitron,monospace`; ctx.textAlign='center';
    ctx.fillText('7',hw*0.50,-hh*0.14);
    // Wide handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.25,-hh*0.85); ctx.lineTo(hw*0.80,-hh*0.85); ctx.stroke();
    ctx.strokeStyle='#666'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(hw*0.52,-hh*0.85); ctx.lineTo(hw*0.52,-hh*0.45); ctx.stroke();
    // Grips
    ctx.fillStyle='#222';
    this._drawRoundedRect(ctx,hw*0.25,-hh*0.92,w*0.08,h*0.14,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.72,-hh*0.92,w*0.08,h*0.14,2); ctx.fill();
    // Round headlight
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.78,-hh*0.38,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.78,-hh*0.38,6,0,Math.PI*2); ctx.fill();
    // Upswept exhaust
    ctx.strokeStyle='#888'; ctx.lineWidth=6; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.05,hh*0.55); ctx.quadraticCurveTo(-hw*0.20,hh*0.90,-hw*0.45,hh*0.72); ctx.stroke();
    ctx.fillStyle='#555';
    ctx.beginPath(); ctx.ellipse(-hw*0.47,hh*0.70,5,3,0.3,0,Math.PI*2); ctx.fill();
  }

  _bodyChopper(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Long stretched frame
    ctx.strokeStyle=D(b,10); ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.30,hh); ctx.lineTo(hw*0.50,-hh*0.20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*0.30,hh); ctx.lineTo(-hw*0.20,hh*0.60); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.50,-hh*0.20); ctx.lineTo(hw*0.55,hh*0.60); ctx.stroke();
    // Extended front fork (raked)
    ctx.strokeStyle='#888'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.50,-hh*0.20); ctx.lineTo(hw*0.90,-hh*0.95); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.55,hh*0.60); ctx.lineTo(hw*0.96,hh*0.80); ctx.stroke();
    // Ape hanger handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(hw*0.50,-hh*0.20); ctx.lineTo(hw*0.30,-hh*0.88); ctx.stroke();
    ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hw*0.18,-hh*0.88); ctx.lineTo(hw*0.60,-hh*0.88); ctx.stroke();
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.arc(hw*0.16,-hh*0.88,4,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hw*0.62,-hh*0.88,4,0,Math.PI*2); ctx.fill();
    // V-twin engine
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,hw*0.08,-hh*0.08,w*0.40,h,4); ctx.fill();
    ctx.fillStyle=b; ctx.globalAlpha=0.8;
    ctx.beginPath(); ctx.moveTo(hw*0.10,-hh*0.08); ctx.lineTo(hw*0.30,-hh*0.78); ctx.lineTo(hw*0.32,-hh*0.08); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hw*0.30,-hh*0.08); ctx.lineTo(hw*0.48,-hh*0.78); ctx.lineTo(hw*0.50,-hh*0.08); ctx.fill();
    ctx.globalAlpha=1;
    // Fuel tank (teardrop)
    ctx.fillStyle=b;
    ctx.beginPath(); ctx.ellipse(hw*0.28,-hh*0.22,w*0.25,h*0.32,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.ellipse(hw*0.28,-hh*0.30,w*0.18,h*0.18,0,0,Math.PI*2); ctx.fill();
    // Long low seat
    ctx.fillStyle=D(b,30);
    this._drawRoundedRect(ctx,-hw*0.30,-hh*0.62,w*0.42,h*0.55,5); ctx.fill();
    // Chrome exhaust
    ctx.strokeStyle='#bbb'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(hw*0.25,hh*0.70); ctx.quadraticCurveTo(-hw*0.10,hh*0.95,-hw*0.42,hh*0.72); ctx.stroke();
    ctx.fillStyle='#555';
    ctx.beginPath(); ctx.ellipse(-hw*0.44,hh*0.70,4,2.5,0.4,0,Math.PI*2); ctx.fill();
    // Headlight
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.86,hh*0.20,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.86,hh*0.20,6,0,Math.PI*2); ctx.fill();
  }

  _bodySportBike(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'sport');
    // Full fairing (upper)
    const grad=ctx.createLinearGradient(0,-hh,0,hh);
    grad.addColorStop(0,L(b,70)); grad.addColorStop(1,D(b,20));
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.moveTo(-hw*0.25,hh*0.62);
    ctx.quadraticCurveTo(hw*0.20,-hh*0.62,hw*0.55,-hh*0.30);
    ctx.lineTo(hw*0.55,hh);
    ctx.lineTo(-hw*0.25,hh);
    ctx.closePath(); ctx.fill();
    // Windscreen
    ctx.fillStyle='rgba(40,80,160,0.60)';
    ctx.beginPath();
    ctx.moveTo(hw*0.36,-hh*0.18); ctx.lineTo(hw*0.62,-hh*0.68);
    ctx.lineTo(hw*0.78,-hh*0.50); ctx.lineTo(hw*0.55,-hh*0.08);
    ctx.closePath(); ctx.fill();
    // Belly pan
    ctx.fillStyle=D(b,15);
    ctx.beginPath();
    ctx.moveTo(-hw*0.22,hh*0.65); ctx.quadraticCurveTo(hw*0.20,hh*0.90,hw*0.55,hh*0.90);
    ctx.lineTo(hw*0.55,hh);       ctx.lineTo(-hw*0.22,hh);
    ctx.closePath(); ctx.fill();
    // Seat hump
    ctx.fillStyle=D(b,20);
    ctx.beginPath(); ctx.ellipse(-hw*0.04,-hh*0.18,w*0.15,h*0.26,0,0,Math.PI*2); ctx.fill();
    // Pointed nose / front fairing
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(hw*0.52,-hh*0.32); ctx.lineTo(hw*0.84,-hh*0.45);
    ctx.lineTo(hw*0.90,hh*0.25);  ctx.lineTo(hw*0.55,hh*0.12);
    ctx.closePath(); ctx.fill();
    // Thin LED headlight
    ctx.fillStyle=L(a,70);
    ctx.beginPath();
    ctx.moveTo(hw*0.80,-hh*0.42); ctx.lineTo(hw*0.92,-hh*0.38);
    ctx.lineTo(hw*0.92,-hh*0.18); ctx.lineTo(hw*0.80,-hh*0.20);
    ctx.closePath(); ctx.fill();
    // Clip-on bars
    ctx.strokeStyle='#888'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.58,-hh*0.68); ctx.lineTo(hw*0.74,-hh*0.72); ctx.stroke();
    // Number decal
    ctx.fillStyle='white'; ctx.globalAlpha=0.8;
    ctx.beginPath(); ctx.ellipse(-hw*0.01,-hh*0.04,w*0.10,h*0.22,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle=b; ctx.font=`bold ${Math.max(6,h*0.28)}px Orbitron,monospace`; ctx.textAlign='center';
    ctx.fillText('46',-hw*0.01,hh*0.02);
    // Taillight
    ctx.fillStyle=a; ctx.globalAlpha=0.9;
    ctx.fillRect(-hw*0.30,-hh*0.32,3,h*0.30);
    ctx.globalAlpha=1;
    // Exhaust (under engine)
    ctx.strokeStyle='#aaa'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.10,hh*0.62); ctx.quadraticCurveTo(-hw*0.10,hh*0.82,-hw*0.28,hh*0.82); ctx.stroke();
    ctx.fillStyle='#444';
    ctx.beginPath(); ctx.ellipse(-hw*0.30,hh*0.82,5,3,0,0,Math.PI*2); ctx.fill();
  }

  _bodyScrambler(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'upright');
    // Round tank (classic)
    ctx.fillStyle=b;
    ctx.beginPath(); ctx.ellipse(hw*0.12,-hh*0.10,w*0.26,h*0.44,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.2)';
    ctx.beginPath(); ctx.ellipse(hw*0.12,-hh*0.18,w*0.18,h*0.25,0,0,Math.PI*2); ctx.fill();
    // Flat padded seat
    ctx.fillStyle=D(b,25);
    this._drawRoundedRect(ctx,-hw*0.44,-hh*0.18,w*0.42,h*0.38,5); ctx.fill();
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,-hw*0.44,-hh*0.24,w*0.42,h*0.22,4); ctx.fill();
    // Engine block
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,hw*0.02,-hh*0.06,w*0.34,h*0.88,3); ctx.fill();
    ctx.fillStyle=a; ctx.globalAlpha=0.4;
    this._drawRoundedRect(ctx,hw*0.05,hh*0.04,w*0.28,h*0.62,2); ctx.fill();
    ctx.globalAlpha=1;
    // Upright handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.42,-hh*0.78); ctx.lineTo(hw*0.78,-hh*0.82); ctx.stroke();
    // Round headlight
    ctx.fillStyle='#222';
    ctx.beginPath(); ctx.arc(hw*0.80,-hh*0.40,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.80,-hh*0.40,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.80,-hh*0.40,5,0,Math.PI*2); ctx.fill();
    // Dual exhausts (upswept)
    ctx.strokeStyle='#aaa'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.62); ctx.quadraticCurveTo(-hw*0.18,hh*0.90,-hw*0.44,hh*0.78); ctx.stroke();
    ctx.strokeStyle='#999'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.78); ctx.quadraticCurveTo(-hw*0.18,hh*1.04,-hw*0.44,hh*0.92); ctx.stroke();
    // Front fender
    ctx.fillStyle=D(b,15);
    ctx.beginPath();
    ctx.arc(hw*0.76,hh*0.20,h*0.48,-Math.PI*0.90,-Math.PI*0.10);
    ctx.lineTo(hw*0.85,hh*0.20); ctx.closePath(); ctx.fill();
  }

  _bodyMiniMoto(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'compact');
    // Small round tank
    ctx.fillStyle=b;
    ctx.beginPath(); ctx.ellipse(hw*0.10,-hh*0.12,w*0.18,h*0.33,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.25)';
    ctx.beginPath(); ctx.ellipse(hw*0.10,-hh*0.22,w*0.12,h*0.18,0,0,Math.PI*2); ctx.fill();
    // Small seat
    ctx.fillStyle=D(b,25);
    this._drawRoundedRect(ctx,-hw*0.40,-hh*0.18,w*0.30,h*0.30,4); ctx.fill();
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,-hw*0.40,-hh*0.24,w*0.30,h*0.18,3); ctx.fill();
    // Tiny engine
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,hw*0.05,hh*0.08,w*0.24,h*0.66,2); ctx.fill();
    ctx.fillStyle=a; ctx.globalAlpha=0.45;
    this._drawRoundedRect(ctx,hw*0.08,hh*0.16,w*0.20,h*0.44,1); ctx.fill();
    ctx.globalAlpha=1;
    // Small handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=2.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.38,-hh*0.65); ctx.lineTo(hw*0.62,-hh*0.68); ctx.stroke();
    // Tiny headlight
    ctx.fillStyle='#222';
    ctx.beginPath(); ctx.arc(hw*0.70,-hh*0.30,8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.70,-hh*0.30,6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.70,-hh*0.30,3,0,Math.PI*2); ctx.fill();
    // Small exhaust
    ctx.strokeStyle='#999'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.62); ctx.quadraticCurveTo(-hw*0.14,hh*0.85,-hw*0.38,hh*0.72); ctx.stroke();
    ctx.fillStyle='#444';
    ctx.beginPath(); ctx.ellipse(-hw*0.40,hh*0.70,4,2.5,0.3,0,Math.PI*2); ctx.fill();
  }

  _bodyEnduroBike(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'dirt');
    // Side panniers
    ctx.fillStyle=D(b,20);
    this._drawRoundedRect(ctx,-hw*0.50,-hh*0.15,w*0.26,h,3); ctx.fill();
    ctx.fillStyle=D(b,10); ctx.globalAlpha=0.7;
    this._drawRoundedRect(ctx,-hw*0.48,-hh*0.08,w*0.22,h*0.88,2); ctx.fill();
    ctx.globalAlpha=1;
    // Tank (angular rally)
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw*0.20,hh);
    ctx.quadraticCurveTo(-hw*0.18,-hh*0.52,hw*0.10,-hh*0.80);
    ctx.quadraticCurveTo(hw*0.40,-hh*0.95,hw*0.50,-hh*0.60);
    ctx.lineTo(hw*0.50,hh);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.10,-hh*0.42); ctx.quadraticCurveTo(hw*0.10,-hh*0.72,hw*0.42,-hh*0.80);
    ctx.closePath(); ctx.fill();
    // Seat (tall)
    ctx.fillStyle=D(b,25);
    this._drawRoundedRect(ctx,-hw*0.44,-hh*0.45,w*0.16,h*1.45,4); ctx.fill();
    // Tall windscreen / beak
    ctx.fillStyle='rgba(160,220,255,0.50)';
    ctx.beginPath();
    ctx.moveTo(hw*0.42,-hh*0.55); ctx.lineTo(hw*0.52,-hh*0.92);
    ctx.lineTo(hw*0.66,-hh*0.80); ctx.lineTo(hw*0.58,-hh*0.45);
    ctx.closePath(); ctx.fill();
    // Rally headlight (square)
    ctx.fillStyle='#111';
    this._drawRoundedRect(ctx,hw*0.58,-hh*0.60,w*0.22,h*0.56,3); ctx.fill();
    ctx.fillStyle=L(a,60); ctx.globalAlpha=0.9;
    this._drawRoundedRect(ctx,hw*0.60,-hh*0.55,w*0.18,h*0.44,2); ctx.fill();
    ctx.globalAlpha=1;
    ctx.fillStyle='rgba(255,255,220,0.9)';
    this._drawRoundedRect(ctx,hw*0.63,-hh*0.50,w*0.10,h*0.25,1); ctx.fill();
    // Wide handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=3.5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.32,-hh*0.88); ctx.lineTo(hw*0.80,-hh*0.92); ctx.stroke();
    // High exhaust
    ctx.strokeStyle='#aaa'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.02,hh*0.55); ctx.quadraticCurveTo(-hw*0.22,hh*0.90,-hw*0.44,hh*0.78); ctx.stroke();
    ctx.fillStyle='#555';
    ctx.beginPath(); ctx.ellipse(-hw*0.46,hh*0.76,5,3,0.3,0,Math.PI*2); ctx.fill();
  }

  _bodyCafeRacer(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'upright');
    // Long elongated tank
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw*0.24,hh);
    ctx.quadraticCurveTo(-hw*0.20,-hh*0.62,hw*0.20,-hh*0.78);
    ctx.quadraticCurveTo(hw*0.46,-hh*0.90,hw*0.52,-hh*0.52);
    ctx.lineTo(hw*0.52,hh);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.20)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.15,-hh*0.52); ctx.quadraticCurveTo(hw*0.15,-hh*0.70,hw*0.44,-hh*0.70);
    ctx.closePath(); ctx.fill();
    // Pin stripe
    ctx.strokeStyle=a; ctx.lineWidth=1.5; ctx.globalAlpha=0.7;
    ctx.beginPath(); ctx.moveTo(-hw*0.14,-hh*0.30); ctx.quadraticCurveTo(hw*0.18,-hh*0.52,hw*0.50,-hh*0.42); ctx.stroke();
    ctx.globalAlpha=1;
    // Seat hump (signature cafe racer)
    ctx.fillStyle=D(b,20);
    ctx.beginPath();
    ctx.moveTo(-hw*0.46,-hh*0.22); ctx.quadraticCurveTo(-hw*0.38,-hh*0.62,-hw*0.20,-hh*0.62);
    ctx.quadraticCurveTo(-hw*0.12,-hh*0.62,-hw*0.12,-hh*0.22);
    ctx.quadraticCurveTo(-hw*0.12,hh*0.28,-hw*0.20,hh*0.28);
    ctx.quadraticCurveTo(-hw*0.38,hh*0.28,-hw*0.46,hh*0.10);
    ctx.closePath(); ctx.fill();
    // Low clip-on bars
    ctx.strokeStyle='#888'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.40,-hh*0.70); ctx.lineTo(hw*0.60,-hh*0.72); ctx.stroke();
    // Round headlight (classic)
    ctx.fillStyle='#1a1a1a';
    ctx.beginPath(); ctx.arc(hw*0.72,-hh*0.34,13,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.72,-hh*0.34,10,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.72,-hh*0.34,6,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#888'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(hw*0.72,-hh*0.34,12,0,Math.PI*2); ctx.stroke();
    // Classic wrapped exhaust
    ctx.strokeStyle='#bbb'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.10,hh*0.62); ctx.quadraticCurveTo(-hw*0.16,hh*0.88,-hw*0.36,hh*0.80); ctx.stroke();
    ctx.fillStyle='#555';
    ctx.beginPath(); ctx.ellipse(-hw*0.38,hh*0.78,4,2.5,0.3,0,Math.PI*2); ctx.fill();
    // Small taillight
    ctx.fillStyle='rgba(220,30,30,0.9)';
    this._drawRoundedRect(ctx,-hw*0.44,-hh*0.18,5,h*0.16,1); ctx.fill();
  }

  _bodyBMX(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Thick diamond frame tubes
    ctx.strokeStyle=b; ctx.lineWidth=6; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.18); ctx.lineTo(hw*0.26,-hh*0.36); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.18); ctx.lineTo(-hw*0.18,hh*0.80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.26,-hh*0.36); ctx.lineTo(hw*0.28,hh*0.80); ctx.stroke();
    ctx.strokeStyle=D(b,10); ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.22); ctx.lineTo(hw*0.26,hh*0.18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.18); ctx.lineTo(hw*0.28,hh*0.70); ctx.stroke();
    // Seat tube
    ctx.strokeStyle=b; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.02,-hh*0.36); ctx.lineTo(hw*0.02,hh*0.18); ctx.stroke();
    // Tiny saddle
    ctx.fillStyle='#222';
    ctx.beginPath(); ctx.ellipse(hw*0.02,-hh*0.42,w*0.08,h*0.10,0,0,Math.PI*2); ctx.fill();
    // Wide BMX handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=4; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.12,-hh*0.62); ctx.lineTo(hw*0.56,-hh*0.68); ctx.stroke();
    ctx.strokeStyle='#666'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(hw*0.28,-hh*0.62); ctx.lineTo(hw*0.26,-hh*0.36); ctx.stroke();
    // Crossbar
    ctx.strokeStyle='#666'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(hw*0.16,-hh*0.50); ctx.lineTo(hw*0.50,-hh*0.55); ctx.stroke();
    // Grips
    ctx.fillStyle='#222';
    this._drawRoundedRect(ctx,hw*0.10,-hh*0.72,w*0.08,h*0.18,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.48,-hh*0.76,w*0.08,h*0.18,2); ctx.fill();
    // Pegs (4)
    ctx.fillStyle='#aaa';
    this._drawRoundedRect(ctx,-hw*0.30,hh*0.74,w*0.12,h*0.18,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.18,hh*0.74,w*0.12,h*0.18,2); ctx.fill();
    this._drawRoundedRect(ctx,-hw*0.30,hh*0.14,w*0.12,h*0.18,2); ctx.fill();
    this._drawRoundedRect(ctx,hw*0.18,hh*0.14,w*0.12,h*0.18,2); ctx.fill();
    // Chain sprocket
    ctx.strokeStyle='#666'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(hw*0.04,hh*0.18,w*0.08,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#444';
    ctx.beginPath(); ctx.arc(hw*0.04,hh*0.18,w*0.04,0,Math.PI*2); ctx.fill();
    // Chain
    ctx.strokeStyle='#555'; ctx.lineWidth=2; ctx.setLineDash([3,2]);
    ctx.beginPath(); ctx.moveTo(hw*0.04,hh*0.18); ctx.lineTo(-hw*0.18,hh*0.80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.04,hh*0.18); ctx.lineTo(hw*0.28,hh*0.80); ctx.stroke();
    ctx.setLineDash([]);
  }

  _bodyCruiserBike(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    // Long low frame
    ctx.strokeStyle=D(b,10); ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.30,hh*0.26); ctx.lineTo(hw*0.55,-hh*0.20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*0.30,hh*0.26); ctx.lineTo(-hw*0.26,hh*0.80); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.55,-hh*0.20); ctx.lineTo(hw*0.58,hh*0.80); ctx.stroke();
    // Teardrop tank
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(hw*0.04,hh);
    ctx.quadraticCurveTo(hw*0.04,-hh*0.52,hw*0.40,-hh*0.55);
    ctx.quadraticCurveTo(hw*0.58,-hh*0.55,hw*0.58,-hh*0.20);
    ctx.lineTo(hw*0.58,hh);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.22)';
    ctx.beginPath();
    ctx.moveTo(hw*0.12,-hh*0.32); ctx.quadraticCurveTo(hw*0.28,-hh*0.48,hw*0.50,-hh*0.46);
    ctx.closePath(); ctx.fill();
    // V-twin engine
    ctx.fillStyle=D(b,10);
    this._drawRoundedRect(ctx,hw*0.08,hh*0.20,w*0.46,h*0.78,4); ctx.fill();
    ctx.fillStyle=b; ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.moveTo(hw*0.12,hh*0.20); ctx.lineTo(hw*0.24,-hh*0.42); ctx.lineTo(hw*0.26,hh*0.20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(hw*0.30,hh*0.20); ctx.lineTo(hw*0.44,-hh*0.42); ctx.lineTo(hw*0.46,hh*0.20); ctx.fill();
    ctx.globalAlpha=1;
    // Long seat
    ctx.fillStyle=D(b,30);
    this._drawRoundedRect(ctx,-hw*0.32,-hh*0.30,w*0.48,h*0.38,5); ctx.fill();
    ctx.fillStyle=D(b,12);
    this._drawRoundedRect(ctx,-hw*0.32,-hh*0.38,w*0.48,h*0.22,4); ctx.fill();
    // Large rear fender
    ctx.fillStyle=D(b,15);
    ctx.beginPath(); ctx.arc(-hw*0.26,hh*0.20,h*0.72,-Math.PI,-Math.PI*0.05); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='#ccc'; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.arc(-hw*0.26,hh*0.20,h*0.62,-Math.PI,-Math.PI*0.15); ctx.stroke();
    // Front fender
    ctx.fillStyle=D(b,15);
    ctx.beginPath(); ctx.arc(hw*0.58,hh*0.25,h*0.65,-Math.PI*0.92,-Math.PI*0.08); ctx.closePath(); ctx.fill();
    // Chrome exhausts (long)
    ctx.strokeStyle='#bbb'; ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(hw*0.36,hh*0.62); ctx.quadraticCurveTo(-hw*0.02,hh*0.90,-hw*0.30,hh*0.82); ctx.stroke();
    ctx.fillStyle='#555';
    ctx.beginPath(); ctx.ellipse(-hw*0.32,hh*0.80,5,3,0.4,0,Math.PI*2); ctx.fill();
    // Pullback bars
    ctx.strokeStyle='#aaa'; ctx.lineWidth=4;
    ctx.beginPath(); ctx.moveTo(hw*0.55,-hh*0.70); ctx.lineTo(hw*0.35,-hh*0.90); ctx.stroke();
    ctx.lineWidth=4.5;
    ctx.beginPath(); ctx.moveTo(hw*0.24,-hh*0.90); ctx.lineTo(hw*0.56,-hh*0.90); ctx.stroke();
    ctx.fillStyle='#333';
    ctx.beginPath(); ctx.arc(hw*0.22,-hh*0.90,5,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(hw*0.58,-hh*0.90,5,0,Math.PI*2); ctx.fill();
    // Round headlight
    ctx.fillStyle='#222';
    ctx.beginPath(); ctx.arc(hw*0.74,-hh*0.28,12,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60);
    ctx.beginPath(); ctx.arc(hw*0.74,-hh*0.28,9,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,255,220,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.74,-hh*0.28,5,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#aaa'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(hw*0.74,-hh*0.28,11,0,Math.PI*2); ctx.stroke();
  }

  _bodySupermoto(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    this._bikeFrame(ctx,w,h,b,a,'upright');
    // Trellis frame (visible triangles)
    ctx.strokeStyle=a; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(-hw*0.20,hh*0.30); ctx.lineTo(hw*0.48,-hh*0.22); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-hw*0.20,hh*0.30); ctx.lineTo(-hw*0.16,hh*0.82); ctx.stroke();
    ctx.strokeStyle=D(b,20); ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.30); ctx.lineTo(-hw*0.16,hh*0.82); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.30); ctx.lineTo(-hw*0.18,hh*0.30); ctx.stroke();
    // Small fairing/tank
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(-hw*0.18,hh*0.32);
    ctx.quadraticCurveTo(-hw*0.14,-hh*0.72,hw*0.28,-hh*0.78);
    ctx.quadraticCurveTo(hw*0.50,-hh*0.82,hw*0.50,-hh*0.22);
    ctx.lineTo(hw*0.50,hh*0.32);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.20)';
    ctx.beginPath();
    ctx.moveTo(-hw*0.06,-hh*0.58); ctx.quadraticCurveTo(hw*0.18,-hh*0.70,hw*0.42,-hh*0.66);
    ctx.closePath(); ctx.fill();
    // Compact seat
    ctx.fillStyle='#333';
    this._drawRoundedRect(ctx,-hw*0.38,-hh*0.25,w*0.16,h*0.44,4); ctx.fill();
    ctx.fillStyle='#444';
    this._drawRoundedRect(ctx,-hw*0.38,-hh*0.30,w*0.16,h*0.25,3); ctx.fill();
    // Number board
    ctx.fillStyle=a;
    this._drawRoundedRect(ctx,hw*0.54,-hh*0.12,w*0.24,h*0.56,2); ctx.fill();
    ctx.fillStyle=b; ctx.font=`bold ${Math.max(6,h*0.32)}px Orbitron,monospace`; ctx.textAlign='center';
    ctx.fillText('1',hw*0.66,hh*0.16);
    // Flat track handlebars
    ctx.strokeStyle='#888'; ctx.lineWidth=3; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(hw*0.38,-hh*0.72); ctx.lineTo(hw*0.72,-hh*0.78); ctx.stroke();
    // SM headlight (oval)
    ctx.fillStyle='#111';
    ctx.beginPath(); ctx.ellipse(hw*0.64,-hh*0.42,w*0.10,h*0.30,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=L(a,60); ctx.globalAlpha=0.9;
    ctx.beginPath(); ctx.ellipse(hw*0.64,-hh*0.42,w*0.07,h*0.20,0,0,Math.PI*2); ctx.fill();
    ctx.globalAlpha=1;
    // Upswept exhaust
    ctx.strokeStyle='#bbb'; ctx.lineWidth=5;
    ctx.beginPath(); ctx.moveTo(hw*0.08,hh*0.60); ctx.quadraticCurveTo(-hw*0.14,hh*0.90,-hw*0.30,hh*0.78); ctx.stroke();
    ctx.fillStyle='#444';
    ctx.beginPath(); ctx.ellipse(-hw*0.32,hh*0.75,4,2.5,0.4,0,Math.PI*2); ctx.fill();
    // Rear sprocket (visible)
    ctx.strokeStyle=a; ctx.lineWidth=2; ctx.setLineDash([4,2]);
    ctx.beginPath(); ctx.arc(-hw*0.16,hh*0.82,h*0.30,0,Math.PI*2); ctx.stroke();
    ctx.setLineDash([]);
  }

  // ── Shared bike frame skeleton ───────────────────────
  _bikeFrame(ctx, w, h, b, a, style) {
    const hw=w/2, hh=h/2;
    ctx.strokeStyle=D(b,10); ctx.lineCap='round';
    switch(style) {
      case 'dirt':
        ctx.lineWidth=5;
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh); ctx.lineTo(hw*0.48,-hh*0.62); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh); ctx.lineTo(-hw*0.18,hh*0.62); ctx.stroke();
        ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(-hw*0.18,hh*0.62); ctx.lineTo(hw*0.48,-hh*0.62); ctx.stroke();
        // Fork (long travel)
        ctx.strokeStyle='#777'; ctx.lineWidth=5;
        ctx.beginPath(); ctx.moveTo(hw*0.48,-hh*0.62); ctx.lineTo(hw*0.58,-hh*0.82); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hw*0.48,-hh*0.62); ctx.lineTo(hw*0.62,hh*0.78); ctx.stroke();
        break;
      case 'sport':
        ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.60); ctx.lineTo(hw*0.40,-hh*0.28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.60); ctx.lineTo(-hw*0.18,hh*0.82); ctx.stroke();
        ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(-hw*0.18,hh*0.62); ctx.lineTo(hw*0.40,-hh*0.28); ctx.stroke();
        ctx.strokeStyle='#777'; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(hw*0.40,-hh*0.28); ctx.lineTo(hw*0.52,-hh*0.68); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hw*0.40,-hh*0.28); ctx.lineTo(hw*0.52,hh*0.82); ctx.stroke();
        break;
      default: // upright / compact
        ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.18); ctx.lineTo(hw*0.44,-hh*0.25); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-hw*0.22,hh*0.18); ctx.lineTo(-hw*0.18,hh*0.80); ctx.stroke();
        ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(-hw*0.18,hh*0.50); ctx.lineTo(hw*0.44,-hh*0.25); ctx.stroke();
        ctx.strokeStyle='#777'; ctx.lineWidth=4;
        ctx.beginPath(); ctx.moveTo(hw*0.44,-hh*0.25); ctx.lineTo(hw*0.52,-hh*0.68); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(hw*0.44,-hh*0.25); ctx.lineTo(hw*0.54,hh*0.80); ctx.stroke();
    }
  }

  // ── Fallbacks ────────────────────────────────────────
  _bodyGenericCar(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    ctx.fillStyle=b;
    this._drawRoundedRect(ctx,-hw,-hh,w,h,7); ctx.fill();
    ctx.fillStyle=a;
    this._drawRoundedRect(ctx,-hw,hh*0.1,w,h*0.28,4); ctx.fill();
    ctx.fillStyle='rgba(160,220,255,0.55)';
    this._drawRoundedRect(ctx,-hw*0.2,-hh*0.95,w*0.55,h*0.75,5); ctx.fill();
    ctx.strokeStyle=a; ctx.lineWidth=1.5;
    this._drawRoundedRect(ctx,-hw*0.2,-hh*0.95,w*0.55,h*0.75,5); ctx.stroke();
    ctx.strokeStyle='rgba(0,0,0,0.35)'; ctx.lineWidth=1;
    this._drawRoundedRect(ctx,-hw,-hh,w,h,7); ctx.stroke();
    ctx.fillStyle='rgba(255,240,150,0.95)';
    ctx.beginPath(); ctx.arc(hw*0.48,hh*0.05,4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(255,50,50,0.9)';
    ctx.beginPath(); ctx.arc(-hw*0.48,hh*0.05,3,0,Math.PI*2); ctx.fill();
  }

  _bodyGenericBike(ctx, w, h, b, a) {
    const hw=w/2, hh=h/2;
    ctx.fillStyle=b;
    ctx.beginPath();
    ctx.moveTo(0,-hh*0.7); ctx.lineTo(hw*0.48,0); ctx.lineTo(0,hh*0.35); ctx.lineTo(-hw*0.48,0);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle=a; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(hw*0.25,-hh*0.5); ctx.lineTo(hw*0.4,-hh*0.2); ctx.stroke();
    ctx.fillStyle=a;
    this._drawRoundedRect(ctx,-hw*0.28,-hh*0.55,hw*0.32*2,hh*0.22*2,3); ctx.fill();
    ctx.strokeStyle='#aaa'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(hw*0.24,-hh*0.1); ctx.lineTo(hw*0.45,hh*0.38); ctx.stroke();
    ctx.fillStyle='rgba(255,240,150,0.9)';
    ctx.beginPath(); ctx.arc(hw*0.42,-hh*0.15,4,0,Math.PI*2); ctx.fill();
  }

  // ═══════════════════════════════════════════════════════
  // PICKUP ITEMS & BACKGROUNDS (unchanged from original)
  // ═══════════════════════════════════════════════════════

  _drawCoin(ctx, x, y) {
    ctx.save(); ctx.translate(x,y);
    const r=10;
    const grd=ctx.createRadialGradient(-4,-4,2,0,0,r);
    grd.addColorStop(0,'#fff9c4'); grd.addColorStop(0.4,'#ffe082'); grd.addColorStop(1,'#fbc02d');
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.7)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r-2,0,Math.PI*2); ctx.stroke();
    ctx.restore();
  }

  _drawFuel(ctx, x, y) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(-0.1);
    ctx.fillStyle='#ff7043';
    this._drawRoundedRect(ctx,-12,-18,24,30,4); ctx.fill();
    ctx.fillStyle='#ffccbc'; ctx.fillRect(-5,-22,10,6);
    ctx.strokeStyle='#ffffff'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-6,-6); ctx.lineTo(0,4); ctx.lineTo(6,-6); ctx.stroke();
    ctx.restore();
  }

  _drawBoost(ctx, x, y) {
    ctx.save(); ctx.translate(x,y); ctx.rotate(0.1);
    ctx.fillStyle='#40c4ff';
    this._drawRoundedRect(ctx,-10,-14,20,26,4); ctx.fill();
    ctx.strokeStyle='#e1f5fe'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(-6,4); ctx.lineTo(0,-6); ctx.lineTo(6,4); ctx.stroke();
    ctx.restore();
  }

  _drawFinishFlag(ctx, x, y) {
    ctx.save(); ctx.translate(x, y+80);
    ctx.fillStyle='#4e342e'; ctx.fillRect(-3,-80,6,80);
    const flagH=40, flagW=40;
    const offset=Math.sin(Date.now()/250)*3;
    ctx.translate(0,-70);
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.quadraticCurveTo(flagW*0.4,offset,flagW,6);
    ctx.lineTo(flagW,flagH); ctx.lineTo(0,flagH-2); ctx.closePath(); ctx.clip();
    for(let i=0;i<4;i++) for(let j=0;j<4;j++) {
      ctx.fillStyle=(i+j)%2===0?'#ffffff':'#000000';
      ctx.fillRect((flagW/4)*i,(flagH/4)*j,flagW/4,flagH/4);
    }
    ctx.restore();
  }

  // ═══════════════════════════════════════════════════════
  // BACKGROUND DRAWING (unchanged)
  // ═══════════════════════════════════════════════════════

  _drawBackground({ theme, cameraX }) {
    const ctx=this.ctx, w=this.width, h=this.height, t=Date.now()/1000;
    switch(theme) {
      case 'pastelFields': case 'pastelHills': case 'farm': case 'meadow': case 'plains': case 'orchard':
        this._sky(ctx,w,h,'#b8f0ff','#d4aaff','#a8e6c4');
        this._sun(ctx,w*0.82,h*0.12,38,'#fff9c4','#ffdd00');
        this._clouds(ctx,w,h,cameraX,0.06,[[0.10,0.12,80,30],[0.35,0.08,100,25],[0.65,0.18,70,22],[0.85,0.10,90,28]],'#ffffffcc');
        this._hillLayer(ctx,w,h,cameraX*0.15,h*0.68,70,1.4,'#6fcf97');
        this._hillLayer(ctx,w,h,cameraX*0.28,h*0.76,45,2.1,'#27ae60');
        break;
      case 'beach':
        this._sky(ctx,w,h,'#87ceeb','#c8e8f8','#f0d870');
        this._sun(ctx,w*0.75,h*0.10,42,'#fff9c4','#ffd700');
        this._clouds(ctx,w,h,cameraX,0.05,[[0.15,0.12,110,28],[0.55,0.09,85,22],[0.78,0.16,95,24]],'#ffffffbb');
        { const og=ctx.createLinearGradient(0,h*0.54,0,h*0.72); og.addColorStop(0,'#40c9e0'); og.addColorStop(1,'#1e7ab8'); ctx.fillStyle=og; ctx.fillRect(0,h*0.54,w,h*0.18); }
        this._hillLayer(ctx,w,h,cameraX*0.20,h*0.72,30,1.5,'#f5cba0');
        break;
      case 'cliffs':
        this._sky(ctx,w,h,'#87afd4','#b8d0e8','#6898b8');
        this._sun(ctx,w*0.80,h*0.13,35,'#fff9c4','#fbbf2e');
        this._clouds(ctx,w,h,cameraX,0.07,[[0.12,0.14,100,30],[0.50,0.10,80,25],[0.80,0.17,90,26]],'#ffffffcc');
        this._hillLayer(ctx,w,h,cameraX*0.12,h*0.58,90,0.8,'#5d7a8a');
        this._hillLayer(ctx,w,h,cameraX*0.22,h*0.70,55,1.3,'#4a6175');
        break;
      case 'lake':
        this._sky(ctx,w,h,'#6bb8e8','#a8d4f0','#80b8d8');
        this._sun(ctx,w*0.78,h*0.11,36,'#fff9c4','#ffd700');
        this._clouds(ctx,w,h,cameraX,0.05,[[0.10,0.11,95,26],[0.45,0.08,75,22],[0.72,0.15,85,24]],'#ffffffcc');
        { const lg=ctx.createLinearGradient(0,h*0.60,0,h*0.76); lg.addColorStop(0,'rgba(110,185,230,0.85)'); lg.addColorStop(1,'rgba(50,120,180,0.70)'); ctx.fillStyle=lg; ctx.fillRect(0,h*0.60,w,h*0.16); }
        this._hillLayer(ctx,w,h,cameraX*0.18,h*0.72,50,1.6,'#4e8a68');
        break;
      case 'forest': case 'jungle': case 'rainforest': {
        const j=theme!=='forest';
        this._sky(ctx,w,h,j?'#1a5c3a':'#2c7a4b',j?'#2e8b57':'#3a9a5e','#1a3d28');
        ctx.save(); ctx.globalAlpha=0.2; { const mg=ctx.createLinearGradient(0,h*0.5,0,h); mg.addColorStop(0,'transparent'); mg.addColorStop(1,'#a8d8a8'); ctx.fillStyle=mg; ctx.fillRect(0,0,w,h); } ctx.restore();
        this._treeSilhouette(ctx,w,h,cameraX,0.12,h*0.45,60,30,'#1a4a28',false);
        this._treeSilhouette(ctx,w,h,cameraX,0.22,h*0.55,50,25,'#0f3a1e',false);
        break; }
      case 'mountain':
        this._sky(ctx,w,h,'#4a6fa5','#7bb3d4','#c8dce8');
        this._sun(ctx,w*0.70,h*0.10,30,'#fff9c4','#ffd700');
        this._clouds(ctx,w,h,cameraX,0.08,[[0.20,0.12,100,30],[0.60,0.09,80,24],[0.85,0.16,90,26]],'#ffffffaa');
        this._mountainLayer(ctx,w,h,cameraX*0.10,h*0.50,130,0.6,'#8eaec4','#f5f5f5');
        this._mountainLayer(ctx,w,h,cameraX*0.20,h*0.64,90,0.9,'#6a8ea8',null);
        break;
      case 'desert':
        this._sky(ctx,w,h,'#f5a623','#ffd27f','#fff0b3');
        this._sun(ctx,w*0.85,h*0.09,48,'#fff9c4','#ff9900');
        ctx.save(); ctx.globalAlpha=0.07+Math.sin(t*3)*0.04; ctx.fillStyle='#ff8800'; ctx.fillRect(0,h*0.55,w,h*0.15); ctx.restore();
        this._hillLayer(ctx,w,h,cameraX*0.15,h*0.72,40,0.8,'#c79a60');
        this._hillLayer(ctx,w,h,cameraX*0.28,h*0.80,25,1.2,'#d4a96a');
        break;
      case 'snow':
        this._sky(ctx,w,h,'#b0c8e8','#d8e8f5','#eef4fb');
        this._sun(ctx,w*0.72,h*0.11,30,'#ffffffaa','#c8ddf0');
        this._clouds(ctx,w,h,cameraX,0.06,[[0.10,0.10,110,35],[0.45,0.08,90,30],[0.75,0.15,100,28]],'#fff');
        this._snowflakes(ctx,w,h,cameraX,t,60);
        this._mountainLayer(ctx,w,h,cameraX*0.10,h*0.55,110,0.7,'#d8ecf8','#ffffff');
        this._mountainLayer(ctx,w,h,cameraX*0.20,h*0.68,75,1.1,'#c0daf0',null);
        break;
      case 'arctic':
        this._sky(ctx,w,h,'#80b4d8','#b8d8f0','#ddeeff');
        ctx.save(); ctx.globalAlpha=0.16+Math.sin(t*0.8)*0.07; { const ag=ctx.createLinearGradient(0,0,w,h*0.5); ag.addColorStop(0,'#00ff88'); ag.addColorStop(0.5,'#00ccff'); ag.addColorStop(1,'#aa00ff'); ctx.fillStyle=ag; ctx.fillRect(0,0,w,h*0.5); } ctx.restore();
        this._snowflakes(ctx,w,h,cameraX,t,40);
        this._mountainLayer(ctx,w,h,cameraX*0.08,h*0.52,120,0.5,'#a8d0e8','#ffffff');
        break;
      case 'canyon':
        this._sky(ctx,w,h,'#e8a050','#c05020','#802000');
        this._sun(ctx,w*0.15,h*0.10,35,'#fff9c4','#ff6600');
        this._hillLayer(ctx,w,h,cameraX*0.10,h*0.42,120,0.5,'#8b4513');
        this._hillLayer(ctx,w,h,cameraX*0.18,h*0.58,80,0.7,'#a0522d');
        this._hillLayer(ctx,w,h,cameraX*0.28,h*0.72,50,1.0,'#cd853f');
        break;
      case 'volcano':
        this._sky(ctx,w,h,'#1a0500','#4d1200','#8b2500');
        { const lg=ctx.createLinearGradient(0,h*0.6,0,h); lg.addColorStop(0,'transparent'); lg.addColorStop(1,'rgba(255,60,0,0.55)'); ctx.fillStyle=lg; ctx.fillRect(0,0,w,h); }
        this._volcanoShape(ctx,w,h,cameraX*0.12,'#3a1000');
        this._ashParticles(ctx,w,h,cameraX,t,'#555555');
        break;
      case 'swamp':
        this._sky(ctx,w,h,'#2a3318','#3b4a20','#546230');
        ctx.save(); ctx.globalAlpha=0.18+Math.sin(t*0.5)*0.05; ctx.fillStyle='#8fba6e'; ctx.fillRect(0,h*0.45,w,h*0.55); ctx.restore();
        this._treeSilhouette(ctx,w,h,cameraX,0.14,h*0.48,50,12,'#1e2c10',true);
        this._treeSilhouette(ctx,w,h,cameraX,0.24,h*0.60,40,10,'#162209',true);
        break;
      case 'storm':
        this._sky(ctx,w,h,'#1a1e2a','#2c3040','#3e4555');
        { const flash=Math.pow(Math.max(0,Math.sin(t*0.7+1.5)),20); if(flash>0.1){ctx.save();ctx.globalAlpha=flash*0.4;ctx.fillStyle='#aaaaff';ctx.fillRect(0,0,w,h);ctx.restore();} }
        this._clouds(ctx,w,h,cameraX,0.09,[[0.05,0.05,200,60],[0.40,0.08,180,55],[0.70,0.04,160,50]],'#222530cc');
        this._hillLayer(ctx,w,h,cameraX*0.15,h*0.65,60,1.0,'#2c3040');
        break;
      case 'space': case 'asteroid':
        this._sky(ctx,w,h,'#020510','#04071a','#06091f');
        this._stars(ctx,w,h,cameraX,180,t);
        { const px=w*0.80-cameraX*0.01,py=h*0.18,pr=45; const pg=ctx.createRadialGradient(px-12,py-12,5,px,py,pr); const c1=theme==='space'?'#4060c0':'#806040'; const c2=theme==='space'?'#203080':'#604020'; pg.addColorStop(0,c1);pg.addColorStop(0.6,c2);pg.addColorStop(1,'#101010'); ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px,py,pr,0,Math.PI*2);ctx.fill(); if(theme==='asteroid'){ctx.save();ctx.strokeStyle='rgba(180,140,80,0.55)';ctx.lineWidth=8;ctx.beginPath();ctx.ellipse(px,py,pr*1.8,pr*0.35,0.15*Math.PI,0,Math.PI*2);ctx.stroke();ctx.restore();} }
        break;
      case 'moon':
        this._sky(ctx,w,h,'#030308','#050510','#0a0a18');
        this._stars(ctx,w,h,cameraX,220,t);
        { const ex=w*0.20-cameraX*0.008,ey=h*0.15,er=50; const eg=ctx.createRadialGradient(ex-14,ey-14,6,ex,ey,er); eg.addColorStop(0,'#4488ff');eg.addColorStop(0.4,'#2255cc');eg.addColorStop(1,'#0d2255'); ctx.fillStyle=eg;ctx.beginPath();ctx.arc(ex,ey,er,0,Math.PI*2);ctx.fill(); }
        break;
      case 'cave': case 'nightmare':
        this._sky(ctx,w,h,'#050508','#0a0a10','#080810');
        ctx.save();ctx.globalAlpha=0.12+Math.sin(t*0.6)*0.04;ctx.fillStyle=theme==='nightmare'?'#800000':'#00004a';ctx.fillRect(0,0,w,h);ctx.restore();
        this._stalactites(ctx,w,h,cameraX,theme==='nightmare'?'#1a0000':'#0a0a1a');
        break;
      case 'underwater':
        this._sky(ctx,w,h,'#001a2e','#00304d','#00426a');
        ctx.save();ctx.globalAlpha=0.06+Math.sin(t*2)*0.03;
        for(let i=0;i<8;i++){const rx=((w*0.13*i-cameraX*0.03)%(w*1.1)+w*1.1)%(w*1.1)-w*0.05;ctx.fillStyle='#80e0ff';ctx.beginPath();ctx.moveTo(rx,0);ctx.lineTo(rx-20,h*0.65);ctx.lineTo(rx+20,h*0.65);ctx.closePath();ctx.fill();}
        ctx.restore();
        this._bubbles(ctx,w,h,cameraX,t);
        break;
      case 'lava':
        this._sky(ctx,w,h,'#100000','#300500','#600800');
        { const lg=ctx.createLinearGradient(0,h*0.5,0,h); lg.addColorStop(0,'transparent'); lg.addColorStop(1,'rgba(255,80,0,0.55)'); ctx.fillStyle=lg; ctx.fillRect(0,0,w,h); }
        this._volcanoShape(ctx,w,h,cameraX*0.14,'#1a0800');
        this._ashParticles(ctx,w,h,cameraX,t,'#ff4400');
        break;
      case 'inferno':
        this._sky(ctx,w,h,'#0a0000','#220400','#440800');
        { const ig=ctx.createLinearGradient(0,h*0.4,0,h); ig.addColorStop(0,'transparent'); ig.addColorStop(1,'rgba(255,30,0,0.65)'); ctx.fillStyle=ig; ctx.fillRect(0,0,w,h); }
        this._ashParticles(ctx,w,h,cameraX,t,'#ff3300');
        this._ashParticles(ctx,w,h,cameraX,t+Math.PI,'#ff8800');
        break;
      case 'chaos': case 'final':
        this._sky(ctx,w,h,'#08000f','#120520','#1e0830');
        this._stars(ctx,w,h,cameraX,100,t);
        ctx.save();ctx.globalAlpha=0.14+Math.sin(t*1.2)*0.07;{ const wg=ctx.createLinearGradient(0,0,w,h); wg.addColorStop(0,'#ff00ff');wg.addColorStop(0.5,'#0080ff');wg.addColorStop(1,'#ff4400'); ctx.fillStyle=wg;ctx.fillRect(0,0,w,h); }ctx.restore();
        break;
      default:
        this._sky(ctx,w,h,'#5ee7df','#b490ca','#355c7d');
        this._sun(ctx,w*0.80,h*0.12,36,'#fff9c4','#ffd700');
        this._clouds(ctx,w,h,cameraX,0.06,[[0.15,0.12,90,26],[0.55,0.09,75,22],[0.80,0.16,85,24]],'#ffffffcc');
        this._hillLayer(ctx,w,h,cameraX*0.15,h*0.68,60,1.4,'#6fcf97');
    }
  }

  _sky(ctx,w,h,top,mid,bot){const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(0.55,mid);g.addColorStop(1,bot);ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}
  _sun(ctx,x,y,r,ic,oc){const glow=ctx.createRadialGradient(x,y,r*0.3,x,y,r*2.8);glow.addColorStop(0,oc+'66');glow.addColorStop(1,'transparent');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,r*2.8,0,Math.PI*2);ctx.fill();const disc=ctx.createRadialGradient(x-r*0.3,y-r*0.3,r*0.1,x,y,r);disc.addColorStop(0,ic);disc.addColorStop(1,oc);ctx.fillStyle=disc;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
  _stars(ctx,w,h,cameraX,count,t){ctx.save();for(let i=0;i<count;i++){const s=i*9973.3;const sx=(((s*0.137%1)*w*3-cameraX*0.02)%(w*3)+w*3)%(w*3)-w;const sy=(s*0.251%1)*h*0.88;const sr=0.7+(s*0.07%1)*1.5;ctx.globalAlpha=(0.4+Math.sin(t*(1+s*0.001)+s)*0.4)*0.95;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(sx,sy,sr,0,Math.PI*2);ctx.fill();}ctx.restore();}
  _clouds(ctx,w,h,cameraX,parallax,defs,color){ctx.save();ctx.fillStyle=color;for(const[xf,yf,cw,ch]of defs){const cx=(((xf*w*2-cameraX*parallax)%(w*1.6))+w*1.6)%(w*1.6)-w*0.1;const cy=h*yf;ctx.save();ctx.globalAlpha=0.85;ctx.beginPath();ctx.ellipse(cx,cy,cw*0.5,ch*0.5,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx-cw*0.30,cy+ch*0.15,cw*0.35,ch*0.40,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx+cw*0.32,cy+ch*0.18,cw*0.38,ch*0.42,0,0,Math.PI*2);ctx.fill();ctx.restore();}ctx.restore();}
  _hillLayer(ctx,w,h,offsetX,baseY,amplitude,freq,color){ctx.beginPath();for(let x=0;x<=w;x+=4){const ox=x+offsetX;const y=baseY-Math.abs(Math.sin(ox*0.008*freq)*amplitude+Math.sin(ox*0.013*freq+1.2)*amplitude*0.4);x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
  _mountainLayer(ctx,w,h,offsetX,baseY,amplitude,freq,color,snowColor){const pts=[];ctx.beginPath();for(let x=0;x<=w;x+=4){const ox=x+offsetX;const y=baseY-Math.abs(Math.sin(ox*0.005*freq)*amplitude+Math.cos(ox*0.009*freq+0.5)*amplitude*0.55);pts.push({x,y});x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=color;ctx.fill();if(snowColor){const threshold=baseY-amplitude*0.72;ctx.beginPath();let inSnow=false;for(const{x,y}of pts){if(y<threshold){if(!inSnow){ctx.moveTo(x,threshold);inSnow=true;}ctx.lineTo(x,y);}else if(inSnow){ctx.lineTo(x,threshold);inSnow=false;}}ctx.fillStyle=snowColor+'cc';ctx.fill();}}
  _treeSilhouette(ctx,w,h,cameraX,parallax,baseY,treeH,treeW,color,dead){ctx.fillStyle=color;const offset=cameraX*parallax;const spacing=treeW*2.6;const count=Math.ceil(w/spacing)+5;for(let i=0;i<count;i++){const tx=((i*spacing*1.35-offset)%(w*1.6)+w*1.6)%(w*1.6)-w*0.1;if(dead){ctx.fillRect(tx-treeW*0.1,baseY-treeH,treeW*0.2,treeH);ctx.fillRect(tx-treeW*0.4,baseY-treeH*0.7,treeW*0.8,treeW*0.15);ctx.fillRect(tx-treeW*0.25,baseY-treeH*0.45,treeW*0.5,treeW*0.12);}else{ctx.beginPath();ctx.moveTo(tx,baseY-treeH);ctx.lineTo(tx-treeW*0.55,baseY);ctx.lineTo(tx+treeW*0.55,baseY);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(tx,baseY-treeH*1.25);ctx.lineTo(tx-treeW*0.4,baseY-treeH*0.35);ctx.lineTo(tx+treeW*0.4,baseY-treeH*0.35);ctx.closePath();ctx.fill();}}}
  _volcanoShape(ctx,w,h,offsetX,color){const vx=((w*0.70-offsetX)%(w*1.5)+w*1.5)%(w*1.5);ctx.beginPath();ctx.moveTo(vx-w*0.36,h);ctx.lineTo(vx-28,h*0.30);ctx.lineTo(vx+28,h*0.30);ctx.lineTo(vx+w*0.36,h);ctx.closePath();ctx.fillStyle=color;ctx.fill();}
  _stalactites(ctx,w,h,cameraX,color){ctx.fillStyle=color;const offset=cameraX*0.25;const count=Math.ceil(w/60)+4;for(let i=0;i<count;i++){const sx=((i*72+(i%3)*18-offset)%(w*1.5)+w*1.5)%(w*1.5)-20;const sh=40+(i*37%62);ctx.beginPath();ctx.moveTo(sx-18,0);ctx.lineTo(sx+18,0);ctx.lineTo(sx,sh);ctx.closePath();ctx.fill();}}
  _snowflakes(ctx,w,h,cameraX,t,count){ctx.save();for(let i=0;i<count;i++){const s=i*7919.1;const sx=(((s*0.23%1)*w*2-cameraX*0.04+t*(28+s*0.002%20))%(w*1.3)+w*1.3)%(w*1.3)-w*0.1;const sy=((s*0.17%1)*h+t*(18+s*0.001%30))%h;ctx.globalAlpha=0.35+(s*0.1%1)*0.5;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(sx,sy,1+(s*0.05%1)*2,0,Math.PI*2);ctx.fill();}ctx.restore();}
  _ashParticles(ctx,w,h,cameraX,t,color){ctx.save();ctx.fillStyle=color;for(let i=0;i<35;i++){const s=i*6547.3;const ax=(((s*0.31%1)*w*1.5-cameraX*0.05+t*(14+s*0.001%24))%(w*1.4)+w*1.4)%(w*1.4)-w*0.15;const ay=h-((s*0.19%1)*h*0.8+t*(22+s*0.002%38))%h;ctx.globalAlpha=0.2+(s*0.07%1)*0.5;ctx.beginPath();ctx.arc(ax,ay,1.5+(s*0.04%1)*2.5,0,Math.PI*2);ctx.fill();}ctx.restore();}
  _bubbles(ctx,w,h,cameraX,t){ctx.save();for(let i=0;i<22;i++){const s=i*8431.7;const bx=(s*0.25%1)*w;const by=h-((s*0.13%1)*h*0.9+t*(28+s*0.002%48))%h;ctx.globalAlpha=0.25+(s*0.08%1)*0.3;ctx.strokeStyle='#80e0ff';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx,by,2+(s*0.06%1)*5,0,Math.PI*2);ctx.stroke();}ctx.restore();}
}