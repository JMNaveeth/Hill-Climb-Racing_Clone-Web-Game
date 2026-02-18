// ui.js - Menus, screens, transitions, vehicle and level selection

import { vehicles, svgMap } from "./vehicles.js";

export function initUI(api) {
  console.log('Initializing UI...');
  
  const mainMenu = document.getElementById("screen-main-menu");
  const levelSelect = document.getElementById("screen-level-select");
  const garage = document.getElementById("screen-garage");
  const pauseScreen = document.getElementById("screen-pause");
  const adScreen = document.getElementById("screen-ad");
  const gameoverScreen = document.getElementById("screen-gameover");
  
  if (!mainMenu || !levelSelect || !garage) {
    console.error('Critical UI elements missing!');
    return;
  }

  const screens = {
    main: mainMenu,
    level: levelSelect,
    garage,
    pause: pauseScreen,
    ad: adScreen,
    gameover: gameoverScreen,
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => {
      if (!el) return;
      el.classList.remove("active");
    });
    if (screens[name]) screens[name].classList.add("active");

    // Hide pedal buttons and gauges whenever any overlay screen is shown; show only during gameplay (name === null)
    const btnBrake = document.getElementById("btn-brake");
    const btnGas = document.getElementById("btn-gas");
    const hudGauges = document.getElementById("hud-gauges");
    const isGameplay = name === null || name === undefined;
    if (btnBrake) btnBrake.style.visibility = isGameplay ? "visible" : "hidden";
    if (btnGas) btnGas.style.visibility = isGameplay ? "visible" : "hidden";
    if (hudGauges) hudGauges.style.visibility = isGameplay ? "visible" : "hidden";
  }

  showScreen("main");
  
  // Verify vehicles are loaded
  if (!vehicles || vehicles.length === 0) {
    console.error('Vehicles array is empty or not loaded!');
  } else {
    console.log('Loaded', vehicles.length, 'vehicles');
  }

  const btnPlay = document.getElementById("btn-play");
  const btnGarage = document.getElementById("btn-garage");
  const btnLevels = document.getElementById("btn-levels");
  const btnSettings = document.getElementById("btn-settings");
  const btnLeaderboard = document.getElementById("btn-leaderboard");

  if (btnPlay) {
    btnPlay.onclick = () => {
      console.log('Play button clicked');
      try {
        const sel = api.getCurrentSelection();
        console.log('Starting run with:', sel);
        api.startRun({ levelId: sel.levelId, vehicleId: sel.vehicleId });
        showScreen(null);
      } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Check console for details.');
      }
    };
  } else {
    console.error('Play button not found!');
  }
  if (btnGarage) {
    btnGarage.onclick = () => {
      console.log('Garage button clicked');
      showScreen("garage");
      renderGarage();
    };
  } else {
    console.error('Garage button not found!');
  }
  if (btnLevels) {
    btnLevels.onclick = () => {
      showScreen("level");
      renderLevelSelect();
    };
  }
  if (btnSettings) {
    btnSettings.onclick = () => {
      alert("Settings coming soon.");
    };
  }
  if (btnLeaderboard) {
    btnLeaderboard.onclick = () => {
      alert("Local-only leaderboard in this demo.");
    };
  }

  document.querySelectorAll(".btn-back").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      Object.values(screens).forEach((el) => el && el.classList.remove("active"));
      const el = document.getElementById(targetId);
      if (el) el.classList.add("active");
    });
  });

  const btnPause = document.getElementById("btn-pause");
  if (btnPause) {
    btnPause.onclick = () => {
      window.dispatchEvent(new Event("game:pause"));
      showScreen("pause");
    };
  }

  const btnResume = document.getElementById("btn-resume");
  const btnRestart = document.getElementById("btn-restart");
  const btnQuit = document.getElementById("btn-quit");
  if (btnResume) {
    btnResume.onclick = () => {
      showScreen(null);
      window.dispatchEvent(new Event("game:resume"));
    };
  }
  if (btnRestart) {
    btnRestart.onclick = () => {
      showScreen(null);
      window.dispatchEvent(new Event("game:restart"));
    };
  }
  if (btnQuit) {
    btnQuit.onclick = () => {
      showScreen("main");
      window.dispatchEvent(new Event("game:quit"));
    };
  }

  const gameoverTitle = document.getElementById("gameover-title");
  const gameoverSummary = document.getElementById("gameover-summary");
  const gameoverStars = document.getElementById("gameover-stars");
  const btnAdContinue = document.getElementById("btn-ad-continue");
  const adSlot = document.getElementById("ad-slot-interstitial");

  let pendingResult = null;

  const btnGoRestart = document.getElementById("btn-gameover-restart");
  const btnGoLevels = document.getElementById("btn-gameover-levels");
  const btnGoMain = document.getElementById("btn-gameover-main");

  if (btnGoRestart) {
    btnGoRestart.onclick = () => {
      showScreen(null);
      window.dispatchEvent(new Event("game:restart"));
    };
  }
  if (btnGoLevels) {
    btnGoLevels.onclick = () => {
      showScreen("level");
      renderLevelSelect();
      window.dispatchEvent(new Event("game:quit"));
    };
  }
  if (btnGoMain) {
    btnGoMain.onclick = () => {
      showScreen("main");
      window.dispatchEvent(new Event("game:quit"));
    };
  }

  function showGameoverFromResult(d) {
    if (!d) return;
    if (gameoverTitle) {
      gameoverTitle.textContent = d.reachedFinish ? "Level Complete!" : "Game Over";
    }
    if (gameoverSummary) {
      gameoverSummary.textContent = `Distance: ${d.distance.toFixed(
        1
      )} m  |  Best: ${d.bestDistance.toFixed(1)} m  |  Coins: +${
        d.coinsEarned
      }`;
    }
    if (gameoverStars) {
      const starsStr = "★".repeat(d.stars) + "☆".repeat(3 - d.stars);
      gameoverStars.textContent = starsStr;
    }
    showScreen("gameover");
  }

  function showAdThenGameover(resultDetail) {
    pendingResult = resultDetail;
    
    const platform = api.platform;
    
    // Use platform SDK if available, otherwise show ad screen
    if (platform && platform.isPlatform()) {
      // Use platform SDK for ads
      platform.requestInterstitialAd(() => {
        showGameoverFromResult(pendingResult);
        pendingResult = null;
      });
    } else {
      // Fallback: show custom ad screen
      if (!adScreen || !adSlot) {
        showGameoverFromResult(pendingResult);
        return;
      }

      showScreen("ad");

      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        showGameoverFromResult(pendingResult);
        pendingResult = null;
      };

      if (btnAdContinue) {
        btnAdContinue.onclick = () => done();
      }

      // Auto-continue after 2 seconds if no ad system
      setTimeout(done, 2000);
    }
  }

  window.addEventListener("game:run-ended", (ev) => {
    const d = ev.detail;
    if (!d) return;
    showAdThenGameover(d);
  });

  const THEME_ICONS = {
    pastelFields:'🛣️', pastelHills:'⛰️', beach:'🏖️', farm:'🌾', cliffs:'🪨',
    meadow:'🌿', plains:'🌄', orchard:'🍎', lake:'🏞️', forest:'🌲',
    mountain:'🗻', desert:'🏜️', jungle:'🌴', snow:'❄️', canyon:'🏔️',
    volcano:'🌋', arctic:'🧊', rainforest:'🌧️', swamp:'🐸', storm:'⛈️',
    asteroid:'☄️', cave:'🌑', underwater:'🐠', space:'🚀', lava:'🔥',
    nightmare:'😱', chaos:'💥', moon:'🌙', inferno:'☠️', final:'🏆',
  };
  const DIFF_META = {
    easy:     { label:'Easy',     color:'#4ade80', glow:'rgba(74,222,128,0.25)' },
    normal:   { label:'Normal',   color:'#60a5fa', glow:'rgba(96,165,250,0.25)' },
    hard:     { label:'Hard',     color:'#f87171', glow:'rgba(248,113,113,0.25)' },
    advanced: { label:'Advanced', color:'#c084fc', glow:'rgba(192,132,252,0.28)' },
  };

  const levelGrid = document.getElementById("level-grid");
  function renderLevelSelect() {
    if (!levelGrid) return;
    const data = api.getLevels();
    const st = api.storage;
    levelGrid.innerHTML = "";

    let lastDiff = null;
    for (const level of data) {
      // ── difficulty section header ──
      if (level.difficulty !== lastDiff) {
        lastDiff = level.difficulty;
        const meta = DIFF_META[level.difficulty] || DIFF_META.easy;
        const hdr = document.createElement('div');
        hdr.className = 'level-section-header';
        hdr.style.setProperty('--diff-color', meta.color);
        hdr.innerHTML = `<span class="diff-dot"></span>${meta.label}<span class="diff-line"></span>`;
        levelGrid.appendChild(hdr);
      }

      const unlocked = isLevelUnlocked(level.id, st);
      const stars = st.getLevelStars(level.id) || 0;
      const icon = THEME_ICONS[level.theme] || '🎮';
      const meta = DIFF_META[level.difficulty] || DIFF_META.easy;

      const div = document.createElement('button');
      div.className = `level-tile ${level.difficulty}${unlocked ? '' : ' locked'}`;
      div.style.setProperty('--diff-color', meta.color);
      div.style.setProperty('--diff-glow', meta.glow);
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
          <div class="lt-play-hint">▶ Play</div>
        `;
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
          <div class="lt-stars">${starsHtml}</div>
        `;
      }
      levelGrid.appendChild(div);
    }
  }

  const btnWatchAdCoins = document.getElementById("btn-watch-ad-coins");
  const btnGameoverAdCoins = document.getElementById("btn-gameover-ad-coins");

  const _statColors = {
    speed:'linear-gradient(90deg,#f7971e,#ffd200)',
    acceleration:'linear-gradient(90deg,#11998e,#38ef7d)',
    fuelEfficiency:'linear-gradient(90deg,#36d1dc,#5b86e5)',
    grip:'linear-gradient(90deg,#a18cd1,#fbc2eb)',
    traction:'linear-gradient(90deg,#ff512f,#dd2476)',
  };
  const _statLabels = {speed:'Speed',acceleration:'Accel',fuelEfficiency:'Efficiency',grip:'Grip',traction:'Traction'};
  const _statKeys = ['speed','acceleration','fuelEfficiency','grip','traction'];

  function renderGarage() {
    const garageGrid = document.getElementById('garage-grid');
    const garageCoins = document.getElementById('garage-coins');
    if (!garageGrid) return;

    const st = api.storage;
    const selectedId = api.getCurrentSelection ? api.getCurrentSelection().vehicleId : null;

    if (garageCoins) garageCoins.textContent = `⚡ ${st.getCoins()} coins`;
    garageGrid.innerHTML = '';

    vehicles.forEach(v => {
      if (v.defaultUnlocked && !st.isVehicleUnlocked(v.id)) st.unlockVehicle(v.id);
      const unlocked = st.isVehicleUnlocked(v.id) || v.defaultUnlocked;
      const selected = selectedId === v.id;
      const canAfford = st.getCoins() >= v.cost;

      const svgFn = svgMap[v.id];
      const svgHTML = svgFn ? svgFn(v) : '';

      const card = document.createElement('div');
      card.className = `gcard${unlocked ? '' : ' gcard-locked'}${selected ? ' gcard-selected' : ''}`;
      card.dataset.type = v.type;

      card.innerHTML = `
        <div class="gcard-bar" style="background:linear-gradient(90deg,${v.palette.body},${v.palette.accent})"></div>
        <div class="gcard-stage">
          ${!unlocked ? '<div class="gcard-lock">🔒</div>' : ''}
          ${selected ? '<div class="gcard-selected-badge">✓ IN USE</div>' : ''}
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
                <div class="gcard-stat-track"><div class="gcard-stat-fill" style="width:${v.stats[k]*10}%;background:${_statColors[k]}"></div></div>
              </div>
            `).join('')}
          </div>
          <div class="gcard-action">
            ${selected
              ? `<button class="gcard-btn gcard-btn-selected" disabled>✓ Selected</button>`
              : unlocked
                ? `<button class="gcard-btn gcard-btn-select" data-id="${v.id}">▶ Select</button>`
                : `<button class="gcard-btn gcard-btn-unlock${canAfford ? '' : ' cant-afford'}" data-id="${v.id}" data-cost="${v.cost}">${canAfford ? `Unlock ⚡${v.cost}` : `⚡${v.cost} coins needed`}</button>`
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

    // Card action buttons (delegated)
    garageGrid.onclick = e => {
      const selBtn = e.target.closest('.gcard-btn-select');
      const unlBtn = e.target.closest('.gcard-btn-unlock');
      if (selBtn) {
        const id = selBtn.dataset.id;
        api.selectVehicle(id);
        if (api.getCurrentSelection) {
          const sel = api.getCurrentSelection();
          api.storage.setLastSelected(sel.levelId, id);
        }
        renderGarage();
      }
      if (unlBtn && !unlBtn.classList.contains('cant-afford')) {
        const id = unlBtn.dataset.id;
        const cost = Number(unlBtn.dataset.cost);
        if (st.getCoins() >= cost) {
          st.addCoins(-cost);
          st.unlockVehicle(id);
          renderGarage();
        }
      }
    };
  }

  // Rewarded ad for coins (garage)
  if (btnWatchAdCoins) {
    btnWatchAdCoins.onclick = async () => {
      const platform = api.platform;
      
      if (!platform || !platform.isPlatform()) {
        alert('Rewarded ads are only available on Poki or CrazyGames.');
        return;
      }
      
      btnWatchAdCoins.disabled = true;
      btnWatchAdCoins.textContent = 'Loading ad...';
      
      try {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        if (result.success) {
          api.storage.addCoins(50);
          alert('You earned 50 coins!');
        } else {
          alert('Ad was not completed.');
        }
      } catch (err) {
        console.error('Rewarded ad error:', err);
        alert('Failed to load ad. Please try again.');
      } finally {
        btnWatchAdCoins.disabled = false;
        btnWatchAdCoins.textContent = 'Watch Ad for 50 Coins';
      }
    };
  }

  // Rewarded ad for coins (gameover)
  if (btnGameoverAdCoins) {
    btnGameoverAdCoins.onclick = async () => {
      const platform = api.platform;
      
      if (!platform || !platform.isPlatform()) {
        alert('Rewarded ads are only available on Poki or CrazyGames.');
        return;
      }
      
      btnGameoverAdCoins.disabled = true;
      btnGameoverAdCoins.textContent = 'Loading ad...';
      
      try {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        if (result.success) {
          api.storage.addCoins(50);
          alert('You earned 50 coins!');
          // Refresh gameover display
          if (pendingResult) {
            pendingResult.coinsEarned += 50;
            showGameoverFromResult(pendingResult);
          }
        } else {
          alert('Ad was not completed.');
        }
      } catch (err) {
        console.error('Rewarded ad error:', err);
        alert('Failed to load ad. Please try again.');
      } finally {
        btnGameoverAdCoins.disabled = false;
        btnGameoverAdCoins.textContent = 'Watch Ad for 50 Coins';
      }
    };
  }

  function isLevelUnlocked(levelId, storage) {
    if (levelId === 1) return true;
    if (levelId <= 3) return true;
    const prevStars = storage.getLevelStars(levelId - 1) || 0;
    const totalStarsBefore = Object.entries(storage.getAll().levelStars || {})
      .filter(([id]) => Number(id) < levelId)
      .reduce((acc, [, s]) => acc + s, 0);
    return prevStars >= 2 || totalStarsBefore >= levelId;
  }
}

