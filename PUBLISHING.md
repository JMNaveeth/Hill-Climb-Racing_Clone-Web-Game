# Publishing Guide for Poki.com and CrazyGames.com

This game is ready to be published on Poki.com and CrazyGames.com with full monetization support.

## 🎮 Platform Integration

The game automatically detects which platform it's running on and loads the appropriate SDK:

- **Poki.com**: Uses Poki SDK for ads and analytics
- **CrazyGames.com**: Uses CrazyGames SDK for ads and analytics
- **Standalone**: Works without any platform SDK (for testing)

## 📦 What's Included

### ✅ Automatic SDK Loading
- SDKs are loaded automatically when embedded on the respective platforms
- No manual configuration needed

### ✅ Ad Monetization
- **Interstitial Ads**: Shown automatically after each game run (death or level complete)
- **Rewarded Ads**: Available in Garage and Game Over screens for:
  - Unlocking vehicles (watch ad instead of paying coins)
  - Earning 50 bonus coins

### ✅ Platform Events
- Game loading finished
- Gameplay start/stop tracking
- Proper audio pause/resume during ads

## 🚀 Publishing Steps

### Poki.com

1. **Create Account**: Sign up at [developers.poki.com](https://developers.poki.com)

2. **Submit Game**:
   - Upload your game files (zip the entire project folder)
   - Game URL: Your hosted game URL or upload directly
   - The Poki SDK will be automatically injected when embedded

3. **Testing**:
   - Use Poki Inspector: https://inspector.poki.dev/
   - Test ad integration and gameplay events

4. **Monetization**:
   - Ads are automatically handled by Poki
   - Revenue sharing is handled by Poki's system
   - You'll receive earnings through their dashboard

### CrazyGames.com

1. **Create Account**: Sign up at [developer.crazygames.com](https://developer.crazygames.com)

2. **Submit Game**:
   - Upload your game files
   - Game URL: Your hosted game URL
   - The CrazyGames SDK will be automatically injected when embedded

3. **Testing**:
   - Test in their sandbox environment
   - Verify ad integration works correctly

4. **Monetization**:
   - Ads are automatically handled by CrazyGames
   - Revenue sharing is handled by their system
   - Earnings tracked in developer dashboard

## 📋 Pre-Publishing Checklist

- [x] Game is fully playable
- [x] All 30 levels are accessible
- [x] All 20 vehicles are unlockable
- [x] Ads integrate properly (interstitial + rewarded)
- [x] Audio pauses during ads
- [x] Gameplay events fire correctly
- [x] Mobile responsive
- [x] No console errors
- [x] LocalStorage saves progress

## 🔧 Testing Locally

To test platform integration locally:

1. **Test Poki**: Add `?poki=true` to your URL
   ```
   http://localhost:8000/index.html?poki=true
   ```

2. **Test CrazyGames**: Add `?crazygames=true` to your URL
   ```
   http://localhost:8000/index.html?crazygames=true
   ```

3. **Standalone**: Just open `index.html` normally

## 💰 Monetization Features

### Automatic Interstitial Ads
- Triggered after each game run ends
- Shown between gameplay and game over screen
- Platform decides when to actually show ads (not every call shows an ad)

### Rewarded Ads
- **Garage**: "Watch Ad to Unlock" button for locked vehicles
- **Garage**: "Watch Ad for 50 Coins" button
- **Game Over**: "Watch Ad for 50 Coins" button
- Player must watch full ad to receive reward

## 📊 Analytics

Both platforms track:
- Daily Active Users (DAU)
- Player engagement
- Ad impressions and revenue
- Conversion rates
- Error tracking

## 🐛 Troubleshooting

### Ads Not Showing
- Make sure you're testing on the actual platform (not standalone)
- Check browser console for SDK errors
- Verify SDK scripts are loading correctly

### Audio Issues During Ads
- Audio should automatically pause/resume
- If not, check `platform.js` integration

### Game Not Loading
- Check that Matter.js CDN is accessible
- Verify all JS files are loading
- Check browser console for errors

## 📝 Notes

- The game works standalone for testing, but ads only work on platforms
- Revenue is handled entirely by the platform (Poki/CrazyGames)
- You don't need to configure ad networks yourself
- Both platforms handle ad serving, optimization, and payment

## 🎯 Next Steps

1. Host your game files (GitHub Pages, Netlify, or your own server)
2. Submit to Poki.com and CrazyGames.com
3. Wait for approval
4. Monitor analytics and earnings in their dashboards

Good luck with your game launch! 🚀
