# Christmas Memories - Interactive Narrative Game

An emotionally-driven, Cube Escape-inspired interactive narrative game built with Next.js, Framer Motion, and Zustand.

## 🎮 Project Overview

This is a polished, cinematic web-based narrative game where players explore rooms, solve symbolic puzzles, collect emotional memories, and unlock a final gift that ties everything together.

### Core Experience

- **Intro Scene**: Exterior view with snowfall, zoom transition into the house
- **Hub Room (Living Room)**: Central navigation hub with Christmas tree, fireplace, and the locked gift
- **Dog Room**: Care and presence-themed puzzle (COMPLETE)
- **Tarot Room**: Intuition and spirituality-themed puzzle (READY TO BUILD)
- **Board Games Room**: Logic and playfulness-themed puzzle (READY TO BUILD)
- **Personal Room**: Intimacy and vulnerability-themed puzzle (READY TO BUILD)

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 15 (App Router, client-side only)
- **State Management**: Zustand (lightweight global store)
- **Animations**: Framer Motion (smooth, cinematic transitions)
- **Styling**: Tailwind CSS (utility-first styling)
- **Audio**: HTML5 Audio API with custom AudioManager
- **Hosting**: Optimized for Vercel static export

### Project Structure

```
christmas-narrative-game/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Entry point
│   └── globals.css         # Global styles
├── components/
│   ├── Game.tsx            # Main game orchestrator
│   ├── SceneTransition.tsx # Scene transition wrapper
│   ├── scenes/
│   │   ├── IntroScene.tsx  # Intro with snowfall
│   │   ├── HubRoom.tsx     # Main hub (living room)
│   │   └── DogRoom.tsx     # Dog care puzzle
│   ├── shared/
│   │   ├── InteractiveObject.tsx  # Reusable clickable objects
│   │   └── ZoomView.tsx           # Zoom-in overlay system
│   └── effects/
│       └── Snowfall.tsx    # Animated snowfall effect
├── store/
│   └── gameStore.ts        # Zustand global state
├── lib/
│   └── audioManager.ts     # Audio system singleton
└── public/
    └── audio/              # Audio files (to be added)
```

## 🎯 Game State

The game uses a centralized Zustand store that tracks:

### Global State
- `currentScene`: Active scene (intro, hub, dog, tarot, boardgames, personal)
- `roomsUnlocked`: Which rooms are accessible
- `photosCollected`: Emotional rewards from each room
- `zoomedObject`: Currently zoomed object ID

### Hub Room State
- `treeLightsOn`: Christmas tree lights (unlocks when all rooms complete)
- `fireplaceOn`: Fireplace lit status
- `mainGiftUnlocked`: Final gift opened status
- `giftCombination`: Combination revealed by tree lights

### Room-Specific State
- **Dog Room**: `dogFed`, `dogFoodInBowl`
- **Tarot Room**: `tarotPuzzleComplete`
- **Board Games Room**: `boardGameComplete`
- **Personal Room**: `letterUnlocked`, `drawerOpen`

## 🎨 Design Principles

### Interaction Quality

Every interaction follows these rules:

1. **Hover Feedback**: All interactive objects scale on hover
2. **Sound Effects**: Every click triggers appropriate audio
3. **Smooth Animations**: No instant transitions, everything eases
4. **Visual Rewards**: State changes trigger visual feedback
5. **Mobile-First**: Touch-friendly hitboxes, responsive layout

### Camera System

The game uses a fixed-camera-per-room approach:

- **Zoom-In**: Click object → smooth scale + blur background
- **Zoom-Out**: Click X button or backdrop → reverse transition
- **State Preservation**: Zoom state persists in global store

### Audio Design

The `AudioManager` singleton handles:

- **Ambient Tracks**: Room-specific background music with crossfade
- **SFX**: Click, zoom, door, fire, dog sounds
- **Volume Control**: Separate ambient/SFX volume
- **Fade System**: Smooth volume transitions

## 🔧 Core Components

### InteractiveObject

Reusable component for all clickable game objects:

```tsx
<InteractiveObject
  id="unique-id"
  onClick={handleClick}
  zoomable={true}           // Triggers zoom view
  hoverScale={1.05}         // Hover scale amount
  disabled={false}          // Disabled state
>
  <YourContent />
</InteractiveObject>
```

### ZoomView

Overlay system for examining objects:

```tsx
<ZoomView id="unique-id">
  <div>Your zoomed content here</div>
</ZoomView>
```

- Automatically shows when `zoomedObject === id`
- Includes backdrop blur and close button
- Smooth scale animation

### SceneTransition

Wrapper for scene changes:

```tsx
<SceneTransition
  sceneKey={currentScene}
  transitionType="fade"     // fade, zoom, or slide
  duration={1.2}            // seconds
>
  <YourScene />
</SceneTransition>
```

## 🎮 Building Remaining Rooms

### Pattern to Follow

Each room should follow this structure (see `DogRoom.tsx` as reference):

1. **Room Setup**
   - Import necessary hooks and components
   - Set up local state for room-specific interactions
   - Play room-specific ambient audio on mount

2. **Interactive Elements**
   - Use `InteractiveObject` for all clickable items
   - Use `ZoomView` for detailed inspections
   - Handle click events with state updates

3. **Puzzle Flow**
   - Start with initial state (e.g., empty bowl)
   - Player takes action (e.g., opens jar)
   - Player completes puzzle (e.g., feeds dog)
   - Reward reveals (photo + room unlock)

4. **Visual Feedback**
   - Use `AnimatePresence` for conditional rendering
   - Trigger animations on state changes
   - Show completion notifications

5. **Navigation**
   - Include back button to Hub
   - Update global state when leaving room

### Tarot Room Implementation Guide

**Theme**: Intuition, destiny, spirituality

**Puzzle Concept**:
- Tarot cards laid out on table
- Player must order them based on symbolic meaning
- Drag-and-drop or click-to-select mechanics
- Matching symbols or interpreting meanings

**State to Track**:
- `tarotCardsOrdered`: boolean
- `selectedCards`: array of card IDs
- Card positions/order

**Elements**:
- Tarot cards (interactive objects)
- Candles with glow effects
- Mystical symbols
- Soft purple/gold color scheme

**Reward**:
- Photo revealing spiritual connection
- Unlocks Board Games Room

### Board Games Room Implementation Guide

**Theme**: Playfulness, logic, shared fun

**Puzzle Concept**:
- Board game pieces scattered
- Simple rule-based mini-game (e.g., connect 4, tic-tac-toe variant)
- Pattern recognition or logic puzzle
- Drag & drop pieces

**State to Track**:
- `boardGameComplete`: boolean
- Game board state
- Current turn/move

**Elements**:
- Board game surface
- Colorful game pieces
- Dice, tokens, cards
- Playful, warm color scheme

**Reward**:
- Photo of shared game moments
- Unlocks Personal Room

### Personal Room Implementation Guide

**Theme**: Intimacy, vulnerability, future

**Puzzle Concept**:
- Desk with locked drawer
- Personal objects as clues
- Unlock mechanism reveals letter
- Slow, emotional reveal

**State to Track**:
- `letterUnlocked`: boolean
- `drawerOpen`: boolean

**Elements**:
- Desk and drawer
- Personal items (books, photos, trinkets)
- Letter with personal message
- Warm, intimate lighting

**Reward**:
- Letter with deeply personal content (provided by author)
- Final photo collected
- Enables tree lighting in Hub

## 🎄 Main Puzzle Flow

The macro puzzle ties all rooms together:

1. **Complete Dog Room** → Collect photo → Tarot Room unlocks
2. **Complete Tarot Room** → Collect photo → Board Games Room unlocks
3. **Complete Board Games Room** → Collect photo → Personal Room unlocks
4. **Complete Personal Room** → Collect photo → All rooms complete
5. **Return to Hub** → Click Christmas tree → Tree lights up
6. **Tree Reveals Combination** → "LOVE" (or custom combination)
7. **Enter Combination** → Gift unlocks
8. **Open Gift** → Final message/QR/real-world clue

## 🚀 Development

### Running the Project

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

### Adding Audio Files

Place audio files in `public/audio/`:

- `intro-ambient.mp3`
- `hub-ambient.mp3`
- `dog-ambient.mp3`
- `tree-lights.mp3`
- `click.mp3`
- `zoom-in.mp3`
- `zoom-out.mp3`
- `door-open.mp3`
- `fireplace.mp3`
- `dog-eat.mp3`
- `photo-reveal.mp3`
- `gift-unlock.mp3`

(Currently using placeholders - game works without audio files)

## 📱 Mobile Optimization

The game is fully responsive and touch-optimized:

- All `InteractiveObject` components work with touch
- Responsive breakpoints using Tailwind (`md:`, `lg:`)
- Touch-friendly button sizes (min 44x44px)
- Smooth transitions work on mobile devices
- Audio handling respects mobile autoplay restrictions

## 🎨 Customization

### Changing the Final Message

Edit `HubRoom.tsx` line 330:

```tsx
<p className="text-center text-lg italic">
  Your custom message here
</p>
```

### Adjusting Colors

Edit `tailwind.config.ts` or use Tailwind's built-in colors in components.

### Modifying Puzzle Difficulty

Each room's puzzle difficulty can be adjusted by changing:
- Number of steps required
- Complexity of interactions
- Hints/guidance provided

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Static Export

The project is configured for static export (`output: 'export'` in `next.config.mjs`), making it deployable to any static hosting service.

## 🎯 Next Steps

1. **Add remaining rooms** (Tarot, Board Games, Personal)
2. **Add audio files** for complete audio experience
3. **Customize final gift message** with personal content
4. **Add actual photo images** (currently using placeholder emojis)
5. **Fine-tune puzzle difficulty** based on playtesting
6. **Add loading screen** for initial asset loading
7. **Implement save/resume** functionality (localStorage)

## 🔑 Key Files to Understand

- **`store/gameStore.ts`**: All game state and actions
- **`lib/audioManager.ts`**: Audio system singleton
- **`components/shared/InteractiveObject.tsx`**: Core interaction pattern
- **`components/shared/ZoomView.tsx`**: Zoom overlay system
- **`components/scenes/DogRoom.tsx`**: Complete room example

## 📝 License

Private project - all rights reserved.

---

**Built with ❤️ for a special Christmas experience**
