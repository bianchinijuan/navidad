# Getting Started Guide

## Quick Start

```bash
# Run the development server
npm run dev
```

Then open http://localhost:3000 in your browser.

## What You Can Do Right Now

The foundation is fully functional with two complete scenes:

### ✅ Working Features

1. **Intro Scene**
   - Animated snowfall
   - Beautiful zoom transition into the house
   - Click "Enter" to begin

2. **Hub Room (Living Room)**
   - Interactive Christmas tree (lights up when all rooms are complete)
   - Interactive fireplace (click to light)
   - Clickable gift under the tree (locked until tree lights up)
   - Door to Dog Room (unlocked and ready)
   - Door to Tarot Room (currently locked - unlocks after Dog Room)
   - Festive stockings

3. **Dog Room** - FULLY PLAYABLE
   - Click the food jar (right side) → Opens zoom view
   - Click "Open Jar" in zoom view
   - Click the bowl (near dog) → Adds food to bowl
   - Click the dog → Dog eats and gets happy
   - Photo reveals after 2 seconds
   - Tarot Room unlocks

4. **Zoom System**
   - Click any interactive object marked "zoomable"
   - Smooth camera movement
   - Backdrop blur effect
   - Click X or backdrop to exit

5. **Audio System**
   - Audio manager is ready (no audio files yet - see below)
   - Crossfade between scenes
   - SFX for interactions
   - Volume control system

## How to Play Through Current Content

1. Click "Enter" on intro screen
2. Wait for transition to Hub Room
3. Click the door labeled "Dog" on the left
4. In Dog Room:
   - Click the purple jar (right side, shelf)
   - Click "Open Jar" button in zoom view
   - Click the empty bowl (to the right of the dog)
   - Click the dog to feed it
   - Watch the dog get happy!
   - Photo frame appears on the wall
   - Click the photo to zoom in
5. Click "← Back to Hub" to return
6. Notice the Tarot door is now unlocked (but room not built yet)

## Testing the Interactions

### Zoom Interactions
- Try clicking the gift under the tree
- Try clicking the stockings (if made interactive)
- Notice how smooth the transitions are
- Try on mobile - touch should work perfectly

### State Changes
- Light the fireplace by clicking it
- Watch the fire animate
- Notice the glow effect

### Mobile Testing
- Resize your browser window
- All interactions should remain touch-friendly
- Text should scale appropriately

## Next Steps for Development

### 1. Add Audio Files (Optional but Recommended)

Create `public/audio/` folder and add these files:

```bash
mkdir public/audio
```

Then add these files (any format: mp3, ogg, wav):
- `intro-ambient.mp3` - Gentle Christmas music for intro
- `hub-ambient.mp3` - Warm living room ambience
- `dog-ambient.mp3` - Playful, gentle music
- `tree-lights.mp3` - Magical chime sound
- `click.mp3` - Soft click
- `zoom-in.mp3` - Whoosh sound
- `zoom-out.mp3` - Reverse whoosh
- `door-open.mp3` - Door creak
- `fireplace.mp3` - Fire ignition
- `dog-eat.mp3` - Eating sounds
- `photo-reveal.mp3` - Camera shutter
- `gift-unlock.mp3` - Lock opening

The game works fine without audio - it will just skip the sounds gracefully.

### 2. Build the Tarot Room

Follow the pattern in `DogRoom.tsx`:

```tsx
// components/scenes/TarotRoom.tsx
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { audioManager } from '@/lib/audioManager';
import InteractiveObject from '../shared/InteractiveObject';
import ZoomView from '../shared/ZoomView';

export default function TarotRoom() {
  const {
    setScene,
    completeTarotPuzzle,
    tarotPuzzleComplete,
    collectPhoto,
    unlockRoom,
  } = useGameStore();

  // Your puzzle logic here...

  return (
    <div className="relative w-full h-full bg-purple-900">
      {/* Back button */}
      <button onClick={() => setScene('hub')}>
        ← Back to Hub
      </button>

      {/* Your room elements */}
    </div>
  );
}
```

Then add it to `Game.tsx`:

```tsx
import TarotRoom from './scenes/TarotRoom';

// In renderScene():
case 'tarot':
  return <TarotRoom />;
```

### 3. Build Board Games Room

Same pattern as Tarot Room. Key points:
- Import necessary components
- Design your puzzle
- Use `InteractiveObject` for clickables
- Use `ZoomView` for close-ups
- Update state when puzzle completes
- Unlock next room (Personal Room)

### 4. Build Personal Room

This is the final room before the grand finale. Make it special:
- Most intimate setting
- Personal objects
- Letter reveal (the emotional peak before the gift)
- Unlocks the Christmas tree interaction

### 5. Customize the Final Gift

Edit `components/scenes/HubRoom.tsx` around line 330:

```tsx
<p className="text-center text-lg italic">
  Your personal message here - make it heartfelt!
</p>
```

You can also change the gift combination by editing the state in `gameStore.ts`.

### 6. Add Real Images

Currently using emoji placeholders (🐕, 🎄). You can:

1. Add images to `public/images/`
2. Replace emoji with `<img>` tags:

```tsx
<img
  src="/images/dog-photo.jpg"
  alt="Memory"
  className="w-full h-full object-cover rounded"
/>
```

## Troubleshooting

### Audio Not Playing

- Check browser console for errors
- Some browsers block autoplay - user must interact first
- Make sure audio files are in `public/audio/`
- Try clicking the page before audio should play

### Build Errors

```bash
npm run build
```

Should show any TypeScript or ESLint errors. Fix them before deploying.

### Slow Performance

- Check browser dev tools Performance tab
- Framer Motion animations are GPU-accelerated
- Consider reducing particle count in Snowfall component

### Touch Not Working on Mobile

- Make sure you're using `InteractiveObject` component
- Check that `whileTap` animations are present
- Test in actual mobile device, not just browser resize

## Project Structure Reminder

```
Key files:
├── store/gameStore.ts          ← All state lives here
├── lib/audioManager.ts         ← Audio system
├── components/
│   ├── Game.tsx                ← Main orchestrator
│   ├── scenes/
│   │   ├── HubRoom.tsx         ← Main hub
│   │   └── DogRoom.tsx         ← Reference implementation
│   └── shared/
│       ├── InteractiveObject.tsx  ← Use this for clickables
│       └── ZoomView.tsx           ← Use this for zooming
```

## Tips for Building Rooms

1. **Start with the layout** - Get the visual structure right first
2. **Add interactivity** - Make objects clickable
3. **Implement puzzle logic** - State updates and flow
4. **Add animations** - Polish the transitions
5. **Test thoroughly** - Both desktop and mobile

## Visual Design Tips

- Use `motion.div` from Framer Motion for all animations
- Leverage Tailwind's color palettes for consistency
- SVG for illustrations (like the dog, tree, fireplace)
- `AnimatePresence` for conditional rendering
- Ease curves: `[0.43, 0.13, 0.23, 0.96]` for smooth feel

## State Management Pattern

```tsx
// Get state and actions
const {
  dogFed,          // Read state
  feedDog,         // Update action
} = useGameStore();

// Update state
const handleFeedDog = () => {
  feedDog();       // Call the action
  // State automatically updates everywhere
};
```

## Need Help?

- Check `README.md` for full architecture details
- Look at `DogRoom.tsx` as a complete working example
- Review `gameStore.ts` to understand available state
- Check `InteractiveObject.tsx` for interaction patterns

---

**Happy building! 🎄**
