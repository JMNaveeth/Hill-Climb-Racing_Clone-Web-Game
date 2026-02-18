// platform.js - Platform detection and SDK integration for Poki.com and CrazyGames.com

export class PlatformIntegration {
  constructor() {
    this.platform = this.detectPlatform();
    this.sdk = null;
    this.initialized = false;
    this.audioManager = null;
  }

  detectPlatform() {
    try {
      // Check if Poki SDK is loaded
      if (typeof PokiSDK !== 'undefined') {
        return 'poki';
      }
      // Check if CrazyGames SDK is loaded
      if (typeof CrazySDK !== 'undefined') {
        return 'crazygames';
      }
      // Check if running on Poki (safe check)
      try {
        if (window.parent !== window && window.parent.location.hostname.includes('poki.com')) {
          return 'poki';
        }
      } catch (e) {
        // Cross-origin, ignore
      }
      // Check if running on CrazyGames (safe check)
      try {
        if (window.parent !== window && window.parent.location.hostname.includes('crazygames.com')) {
          return 'crazygames';
        }
      } catch (e) {
        // Cross-origin, ignore
      }
    } catch (error) {
      console.warn('Platform detection error:', error);
    }
    return 'standalone';
  }

  async init(audioManager) {
    this.audioManager = audioManager;
    
    if (this.platform === 'poki') {
      await this.initPoki();
    } else if (this.platform === 'crazygames') {
      await this.initCrazyGames();
    }
    
    this.initialized = true;
    return this.platform;
  }

  async initPoki() {
    return new Promise((resolve) => {
      if (typeof PokiSDK === 'undefined') {
        console.warn('Poki SDK not loaded');
        resolve();
        return;
      }

      PokiSDK.init().then(() => {
        console.log('Poki SDK initialized');
        this.sdk = PokiSDK;
        PokiSDK.gameLoadingFinished();
        resolve();
      }).catch((err) => {
        console.error('Poki SDK init failed:', err);
        resolve();
      });
    });
  }

  async initCrazyGames() {
    return new Promise((resolve) => {
      if (typeof CrazySDK === 'undefined') {
        console.warn('CrazyGames SDK not loaded');
        resolve();
        return;
      }

      CrazySDK.init().then(() => {
        console.log('CrazyGames SDK initialized');
        this.sdk = CrazySDK;
        resolve();
      }).catch((err) => {
        console.error('CrazyGames SDK init failed:', err);
        resolve();
      });
    });
  }

  gameplayStart() {
    if (!this.initialized) return;
    
    if (this.platform === 'poki' && this.sdk) {
      this.sdk.gameplayStart();
    }
  }

  gameplayStop() {
    if (!this.initialized) return;
    
    if (this.platform === 'poki' && this.sdk) {
      this.sdk.gameplayStop();
    }
  }

  requestInterstitialAd(callback) {
    if (!this.initialized || !this.sdk) {
      // Fallback: just call callback immediately
      callback();
      return;
    }

    if (this.platform === 'poki') {
      // Poki commercial break - may or may not show an ad
      this.sdk.commercialBreak().then(() => {
        callback();
      }).catch(() => {
        callback();
      });
    } else if (this.platform === 'crazygames') {
      // CrazyGames midgame ad
      this.sdk.ad.requestAd({
        adStarted: () => {
          // Pause audio/game when ad starts
          if (this.audioManager) {
            this.audioManager.suspend();
          }
          window.dispatchEvent(new Event('game:ad-started'));
        },
        adFinished: () => {
          // Resume audio/game when ad finishes
          if (this.audioManager) {
            this.audioManager.resume();
          }
          window.dispatchEvent(new Event('game:ad-finished'));
          callback();
        },
        adError: () => {
          // Ad failed to load, continue anyway
          callback();
        }
      });
    } else {
      // Standalone: no ads
      callback();
    }
  }

  requestRewardedAd(options = {}) {
    return new Promise((resolve) => {
      if (!this.initialized || !this.sdk) {
        resolve({ success: false });
        return;
      }

      if (this.platform === 'poki') {
        this.sdk.rewardedBreak({
          size: options.size || 'medium',
          onStart: () => {
            if (this.audioManager) {
              this.audioManager.suspend();
            }
            window.dispatchEvent(new Event('game:ad-started'));
          }
        }).then((success) => {
          if (this.audioManager) {
            this.audioManager.resume();
          }
          window.dispatchEvent(new Event('game:ad-finished'));
          resolve({ success });
        }).catch(() => {
          if (this.audioManager) {
            this.audioManager.resume();
          }
          resolve({ success: false });
        });
      } else if (this.platform === 'crazygames') {
        this.sdk.ad.requestRewardedAd({
          adStarted: () => {
            if (this.audioManager) {
              this.audioManager.suspend();
            }
            window.dispatchEvent(new Event('game:ad-started'));
          },
          adFinished: (adWatched) => {
            if (this.audioManager) {
              this.audioManager.resume();
            }
            window.dispatchEvent(new Event('game:ad-finished'));
            resolve({ success: adWatched });
          },
          adError: () => {
            if (this.audioManager) {
              this.audioManager.resume();
            }
            resolve({ success: false });
          }
        });
      } else {
        resolve({ success: false });
      }
    });
  }

  getPlatform() {
    return this.platform;
  }

  isPlatform() {
    return this.platform !== 'standalone';
  }
}
