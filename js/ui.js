// ui.js — Menus, screens, transitions, vehicle and level selection
// Enhanced version — 100% original code, free to publish (no copyright claims)

import { vehicles, svgMap } from "./vehicles.js";

/* ─── Particle burst helper (upgrade screen sparkles) ─── */
function _burst(x, y, color) {
  const palette = [color, '#ffd700', '#ffffff', '#a78bfa', '#34d399'];
  for (let i = 0; i < 16; i++) {
    const el = document.createElement('div');
    el.className = 'burst-particle';
    const size  = 4 + Math.random() * 7;
    const angle = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const dist  = 35 + Math.random() * 70;
    const tx    = Math.cos(angle) * dist;
    const ty    = Math.sin(angle) * dist;
    const dur   = 500 + Math.random() * 400;
    el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;
      background:${palette[i % palette.length]};transform:translate(-50%,-50%);
      box-shadow:0 0 6px ${palette[i % palette.length]};`;
    el.animate(
      [
        { transform: 'translate(-50%,-50%) scale(1)',                                   opacity: 1 },
        { transform: `translate(calc(-50% + ${tx}px),calc(-50% + ${ty}px)) scale(0)`, opacity: 0 },
      ],
      { duration: dur, easing: 'ease-out', fill: 'forwards' }
    );
    document.body.appendChild(el);
    setTimeout(() => el.remove(), dur + 100);
  }
}

/* ─── Spawn ambient particles in upgrade stage ─────────── */
let _stageParticleTimer = null;
function _startStageParticles() {
  _stopStageParticles();
  _stageParticleTimer = setInterval(() => {
    const stage = document.querySelector('.upgr-stage');
    if (!stage) return;
    const p = document.createElement('div');
    p.className = 'burst-particle';
    const size   = 2 + Math.random() * 4;
    const colors = ['#63caff','#a78bfa','#34d399','#ffd700','#fb923c'];
    const col    = colors[Math.floor(Math.random() * colors.length)];
    p.style.cssText = `
      width:${size}px;height:${size}px;
      left:${10 + Math.random() * 80}%;
      top:${20 + Math.random() * 55}%;
      background:${col};
      box-shadow:0 0 6px ${col};
      position:absolute;
      animation:sparkle ${1.5 + Math.random() * 2}s ease-in-out ${Math.random() * 1}s infinite;
    `;
    stage.appendChild(p);
    setTimeout(() => p.remove(), 5000);
  }, 900);
}
function _stopStageParticles() {
  if (_stageParticleTimer) { clearInterval(_stageParticleTimer); _stageParticleTimer = null; }
  document.querySelectorAll('.upgr-stage .burst-particle').forEach(p => p.remove());
}

export function initUI(api) {
  console.log('Initializing UI...');

  const mainMenu    = document.getElementById("screen-main-menu");
  const levelSelect = document.getElementById("screen-level-select");
  const garage      = document.getElementById("screen-garage");
  const pauseScreen = document.getElementById("screen-pause");
  const adScreen    = document.getElementById("screen-ad");
  const gameoverScreen = document.getElementById("screen-gameover");

  if (!mainMenu || !levelSelect || !garage) {
    console.error('Critical UI elements missing!');
    return;
  }

  const screens = { main: mainMenu, level: levelSelect, garage, pause: pauseScreen, ad: adScreen, gameover: gameoverScreen };

  function showScreen(name) {
    Object.values(screens).forEach(el => el && el.classList.remove("active"));
    if (screens[name]) screens[name].classList.add("active");

    const btnBrake = document.getElementById("btn-brake");
    const btnGas   = document.getElementById("btn-gas");
    const hudGauges= document.getElementById("hud-gauges");
    const isGameplay = name === null || name === undefined;
    if (btnBrake)  btnBrake.style.visibility  = isGameplay ? "visible" : "hidden";
    if (btnGas)    btnGas.style.visibility    = isGameplay ? "visible" : "hidden";
    if (hudGauges) hudGauges.style.visibility = isGameplay ? "visible" : "hidden";
  }

  showScreen("main");

  if (!vehicles || vehicles.length === 0) {
    console.error('Vehicles array is empty or not loaded!');
  } else {
    console.log('Loaded', vehicles.length, 'vehicles');
  }

  const btnPlay        = document.getElementById("btn-play");
  const btnGarage      = document.getElementById("btn-garage");
  const btnLevels      = document.getElementById("btn-levels");
  const btnSettings    = document.getElementById("btn-settings");
  const btnLeaderboard = document.getElementById("btn-leaderboard");

  if (btnPlay) {
    btnPlay.onclick = () => {
      console.log('Play button clicked');
      try {
        const sel = api.getCurrentSelection();
        api.startRun({ levelId: sel.levelId, vehicleId: sel.vehicleId });
        showScreen(null);
      } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Check console for details.');
      }
    };
  } else { console.error('Play button not found!'); }

  if (btnGarage) {
    btnGarage.onclick = () => { showScreen("garage"); renderGarage(); };
  } else { console.error('Garage button not found!'); }

  if (btnLevels)      btnLevels.onclick      = () => { showScreen("level"); renderLevelSelect(); };
  if (btnSettings)    btnSettings.onclick    = () => { alert("Settings coming soon."); };
  if (btnLeaderboard) btnLeaderboard.onclick = () => { alert("Local-only leaderboard in this demo."); };

  document.querySelectorAll(".btn-back").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      Object.values(screens).forEach(el => el && el.classList.remove("active"));
      const el = document.getElementById(targetId);
      if (el) el.classList.add("active");
    });
  });

  const btnPause = document.getElementById("btn-pause");
  if (btnPause) btnPause.onclick = () => { window.dispatchEvent(new Event("game:pause")); showScreen("pause"); };

  const btnResume  = document.getElementById("btn-resume");
  const btnRestart = document.getElementById("btn-restart");
  const btnQuit    = document.getElementById("btn-quit");
  if (btnResume)  btnResume.onclick  = () => { showScreen(null); window.dispatchEvent(new Event("game:resume")); };
  if (btnRestart) btnRestart.onclick = () => { showScreen(null); window.dispatchEvent(new Event("game:restart")); };
  if (btnQuit)    btnQuit.onclick    = () => { showScreen("main"); window.dispatchEvent(new Event("game:quit")); };

  const gameoverTitle   = document.getElementById("gameover-title");
  const gameoverSummary = document.getElementById("gameover-summary");
  const gameoverStars   = document.getElementById("gameover-stars");
  const btnAdContinue   = document.getElementById("btn-ad-continue");
  const adSlot          = document.getElementById("ad-slot-interstitial");

  let pendingResult = null;

  const btnGoRestart = document.getElementById("btn-gameover-restart");
  const btnGoLevels  = document.getElementById("btn-gameover-levels");
  const btnGoMain    = document.getElementById("btn-gameover-main");

  if (btnGoRestart) btnGoRestart.onclick = () => { showScreen(null); window.dispatchEvent(new Event("game:restart")); };
  if (btnGoLevels)  btnGoLevels.onclick  = () => { showScreen("level"); renderLevelSelect(); window.dispatchEvent(new Event("game:quit")); };
  if (btnGoMain)    btnGoMain.onclick    = () => { showScreen("main"); window.dispatchEvent(new Event("game:quit")); };

  function showGameoverFromResult(d) {
    if (!d) return;
    if (gameoverTitle)   gameoverTitle.textContent   = d.reachedFinish ? "Level Complete! 🏆" : "Game Over 💥";
    if (gameoverSummary) gameoverSummary.textContent = `Distance: ${d.distance.toFixed(1)} m  |  Best: ${d.bestDistance.toFixed(1)} m  |  Coins: +${d.coinsEarned}`;
    if (gameoverStars)   gameoverStars.textContent   = "★".repeat(d.stars) + "☆".repeat(3 - d.stars);
    showScreen("gameover");
  }

  function showAdThenGameover(resultDetail) {
    pendingResult = resultDetail;
    const platform = api.platform;
    if (platform && platform.isPlatform()) {
      platform.requestInterstitialAd(() => { showGameoverFromResult(pendingResult); pendingResult = null; });
    } else {
      if (!adScreen || !adSlot) { showGameoverFromResult(pendingResult); return; }
      showScreen("ad");
      let finished = false;
      const done = () => {
        if (finished) return; finished = true;
        showGameoverFromResult(pendingResult); pendingResult = null;
      };
      if (btnAdContinue) btnAdContinue.onclick = () => done();
      setTimeout(done, 2000);
    }
  }

  window.addEventListener("game:run-ended", ev => {
    const d = ev.detail;
    if (!d) return;
    showAdThenGameover(d);
  });

  /* ── Level select theme icons & difficulty meta ──────── */
  const THEME_ICONS = {
    pastelFields:'🛣️', pastelHills:'⛰️', beach:'🏖️', farm:'🌾', cliffs:'🪨',
    meadow:'🌿', plains:'🌄', orchard:'🍎', lake:'🏞️', forest:'🌲',
    mountain:'🗻', desert:'🏜️', jungle:'🌴', snow:'❄️', canyon:'🏔️',
    volcano:'🌋', arctic:'🧊', rainforest:'🌧️', swamp:'🐸', storm:'⛈️',
    asteroid:'☄️', cave:'🌑', underwater:'🐠', space:'🚀', lava:'🔥',
    nightmare:'😱', chaos:'💥', moon:'🌙', inferno:'☠️', final:'🏆',
  };
  const DIFF_META = {
    easy:     { label:'Easy',     color:'#4ade80', glow:'rgba(74,222,128,0.25)'  },
    normal:   { label:'Normal',   color:'#60a5fa', glow:'rgba(96,165,250,0.25)'  },
    hard:     { label:'Hard',     color:'#f87171', glow:'rgba(248,113,113,0.25)' },
    advanced: { label:'Advanced', color:'#c084fc', glow:'rgba(192,132,252,0.28)' },
  };

  const levelGrid = document.getElementById("level-grid");

  function renderLevelSelect() {
    if (!levelGrid) return;
    const data = api.getLevels();
    const st   = api.storage;
    levelGrid.innerHTML = "";
    let lastDiff = null;

    for (const level of data) {
      if (level.difficulty !== lastDiff) {
        lastDiff = level.difficulty;
        const meta = DIFF_META[level.difficulty] || DIFF_META.easy;
        const hdr  = document.createElement('div');
        hdr.className = 'level-section-header';
        hdr.style.setProperty('--diff-color', meta.color);
        hdr.innerHTML = `<span class="diff-dot"></span>${meta.label}<span class="diff-line"></span>`;
        levelGrid.appendChild(hdr);
      }

      const unlocked = isLevelUnlocked(level.id, st);
      const stars    = st.getLevelStars(level.id) || 0;
      const icon     = THEME_ICONS[level.theme] || '🎮';
      const meta     = DIFF_META[level.difficulty] || DIFF_META.easy;

      const div = document.createElement('button');
      div.className = `level-tile ${level.difficulty}${unlocked ? '' : ' locked'}`;
      div.style.setProperty('--diff-color', meta.color);
      div.style.setProperty('--diff-glow',  meta.glow);
      div.setAttribute('aria-label', `Level ${level.id}: ${level.name}`);

      const starsHtml = Array.from({length:3}, (_,i) =>
        `<span class="star${i < stars ? ' earned' : ''}">${i < stars ? '★' : '☆'}</span>`
      ).join('');

      if (unlocked) {
        div.innerHTML = `
          <div class="lt-icon">${icon}</div>
          <div class="lt-num">${level.id}</div>
          <div class="lt-name">${level.name}</div>
          <div class="lt-stars">${starsHtml}</div>
          <div class="lt-play-hint">▶ Play</div>`;
        div.onclick = () => {
          api.selectLevel(level.id);
          const selVehicle = api.getCurrentSelection().vehicleId;
          api.storage.setLastSelected(level.id, selVehicle);
          api.startRun({ levelId: level.id, vehicleId: selVehicle });
          showScreen(null);
        };
      } else {
        div.innerHTML = `
          <div class="lt-icon lt-lock">🔒</div>
          <div class="lt-num">${level.id}</div>
          <div class="lt-name">${level.name}</div>
          <div class="lt-stars">${starsHtml}</div>`;
      }
      levelGrid.appendChild(div);
    }
  }

  const btnWatchAdCoins    = document.getElementById("btn-watch-ad-coins");
  const btnGameoverAdCoins = document.getElementById("btn-gameover-ad-coins");

  /* ── Stat colour/label maps ──────────────────────────── */
  const _statColors = {
    speed:           'linear-gradient(90deg,#f7971e,#ffd200)',
    acceleration:    'linear-gradient(90deg,#11998e,#38ef7d)',
    fuelEfficiency:  'linear-gradient(90deg,#36d1dc,#5b86e5)',
    grip:            'linear-gradient(90deg,#a18cd1,#fbc2eb)',
    traction:        'linear-gradient(90deg,#ff512f,#dd2476)',
  };
  const _statLabels = { speed:'Speed', acceleration:'Accel', fuelEfficiency:'Efficiency', grip:'Grip', traction:'Traction' };
  const _statKeys   = ['speed','acceleration','fuelEfficiency','grip','traction'];

  /* ── Upgrade tile definitions ────────────────────────── */
  const UPGRADE_DEFS = [
    {
      key:'engine', label:'ENGINE', maxLevel:10,
      color:'#f97316',
      icon:`<svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='8' y='14' width='26' height='20' rx='4' fill='#f97316' opacity='0.9'/>
        <rect x='15' y='6' width='6' height='10' rx='2' fill='#fb923c'/>
        <rect x='23' y='6' width='6' height='10' rx='2' fill='#fb923c'/>
        <rect x='2'  y='18' width='8' height='10' rx='2' fill='#fed7aa'/>
        <rect x='38' y='18' width='8' height='10' rx='2' fill='#fed7aa'/>
        <circle cx='21' cy='24' r='4.5' fill='#fff7ed' opacity='0.85'/>
        <circle cx='21' cy='24' r='2.2' fill='#f97316'/>
        <rect x='15' y='34' width='18' height='4' rx='2' fill='#fdba74'/>
      </svg>`
    },
    {
      key:'suspension', label:'SUSPEN.', maxLevel:10,
      color:'#a78bfa',
      icon:`<svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='20' y='2' width='8' height='44' rx='4' fill='#a78bfa' opacity='0.18'/>
        <polyline points='16,5 32,5 16,13 32,13 16,21 32,21 16,29 32,29 16,37 32,37' stroke='#a78bfa' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'/>
        <rect x='12' y='2' width='24' height='6' rx='3' fill='#c4b5fd'/>
        <rect x='12' y='40' width='24' height='6' rx='3' fill='#c4b5fd'/>
      </svg>`
    },
    {
      key:'tires', label:'TIRES', maxLevel:10,
      color:'#34d399',
      icon:`<svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='24' cy='24' r='21' fill='#1e293b' stroke='#34d399' stroke-width='2.5'/>
        <circle cx='24' cy='24' r='14' fill='#0f172a'/>
        <circle cx='24' cy='24' r='7'  fill='#1e293b'/>
        <circle cx='24' cy='24' r='3.5' fill='#34d399' opacity='0.85'/>
        <line x1='24' y1='3'  x2='24' y2='10' stroke='#34d399' stroke-width='2.5' stroke-linecap='round'/>
        <line x1='24' y1='38' x2='24' y2='45' stroke='#34d399' stroke-width='2.5' stroke-linecap='round'/>
        <line x1='3'  y1='24' x2='10' y2='24' stroke='#34d399' stroke-width='2.5' stroke-linecap='round'/>
        <line x1='38' y1='24' x2='45' y2='24' stroke='#34d399' stroke-width='2.5' stroke-linecap='round'/>
        <line x1='7.5'  y1='7.5'  x2='12.5' y2='12.5' stroke='#34d399' stroke-width='2'  stroke-linecap='round'/>
        <line x1='40.5' y1='40.5' x2='35.5' y2='35.5' stroke='#34d399' stroke-width='2'  stroke-linecap='round'/>
        <line x1='40.5' y1='7.5'  x2='35.5' y2='12.5' stroke='#34d399' stroke-width='2'  stroke-linecap='round'/>
        <line x1='7.5'  y1='40.5' x2='12.5' y2='35.5' stroke='#34d399' stroke-width='2'  stroke-linecap='round'/>
      </svg>`
    },
    {
      key:'fuel', label:'4WD', maxLevel:10,
      color:'#fb923c',
      icon:`<svg viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <circle cx='10' cy='10' r='7' fill='none' stroke='#fb923c' stroke-width='2.5'/>
        <circle cx='38' cy='10' r='7' fill='none' stroke='#fb923c' stroke-width='2.5'/>
        <circle cx='10' cy='38' r='7' fill='none' stroke='#fb923c' stroke-width='2.5'/>
        <circle cx='38' cy='38' r='7' fill='none' stroke='#fb923c' stroke-width='2.5'/>
        <circle cx='10' cy='10' r='3' fill='#fed7aa'/>
        <circle cx='38' cy='10' r='3' fill='#fed7aa'/>
        <circle cx='10' cy='38' r='3' fill='#fed7aa'/>
        <circle cx='38' cy='38' r='3' fill='#fed7aa'/>
        <line x1='10' y1='17' x2='10' y2='31' stroke='#fb923c' stroke-width='2'/>
        <line x1='38' y1='17' x2='38' y2='31' stroke='#fb923c' stroke-width='2'/>
        <line x1='17' y1='10' x2='31' y2='10' stroke='#fb923c' stroke-width='2'/>
        <line x1='17' y1='38' x2='31' y2='38' stroke='#fb923c' stroke-width='2'/>
        <circle cx='24' cy='24' r='5' fill='#fb923c' opacity='0.9'/>
      </svg>`
    },
  ];

  const UPGRADE_COSTS = [200, 400, 700, 1200, 1800, 2600, 3600, 4900, 6500, 8500];

  /* ── Garage render ───────────────────────────────────── */
  function renderGarage() {
    const garageGrid  = document.getElementById('garage-grid');
    const garageCoins = document.getElementById('garage-coins');
    if (!garageGrid) return;

    const st         = api.storage;
    const selectedId = api.getCurrentSelection ? api.getCurrentSelection().vehicleId : null;

    if (garageCoins) garageCoins.textContent = `⚡ ${st.getCoins().toLocaleString()} coins`;
    garageGrid.innerHTML = '';

    vehicles.forEach(v => {
      if (v.defaultUnlocked && !st.isVehicleUnlocked(v.id)) st.unlockVehicle(v.id);
      const unlocked  = st.isVehicleUnlocked(v.id) || v.defaultUnlocked;
      const selected  = selectedId === v.id;
      const canAfford = st.getCoins() >= v.cost;

      const svgFn   = svgMap[v.id];
      const svgHTML = svgFn ? svgFn(v) : '';

      const card = document.createElement('div');
      card.className   = `gcard${unlocked ? '' : ' gcard-locked'}${selected ? ' gcard-selected' : ''}`;
      card.dataset.type      = v.type;
      card.dataset.id        = v.id;
      card.dataset.unlocked  = unlocked  ? '1' : '0';
      card.dataset.cost      = v.cost;
      card.dataset.canAfford = canAfford ? '1' : '0';
      card.style.cursor      = 'pointer';

      card.innerHTML = `
        <div class="gcard-bar" style="background:linear-gradient(90deg,${v.palette.body},${v.palette.accent})"></div>
        <div class="gcard-stage">
          ${!unlocked ? '<div class="gcard-lock">🔒</div>' : ''}
          ${selected  ? '<div class="gcard-selected-badge">✓ IN USE</div>' : ''}
          <div class="gcard-svg">${svgHTML}</div>
        </div>
        <div class="gcard-body">
          <div class="gcard-header">
            <div>
              <div class="gcard-name">${v.name}</div>
              <div class="gcard-type">${v.type === 'car' ? '🚗 Car' : '🏍️ Bike'}</div>
            </div>
            <div class="gcard-badge ${v.cost === 0 ? 'gfree' : 'gpaid'}">${v.cost === 0 ? 'FREE' : `⚡ ${v.cost}`}</div>
          </div>
          <div class="gcard-stats">
            ${_statKeys.map(k => `
              <div class="gcard-stat">
                <div class="gcard-stat-label">${_statLabels[k]}</div>
                <div class="gcard-stat-track">
                  <div class="gcard-stat-fill" style="width:${v.stats[k]*10}%;background:${_statColors[k]}"></div>
                </div>
              </div>`).join('')}
          </div>
          <div class="gcard-action">
            ${selected
              ? `<button class="gcard-btn gcard-btn-selected" disabled>✓ Selected</button>`
              : unlocked
                ? `<button class="gcard-btn gcard-btn-select" data-id="${v.id}">▶ Select</button>`
                : `<button class="gcard-btn gcard-btn-unlock${canAfford ? '' : ' cant-afford'}" data-id="${v.id}" data-cost="${v.cost}">
                     ${canAfford ? `Unlock ⚡${v.cost}` : `⚡${v.cost} coins needed`}
                   </button>`
            }
          </div>
        </div>`;
      garageGrid.appendChild(card);
    });

    // Tab filter
    document.querySelectorAll('.garage-tab').forEach(tab => {
      tab.onclick = () => {
        document.querySelectorAll('.garage-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const f = tab.dataset.filter;
        document.querySelectorAll('.gcard').forEach(c => {
          c.style.display = (f === 'all' || c.dataset.type === f) ? '' : 'none';
        });
      };
    });

    // Card tap: select / unlock / open upgrade screen
    garageGrid.onclick = e => {
      const selBtn  = e.target.closest('.gcard-btn-select');
      const unlBtn  = e.target.closest('.gcard-btn-unlock');
      const anyCard = e.target.closest('.gcard');
      const st      = api.storage;

      function doSelect(id) {
        api.selectVehicle(id);
        if (api.getCurrentSelection) {
          const sel = api.getCurrentSelection();
          api.storage.setLastSelected(sel.levelId, id);
        }
        renderGarage();
      }

      if (selBtn) { doSelect(selBtn.dataset.id); return; }

      if (unlBtn && !unlBtn.classList.contains('cant-afford')) {
        const id = unlBtn.dataset.id, cost = Number(unlBtn.dataset.cost);
        if (st.getCoins() >= cost) { st.addCoins(-cost); st.unlockVehicle(id); renderGarage(); }
        return;
      }

      if (anyCard) {
        const id         = anyCard.dataset.id;
        const isUnlocked = anyCard.dataset.unlocked === '1';
        const v          = vehicles.find(x => x.id === id);
        if (!v) return;
        if (isUnlocked) {
          openUpgradeScreen(v);
        } else {
          // shake if can't afford
          if (anyCard.dataset.canAfford !== '1') {
            anyCard.classList.add('gcard-shake');
            setTimeout(() => anyCard.classList.remove('gcard-shake'), 440);
          }
          openUnlockModal(v);
        }
      }
    };
  }

  /* ── Unlock Modal ────────────────────────────────────── */
  const _modalEl = document.createElement('div');
  _modalEl.id = 'unlock-modal';
  _modalEl.className = 'umodal-overlay';
  _modalEl.innerHTML = `
    <div class="umodal">
      <button class="umodal-close" id="umodal-close">✕</button>
      <div class="umodal-svg"  id="umodal-svg"></div>
      <div class="umodal-name" id="umodal-name"></div>
      <div class="umodal-type" id="umodal-type"></div>
      <div class="umodal-price-row">
        <span class="umodal-original" id="umodal-original"></span>
        <span class="umodal-current"  id="umodal-current"></span>
      </div>
      <div class="umodal-adsaved" id="umodal-adsaved"></div>
      <div class="umodal-btns">
        <button class="umodal-btn umodal-btn-ad"  id="umodal-btn-ad">📺 Watch Ad&nbsp;&nbsp;−50 coins</button>
        <button class="umodal-btn umodal-btn-buy" id="umodal-btn-buy"></button>
      </div>
      <div class="umodal-hint" id="umodal-hint"></div>
    </div>`;
  document.body.appendChild(_modalEl);
  _modalEl.style.display = 'none';

  let _modalVehicle = null;

  function _updateModalPrice() {
    if (!_modalVehicle) return;
    const v        = _modalVehicle;
    const discount = api.storage.getVehicleDiscount(v.id);
    const final    = Math.max(0, v.cost - discount);
    const coins    = api.storage.getCoins();
    const adsN     = Math.floor(discount / 50);

    const origEl  = document.getElementById('umodal-original');
    const curEl   = document.getElementById('umodal-current');
    const savedEl = document.getElementById('umodal-adsaved');
    const buyBtn  = document.getElementById('umodal-btn-buy');
    const hint    = document.getElementById('umodal-hint');

    origEl.textContent   = discount > 0 ? `⚡ ${v.cost}` : '';
    origEl.style.display = discount > 0 ? 'inline' : 'none';
    curEl.textContent    = final === 0 ? '🎉 FREE!' : `⚡ ${final} coins`;
    curEl.className      = final === 0 ? 'umodal-current free' : 'umodal-current';
    savedEl.textContent  = adsN > 0 ? `📺 ${adsN} ad${adsN > 1 ? 's' : ''} watched · ${discount} coins saved` : '';

    if (final === 0) {
      buyBtn.textContent = '🎉 Unlock for Free!';
      buyBtn.disabled    = false;
      buyBtn.className   = 'umodal-btn umodal-btn-buy afford';
    } else if (coins >= final) {
      buyBtn.textContent = `⚡ Buy for ${final} coins`;
      buyBtn.disabled    = false;
      buyBtn.className   = 'umodal-btn umodal-btn-buy afford';
    } else {
      buyBtn.textContent = `Need ${final - coins} more coins`;
      buyBtn.disabled    = true;
      buyBtn.className   = 'umodal-btn umodal-btn-buy no-afford';
    }
    hint.textContent = `You have ⚡ ${coins.toLocaleString()} coins`;
  }

  function openUnlockModal(v) {
    _modalVehicle = v;
    const svgFn = svgMap[v.id];
    document.getElementById('umodal-svg').innerHTML  = svgFn ? svgFn(v) : '';
    document.getElementById('umodal-name').textContent = v.name;
    document.getElementById('umodal-type').textContent = v.type === 'car' ? '🚗 Car' : '🏍️ Bike';
    _updateModalPrice();
    _modalEl.style.display = 'flex';
  }

  function closeUnlockModal() { _modalEl.style.display = 'none'; _modalVehicle = null; }

  document.getElementById('umodal-close').onclick = closeUnlockModal;
  _modalEl.addEventListener('click', e => { if (e.target === _modalEl) closeUnlockModal(); });

  document.getElementById('umodal-btn-ad').onclick = async () => {
    if (!_modalVehicle) return;
    const btn      = document.getElementById('umodal-btn-ad');
    const platform = api.platform;
    btn.disabled   = true;
    btn.textContent = '⏳ Loading ad...';
    try {
      let success = false;
      if (platform && platform.isPlatform()) {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        success = result.success;
      } else {
        await new Promise(r => setTimeout(r, 1200));
        success = true;
      }
      if (success) { api.storage.addVehicleDiscount(_modalVehicle.id, 50); _updateModalPrice(); }
    } catch {/* ignore */} finally {
      btn.disabled    = false;
      btn.textContent = '📺 Watch Ad  −50 coins';
    }
  };

  document.getElementById('umodal-btn-buy').onclick = () => {
    if (!_modalVehicle) return;
    const v        = _modalVehicle;
    const discount = api.storage.getVehicleDiscount(v.id);
    const final    = Math.max(0, v.cost - discount);
    if (api.storage.getCoins() >= final) {
      api.storage.addCoins(-final);
      api.storage.unlockVehicle(v.id);
      closeUnlockModal();
      renderGarage();
    }
  };

  /* ═══════════════════════════════════════════════════════
     UPGRADE SCREEN — FULL SPECTACULAR VERSION
  ═══════════════════════════════════════════════════════ */
  const _upgrEl = document.createElement('div');
  _upgrEl.id = 'upgr-screen';

  _upgrEl.innerHTML = `
    <!-- Atmospheric background layers -->
    <div class="upgr-nebula upgr-nb1"></div>
    <div class="upgr-nebula upgr-nb2"></div>
    <div class="upgr-nebula upgr-nb3"></div>
    <div class="upgr-stars"></div>

    <!-- TOP BAR -->
    <div class="upgr-topbar">
      <button class="upgr-back-btn" id="upgr-back-btn">&#8249;</button>
      <div class="upgr-title-zone">
        <span class="upgr-screen-label">GARAGE</span>
        <span class="upgr-screen-title">&#9881; UPGRADES</span>
      </div>
      <div class="upgr-coin-display">
        <svg viewBox="0 0 22 22" width="22" height="22" style="animation:coinSpin 3s linear infinite;display:block;">
          <defs>
            <radialGradient id="ucg" cx="38%" cy="32%">
              <stop offset="0%"   stop-color="#ffe97a"/>
              <stop offset="60%"  stop-color="#ffd700"/>
              <stop offset="100%" stop-color="#b8860b"/>
            </radialGradient>
          </defs>
          <circle cx="11" cy="11" r="10" fill="url(#ucg)" stroke="#a0720a" stroke-width="1"/>
          <text x="11" y="15.5" text-anchor="middle" font-size="9" fill="#7a4800" font-weight="bold" font-family="Arial">$</text>
        </svg>
        <span id="upgr-coins-val">0</span>
      </div>
    </div>

    <!-- UPGRADE TILES -->
    <div class="upgr-tiles-panel">
      <div class="upgr-tiles-row" id="upgr-tiles-row"></div>
    </div>

    <!-- VEHICLE STAGE -->
    <div class="upgr-stage">
      <div class="upgr-svg-wrap" id="upgr-svg-wrap"></div>
      <div class="upgr-vname-bar">
        <span class="upgr-check-icon" id="upgr-check-icon">&#10003;</span>
        <span class="upgr-vname" id="upgr-vname"></span>
      </div>
    </div>

    <!-- SELECT BUTTON -->
    <button class="upgr-select-btn" id="upgr-select-btn">SELECT</button>
  `;

  document.body.appendChild(_upgrEl);
  _upgrEl.style.display = 'none';

  // Inject coinSpin keyframe if not already in stylesheet
  if (!document.getElementById('upgr-keyframe-style')) {
    const ks = document.createElement('style');
    ks.id = 'upgr-keyframe-style';
    ks.textContent = `@keyframes coinSpin { from{transform:rotateY(0deg)} to{transform:rotateY(360deg)} }
      @keyframes sparkle { 0%{transform:scale(0) rotate(0deg);opacity:1;} 100%{transform:scale(1.5) rotate(180deg);opacity:0;} }`;
    document.head.appendChild(ks);
  }

  let _upgrVehicle = null;

  function _upgrRefreshCoins() {
    const el = document.getElementById('upgr-coins-val');
    if (el) el.textContent = api.storage.getCoins().toLocaleString();
  }

  function _renderUpgradeTiles() {
    const row = document.getElementById('upgr-tiles-row');
    if (!row || !_upgrVehicle) return;
    const coins = api.storage.getCoins();

    row.innerHTML = UPGRADE_DEFS.map(def => {
      const lvl    = api.storage.getUpgradeLevel(_upgrVehicle.id, def.key);
      const maxed  = lvl >= def.maxLevel;
      const cost   = maxed ? 0 : UPGRADE_COSTS[lvl];
      const afford = !maxed && coins >= cost;
      const pct    = Math.round((lvl / def.maxLevel) * 100);

      return `
        <div class="upgr-tile${maxed ? ' upgr-tile-max' : ''}" data-key="${def.key}">
          <div class="upgr-tile-icon">${def.icon}</div>
          <div class="upgr-tile-label">${def.label}</div>
          <div class="upgr-tile-lvl">${lvl}<span class="upgr-tile-max-lv">/${def.maxLevel}</span></div>
          <div class="upgr-tile-bar">
            <div class="upgr-tile-fill" style="--target-w:${pct}%;width:${pct}%"></div>
          </div>
          <div class="upgr-tile-cost ${maxed ? 'maxed' : afford ? 'can-afford' : 'no-coins'}">
            ${maxed
              ? `<span class="upgr-max-badge">MAX &#10003;</span>`
              : `<svg viewBox="0 0 16 16" width="12" height="12">
                   <circle cx="8" cy="8" r="7.5" fill="#ffd700"/>
                   <text x="8" y="12" text-anchor="middle" font-size="7" fill="#8a5000" font-weight="bold">$</text>
                 </svg>
                 <span>${cost.toLocaleString()}</span>`}
          </div>
        </div>`;
    }).join('');
  }

  function _refreshUpgrSelectBtn() {
    const btn  = document.getElementById('upgr-select-btn');
    const badge= document.getElementById('upgr-check-icon');
    if (!btn || !_upgrVehicle) return;
    const isSel = api.getCurrentSelection?.().vehicleId === _upgrVehicle.id;
    btn.textContent = isSel ? '\u2713  SELECTED' : 'SELECT';
    btn.className   = isSel ? 'upgr-select-btn upgr-selected-active' : 'upgr-select-btn';
    if (badge) badge.style.opacity = isSel ? '1' : '0.2';
  }

  function openUpgradeScreen(v) {
    _upgrVehicle = v;
    const svgFn = svgMap[v.id];
    document.getElementById('upgr-svg-wrap').innerHTML = svgFn ? svgFn(v) : '';
    document.getElementById('upgr-vname').textContent  = v.name.toUpperCase();
    _upgrRefreshCoins();
    _renderUpgradeTiles();
    _refreshUpgrSelectBtn();
    _upgrEl.style.display = 'flex';
    _startStageParticles();
  }

  function closeUpgradeScreen() {
    _upgrEl.style.display = 'none';
    _upgrVehicle = null;
    _stopStageParticles();
    renderGarage();
  }

  document.getElementById('upgr-back-btn').onclick = closeUpgradeScreen;

  document.getElementById('upgr-select-btn').onclick = () => {
    if (!_upgrVehicle) return;
    const isSel = api.getCurrentSelection?.().vehicleId === _upgrVehicle.id;
    if (!isSel) {
      api.selectVehicle(_upgrVehicle.id);
      if (api.getCurrentSelection) {
        const sel = api.getCurrentSelection();
        api.storage.setLastSelected(sel.levelId, _upgrVehicle.id);
      }
      _refreshUpgrSelectBtn();
      renderGarage();

      // Celebratory burst on select
      const btn  = document.getElementById('upgr-select-btn');
      const rect = btn.getBoundingClientRect();
      _burst(rect.left + rect.width / 2, rect.top + rect.height / 2, '#34d399');
    }
  };

  /* ── Tile click: upgrade with burst effect ───────────── */
  document.getElementById('upgr-tiles-row').addEventListener('click', e => {
    const tile = e.target.closest('.upgr-tile');
    if (!tile || !_upgrVehicle) return;

    const key  = tile.dataset.key;
    const def  = UPGRADE_DEFS.find(d => d.key === key);
    if (!def) return;

    const lvl = api.storage.getUpgradeLevel(_upgrVehicle.id, key);
    if (lvl >= def.maxLevel) {
      tile.classList.add('upgr-tile-bounce');
      setTimeout(() => tile.classList.remove('upgr-tile-bounce'), 400);
      return;
    }

    const cost = UPGRADE_COSTS[lvl];
    if (api.storage.getCoins() < cost) {
      tile.classList.add('upgr-tile-shake');
      setTimeout(() => tile.classList.remove('upgr-tile-shake'), 400);
      return;
    }

    api.storage.upgradeVehicle(_upgrVehicle.id, key, cost);
    _upgrRefreshCoins();
    _renderUpgradeTiles();

    // Particle burst at tile centre
    const rect = tile.getBoundingClientRect();
    _burst(rect.left + rect.width / 2, rect.top + rect.height / 2, def.color || '#63caff');
  });

  /* ── Rewarded ad — garage ────────────────────────────── */
  if (btnWatchAdCoins) {
    btnWatchAdCoins.onclick = async () => {
      const platform = api.platform;
      if (!platform || !platform.isPlatform()) { alert('Rewarded ads are only available on Poki or CrazyGames.'); return; }
      btnWatchAdCoins.disabled    = true;
      btnWatchAdCoins.textContent = 'Loading ad...';
      try {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        if (result.success) { api.storage.addCoins(50); alert('You earned 50 coins!'); }
        else alert('Ad was not completed.');
      } catch (err) {
        console.error('Rewarded ad error:', err);
        alert('Failed to load ad. Please try again.');
      } finally {
        btnWatchAdCoins.disabled    = false;
        btnWatchAdCoins.textContent = 'Watch Ad for 50 Coins';
      }
    };
  }

  /* ── Rewarded ad — gameover ──────────────────────────── */
  if (btnGameoverAdCoins) {
    btnGameoverAdCoins.onclick = async () => {
      const platform = api.platform;
      if (!platform || !platform.isPlatform()) { alert('Rewarded ads are only available on Poki or CrazyGames.'); return; }
      btnGameoverAdCoins.disabled    = true;
      btnGameoverAdCoins.textContent = 'Loading ad...';
      try {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        if (result.success) {
          api.storage.addCoins(50);
          alert('You earned 50 coins!');
          if (pendingResult) { pendingResult.coinsEarned += 50; showGameoverFromResult(pendingResult); }
        } else alert('Ad was not completed.');
      } catch (err) {
        console.error('Rewarded ad error:', err);
        alert('Failed to load ad. Please try again.');
      } finally {
        btnGameoverAdCoins.disabled    = false;
        btnGameoverAdCoins.textContent = 'Watch Ad for 50 Coins';
      }
    };
  }

  /* ── Level unlock logic ──────────────────────────────── */
  function isLevelUnlocked(levelId, storage) {
    if (levelId === 1) return true;
    if (levelId <= 3)  return true;
    const prevStars = storage.getLevelStars(levelId - 1) || 0;
    const totalStarsBefore = Object.entries(storage.getAll().levelStars || {})
      .filter(([id]) => Number(id) < levelId)
      .reduce((acc, [, s]) => acc + s, 0);
    return prevStars >= 2 || totalStarsBefore >= levelId;
  }
}