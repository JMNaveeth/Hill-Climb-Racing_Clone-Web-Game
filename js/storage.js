// storage.js - LocalStorage wrapper for game persistence

export class Storage {
  constructor(ls) {
    this.ls = ls;
    this.key = "hillclimb_canvas_save_v1";
    this.state = this._load() || this._createDefaultState();
    this._save();
  }

  _createDefaultState() {
    return {
      coins: 0,
      unlockedVehicles: {
        rusty_hatchback: true,
        monster_truck: true,
        dirt_bike: true,
      },
      bestDistances: {},
      levelStars: {},
      bestDistanceOverall: 0,
      lastSelectedVehicle: "rusty_hatchback",
      lastSelectedLevel: 1,
      vehicleDiscounts: {},
    };
  }

  _load() {
    try {
      const raw = this.ls.getItem(this.key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  _save() {
    try {
      this.ls.setItem(this.key, JSON.stringify(this.state));
    } catch {
      // ignore quota errors
    }
  }

  getAll() {
    return this.state;
  }

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

  isVehicleUnlocked(id) {
    return !!this.state.unlockedVehicles[id];
  }

  unlockVehicle(id) {
    this.state.unlockedVehicles[id] = true;
    this._save();
  }

  getBestDistance(levelId) {
    return this.state.bestDistances[levelId] || 0;
  }

  setBestDistance(levelId, distance) {
    this.state.bestDistances[levelId] = Math.max(
      this.getBestDistance(levelId),
      distance
    );
    this.state.bestDistanceOverall = Math.max(
      this.state.bestDistanceOverall,
      distance
    );
    this._save();
  }

  getLevelStars(levelId) {
    return this.state.levelStars[levelId] || 0;
  }

  setLevelStars(levelId, stars) {
    this.state.levelStars[levelId] = Math.max(
      this.getLevelStars(levelId),
      stars
    );
    this._save();
  }

  setLastSelected(levelId, vehicleId) {
    this.state.lastSelectedLevel = levelId;
    this.state.lastSelectedVehicle = vehicleId;
    this._save();
  }

  getVehicleDiscount(id) {
    return (this.state.vehicleDiscounts && this.state.vehicleDiscounts[id]) || 0;
  }

  addVehicleDiscount(id, amount) {
    if (!this.state.vehicleDiscounts) this.state.vehicleDiscounts = {};
    this.state.vehicleDiscounts[id] = (this.state.vehicleDiscounts[id] || 0) + amount;
    this._save();
  }
}

