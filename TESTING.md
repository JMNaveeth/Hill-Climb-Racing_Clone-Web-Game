# Testing Guide

## Quick Debug Checklist

If buttons aren't working or vehicles aren't showing:

1. **Open Browser Console** (F12)
   - Check for any red error messages
   - Look for "Game initialized successfully" message
   - Check if Matter.js loaded correctly

2. **Common Issues:**

   **Issue: "Matter is not defined"**
   - Solution: Check internet connection, Matter.js CDN might be blocked
   - Try refreshing the page

   **Issue: "Vehicles array is empty"**
   - Solution: Check if `js/vehicles.js` file exists and is loading
   - Check console for import errors

   **Issue: Buttons don't respond**
   - Solution: Check if UI initialized (look for "Initializing UI..." in console)
   - Verify all button IDs match between HTML and JS

   **Issue: Canvas is blank**
   - Solution: Check if canvas element exists
   - Verify renderer is initialized

3. **Test Steps:**
   - Open `index.html` in a browser
   - Open Developer Console (F12)
   - Click "Play" button - should see "Play button clicked" in console
   - Click "Garage" button - should see "Garage button clicked" and vehicles should appear
   - Check console for any errors

4. **If Still Not Working:**
   - Make sure you're using a local web server (not file://)
   - Try: `python -m http.server 8000` or `npx serve`
   - Access via `http://localhost:8000/index.html`

## Expected Console Output

When game loads successfully, you should see:
```
Starting game initialization...
Initializing UI...
Game initialized successfully
```

When clicking buttons:
```
Play button clicked
Starting run with: {levelId: 1, vehicleId: "rusty_hatchback"}
Game started successfully
```

## File Structure Check

Make sure these files exist:
- `index.html`
- `style.css`
- `js/main.js`
- `js/physics.js`
- `js/renderer.js`
- `js/vehicles.js`
- `js/levels.js`
- `js/hud.js`
- `js/ui.js`
- `js/input.js`
- `js/storage.js`
- `js/audio.js`
- `js/particles.js`
- `js/platform.js`
