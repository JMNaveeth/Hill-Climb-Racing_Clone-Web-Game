
export const vehicles = [
  {
    id:"rusty_hatchback", name:"Rusty Hatchback", type:"car",
    stats:{speed:5,acceleration:5,fuelEfficiency:5,grip:5,traction:5,torque:0.030,fuelCapacity:100},
    cost:0, defaultUnlocked:true,
    bodyWidth:110, bodyHeight:35, wheelBase:75, wheelRadius:16, wheelYOffset:18, suspensionLength:26,
    physics:{density:0.004},
    palette:{body:"#c8914a",accent:"#7a3b2e"}
  },
  {
    id:"monster_truck", name:"Monster Truck", type:"car",
    stats:{speed:3,acceleration:4,fuelEfficiency:4,grip:9,traction:9,torque:0.050,fuelCapacity:80},
    cost:500, defaultUnlocked:true,
    bodyWidth:104, bodyHeight:30, wheelBase:96, wheelRadius:26, wheelYOffset:30, suspensionLength:38,
    physics:{density:0.007},
    palette:{body:"#2e6fd4",accent:"#0a1a3a"}
  },
  {
    id:"rally_racer", name:"Rally Racer", type:"car",
    stats:{speed:8,acceleration:7,fuelEfficiency:4,grip:4,traction:4,torque:0.042,fuelCapacity:90},
    cost:900, defaultUnlocked:false,
    bodyWidth:115, bodyHeight:30, wheelBase:82, wheelRadius:17, wheelYOffset:16, suspensionLength:28,
    physics:{density:0.0038},
    palette:{body:"#e63030",accent:"#ff9900"}
  },
  {
    id:"muscle_car", name:"Muscle Car", type:"car",
    stats:{speed:9,acceleration:7,fuelEfficiency:3,grip:5,traction:5,torque:0.048,fuelCapacity:85},
    cost:1100, defaultUnlocked:false,
    bodyWidth:118, bodyHeight:32, wheelBase:88, wheelRadius:18, wheelYOffset:18, suspensionLength:27,
    physics:{density:0.0045},
    palette:{body:"#f79820",accent:"#a04000"}
  },
  {
    id:"jeep_4x4", name:"Jeep 4x4", type:"car",
    stats:{speed:5,acceleration:5,fuelEfficiency:5,grip:8,traction:8,torque:0.040,fuelCapacity:110},
    cost:1000, defaultUnlocked:false,
    bodyWidth:112, bodyHeight:38, wheelBase:80, wheelRadius:22, wheelYOffset:22, suspensionLength:34,
    physics:{density:0.005},
    palette:{body:"#2a8c6e",accent:"#0d3d2a"}
  },
  {
    id:"sports_coupe", name:"Sports Coupe", type:"car",
    stats:{speed:10,acceleration:8,fuelEfficiency:3,grip:5,traction:4,torque:0.046,fuelCapacity:80},
    cost:1300, defaultUnlocked:false,
    bodyWidth:120, bodyHeight:28, wheelBase:88, wheelRadius:16, wheelYOffset:14, suspensionLength:24,
    physics:{density:0.0035},
    palette:{body:"#00aaee",accent:"#003388"}
  },
  {
    id:"dune_buggy", name:"Dune Buggy", type:"car",
    stats:{speed:7,acceleration:9,fuelEfficiency:6,grip:7,traction:7,torque:0.044,fuelCapacity:90},
    cost:1200, defaultUnlocked:false,
    bodyWidth:100, bodyHeight:28, wheelBase:78, wheelRadius:22, wheelYOffset:20, suspensionLength:32,
    physics:{density:0.004},
    palette:{body:"#e8c030",accent:"#a06010"}
  },
  {
    id:"tank", name:"Tank", type:"car",
    stats:{speed:3,acceleration:3,fuelEfficiency:2,grip:10,traction:10,torque:0.065,fuelCapacity:70},
    cost:2000, defaultUnlocked:false,
    bodyWidth:130, bodyHeight:38, wheelBase:90, wheelRadius:16, wheelYOffset:20, suspensionLength:24,
    physics:{density:0.010},
    palette:{body:"#5a7040",accent:"#283018"}
  },
  {
    id:"pickup_truck", name:"Pickup Truck", type:"car",
    stats:{speed:6,acceleration:6,fuelEfficiency:5,grip:7,traction:7,torque:0.038,fuelCapacity:110},
    cost:1000, defaultUnlocked:false,
    bodyWidth:116, bodyHeight:36, wheelBase:84, wheelRadius:18, wheelYOffset:20, suspensionLength:30,
    physics:{density:0.005},
    palette:{body:"#cc3344",accent:"#6a0010"}
  },
  {
    id:"electric_car", name:"Electric Car", type:"car",
    stats:{speed:8,acceleration:8,fuelEfficiency:10,grip:6,traction:6,torque:0.044,fuelCapacity:120},
    cost:1500, defaultUnlocked:false,
    bodyWidth:112, bodyHeight:30, wheelBase:82, wheelRadius:16, wheelYOffset:15, suspensionLength:25,
    physics:{density:0.0038},
    palette:{body:"#30c8cc",accent:"#1050aa"}
  },
  {
    id:"dirt_bike", name:"Dirt Bike", type:"bike",
    stats:{speed:7,acceleration:8,fuelEfficiency:7,grip:7,traction:6,torque:0.032,fuelCapacity:70},
    cost:0, defaultUnlocked:true,
    bodyWidth:70, bodyHeight:28, wheelBase:70, wheelRadius:18, wheelYOffset:18, suspensionLength:28,
    physics:{density:0.003},
    palette:{body:"#e87030",accent:"#c02010"}
  },
  {
    id:"chopper", name:"Chopper", type:"bike",
    stats:{speed:5,acceleration:4,fuelEfficiency:5,grip:6,traction:6,torque:0.028,fuelCapacity:90},
    cost:700, defaultUnlocked:false,
    bodyWidth:90, bodyHeight:26, wheelBase:90, wheelRadius:18, wheelYOffset:18, suspensionLength:24,
    physics:{density:0.0038},
    palette:{body:"#c01030",accent:"#1a0420"}
  },
  {
    id:"sport_bike", name:"Sport Bike", type:"bike",
    stats:{speed:10,acceleration:10,fuelEfficiency:5,grip:7,traction:6,torque:0.038,fuelCapacity:75},
    cost:1600, defaultUnlocked:false,
    bodyWidth:72, bodyHeight:26, wheelBase:72, wheelRadius:17, wheelYOffset:16, suspensionLength:26,
    physics:{density:0.003},
    palette:{body:"#1a30c0",accent:"#00cccc"}
  },
  {
    id:"scrambler", name:"Scrambler", type:"bike",
    stats:{speed:7,acceleration:7,fuelEfficiency:7,grip:7,traction:7,torque:0.030,fuelCapacity:80},
    cost:900, defaultUnlocked:false,
    bodyWidth:74, bodyHeight:28, wheelBase:72, wheelRadius:18, wheelYOffset:18, suspensionLength:28,
    physics:{density:0.003},
    palette:{body:"#28a060",accent:"#a0d030"}
  },
  {
    id:"mini_moto", name:"Mini Moto", type:"bike",
    stats:{speed:6,acceleration:8,fuelEfficiency:8,grip:6,traction:6,torque:0.026,fuelCapacity:60},
    cost:600, defaultUnlocked:false,
    bodyWidth:60, bodyHeight:22, wheelBase:58, wheelRadius:14, wheelYOffset:14, suspensionLength:20,
    physics:{density:0.0028},
    palette:{body:"#7050d0",accent:"#c060ff"}
  },
  {
    id:"enduro_bike", name:"Enduro Bike", type:"bike",
    stats:{speed:7,acceleration:7,fuelEfficiency:9,grip:7,traction:7,torque:0.030,fuelCapacity:100},
    cost:1100, defaultUnlocked:false,
    bodyWidth:76, bodyHeight:28, wheelBase:74, wheelRadius:20, wheelYOffset:20, suspensionLength:32,
    physics:{density:0.003},
    palette:{body:"#e060a0",accent:"#ff9060"}
  },
  {
    id:"cafe_racer", name:"Cafe Racer", type:"bike",
    stats:{speed:8,acceleration:7,fuelEfficiency:6,grip:8,traction:7,torque:0.032,fuelCapacity:75},
    cost:1000, defaultUnlocked:false,
    bodyWidth:74, bodyHeight:26, wheelBase:72, wheelRadius:17, wheelYOffset:16, suspensionLength:25,
    physics:{density:0.0032},
    palette:{body:"#d4aa00",accent:"#3a5010"}
  },
  {
    id:"bmx", name:"BMX", type:"bike",
    stats:{speed:5,acceleration:8,fuelEfficiency:10,grip:6,traction:5,torque:0.022,fuelCapacity:60},
    cost:500, defaultUnlocked:false,
    bodyWidth:60, bodyHeight:22, wheelBase:56, wheelRadius:15, wheelYOffset:15, suspensionLength:20,
    physics:{density:0.0025},
    palette:{body:"#ff5588",accent:"#ffbb44"}
  },
  {
    id:"cruiser_bike", name:"Cruiser", type:"bike",
    stats:{speed:6,acceleration:5,fuelEfficiency:6,grip:8,traction:8,torque:0.028,fuelCapacity:90},
    cost:950, defaultUnlocked:false,
    bodyWidth:88, bodyHeight:26, wheelBase:86, wheelRadius:17, wheelYOffset:17, suspensionLength:24,
    physics:{density:0.0035},
    palette:{body:"#d0c040",accent:"#604000"}
  },
  {
    id:"supermoto", name:"Supermoto", type:"bike",
    stats:{speed:8,acceleration:8,fuelEfficiency:7,grip:8,traction:7,torque:0.034,fuelCapacity:75},
    cost:1300, defaultUnlocked:false,
    bodyWidth:72, bodyHeight:26, wheelBase:70, wheelRadius:17, wheelYOffset:16, suspensionLength:26,
    physics:{density:0.003},
    palette:{body:"#f0f0f0",accent:"#2040c0"}
  },
];

// ─── Per-vehicle unique SVG generators ───────────────────────────────────────

function L(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgb(${Math.min(255,r+a)},${Math.min(255,g+a)},${Math.min(255,b+a)})`}
function D(hex,a){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgb(${Math.max(0,r-a)},${Math.max(0,g-a)},${Math.max(0,b-a)})`}
function A(hex,op){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return `rgba(${r},${g},${b},${op})`}

function wheel(cx,cy,r,acc,id,i){
  const spokes=[0,51,102,153,204,255].map(a=>{
    const rad=a*Math.PI/180,x1=cx+Math.cos(rad)*r*0.18,y1=cy+Math.sin(rad)*r*0.18,x2=cx+Math.cos(rad)*r*0.58,y2=cy+Math.sin(rad)*r*0.58;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${acc}" stroke-width="1.8"/>`;
  }).join('');
  return `<circle cx="${cx}" cy="${cy}" r="${r+2}" fill="#181818"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#222" stroke="#333" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="${cx}" cy="${cy}" r="${r*0.64}" fill="#3a3a3a"/>
  ${spokes}
  <circle cx="${cx}" cy="${cy}" r="${r*0.18}" fill="${acc}"/>
  <ellipse cx="${cx-r*0.12}" cy="${cy-r*0.12}" rx="${r*0.2}" ry="${r*0.12}" fill="rgba(255,255,255,0.3)" transform="rotate(-30,${cx},${cy})"/>`;
}

function bigWheel(cx,cy,r,acc){
  // chunky off-road wheel
  const spokes=[0,40,80,120,160,200,240,280,320].map(a=>{
    const rad=a*Math.PI/180,x1=cx+Math.cos(rad)*r*0.25,y1=cy+Math.sin(rad)*r*0.25,x2=cx+Math.cos(rad)*r*0.7,y2=cy+Math.sin(rad)*r*0.7;
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${acc}" stroke-width="2.5"/>`;
  }).join('');
  return `<circle cx="${cx}" cy="${cy}" r="${r+4}" fill="#111"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#1a1a1a" stroke="#444" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="${cx}" cy="${cy}" r="${r*0.6}" fill="#444"/>
  ${spokes}
  <circle cx="${cx}" cy="${cy}" r="${r*0.2}" fill="${acc}"/>`;
}

function trackSegment(x,y,w,h,color){
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${color}"/>
  <line x1="${x+10}" y1="${y}" x2="${x+10}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+20}" y1="${y}" x2="${x+20}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+30}" y1="${y}" x2="${x+30}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+40}" y1="${y}" x2="${x+40}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+50}" y1="${y}" x2="${x+50}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+60}" y1="${y}" x2="${x+60}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+70}" y1="${y}" x2="${x+70}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>
  <line x1="${x+80}" y1="${y}" x2="${x+80}" y2="${y+h}" stroke="rgba(0,0,0,0.4)" stroke-width="3"/>`;
}

// ──────────────────────────────────────────────────────────────────────────────
// CAR SVGs
// ──────────────────────────────────────────────────────────────────────────────

function svgRustyHatchback(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="200" height="110" viewBox="0 0 200 110" xmlns="http://www.w3.org/2000/svg">
  <!-- Boxy hatchback - tall roofline, square rear, short hood -->
  <defs>
    <linearGradient id="rh_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,50)}"/><stop offset="100%" stop-color="${D(b,30)}"/></linearGradient>
  </defs>
  <!-- body -->
  <rect x="30" y="55" width="148" height="32" rx="5" fill="url(#rh_b)"/>
  <!-- cab - tall and boxy -->
  <rect x="42" y="25" width="98" height="34" rx="4" fill="${L(b,20)}"/>
  <!-- windshield - almost vertical -->
  <polygon points="56,26 96,26 96,55 42,55" fill="rgba(160,220,255,0.45)"/>
  <!-- rear window - vertical -->
  <rect x="102" y="28" width="30" height="25" rx="2" fill="rgba(160,220,255,0.35)"/>
  <!-- roof rack detail -->
  <rect x="48" y="24" width="90" height="4" rx="2" fill="${D(b,50)}"/>
  <!-- rust spots -->
  <ellipse cx="45" cy="72" rx="5" ry="3" fill="${D(b,40)}" opacity="0.7"/>
  <ellipse cx="160" cy="60" rx="4" ry="2" fill="${D(b,40)}" opacity="0.7"/>
  <ellipse cx="80" cy="80" rx="3" ry="2" fill="${D(b,40)}" opacity="0.7"/>
  <!-- dent mark -->
  <path d="M50,65 Q55,60 60,65" stroke="${D(b,60)}" stroke-width="1.5" fill="none"/>
  <!-- door line -->
  <line x1="95" y1="55" x2="95" y2="87" stroke="${D(b,40)}" stroke-width="1" opacity="0.6"/>
  <!-- headlight (square) -->
  <rect x="168" y="60" width="14" height="9" rx="1" fill="${L(a,80)}" opacity="0.9"/>
  <rect x="170" y="62" width="8" height="5" rx="1" fill="rgba(255,255,200,0.9)"/>
  <!-- taillight (square, red) -->
  <rect x="30" y="60" width="11" height="9" rx="1" fill="rgba(220,30,30,0.85)"/>
  <!-- bumpers -->
  <rect x="28" y="80" width="8" height="7" rx="2" fill="${D(a,10)}"/>
  <rect x="172" y="78" width="10" height="8" rx="2" fill="${D(a,10)}"/>
  <!-- exhaust -->
  <rect x="35" y="84" width="12" height="4" rx="2" fill="#555"/>
  <ellipse cx="35" cy="86" rx="3" ry="2" fill="#222"/>
  ${wheel(58,88,16,a,'rh',0)}
  ${wheel(150,88,16,a,'rh',1)}
  </svg>`;
}

function svgMonsterTruck(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="200" height="120" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mt_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,60)}"/><stop offset="100%" stop-color="${D(b,30)}"/></linearGradient>
  </defs>
  <!-- Huge wheels with suspension, tiny cab on top -->
  <!-- Suspension arms -->
  <line x1="52" y1="70" x2="52" y2="50" stroke="#555" stroke-width="5" stroke-linecap="round"/>
  <line x1="148" y1="70" x2="148" y2="50" stroke="#555" stroke-width="5" stroke-linecap="round"/>
  <!-- Axle bars -->
  <rect x="45" y="48" width="110" height="6" rx="3" fill="#444"/>
  <!-- Body - sits high up -->
  <rect x="48" y="20" width="104" height="36" rx="6" fill="url(#mt_b)"/>
  <!-- Cab on top -->
  <rect x="60" y="8" width="80" height="18" rx="5" fill="${L(b,25)}"/>
  <!-- Windshield -->
  <polygon points="68,9 132,9 128,22 72,22" fill="rgba(160,220,255,0.5)"/>
  <!-- Scoop on hood -->
  <rect x="72" y="20" width="16" height="8" rx="2" fill="${D(a,10)}"/>
  <rect x="74" y="22" width="12" height="4" rx="1" fill="#1a1a1a"/>
  <!-- Exhaust stacks (x2 vertical) -->
  <rect x="62" y="5" width="6" height="16" rx="3" fill="#888"/>
  <rect x="72" y="3" width="6" height="18" rx="3" fill="#888"/>
  <!-- Headlights (round) -->
  <circle cx="148" cy="38" r="7" fill="${L(a,60)}"/>
  <circle cx="148" cy="38" r="4" fill="rgba(255,255,200,0.9)"/>
  <circle cx="136" cy="38" r="5" fill="${L(a,40)}"/>
  <!-- Taillights -->
  <circle cx="56" cy="38" r="6" fill="rgba(220,30,30,0.9)"/>
  <!-- Giant off-road wheels -->
  ${bigWheel(52,88,26,a)}
  ${bigWheel(148,88,26,a)}
  <!-- Mud flaps -->
  <rect x="22" y="82" width="6" height="14" rx="1" fill="#333"/>
  <rect x="172" y="82" width="6" height="14" rx="1" fill="#333"/>
  </svg>`;
}

function svgRallyRacer(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="210" height="105" viewBox="0 0 210 105" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rr_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,55)}"/><stop offset="100%" stop-color="${D(b,20)}"/></linearGradient>
  </defs>
  <!-- Very low, wide, sporty - wide arches, rear spoiler -->
  <!-- Body shell - wedge shape -->
  <polygon points="25,75 55,52 155,48 195,58 198,78 22,78" fill="url(#rr_b)"/>
  <!-- Cab -->
  <polygon points="70,53 72,32 145,30 150,48" fill="${L(b,20)}"/>
  <!-- Windshield (raked) -->
  <polygon points="78,33 140,31 142,48 73,50" fill="rgba(160,220,255,0.5)"/>
  <!-- Side stripe -->
  <polygon points="30,72 200,72 200,78 25,78" fill="${a}" opacity="0.7"/>
  <!-- Number plate on door -->
  <rect x="98" y="58" width="30" height="16" rx="2" fill="white" opacity="0.9"/>
  <text x="113" y="70" text-anchor="middle" font-size="9" font-weight="bold" fill="${b}" font-family="Orbitron,monospace">03</text>
  <!-- Rear spoiler -->
  <rect x="24" y="47" width="6" height="14" rx="1" fill="${D(b,20)}"/>
  <rect x="18" y="45" width="20" height="4" rx="2" fill="${D(a,10)}"/>
  <!-- Rally lights bar on roof -->
  <rect x="88" y="29" width="40" height="6" rx="2" fill="#222"/>
  <circle cx="96" cy="32" r="2.5" fill="#ffcc00"/>
  <circle cx="105" cy="32" r="2.5" fill="#ffcc00"/>
  <circle cx="114" cy="32" r="2.5" fill="#ffcc00"/>
  <circle cx="123" cy="32" r="2.5" fill="#ffcc00"/>
  <!-- Headlights (round, 2) -->
  <circle cx="190" cy="63" r="6" fill="${L(a,70)}"/>
  <circle cx="190" cy="63" r="3.5" fill="rgba(255,255,200,0.9)"/>
  <circle cx="178" cy="63" r="5" fill="${L(a,40)}"/>
  <!-- Taillights (strip) -->
  <rect x="24" y="61" width="3" height="14" fill="rgba(220,30,30,0.9)"/>
  <!-- Wide wheel arches -->
  <ellipse cx="72" cy="78" rx="22" ry="6" fill="${D(b,50)}" opacity="0.5"/>
  <ellipse cx="158" cy="78" rx="22" ry="6" fill="${D(b,50)}" opacity="0.5"/>
  <!-- Dual exhaust -->
  <rect x="195" y="73" width="14" height="4" rx="2" fill="#777"/>
  <rect x="195" y="79" width="14" height="4" rx="2" fill="#777"/>
  ${wheel(72,83,17,a,'rr',0)}
  ${wheel(158,83,17,a,'rr',1)}
  </svg>`;
}

function svgMuscleCar(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="215" height="108" viewBox="0 0 215 108" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mc_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,65)}"/><stop offset="100%" stop-color="${D(b,25)}"/></linearGradient>
  </defs>
  <!-- Long hood, fastback roofline, short deck -->
  <!-- Long body -->
  <polygon points="15,80 30,62 80,55 130,48 195,55 210,65 210,82 15,82" fill="url(#mc_b)"/>
  <!-- Long hood (flat) -->
  <rect x="130" y="54" width="80" height="14" rx="3" fill="${L(b,30)}"/>
  <!-- Power hood scoop -->
  <ellipse cx="165" cy="54" rx="20" ry="6" fill="${D(b,15)}"/>
  <ellipse cx="165" cy="54" rx="12" ry="3" fill="#111"/>
  <!-- Fastback cab (sloping rear) -->
  <polygon points="80,56 83,30 148,28 152,48" fill="${L(b,18)}"/>
  <!-- Windshield (raked) -->
  <polygon points="90,31 145,29 148,47 83,50" fill="rgba(160,220,255,0.5)"/>
  <!-- Rear fastback slope -->
  <polygon points="30,62 82,56 80,80 16,80" fill="${L(b,8)}"/>
  <!-- Rear window (small, sloped) -->
  <polygon points="42,63 78,57 78,72 44,76" fill="rgba(160,220,255,0.35)"/>
  <!-- Stripe (classic muscle stripe) -->
  <polygon points="15,68 210,68 210,74 15,74" fill="${a}" opacity="0.6"/>
  <!-- Front grille -->
  <rect x="202" y="62" width="6" height="14" rx="1" fill="#111"/>
  <line x1="202" y1="66" x2="208" y2="66" stroke="#333" stroke-width="1"/>
  <line x1="202" y1="70" x2="208" y2="70" stroke="#333" stroke-width="1"/>
  <line x1="202" y1="74" x2="208" y2="74" stroke="#333" stroke-width="1"/>
  <!-- Headlights (round, quad) -->
  <circle cx="200" cy="62" r="5" fill="${L(a,80)}"/>
  <circle cx="200" cy="62" r="2.5" fill="rgba(255,255,220,0.9)"/>
  <circle cx="200" cy="71" r="5" fill="${L(a,60)}"/>
  <!-- Taillights -->
  <rect x="18" y="62" width="5" height="16" fill="rgba(220,40,40,0.9)"/>
  <!-- Dual side exhaust pipes -->
  <rect x="136" y="80" width="20" height="4" rx="2" fill="#888"/>
  <ellipse cx="135" cy="82" rx="3" ry="2" fill="#333"/>
  <rect x="136" y="85" width="20" height="4" rx="2" fill="#888"/>
  <ellipse cx="135" cy="87" rx="3" ry="2" fill="#333"/>
  ${wheel(62,85,18,a,'mc',0)}
  ${wheel(170,85,18,a,'mc',1)}
  </svg>`;
}

function svgJeep4x4(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="200" height="112" viewBox="0 0 200 112" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="jx_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,55)}"/><stop offset="100%" stop-color="${D(b,25)}"/></linearGradient>
  </defs>
  <!-- Boxy, upright, tall clearance, flat roof, spare tire on back -->
  <!-- Main body - very boxy -->
  <rect x="28" y="48" width="144" height="38" rx="3" fill="url(#jx_b)"/>
  <!-- Flat roof cab -->
  <rect x="38" y="20" width="124" height="32" rx="2" fill="${L(b,20)}"/>
  <!-- Windshield (nearly vertical) -->
  <rect x="50" y="22" width="96" height="28" rx="2" fill="rgba(160,220,255,0.45)"/>
  <!-- Windshield divider -->
  <line x1="100" y1="22" x2="100" y2="50" stroke="${D(b,30)}" stroke-width="2"/>
  <!-- Spare tire on back -->
  <circle cx="30" cy="65" r="16" fill="#1a1a1a"/>
  <circle cx="30" cy="65" r="11" fill="#333" stroke="#555" stroke-width="1.5" stroke-dasharray="4 3"/>
  <circle cx="30" cy="65" r="5" fill="#666"/>
  <!-- Snorkel on front-right -->
  <rect x="166" y="14" width="6" height="40" rx="3" fill="#555"/>
  <rect x="163" y="14" width="12" height="6" rx="3" fill="#444"/>
  <!-- Roof rack -->
  <rect x="44" y="19" width="116" height="4" rx="2" fill="${D(b,40)}"/>
  <line x1="66" y1="19" x2="66" y2="23" stroke="${D(b,50)}" stroke-width="1.5"/>
  <line x1="90" y1="19" x2="90" y2="23" stroke="${D(b,50)}" stroke-width="1.5"/>
  <line x1="114" y1="19" x2="114" y2="23" stroke="${D(b,50)}" stroke-width="1.5"/>
  <line x1="138" y1="19" x2="138" y2="23" stroke="${D(b,50)}" stroke-width="1.5"/>
  <!-- Headlights (round) -->
  <circle cx="166" cy="62" r="8" fill="${L(a,70)}"/>
  <circle cx="166" cy="62" r="4.5" fill="rgba(255,255,220,0.9)"/>
  <!-- Taillights (square) -->
  <rect x="20" y="58" width="10" height="12" rx="1" fill="rgba(220,30,30,0.9)"/>
  <!-- Door handle lines -->
  <line x1="70" y1="64" x2="100" y2="64" stroke="${D(b,40)}" stroke-width="1" opacity="0.7"/>
  <line x1="108" y1="64" x2="138" y2="64" stroke="${D(b,40)}" stroke-width="1" opacity="0.7"/>
  <!-- Front winch -->
  <rect x="170" y="75" width="8" height="8" rx="1" fill="#555"/>
  <!-- Bull bar -->
  <rect x="168" y="48" width="4" height="38" rx="2" fill="#666"/>
  ${bigWheel(65,90,22,a)}
  ${bigWheel(155,90,22,a)}
  </svg>`;
}

function svgSportsCoupe(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="215" height="100" viewBox="0 0 215 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sc_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,70)}"/><stop offset="100%" stop-color="${D(b,15)}"/></linearGradient>
    <linearGradient id="sc_shine" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.5)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
  </defs>
  <!-- Ultra-low supercar silhouette, huge greenhouse, aerodynamic -->
  <!-- Body - very low, sharp wedge -->
  <polygon points="12,80 28,68 60,58 150,52 205,60 213,72 213,82 12,82" fill="url(#sc_b)"/>
  <!-- Swooping canopy -->
  <path d="M72,59 Q90,35 148,33 Q162,33 168,50 L152,52 Q140,40 94,44 Q80,46 70,58 Z" fill="${L(b,22)}"/>
  <!-- Windshield (very raked) -->
  <path d="M80,59 Q96,40 148,37 L152,52 L72,59 Z" fill="rgba(160,220,255,0.55)"/>
  <!-- Rear window -->
  <polygon points="70,59 80,47 90,46 88,58" fill="rgba(160,220,255,0.4)"/>
  <!-- Shine on body -->
  <polygon points="30,70 205,63 205,68 30,76" fill="url(#sc_shine)" opacity="0.6"/>
  <!-- Side air intake -->
  <path d="M182,66 L194,64 L194,74 L182,74 Z" fill="#111"/>
  <rect x="182" y="67" width="12" height="2" fill="#333"/>
  <rect x="182" y="70" width="12" height="2" fill="#333"/>
  <!-- Door crease -->
  <line x1="70" y1="66" x2="185" y2="62" stroke="${L(b,40)}" stroke-width="1.5" opacity="0.8"/>
  <!-- Rear diffuser -->
  <rect x="15" y="73" width="14" height="10" rx="1" fill="#1a1a1a"/>
  <line x1="18" y1="73" x2="18" y2="83" stroke="#333" stroke-width="1"/>
  <line x1="22" y1="73" x2="22" y2="83" stroke="#333" stroke-width="1"/>
  <line x1="26" y1="73" x2="26" y2="83" stroke="#333" stroke-width="1"/>
  <!-- Headlights (thin, aggressive) -->
  <polygon points="205,62 213,65 213,70 205,67" fill="${L(a,80)}" opacity="0.95"/>
  <polygon points="205,63 212,65 212,68 205,66" fill="rgba(255,255,220,0.9)"/>
  <!-- Tail lights (LED strip) -->
  <rect x="15" y="62" width="3" height="10" fill="${a}" opacity="0.9"/>
  <!-- Lip spoiler front -->
  <rect x="205" y="79" width="9" height="4" rx="1" fill="${D(b,30)}"/>
  <!-- Rear wing small -->
  <rect x="18" y="56" width="3" height="10" rx="1" fill="${D(b,40)}"/>
  <rect x="12" y="54" width="16" height="3" rx="1" fill="${D(b,20)}"/>
  <!-- Exhaust (x2 center) -->
  <ellipse cx="110" cy="83" rx="5" ry="3" fill="#333"/>
  <ellipse cx="122" cy="83" rx="5" ry="3" fill="#333"/>
  ${wheel(70,82,16,a,'sp',0)}
  ${wheel(168,82,16,a,'sp',1)}
  </svg>`;
}

function svgDuneBuggy(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="195" height="108" viewBox="0 0 195 108" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="db_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,60)}"/><stop offset="100%" stop-color="${D(b,20)}"/></linearGradient>
  </defs>
  <!-- Open frame, tubular roll cage, exposed engine, no doors -->
  <!-- Roll cage tubes -->
  <line x1="68" y1="30" x2="68" y2="75" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="130" y1="30" x2="130" y2="75" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="68" y1="30" x2="130" y2="30" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <!-- Diagonal braces -->
  <line x1="68" y1="30" x2="130" y2="55" stroke="${D(b,20)}" stroke-width="3"/>
  <line x1="130" y1="30" x2="68" y2="55" stroke="${D(b,20)}" stroke-width="3"/>
  <!-- Low body pan -->
  <rect x="48" y="68" width="100" height="16" rx="3" fill="url(#db_b)"/>
  <!-- Front nose (fiberglass shell) -->
  <path d="M148,68 Q175,65 188,75 L188,80 L148,82 Z" fill="${L(b,20)}"/>
  <!-- Rear engine exposed -->
  <rect x="30" y="50" width="28" height="22" rx="2" fill="${D(b,10)}"/>
  <rect x="33" y="53" width="22" height="14" rx="1" fill="${a}" opacity="0.5"/>
  <!-- Engine fins -->
  <line x1="35" y1="53" x2="35" y2="67" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="39" y1="53" x2="39" y2="67" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="43" y1="53" x2="43" y2="67" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="47" y1="53" x2="47" y2="67" stroke="${D(b,40)}" stroke-width="1.5"/>
  <!-- Seats (bucket) -->
  <rect x="72" y="48" width="24" height="22" rx="3" fill="${D(b,20)}"/>
  <rect x="102" y="48" width="24" height="22" rx="3" fill="${D(b,20)}"/>
  <rect x="74" y="46" width="20" height="6" rx="2" fill="${D(b,10)}"/>
  <rect x="104" y="46" width="20" height="6" rx="2" fill="${D(b,10)}"/>
  <!-- Steering wheel -->
  <circle cx="132" cy="52" r="10" fill="none" stroke="#333" stroke-width="3"/>
  <line x1="122" y1="52" x2="142" y2="52" stroke="#333" stroke-width="2"/>
  <line x1="132" y1="42" x2="132" y2="62" stroke="#333" stroke-width="2"/>
  <!-- Headlights (round, on nose) -->
  <circle cx="185" cy="72" r="7" fill="${L(a,70)}"/>
  <circle cx="185" cy="72" r="4" fill="rgba(255,255,220,0.9)"/>
  <!-- Flag mount -->
  <line x1="55" y1="28" x2="55" y2="15" stroke="#888" stroke-width="2"/>
  <polygon points="55,15 70,18 55,22" fill="${a}"/>
  <!-- Exhaust (side, rear) -->
  <path d="M30,62 Q18,64 15,72" stroke="#888" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="15" cy="73" rx="4" ry="2.5" fill="#444"/>
  ${bigWheel(55,86,22,a)}
  ${bigWheel(155,86,22,a)}
  </svg>`;
}

function svgTank(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="215" height="105" viewBox="0 0 215 105" xmlns="http://www.w3.org/2000/svg">
  <!-- Tank - flat hull, tracks, turret, cannon -->
  <!-- Track (left) -->
  ${trackSegment(8,68,199,22,D(b,30))}
  <rect x="8" y="66" width="199" height="4" rx="2" fill="${D(b,40)}"/>
  <rect x="8" y="88" width="199" height="4" rx="2" fill="${D(b,40)}"/>
  <!-- Road wheels -->
  ${[28,54,80,106,132,158,184].map(x=>`<circle cx="${x}" cy="79" r="10" fill="#333" stroke="#555" stroke-width="1.5"/><circle cx="${x}" cy="79" r="5" fill="#444"/>`).join('')}
  <!-- Hull -->
  <polygon points="12,44 30,36 185,36 200,44 200,68 12,68" fill="${b}"/>
  <!-- Hull top shine -->
  <polygon points="30,36 185,36 182,42 33,42" fill="rgba(255,255,255,0.15)"/>
  <!-- Turret -->
  <ellipse cx="108" cy="36" rx="42" ry="18" fill="${L(b,15)}"/>
  <ellipse cx="108" cy="34" rx="36" ry="14" fill="${L(b,20)}"/>
  <!-- Hatch -->
  <ellipse cx="118" cy="30" rx="10" ry="6" fill="${D(b,20)}"/>
  <ellipse cx="118" cy="29" rx="7" ry="4" fill="${D(b,40)}"/>
  <!-- Periscope -->
  <rect x="100" y="22" width="5" height="10" rx="2" fill="#555"/>
  <rect x="99" y="22" width="7" height="3" rx="1" fill="#666"/>
  <!-- Cannon barrel -->
  <rect x="148" y="29" width="60" height="8" rx="3" fill="${D(b,15)}"/>
  <rect x="204" y="28" width="8" height="10" rx="2" fill="${D(b,30)}"/>
  <rect x="148" y="31" width="56" height="4" rx="2" fill="${D(b,30)}"/>
  <!-- Antenna -->
  <line x1="82" y1="22" x2="80" y2="5" stroke="#888" stroke-width="2"/>
  <!-- Machine gun -->
  <rect x="146" y="22" width="20" height="4" rx="2" fill="#555"/>
  <!-- Hull vents -->
  <rect x="40" y="50" width="20" height="6" rx="1" fill="${D(b,40)}"/>
  <line x1="43" y1="50" x2="43" y2="56" stroke="${D(b,50)}" stroke-width="1.5"/>
  <line x1="47" y1="50" x2="47" y2="56" stroke="${D(b,50)}" stroke-width="1.5"/>
  <line x1="51" y1="50" x2="51" y2="56" stroke="${D(b,50)}" stroke-width="1.5"/>
  <!-- Headlight -->
  <circle cx="30" cy="52" r="6" fill="${L(a,70)}"/>
  <circle cx="30" cy="52" r="3" fill="rgba(255,255,220,0.9)"/>
  </svg>`;
}

function svgPickupTruck(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="215" height="108" viewBox="0 0 215 108" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pt_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,55)}"/><stop offset="100%" stop-color="${D(b,20)}"/></linearGradient>
  </defs>
  <!-- Cab + open bed, high ride -->
  <!-- Truck bed (flat open) -->
  <rect x="22" y="52" width="90" height="32" rx="3" fill="${D(b,15)}"/>
  <!-- Bed floor -->
  <rect x="24" y="64" width="86" height="18" rx="1" fill="${D(b,40)}"/>
  <!-- Bed rails -->
  <rect x="22" y="52" width="4" height="32" rx="1" fill="${D(b,20)}"/>
  <rect x="108" y="52" width="4" height="32" rx="1" fill="${D(b,20)}"/>
  <!-- Tailgate -->
  <rect x="22" y="80" width="90" height="4" rx="1" fill="${D(b,10)}"/>
  <!-- Cab -->
  <rect x="112" y="48" width="90" height="36" rx="5" fill="url(#pt_b)"/>
  <!-- Cab roof -->
  <rect x="120" y="26" width="76" height="26" rx="4" fill="${L(b,20)}"/>
  <!-- Windshield -->
  <polygon points="128,27 192,27 194,48 120,48" fill="rgba(160,220,255,0.5)"/>
  <!-- Rear window (small) -->
  <rect x="122" y="30" width="18" height="16" rx="2" fill="rgba(160,220,255,0.35)"/>
  <!-- Hood -->
  <rect x="190" y="46" width="22" height="20" rx="2" fill="${L(b,25)}"/>
  <!-- Grille -->
  <rect x="206" y="48" width="6" height="14" rx="1" fill="#111"/>
  <line x1="206" y1="52" x2="212" y2="52" stroke="#333" stroke-width="1"/>
  <line x1="206" y1="56" x2="212" y2="56" stroke="#333" stroke-width="1"/>
  <line x1="206" y1="60" x2="212" y2="60" stroke="#333" stroke-width="1"/>
  <!-- Headlights -->
  <rect x="200" y="50" width="7" height="9" rx="2" fill="${L(a,80)}"/>
  <rect x="201" y="52" width="4" height="5" rx="1" fill="rgba(255,255,220,0.9)"/>
  <!-- Taillights (strip on bed) -->
  <rect x="24" y="54" width="4" height="10" fill="rgba(220,30,30,0.9)"/>
  <!-- Step bar -->
  <rect x="138" y="82" width="40" height="4" rx="2" fill="#555"/>
  <!-- Tow hook -->
  <rect x="14" y="76" width="10" height="8" rx="2" fill="#555"/>
  <circle cx="14" cy="80" r="4" fill="none" stroke="#888" stroke-width="2"/>
  <!-- Exhaust -->
  <rect x="106" y="82" width="10" height="4" rx="2" fill="#888"/>
  ${wheel(56,85,18,a,'pi',0)}
  ${wheel(170,85,18,a,'pi',1)}
  </svg>`;
}

function svgElectricCar(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="210" height="102" viewBox="0 0 210 102" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ec_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,70)}"/><stop offset="100%" stop-color="${D(b,10)}"/></linearGradient>
    <linearGradient id="ec_s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.55)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient>
  </defs>
  <!-- Aerodynamic teardrop, very smooth, no panel gaps -->
  <!-- Main body - smooth aero shape -->
  <path d="M25,80 Q22,65 38,56 Q68,42 110,40 Q150,40 178,50 Q200,58 205,70 Q208,80 205,82 L25,82 Z" fill="url(#ec_b)"/>
  <!-- Smooth canopy integrated with body -->
  <path d="M62,56 Q76,35 128,33 Q158,33 172,50 L165,52 Q152,38 126,38 Q80,38 68,57 Z" fill="${L(b,22)}"/>
  <!-- Panoramic glass (huge) -->
  <path d="M70,57 Q84,40 128,38 Q155,38 166,50 L162,52 L68,57 Z" fill="rgba(160,220,255,0.6)"/>
  <!-- Glass tint reflection -->
  <path d="M80,57 Q90,44 120,42 L125,44 Q96,46 82,58 Z" fill="rgba(255,255,255,0.2)"/>
  <!-- Body shine -->
  <path d="M40,60 Q110,48 175,54 Q178,58 175,60 Q110,54 40,65 Z" fill="url(#ec_s)" opacity="0.5"/>
  <!-- Flush charge port (glowing) -->
  <circle cx="26" cy="66" r="6" fill="${a}" opacity="0.8"/>
  <circle cx="26" cy="66" r="3" fill="rgba(255,255,255,0.7)"/>
  <!-- LED headlight strip -->
  <path d="M196,62 Q205,65 206,72 L200,73 Q200,68 195,66 Z" fill="${L(a,80)}" opacity="0.9"/>
  <!-- LED taillight strip -->
  <path d="M26,65 Q24,70 25,78" stroke="${a}" stroke-width="3" fill="none" opacity="0.9"/>
  <!-- Aero underbody (flat) -->
  <rect x="30" y="80" width="178" height="4" rx="2" fill="${D(b,30)}"/>
  <!-- No grille (electric) - smooth nose -->
  <path d="M200,67 Q207,70 207,76 L200,76 Z" fill="${D(b,15)}"/>
  <!-- Charging indicator dots -->
  <circle cx="36" cy="66" r="2" fill="${a}" opacity="0.7"/>
  <circle cx="43" cy="64" r="2" fill="${a}" opacity="0.5"/>
  <circle cx="50" cy="62" r="2" fill="${a}" opacity="0.3"/>
  ${wheel(72,83,16,a,'el',0)}
  ${wheel(164,83,16,a,'el',1)}
  </svg>`;
}

// ──────────────────────────────────────────────────────────────────────────────
// BIKE SVGs
// ──────────────────────────────────────────────────────────────────────────────

function svgDirtBike(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="180" height="115" viewBox="0 0 180 115" xmlns="http://www.w3.org/2000/svg">
  <!-- High seat, long travel suspension visible, knobbly tires, upright -->
  <!-- Rear suspension linkage -->
  <line x1="52" y1="60" x2="68" y2="88" stroke="#666" stroke-width="4" stroke-linecap="round"/>
  <line x1="68" y1="72" x2="58" y2="88" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <!-- Frame backbone -->
  <line x1="52" y1="38" x2="120" y2="52" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="52" y1="38" x2="62" y2="62" stroke="${D(b,10)}" stroke-width="4" stroke-linecap="round"/>
  <line x1="62" y1="62" x2="120" y2="52" stroke="${D(b,15)}" stroke-width="3"/>
  <!-- Swingarm -->
  <line x1="62" y1="62" x2="52" y2="88" stroke="${D(b,5)}" stroke-width="5" stroke-linecap="round"/>
  <!-- Front fork (long travel) -->
  <line x1="120" y1="52" x2="128" y2="20" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <line x1="120" y1="52" x2="134" y2="88" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <!-- Fork springs detail -->
  <rect x="126" y="22" width="4" height="20" rx="2" fill="#999"/>
  <line x1="126" y1="26" x2="130" y2="26" stroke="#bbb" stroke-width="1"/>
  <line x1="126" y1="30" x2="130" y2="30" stroke="#bbb" stroke-width="1"/>
  <line x1="126" y1="34" x2="130" y2="34" stroke="#bbb" stroke-width="1"/>
  <!-- Fuel tank / seat unit (tall) -->
  <path d="M52,36 Q58,22 78,20 Q90,20 100,26 Q115,32 120,50 L62,62 Z" fill="${b}"/>
  <!-- Tank shine -->
  <path d="M60,36 Q66,26 80,24 Q92,24 98,30 Z" fill="rgba(255,255,255,0.25)"/>
  <!-- Seat (tall, narrow) -->
  <rect x="48" y="36" width="16" height="28" rx="4" fill="${D(b,25)}"/>
  <!-- Number plate front -->
  <rect x="124" y="42" width="18" height="14" rx="2" fill="white" opacity="0.9"/>
  <text x="133" y="52" text-anchor="middle" font-size="7" font-weight="bold" fill="${b}" font-family="Orbitron,monospace">7</text>
  <!-- Handlebars (wide motocross) -->
  <line x1="110" y1="20" x2="148" y2="20" stroke="#888" stroke-width="4" stroke-linecap="round"/>
  <line x1="126" y1="20" x2="126" y2="28" stroke="#666" stroke-width="3" stroke-linecap="round"/>
  <!-- Hand grips -->
  <rect x="110" y="18" width="8" height="5" rx="2" fill="#222"/>
  <rect x="142" y="18" width="8" height="5" rx="2" fill="#222"/>
  <!-- Headlight (round) -->
  <circle cx="136" cy="44" r="10" fill="${L(a,60)}"/>
  <circle cx="136" cy="44" r="6" fill="rgba(255,255,220,0.9)"/>
  <!-- Exhaust (upswept) -->
  <path d="M80,62 Q70,70 60,80 Q50,88 45,85" stroke="#888" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="43" cy="84" rx="5" ry="3" fill="#555"/>
  <!-- Knobbly wheels (bigger tread pattern) -->
  ${bigWheel(52,92,22,a)}
  ${bigWheel(134,92,22,a)}
  </svg>`;
}

function svgChopper(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="200" height="105" viewBox="0 0 200 105" xmlns="http://www.w3.org/2000/svg">
  <!-- Very extended front fork at angle, ape hanger bars, low seat, long stretched frame -->
  <!-- Extended front fork (highly raked) -->
  <line x1="142" y1="48" x2="178" y2="12" stroke="#888" stroke-width="5" stroke-linecap="round"/>
  <line x1="148" y1="52" x2="184" y2="14" stroke="#aaa" stroke-width="3" stroke-linecap="round"/>
  <!-- Ape hanger handlebars (tall) -->
  <line x1="142" y1="48" x2="130" y2="20" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <line x1="130" y1="20" x2="160" y2="20" stroke="#888" stroke-width="4" stroke-linecap="round"/>
  <circle cx="128" cy="20" r="4" fill="#333"/>
  <circle cx="162" cy="20" r="4" fill="#333"/>
  <!-- Long frame backbone (stretched) -->
  <line x1="48" y1="66" x2="148" y2="52" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="48" y1="66" x2="58" y2="84" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="142" y1="56" x2="148" y2="80" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <!-- Engine (v-twin look) -->
  <rect x="90" y="55" width="40" height="28" rx="4" fill="${D(b,10)}"/>
  <polygon points="95,55 115,42 118,55" fill="${b}" opacity="0.8"/>
  <polygon points="115,55 132,42 135,55" fill="${b}" opacity="0.8"/>
  <!-- Engine fins -->
  <line x1="97" y1="45" x2="97" y2="55" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="101" y1="43" x2="101" y2="55" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="105" y1="42" x2="105" y2="55" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="109" y1="42" x2="109" y2="55" stroke="${D(b,40)}" stroke-width="1.5"/>
  <!-- Chrome cylinders -->
  <rect x="118" y="44" width="14" height="11" rx="2" fill="#bbb"/>
  <rect x="133" y="44" width="14" height="11" rx="2" fill="#aaa"/>
  <!-- Fuel tank (teardrop) -->
  <ellipse cx="112" cy="56" rx="25" ry="9" fill="${b}"/>
  <ellipse cx="112" cy="54" rx="18" ry="5" fill="rgba(255,255,255,0.2)"/>
  <!-- Low seat (long, stretched) -->
  <rect x="52" y="62" width="60" height="8" rx="4" fill="${D(b,30)}"/>
  <rect x="52" y="60" width="60" height="5" rx="3" fill="${D(b,15)}"/>
  <!-- Sissy bar -->
  <line x1="52" y1="60" x2="48" y2="40" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="48" y1="40" x2="56" y2="40" stroke="#888" stroke-width="2" stroke-linecap="round"/>
  <!-- Fat rear fender (big) -->
  <path d="M25,68 Q26,50 48,52 Q58,52 60,68 Z" fill="${D(b,15)}" opacity="0.8"/>
  <!-- Front fender (small) -->
  <path d="M160,80 Q162,70 168,68 Q174,70 172,80 Z" fill="${D(b,15)}" opacity="0.8"/>
  <!-- Side exhaust (long pipes) -->
  <path d="M128,80 Q115,84 100,84 Q70,84 50,82" stroke="#bbb" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M128,86 Q115,90 100,90 Q70,90 50,88" stroke="#999" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- Headlight (small teardrop) -->
  <ellipse cx="180" cy="18" rx="9" ry="7" fill="${L(a,70)}"/>
  <ellipse cx="180" cy="17" rx="5" ry="4" fill="rgba(255,255,220,0.9)"/>
  <!-- Taillight (small red) -->
  <circle cx="44" cy="62" r="4" fill="rgba(220,30,30,0.9)"/>
  <!-- Fat rear wheel, thin front -->
  ${wheel(48,86,20,a,'ch',0)}
  ${wheel(168,86,16,a,'ch',1)}
  </svg>`;
}

function svgSportBike(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="185" height="105" viewBox="0 0 185 105" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sb_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,65)}"/><stop offset="100%" stop-color="${D(b,15)}"/></linearGradient>
  </defs>
  <!-- Full fairing, crouched rider position, aggressive front -->
  <!-- Frame -->
  <line x1="62" y1="60" x2="118" y2="46" stroke="#444" stroke-width="4"/>
  <line x1="62" y1="60" x2="68" y2="82" stroke="#444" stroke-width="4"/>
  <!-- Front fork -->
  <line x1="118" y1="46" x2="126" y2="28" stroke="#888" stroke-width="4" stroke-linecap="round"/>
  <line x1="118" y1="46" x2="128" y2="82" stroke="#888" stroke-width="4" stroke-linecap="round"/>
  <!-- Swingarm -->
  <line x1="62" y1="62" x2="68" y2="82" stroke="#555" stroke-width="4"/>
  <!-- Full fairing (upper) -->
  <path d="M100,46 Q118,28 136,32 Q148,38 150,50 Q148,60 134,65 Q118,68 100,64 Z" fill="url(#sb_b)"/>
  <!-- Windscreen (tinted) -->
  <path d="M118,32 Q130,28 138,34 Q142,40 136,46 Q126,42 118,45 Z" fill="rgba(40,80,160,0.6)"/>
  <!-- Fairing side panel -->
  <path d="M62,58 Q80,44 120,44 Q130,44 136,50 Q134,64 120,66 Q80,68 62,68 Z" fill="${L(b,10)}" opacity="0.9"/>
  <!-- Tank/bodywork seam -->
  <line x1="70" y1="50" x2="120" y2="46" stroke="${D(b,20)}" stroke-width="1" opacity="0.7"/>
  <!-- Seat hump -->
  <ellipse cx="70" cy="54" rx="15" ry="7" fill="${D(b,20)}"/>
  <!-- Belly pan -->
  <path d="M68,68 Q95,74 128,74 L128,78 Q95,80 68,74 Z" fill="${D(b,15)}"/>
  <!-- Front nose (pointed) -->
  <path d="M134,50 Q148,48 156,56 Q154,64 140,66 Z" fill="${b}"/>
  <!-- Headlight (thin LED) -->
  <path d="M148,50 Q158,54 158,60 L152,60 Q152,57 145,55 Z" fill="${L(a,70)}"/>
  <!-- Taillight (LED) -->
  <rect x="58" y="53" width="3" height="8" fill="${a}" opacity="0.9"/>
  <!-- Clip-on handlebars (low, sporty) -->
  <line x1="120" y1="35" x2="130" y2="33" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <line x1="126" y1="28" x2="134" y2="33" stroke="#777" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Exhaust (under-engine) -->
  <path d="M90,68 Q75,74 70,80 Q66,84 62,84" stroke="#aaa" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="61" cy="84" rx="5" ry="3" fill="#444"/>
  <!-- Number decal -->
  <ellipse cx="104" cy="56" rx="10" ry="6" fill="white" opacity="0.8"/>
  <text x="104" y="59" text-anchor="middle" font-size="7" font-weight="bold" fill="${b}" font-family="Orbitron,monospace">46</text>
  ${wheel(68,86,18,a,'sp',0)}
  ${wheel(128,86,17,a,'sp',1)}
  </svg>`;
}

function svgScrambler(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="178" height="105" viewBox="0 0 178 105" xmlns="http://www.w3.org/2000/svg">
  <!-- Upright, round headlight, simple tubular frame, knobbly tires -->
  <!-- Simple frame -->
  <line x1="58" y1="56" x2="110" y2="46" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="58" y1="56" x2="60" y2="82" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="60" y1="70" x2="110" y2="56" stroke="${D(b,15)}" stroke-width="3"/>
  <line x1="110" y1="46" x2="116" y2="82" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <!-- Fork stays -->
  <line x1="110" y1="46" x2="114" y2="26" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <!-- Round tank (classic) -->
  <ellipse cx="90" cy="52" rx="26" ry="12" fill="${b}"/>
  <ellipse cx="90" cy="50" rx="18" ry="7" fill="rgba(255,255,255,0.2)"/>
  <!-- Seat (padded, flat) -->
  <rect x="54" y="48" width="40" height="10" rx="5" fill="${D(b,25)}"/>
  <rect x="54" y="46" width="40" height="6" rx="4" fill="${D(b,10)}"/>
  <!-- Engine (simple block) -->
  <rect x="76" y="56" width="34" height="24" rx="3" fill="${D(b,10)}"/>
  <rect x="79" y="59" width="28" height="16" rx="2" fill="${a}" opacity="0.4"/>
  <!-- Engine fins -->
  <line x1="80" y1="59" x2="80" y2="75" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="85" y1="59" x2="85" y2="75" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="90" y1="59" x2="90" y2="75" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="95" y1="59" x2="95" y2="75" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="100" y1="59" x2="100" y2="75" stroke="${D(b,40)}" stroke-width="1.5"/>
  <!-- Upright handlebars -->
  <line x1="106" y1="26" x2="130" y2="24" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <rect x="126" y="22" width="8" height="5" rx="2" fill="#222"/>
  <rect x="104" y="22" width="8" height="5" rx="2" fill="#222"/>
  <!-- Round headlight -->
  <circle cx="122" cy="44" r="12" fill="#222"/>
  <circle cx="122" cy="44" r="9" fill="${L(a,60)}"/>
  <circle cx="122" cy="44" r="5" fill="rgba(255,255,220,0.9)"/>
  <!-- Exhausts (dual, upswept) -->
  <path d="M86,78 Q75,82 65,88 Q57,92 52,90" stroke="#aaa" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="51" cy="90" rx="5" ry="3" fill="#444"/>
  <path d="M86,82 Q76,86 66,92 Q58,96 53,94" stroke="#999" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Mudguard (front) -->
  <path d="M108,68 Q116,62 124,68 Q120,76 114,76 Z" fill="${D(b,15)}"/>
  ${bigWheel(60,88,20,a)}
  ${bigWheel(116,88,20,a)}
  </svg>`;
}

function svgMiniMoto(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="155" height="90" viewBox="0 0 155 90" xmlns="http://www.w3.org/2000/svg">
  <!-- Very small, compact pitbike/mini moto, tiny wheels -->
  <!-- Compact frame -->
  <line x1="52" y1="52" x2="96" y2="44" stroke="${D(b,10)}" stroke-width="4" stroke-linecap="round"/>
  <line x1="52" y1="52" x2="54" y2="72" stroke="${D(b,10)}" stroke-width="4" stroke-linecap="round"/>
  <line x1="54" y1="62" x2="96" y2="52" stroke="${D(b,15)}" stroke-width="2.5"/>
  <line x1="96" y1="44" x2="100" y2="72" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <line x1="96" y1="44" x2="100" y2="28" stroke="#777" stroke-width="3" stroke-linecap="round"/>
  <!-- Small round tank -->
  <ellipse cx="80" cy="48" rx="18" ry="9" fill="${b}"/>
  <ellipse cx="80" cy="46" rx="12" ry="5" fill="rgba(255,255,255,0.25)"/>
  <!-- Small seat -->
  <rect x="48" y="44" width="30" height="8" rx="4" fill="${D(b,25)}"/>
  <rect x="48" y="43" width="30" height="5" rx="3" fill="${D(b,10)}"/>
  <!-- Tiny engine -->
  <rect x="68" y="52" width="24" height="18" rx="2" fill="${D(b,10)}"/>
  <rect x="70" y="54" width="20" height="12" rx="1" fill="${a}" opacity="0.45"/>
  <!-- Small handlebars -->
  <line x1="96" y1="28" x2="112" y2="26" stroke="#888" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="108" y="24" width="6" height="4" rx="2" fill="#222"/>
  <rect x="96" y="24" width="6" height="4" rx="2" fill="#222"/>
  <!-- Tiny headlight -->
  <circle cx="106" cy="38" r="8" fill="#222"/>
  <circle cx="106" cy="38" r="6" fill="${L(a,60)}"/>
  <circle cx="106" cy="38" r="3" fill="rgba(255,255,220,0.9)"/>
  <!-- Exhaust (small) -->
  <path d="M74,68 Q65,72 58,76 Q52,78 50,76" stroke="#999" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="49" cy="76" rx="4" ry="2.5" fill="#444"/>
  <!-- Small wheels (13px) -->
  ${wheel(54,76,14,a,'mm',0)}
  ${wheel(100,76,14,a,'mm',1)}
  </svg>`;
}

function svgEnduroBike(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="188" height="112" viewBox="0 0 188 112" xmlns="http://www.w3.org/2000/svg">
  <!-- Tall adventure bike, panniers on sides, high mudguard, rally style -->
  <!-- Frame -->
  <line x1="60" y1="58" x2="118" y2="46" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="60" y1="58" x2="62" y2="86" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="62" y1="72" x2="118" y2="58" stroke="${D(b,15)}" stroke-width="3"/>
  <line x1="118" y1="46" x2="124" y2="86" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <line x1="118" y1="46" x2="122" y2="18" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <!-- Side panniers -->
  <rect x="34" y="60" width="26" height="28" rx="3" fill="${D(b,20)}"/>
  <rect x="36" y="62" width="22" height="24" rx="2" fill="${D(b,10)}" opacity="0.7"/>
  <circle cx="57" cy="74" r="4" fill="#666"/>
  <rect x="148" y="60" width="24" height="28" rx="3" fill="${D(b,20)}"/>
  <rect x="150" y="62" width="20" height="24" rx="2" fill="${D(b,10)}" opacity="0.7"/>
  <circle cx="167" cy="74" r="4" fill="#666"/>
  <!-- Tall windscreen / beak -->
  <path d="M116,18 Q122,8 134,10 Q140,14 138,24 L122,28 Z" fill="rgba(160,220,255,0.5)"/>
  <!-- Rally tank (angular) -->
  <path d="M60,56 Q72,38 100,36 Q118,36 120,46 L118,58 L60,62 Z" fill="${b}"/>
  <path d="M68,54 Q78,42 100,40 Q112,40 116,46 Z" fill="rgba(255,255,255,0.18)"/>
  <!-- Seat (tall/narrow) -->
  <rect x="52" y="54" width="15" height="30" rx="4" fill="${D(b,25)}"/>
  <!-- Engine -->
  <rect x="78" y="58" width="36" height="26" rx="3" fill="${D(b,10)}"/>
  <rect x="81" y="61" width="30" height="18" rx="2" fill="${a}" opacity="0.35"/>
  <!-- High exhaust (upswept to right) -->
  <path d="M86,82 Q78,88 70,96 Q63,102 58,100" stroke="#aaa" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M86,87 Q79,94 72,100" stroke="#999" stroke-width="4" fill="none" stroke-linecap="round"/>
  <!-- Rally headlight (square) -->
  <rect x="122" y="24" width="22" height="16" rx="3" fill="#111"/>
  <rect x="124" y="26" width="18" height="12" rx="2" fill="${L(a,60)}" opacity="0.9"/>
  <rect x="127" y="28" width="10" height="7" rx="1" fill="rgba(255,255,220,0.9)"/>
  <!-- Wide handlebars -->
  <line x1="112" y1="18" x2="148" y2="16" stroke="#888" stroke-width="3.5" stroke-linecap="round"/>
  <rect x="144" y="14" width="8" height="5" rx="2" fill="#222"/>
  <rect x="110" y="14" width="8" height="5" rx="2" fill="#222"/>
  <!-- Tall front mudguard -->
  <path d="M116,58 Q124,48 128,58 Q128,70 124,75 Q120,76 116,68 Z" fill="${D(b,15)}"/>
  ${bigWheel(62,92,22,a)}
  ${bigWheel(124,92,22,a)}
  </svg>`;
}

function svgCafeRacer(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="180" height="100" viewBox="0 0 180 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Retro cafe racer: elongated tank, low clip-ons, seat hump, round headlight -->
  <!-- Frame -->
  <line x1="55" y1="56" x2="120" y2="48" stroke="${D(b,10)}" stroke-width="4" stroke-linecap="round"/>
  <line x1="55" y1="56" x2="57" y2="80" stroke="${D(b,10)}" stroke-width="4" stroke-linecap="round"/>
  <line x1="57" y1="68" x2="120" y2="56" stroke="${D(b,15)}" stroke-width="3"/>
  <line x1="120" y1="48" x2="124" y2="80" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <line x1="120" y1="48" x2="124" y2="26" stroke="#777" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Long elongated tank (cafe racer) -->
  <path d="M55,54 Q68,36 105,34 Q122,34 124,48 L120,56 L55,62 Z" fill="${b}"/>
  <path d="M65,52 Q76,40 105,38 Q118,38 120,46 Z" fill="rgba(255,255,255,0.2)"/>
  <!-- Pinstripe on tank -->
  <path d="M68,55 Q88,44 120,48" stroke="${a}" stroke-width="1.5" fill="none" opacity="0.7"/>
  <!-- Seat hump (cafe racer signature) -->
  <path d="M38,56 Q46,44 58,44 Q64,44 64,56 Q64,68 58,70 Q46,70 38,64 Z" fill="${D(b,20)}"/>
  <!-- Low clip-on bars -->
  <line x1="118" y1="28" x2="134" y2="30" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <rect x="130" y="28" width="7" height="4" rx="2" fill="#222"/>
  <!-- Round headlight (classic) -->
  <circle cx="130" cy="44" r="13" fill="#1a1a1a"/>
  <circle cx="130" cy="44" r="10" fill="${L(a,60)}"/>
  <circle cx="130" cy="44" r="6" fill="rgba(255,255,220,0.9)"/>
  <!-- Fender ring -->
  <circle cx="130" cy="44" r="12" fill="none" stroke="#888" stroke-width="2"/>
  <!-- Exhaust (classic wrapped pipes) -->
  <path d="M90,70 Q78,76 65,82 Q55,86 50,84" stroke="#bbb" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="49" cy="84" rx="4" ry="2.5" fill="#555"/>
  <!-- Heat wrap texture -->
  <path d="M58,81 Q62,76 66,80" stroke="#888" stroke-width="1" fill="none"/>
  <path d="M64,82 Q68,77 72,81" stroke="#888" stroke-width="1" fill="none"/>
  <path d="M70,83 Q74,78 78,82" stroke="#888" stroke-width="1" fill="none"/>
  <!-- Small taillight -->
  <rect x="38" y="58" width="5" height="4" rx="1" fill="rgba(220,30,30,0.9)"/>
  <!-- Rearset pegs (high) -->
  <line x1="72" y1="72" x2="64" y2="76" stroke="#888" stroke-width="2.5"/>
  ${wheel(57,84,18,a,'cr',0)}
  ${wheel(124,84,17,a,'cr',1)}
  </svg>`;
}

function svgBMX(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="155" height="95" viewBox="0 0 155 95" xmlns="http://www.w3.org/2000/svg">
  <!-- BMX: small fat frame, no motor, thick tires, pegs, no seat (trick style) -->
  <!-- Thick tubular frame (diamond) -->
  <line x1="50" y1="54" x2="90" y2="40" stroke="${b}" stroke-width="6" stroke-linecap="round"/>
  <line x1="50" y1="54" x2="52" y2="76" stroke="${b}" stroke-width="6" stroke-linecap="round"/>
  <line x1="90" y1="40" x2="92" y2="76" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <line x1="90" y1="40" x2="90" y2="22" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <!-- Chain stay -->
  <line x1="50" y1="56" x2="90" y2="54" stroke="${D(b,10)}" stroke-width="4"/>
  <!-- Seat stay -->
  <line x1="50" y1="54" x2="92" y2="70" stroke="${D(b,10)}" stroke-width="3.5"/>
  <!-- Seat tube (with no seat, just stump) -->
  <line x1="68" y1="40" x2="68" y2="56" stroke="${b}" stroke-width="5" stroke-linecap="round"/>
  <!-- Tiny saddle (minimal) -->
  <ellipse cx="68" cy="38" rx="8" ry="3" fill="#222"/>
  <!-- Handle bars (wide BMX) -->
  <line x1="82" y1="22" x2="116" y2="18" stroke="#888" stroke-width="4" stroke-linecap="round"/>
  <line x1="82" y1="22" x2="90" y2="40" stroke="#666" stroke-width="3" stroke-linecap="round"/>
  <rect x="112" y="16" width="8" height="5" rx="2" fill="#222"/>
  <rect x="80" y="16" width="8" height="5" rx="2" fill="#222"/>
  <!-- Crossbar -->
  <line x1="86" y1="26" x2="110" y2="22" stroke="#666" stroke-width="2.5"/>
  <!-- Pegs (4 pegs) -->
  <rect x="38" y="73" width="12" height="5" rx="2" fill="#aaa"/>
  <rect x="96" y="73" width="12" height="5" rx="2" fill="#aaa"/>
  <rect x="38" y="52" width="12" height="5" rx="2" fill="#aaa"/>
  <rect x="96" y="52" width="12" height="5" rx="2" fill="#aaa"/>
  <!-- Chain (simple line) -->
  <line x1="68" y1="58" x2="50" y2="76" stroke="#555" stroke-width="2" stroke-dasharray="3 2"/>
  <line x1="68" y1="58" x2="92" y2="76" stroke="#555" stroke-width="2" stroke-dasharray="3 2"/>
  <!-- Chain sprocket -->
  <circle cx="68" cy="58" r="8" fill="none" stroke="#666" stroke-width="2.5"/>
  <circle cx="68" cy="58" r="4" fill="#444"/>
  <!-- Spoke brakes -->
  <path d="M80,36 Q88,30 94,36" stroke="#888" stroke-width="2" fill="none"/>
  <!-- Fat tires (small wheels but thick) -->
  ${wheel(50,78,17,a,'bx',0)}
  ${wheel(92,78,17,a,'bx',1)}
  </svg>`;
}

function svgCruiserBike(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="195" height="100" viewBox="0 0 195 100" xmlns="http://www.w3.org/2000/svg">
  <!-- Long, low cruiser: huge fenders, forward controls, wide bars, teardrop tank -->
  <!-- Long low frame -->
  <line x1="45" y1="62" x2="140" y2="52" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="45" y1="62" x2="50" y2="80" stroke="${D(b,10)}" stroke-width="5" stroke-linecap="round"/>
  <line x1="140" y1="52" x2="146" y2="80" stroke="#777" stroke-width="5" stroke-linecap="round"/>
  <line x1="140" y1="52" x2="142" y2="30" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <!-- Teardrop tank (classic) -->
  <path d="M82,50 Q94,38 118,38 Q136,38 140,52 L136,58 Q120,62 82,62 Z" fill="${b}"/>
  <path d="M92,50 Q100,42 118,42 Q130,42 134,50 Z" fill="rgba(255,255,255,0.22)"/>
  <!-- V-twin engine (large) -->
  <rect x="80" y="56" width="46" height="22" rx="4" fill="${D(b,10)}"/>
  <polygon points="86,56 98,42 100,56" fill="${b}" opacity="0.9"/>
  <polygon points="106,56 120,42 122,56" fill="${b}" opacity="0.9"/>
  <!-- Engine fins -->
  <line x1="88" y1="44" x2="88" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="92" y1="42" x2="92" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="96" y1="42" x2="96" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="108" y1="42" x2="108" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="112" y1="42" x2="112" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <line x1="116" y1="44" x2="116" y2="56" stroke="${D(b,40)}" stroke-width="1.5"/>
  <!-- Wide seat (long) -->
  <rect x="38" y="56" width="48" height="10" rx="5" fill="${D(b,30)}"/>
  <rect x="38" y="54" width="48" height="6" rx="4" fill="${D(b,12)}"/>
  <!-- Large rear fender -->
  <path d="M22,62 Q26,44 46,46 Q58,46 58,62 Q58,80 46,82 Q26,82 22,70 Z" fill="${D(b,15)}"/>
  <!-- Chrome fender trim -->
  <path d="M24,66 Q26,50 46,50 Q55,50 55,62" stroke="#ccc" stroke-width="1.5" fill="none"/>
  <!-- Front fender (large) -->
  <path d="M136,68 Q140,55 148,54 Q158,55 158,68 Q158,78 148,80 Q138,80 136,72 Z" fill="${D(b,15)}"/>
  <!-- Forward controls -->
  <line x1="80" y1="76" x2="56" y2="84" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <rect x="52" y="82" width="8" height="5" rx="2" fill="#666"/>
  <!-- Wide pullback bars -->
  <line x1="136" y1="30" x2="125" y2="22" stroke="#888" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="125" y1="22" x2="155" y2="22" stroke="#aaa" stroke-width="4" stroke-linecap="round"/>
  <circle cx="123" cy="22" r="5" fill="#333"/>
  <circle cx="157" cy="22" r="5" fill="#333"/>
  <!-- Chrome exhaust (long) -->
  <path d="M124,76 Q100,82 78,82 Q55,82 38,80" stroke="#bbb" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="37" cy="80" rx="5" ry="3" fill="#555"/>
  <!-- Headlight (round, chrome) -->
  <circle cx="152" cy="44" r="12" fill="#222"/>
  <circle cx="152" cy="44" r="9" fill="${L(a,60)}"/>
  <circle cx="152" cy="44" r="5" fill="rgba(255,255,220,0.9)"/>
  <circle cx="152" cy="44" r="11" fill="none" stroke="#aaa" stroke-width="2"/>
  <!-- Taillight -->
  <circle cx="40" cy="60" r="5" fill="rgba(220,30,30,0.9)"/>
  ${wheel(46,84,18,a,'cu',0)}
  ${wheel(148,84,17,a,'cu',1)}
  </svg>`;
}

function svgSupermoto(v) {
  const b=v.palette.body,a=v.palette.accent;
  return `<svg width="175" height="100" viewBox="0 0 175 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sm_b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${L(b,60)}"/><stop offset="100%" stop-color="${D(b,20)}"/></linearGradient>
  </defs>
  <!-- Motard/supermoto: minimal fairing, flat track bars, SM wheels -->
  <!-- Trellis frame (visible triangles) -->
  <line x1="55" y1="54" x2="104" y2="44" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
  <line x1="55" y1="54" x2="60" y2="78" stroke="${a}" stroke-width="3" stroke-linecap="round"/>
  <line x1="75" y1="54" x2="60" y2="78" stroke="${a}" stroke-width="2.5"/>
  <line x1="75" y1="54" x2="60" y2="54" stroke="${a}" stroke-width="2"/>
  <line x1="104" y1="44" x2="110" y2="78" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <line x1="104" y1="44" x2="108" y2="24" stroke="#777" stroke-width="4" stroke-linecap="round"/>
  <!-- Small tank/fairing -->
  <path d="M56,52 Q70,36 98,36 Q110,36 112,48 L104,54 L56,58 Z" fill="url(#sm_b)"/>
  <path d="M66,50 Q76,40 98,40 Q108,40 108,46 Z" fill="rgba(255,255,255,0.2)"/>
  <!-- Number board -->
  <rect x="112" y="32" width="24" height="16" rx="2" fill="${a}"/>
  <text x="124" y="43" text-anchor="middle" font-size="8" font-weight="bold" fill="${b}" font-family="Orbitron,monospace">1</text>
  <!-- Compact seat (narrow) -->
  <rect x="46" y="48" width="16" height="12" rx="4" fill="#333"/>
  <rect x="46" y="47" width="16" height="7" rx="3" fill="#444"/>
  <!-- Flat track handlebars -->
  <line x1="100" y1="24" x2="126" y2="22" stroke="#888" stroke-width="3" stroke-linecap="round"/>
  <rect x="122" y="20" width="7" height="4" rx="2" fill="#222"/>
  <rect x="100" y="20" width="7" height="4" rx="2" fill="#222"/>
  <!-- SM headlight (oval) -->
  <ellipse cx="118" cy="42" rx="10" ry="8" fill="#111"/>
  <ellipse cx="118" cy="42" rx="7" ry="5" fill="${L(a,60)}" opacity="0.9"/>
  <ellipse cx="118" cy="42" rx="4" ry="3" fill="rgba(255,255,220,0.9)"/>
  <!-- Radiator (visible) -->
  <rect x="100" y="46" width="14" height="14" rx="2" fill="#222"/>
  <line x1="102" y1="48" x2="102" y2="58" stroke="#555" stroke-width="1.5"/>
  <line x1="106" y1="48" x2="106" y2="58" stroke="#555" stroke-width="1.5"/>
  <line x1="110" y1="48" x2="110" y2="58" stroke="#555" stroke-width="1.5"/>
  <!-- Exhaust (short, upswept) -->
  <path d="M80,70 Q70,78 62,84 Q55,88 50,86" stroke="#bbb" stroke-width="5" fill="none" stroke-linecap="round"/>
  <ellipse cx="49" cy="86" rx="5" ry="3" fill="#444"/>
  <!-- Rear sprocket visible -->
  <circle cx="60" cy="78" r="8" fill="none" stroke="${a}" stroke-width="2" stroke-dasharray="4 2"/>
  <!-- Taillight (LED) -->
  <rect x="46" y="52" width="3" height="6" fill="${a}" opacity="0.9"/>
  <!-- Rearset footpegs -->
  <line x1="80" y1="74" x2="68" y2="80" stroke="#888" stroke-width="2.5"/>
  ${wheel(60,84,18,a,'sm',0)}
  ${wheel(110,84,17,a,'sm',1)}
  </svg>`;
}

// ─── Dispatch table ───────────────────────────────────────────────────────────
export const svgMap = {
  rusty_hatchback: svgRustyHatchback,
  monster_truck:   svgMonsterTruck,
  rally_racer:     svgRallyRacer,
  muscle_car:      svgMuscleCar,
  jeep_4x4:        svgJeep4x4,
  sports_coupe:    svgSportsCoupe,
  dune_buggy:      svgDuneBuggy,
  tank:            svgTank,
  pickup_truck:    svgPickupTruck,
  electric_car:    svgElectricCar,
  dirt_bike:       svgDirtBike,
  chopper:         svgChopper,
  sport_bike:      svgSportBike,
  scrambler:       svgScrambler,
  mini_moto:       svgMiniMoto,
  enduro_bike:     svgEnduroBike,
  cafe_racer:      svgCafeRacer,
  bmx:             svgBMX,
  cruiser_bike:    svgCruiserBike,
  supermoto:       svgSupermoto,
};

const statColors = {
  speed:          'linear-gradient(90deg,#f7971e,#ffd200)',
  acceleration:   'linear-gradient(90deg,#11998e,#38ef7d)',
  fuelEfficiency: 'linear-gradient(90deg,#36d1dc,#5b86e5)',
  grip:           'linear-gradient(90deg,#a18cd1,#fbc2eb)',
  traction:       'linear-gradient(90deg,#ff512f,#dd2476)',
};

function hexToRgb(hex){const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);return{r,g,b};}
function glowColor(v){const{r,g,b}=hexToRgb(v.palette.body);return `rgba(${r},${g},${b},0.22)`;}
function cardGradient(v){return `linear-gradient(135deg, ${v.palette.body}, ${v.palette.accent})`;}

function createCard(v) {
  const card = document.createElement('div');
  card.className = `card ${v.defaultUnlocked ? '' : 'locked'}`;
  card.dataset.type = v.type;
  card.style.setProperty('--card-glow', glowColor(v));
  card.style.setProperty('--card-glow-color', `radial-gradient(ellipse, ${glowColor(v)} 0%, transparent 70%)`);

  const statKeys = ['speed','acceleration','fuelEfficiency','grip','traction'];
  const statLabels = {speed:'Speed',acceleration:'Accel',fuelEfficiency:'Efficiency',grip:'Grip',traction:'Traction'};

  const svgFn = svgMap[v.id];
  const svgHTML = svgFn ? svgFn(v) : '<svg width="180" height="100"></svg>';

  card.innerHTML = `
    <div class="card-accent-bar" style="background:${cardGradient(v)}"></div>
    <div class="vehicle-stage">
      ${v.defaultUnlocked ? '' : '<div class="lock-overlay">🔒</div>'}
      <div class="vehicle-svg">${svgHTML}</div>
    </div>
    <div class="card-body">
      <div class="card-header">
        <div>
          <div class="vehicle-name">${v.name}</div>
          <div class="vehicle-type">${v.type === 'car' ? '🚗 Car' : '🏍️ Bike'}</div>
        </div>
        <div class="cost-badge ${v.cost === 0 ? 'free' : 'paid'}">
          ${v.cost === 0 ? 'FREE' : `⚡ ${v.cost}`}
        </div>
      </div>
      <div class="stats">
        ${statKeys.map(k => `
          <div class="stat">
            <div class="stat-label">${statLabels[k]}</div>
            <div class="stat-bar-track">
              <div class="stat-bar-fill" style="width:${v.stats[k]*10}%;background:${statColors[k]}"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return card;
}

const grid = document.getElementById('grid');
vehicles.forEach(v => grid.appendChild(createCard(v)));

function filter(type, event) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (event) event.target.classList.add('active');
  document.querySelectorAll('.card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

export function getDefaultVehicleId() {
  return "rusty_hatchback";
}

// Expose filter to global scope for onclick handlers in vehicles.html
if (typeof window !== 'undefined') window.filter = filter;