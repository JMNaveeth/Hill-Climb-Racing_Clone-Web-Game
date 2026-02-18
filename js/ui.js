// ui.js - Menus, screens, transitions, vehicle and level selection

import { vehicles } from "./vehicles.js";

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

  const levelGrid = document.getElementById("level-grid");
  function renderLevelSelect() {
    if (!levelGrid) return;
    const data = api.getLevels();
    const st = api.storage;
    levelGrid.innerHTML = "";
    for (const level of data) {
      const div = document.createElement("button");
      div.className = "level-tile";
      div.classList.add(level.difficulty);
      const unlocked = isLevelUnlocked(level.id, st);
      if (!unlocked) {
        div.classList.add("locked");
        const lock = document.createElement("div");
        lock.className = "lock";
        lock.textContent = "🔒";
        div.appendChild(lock);
      }
      const stars = st.getLevelStars(level.id) || 0;
      div.innerHTML += `<div>${level.id}</div><div style="font-size:0.6rem">${level.name}</div><div style="font-size:0.6rem">${"★".repeat(
        stars
      )}${"☆".repeat(3 - stars)}</div>`;
      if (unlocked) {
        div.onclick = () => {
          api.selectLevel(level.id);
          const selVehicle = api.getCurrentSelection().vehicleId;
          api.storage.setLastSelected(level.id, selVehicle);
          api.startRun({ levelId: level.id, vehicleId: selVehicle });
          showScreen(null);
        };
      }
      levelGrid.appendChild(div);
    }
  }

  const vehicleCarousel = document.getElementById("vehicle-carousel");
  const vehicleStats = document.getElementById("vehicle-stats");
  const btnUnlockVehicle = document.getElementById("btn-unlock-vehicle");
  const btnUnlockAd = document.getElementById("btn-unlock-ad");
  const btnWatchAdCoins = document.getElementById("btn-watch-ad-coins");
  const btnSelectVehicle = document.getElementById("btn-select-vehicle");
  const btnGameoverAdCoins = document.getElementById("btn-gameover-ad-coins");

  let vehicleIndex = 0;

  function renderGarage() {
    if (!vehicleCarousel || !vehicleStats) {
      console.error('Garage elements not found');
      return;
    }
    
    if (!vehicles || vehicles.length === 0) {
      console.error('Vehicles array is empty');
      vehicleCarousel.innerHTML = '<div>No vehicles available</div>';
      return;
    }
    
    const st = api.storage;
    vehicleCarousel.innerHTML = "";

    const v = vehicles[vehicleIndex];
    if (!v) {
      console.error('Vehicle at index', vehicleIndex, 'not found');
      return;
    }
    const unlocked = st.isVehicleUnlocked(v.id) || v.defaultUnlocked;
    if (v.defaultUnlocked && !st.isVehicleUnlocked(v.id)) {
      st.unlockVehicle(v.id);
    }

    const left = document.createElement("button");
    left.textContent = "<";
    left.style.width = "40px";
    left.onclick = () => {
      vehicleIndex = (vehicleIndex - 1 + vehicles.length) % vehicles.length;
      renderGarage();
    };

    const right = document.createElement("button");
    right.textContent = ">";
    right.style.width = "40px";
    right.onclick = () => {
      vehicleIndex = (vehicleIndex + 1) % vehicles.length;
      renderGarage();
    };

    const center = document.createElement("div");
    center.style.flex = "1";
    center.style.textAlign = "center";
    center.innerHTML = `<div style="font-weight:700;margin-bottom:4px">${v.name}</div>
      <div style="font-size:0.75rem;opacity:0.8">${v.type === "car" ? "Car" : "Motorbike"}</div>
      <div style="margin-top:6px;font-size:0.7rem;opacity:0.7">${
        unlocked ? "Unlocked" : `Locked • Cost: ${v.cost} coins`
      }</div>`;

    vehicleCarousel.appendChild(left);
    vehicleCarousel.appendChild(center);
    vehicleCarousel.appendChild(right);

    vehicleStats.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = makeStatRow("Speed", v.stats.speed) +
      makeStatRow("Accel", v.stats.acceleration) +
      makeStatRow("Fuel Eff.", v.stats.fuelEfficiency) +
      makeStatRow("Grip", v.stats.grip) +
      makeStatRow("Traction", v.stats.traction);
    vehicleStats.appendChild(wrapper);

    if (btnUnlockVehicle) {
      btnUnlockVehicle.disabled = unlocked;
      btnUnlockVehicle.textContent = unlocked
        ? "Unlocked"
        : `Unlock for ${v.cost} coins`;
    }
    if (btnSelectVehicle) {
      btnSelectVehicle.disabled = !unlocked;
    }
    if (btnUnlockAd) {
      btnUnlockAd.disabled = unlocked;
      btnUnlockAd.style.display = unlocked ? 'none' : 'block';
    }
    if (btnUnlockVehicle) {
      btnUnlockVehicle.style.display = unlocked ? 'none' : 'block';
    }
  }

  function makeStatRow(label, value) {
    // Value is 1-10, convert to percentage (0-100%)
    const pct = Math.max(0, Math.min(100, (value / 10) * 100));
    return `<div class="stat-row">
      <span>${label}</span>
      <div class="stat-bar">
        <div class="stat-bar-fill" style="width:${pct}%"></div>
      </div>
    </div>`;
  }

  if (btnUnlockVehicle) {
    btnUnlockVehicle.onclick = () => {
      const st = api.storage;
      const v = vehicles[vehicleIndex];
      const unlocked = st.isVehicleUnlocked(v.id);
      if (unlocked) return;
      if (st.getCoins() >= v.cost) {
        st.addCoins(-v.cost);
        st.unlockVehicle(v.id);
        alert(`Unlocked ${v.name}!`);
        renderGarage();
      } else {
        alert("Not enough coins.");
      }
    };
  }

  if (btnSelectVehicle) {
    btnSelectVehicle.onclick = () => {
      const v = vehicles[vehicleIndex];
      const st = api.storage;
      const unlocked = st.isVehicleUnlocked(v.id);
      if (!unlocked) return;
      api.selectVehicle(v.id);
      const sel = api.getCurrentSelection();
      api.storage.setLastSelected(sel.levelId, v.id);
      alert(`${v.name} selected.`);
    };
  }

  // Rewarded ad for unlocking vehicle
  if (btnUnlockAd) {
    btnUnlockAd.onclick = async () => {
      const platform = api.platform;
      const v = vehicles[vehicleIndex];
      const st = api.storage;
      
      if (st.isVehicleUnlocked(v.id)) return;
      
      if (!platform || !platform.isPlatform()) {
        alert('Rewarded ads are only available on Poki or CrazyGames.');
        return;
      }
      
      btnUnlockAd.disabled = true;
      btnUnlockAd.textContent = 'Loading ad...';
      
      try {
        const result = await platform.requestRewardedAd({ size: 'medium' });
        if (result.success) {
          st.unlockVehicle(v.id);
          alert(`Unlocked ${v.name} by watching an ad!`);
          renderGarage();
        } else {
          alert('Ad was not completed. Vehicle remains locked.');
        }
      } catch (err) {
        console.error('Rewarded ad error:', err);
        alert('Failed to load ad. Please try again.');
      } finally {
        btnUnlockAd.disabled = false;
        btnUnlockAd.textContent = 'Watch Ad to Unlock';
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

