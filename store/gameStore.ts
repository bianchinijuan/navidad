import { create } from 'zustand';

export type GameScene =
  | 'intro'
  | 'hub'
  | 'dog'
  | 'taylor'
  | 'bedroom'
  | 'kitchen'
  | 'brother'
  | 'airbag'
  | 'sister'
  | 'mother'
  | 'tarot'
  | 'boardgames'
  | 'personal'
  | 'door'
  | 'final';

export type PhotoId =
  | 'dog'
  | 'taylor'
  | 'bedroom'
  | 'kitchen'
  | 'brother'
  | 'mother'
  | 'tarot'
  | 'boardgames'
  | 'personal';

interface GameState {
  // Current scene
  currentScene: GameScene;

  // Room unlocks
  roomsUnlocked: {
    dog: boolean;
    taylor: boolean;
    bedroom: boolean;
    kitchen: boolean;
    brother: boolean;
    airbag: boolean;
    sister: boolean;
    mother: boolean;
    tarot: boolean;
    boardgames: boolean;
    personal: boolean;
  };

  // Rooms completed (game finished, reward obtained)
  roomsCompleted: {
    dog: boolean;
    taylor: boolean;
    bedroom: boolean;
    kitchen: boolean;
    brother: boolean;
    airbag: boolean;
    sister: boolean;
    mother: boolean;
    tarot: boolean;
    boardgames: boolean;
    personal: boolean;
  };

  // Hub room state
  treeLightsOn: boolean;
  fireplaceOn: boolean;

  // Photos collected (emotional rewards from each room)
  photosCollected: PhotoId[];

  // Gift state (door unlock)
  mainGiftUnlocked: boolean;
  giftOpened: boolean; // True when user clicks on opened gift to see key
  giftCombination: number[]; // 6-digit combination revealed by completing rooms
  revealedNumbers: { room: string; number: number }[]; // Track which numbers have been revealed

  // Dog room state
  dogFed: boolean;
  dogFoodInBowl: boolean;

  // Tarot room state
  tarotCardsOrdered: boolean;
  tarotPuzzleComplete: boolean;

  // Board games room state
  boardGameComplete: boolean;

  // Personal room state
  letterUnlocked: boolean;
  drawerOpen: boolean;

  // Zoom state (for camera system)
  zoomedObject: string | null;

  // Audio state
  audioEnabled: boolean;

  // Actions
  setScene: (scene: GameScene) => void;
  unlockRoom: (room: keyof GameState['roomsUnlocked']) => void;
  completeRoom: (room: keyof GameState['roomsCompleted']) => void;
  collectPhoto: (photoId: PhotoId) => void;
  toggleTreeLights: () => void;
  toggleFireplace: () => void;
  unlockGift: () => void;
  openGift: () => void;
  revealNumber: (room: string, number: number) => void;

  // Dog room actions
  feedDog: () => void;
  putFoodInBowl: () => void;

  // Tarot room actions
  completeTarotPuzzle: () => void;

  // Board games room actions
  completeBoardGame: () => void;

  // Personal room actions
  unlockLetter: () => void;
  openDrawer: () => void;

  // Zoom actions
  zoomIn: (objectId: string) => void;
  zoomOut: () => void;

  // Audio actions
  toggleAudio: () => void;

  // Check if all rooms are complete
  allRoomsComplete: () => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  currentScene: 'intro',

  roomsUnlocked: {
    dog: true,      // Start with dog room available
    taylor: true,   // Start with taylor room available (for testing)
    bedroom: true,  // Start with bedroom room available (for testing)
    kitchen: true,  // Start with kitchen room available (for testing)
    brother: true,  // Start with brother room available (for testing)
    airbag: true,   // Start with airbag room available (for testing)
    sister: true,   // Start with sister room available (for testing)
    mother: true,   // Start with mother room available (for testing)
    tarot: false,
    boardgames: false,
    personal: false,
  },

  roomsCompleted: {
    dog: false,
    taylor: false,
    bedroom: false,
    kitchen: false,
    brother: false,
    airbag: false,
    sister: false,
    mother: false,
    tarot: false,
    boardgames: false,
    personal: false,
  },

  treeLightsOn: false,
  fireplaceOn: false,

  photosCollected: [],

  mainGiftUnlocked: false,
  giftOpened: false,
  giftCombination: [2, 3, 4, 5, 7, 9], // 6-digit combination (future-room, mother, airbag, bedroom, kitchen, brother)
  revealedNumbers: [],

  dogFed: false,
  dogFoodInBowl: false,

  tarotCardsOrdered: false,
  tarotPuzzleComplete: false,

  boardGameComplete: false,

  letterUnlocked: false,
  drawerOpen: false,

  zoomedObject: null,

  audioEnabled: true,

  // Actions
  setScene: (scene) => set({ currentScene: scene }),

  unlockRoom: (room) => set((state) => ({
    roomsUnlocked: { ...state.roomsUnlocked, [room]: true }
  })),

  completeRoom: (room) => set((state) => ({
    roomsCompleted: { ...state.roomsCompleted, [room]: true }
  })),

  collectPhoto: (photoId) => set((state) => {
    if (state.photosCollected.includes(photoId)) return state;
    return { photosCollected: [...state.photosCollected, photoId] };
  }),

  toggleTreeLights: () => set((state) => ({
    treeLightsOn: !state.treeLightsOn
  })),

  toggleFireplace: () => set((state) => ({
    fireplaceOn: !state.fireplaceOn
  })),

  unlockGift: () => set({ mainGiftUnlocked: true }),

  openGift: () => set({ giftOpened: true }),

  revealNumber: (room, number) => set((state) => {
    const alreadyRevealed = state.revealedNumbers.some(r => r.room === room);
    if (alreadyRevealed) return state;
    return { revealedNumbers: [...state.revealedNumbers, { room, number }] };
  }),

  // Dog room
  feedDog: () => set({ dogFed: true }),

  putFoodInBowl: () => set({ dogFoodInBowl: true }),

  // Tarot room
  completeTarotPuzzle: () => set({ tarotPuzzleComplete: true }),

  // Board games room
  completeBoardGame: () => set({ boardGameComplete: true }),

  // Personal room
  unlockLetter: () => set({ letterUnlocked: true }),

  openDrawer: () => set({ drawerOpen: true }),

  // Zoom
  zoomIn: (objectId) => set({ zoomedObject: objectId }),

  zoomOut: () => set({ zoomedObject: null }),

  // Audio
  toggleAudio: () => set((state) => ({
    audioEnabled: !state.audioEnabled
  })),

  // Check completion
  allRoomsComplete: () => {
    const state = get();
    return (
      state.dogFed &&
      state.tarotPuzzleComplete &&
      state.boardGameComplete &&
      state.letterUnlocked
    );
  },
}));
