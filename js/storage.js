// storage.js — LocalStorage wrapper for game persistence
// Enhanced version — 100% original code, free to publish (no copyright claims)

export class Storage {
  constructor(ls) {
    this.ls  = ls;
    this.key = "hillclimb_canvas_save_v1";

    // Load saved state, fall back to fresh defaults, then persist
    this.state = this._load() || this._createDefaultState();
    this._migrate();   // future-proof: fill in any missing fields
    this._save();
  }

  /* ─── Default state factory ──────────────────────── */
  _createDefaultState() {
    return {
      coins: 0,
      unlockedVehicles: {
        rusty_hatchback: true,
        monster_truck:   true,
        dirt_bike:       true,
      },
      bestDistances:      {},
      levelStars:         {},
      bestDistanceOverall:0,
      lastSelectedVehicle:"rusty_hatchback",
      lastSelectedLevel:  1,
      vehicleDiscounts:   {},
      vehicleUpgrades:    {},
    };
  }

  /* ─── Migration: fill fields added after initial release ─ */
  _migrate() {
    if (!this.state.vehicleDiscounts) this.state.vehicleDiscounts = {};
    if (!this.state.vehicleUpgrades)  this.state.vehicleUpgrades  = {};
    if (this.state.bestDistanceOverall === undefined) this.state.bestDistanceOverall = 0;
  }

  /* ─── Load / save ────────────────────────────────── */
  _load() {
    try {
      const raw = this.ls.getItem(this.key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Sanity check: must be a plain object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  _save() {
    try {
      this.ls.setItem(this.key, JSON.stringify(this.state));
    } catch {
      // Silently ignore quota errors — progress is kept in memory for this session
    }
  }

  /* ─── Full state accessor ────────────────────────── */
  getAll() {
    return this.state;
  }

  /* ─── Coins ──────────────────────────────────────── */
  getCoins() {
    return this.state.coins || 0;
  }

  setCoins(value) {
    this.state.coins = Math.max(0, Math.floor(value));
    this._save();
  }

  addCoins(amount) {
    this.setCoins(this.getCoins() + amount);
  }

  /* ─── Vehicles ───────────────────────────────────── */
  isVehicleUnlocked(id) {
    return !!this.state.unlockedVehicles[id];
  }

  unlockVehicle(id) {
    this.state.unlockedVehicles[id] = true;
    this._save();
  }

  /* ─── Best distances ─────────────────────────────── */
  getBestDistance(levelId) {
    return this.state.bestDistances[levelId] || 0;
  }

  setBestDistance(levelId, distance) {
    const prev = this.getBestDistance(levelId);
    if (distance > prev) {
      this.state.bestDistances[levelId]    = distance;
      this.state.bestDistanceOverall       = Math.max(this.state.bestDistanceOverall || 0, distance);
      this._save();
    }
  }

  getBestDistanceOverall() {
    return this.state.bestDistanceOverall || 0;
  }

  /* ─── Level stars ────────────────────────────────── */
  getLevelStars(levelId) {
    return this.state.levelStars[levelId] || 0;
  }

  setLevelStars(levelId, stars) {
    const current = this.getLevelStars(levelId);
    if (stars > current) {
      this.state.levelStars[levelId] = Math.min(3, stars);
      this._save();
    }
  }

  getTotalStars() {
    return Object.values(this.state.levelStars || {}).reduce((acc, s) => acc + (s || 0), 0);
  }

  /* ─── Selection memory ───────────────────────────── */
  setLastSelected(levelId, vehicleId) {
    this.state.lastSelectedLevel   = levelId;
    this.state.lastSelectedVehicle = vehicleId;
    this._save();
  }

  /* ─── Vehicle discounts (ad rewards) ────────────── */
  getVehicleDiscount(id) {
    return (this.state.vehicleDiscounts && this.state.vehicleDiscounts[id]) || 0;
  }

  addVehicleDiscount(id, amount) {
    if (!this.state.vehicleDiscounts) this.state.vehicleDiscounts = {};
    this.state.vehicleDiscounts[id] = (this.state.vehicleDiscounts[id] || 0) + amount;
    this._save();
  }

  /* ─── Vehicle upgrades ───────────────────────────── */
  getUpgradeLevel(vehicleId, type) {
    const vu = this.state.vehicleUpgrades || {};
    return (vu[vehicleId] && vu[vehicleId][type]) || 0;
  }

  /**
   * Increment one upgrade level and deduct the coin cost.
   * Returns true if successful, false if insufficient coins.
   */
  upgradeVehicle(vehicleId, type, cost) {
    if (this.getCoins() < cost) return false;

    if (!this.state.vehicleUpgrades)            this.state.vehicleUpgrades = {};
    if (!this.state.vehicleUpgrades[vehicleId]) this.state.vehicleUpgrades[vehicleId] = {};

    this.state.vehicleUpgrades[vehicleId][type] =
      (this.state.vehicleUpgrades[vehicleId][type] || 0) + 1;

    this.setCoins(this.getCoins() - cost); // setCoins calls _save()
    return true;
  }

  /** Return a summary of all upgrades for a given vehicle. */
  getVehicleUpgrades(vehicleId) {
    return (this.state.vehicleUpgrades && this.state.vehicleUpgrades[vehicleId]) || {};
  }

  /* ─── Reset (for debug / fresh-start button) ─────── */
  reset() {
    this.state = this._createDefaultState();
    this._save();
  }
}