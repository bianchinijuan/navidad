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
    tarot: boolean;
    boardgames: boolean;
    personal: boolean;
  };

  // Hub room state
  treeLightsOn: boolean;
  fireplaceOn: boolean;

  // Photos collected (emotional rewards from each room)
  photosCollected: PhotoId[];

  // Photo puzzle state (main puzzle)
  photoFragments: {
    id: number; // 1-3 (TEMPORAL para testing)
    number: number; // Dígito de la combinación
    collected: boolean;
    roomId: 'airbag' | 'bedroom' | 'kitchen'; // TEMPORAL - solo los 3 rooms con juegos
  }[];
  allFragmentsCollected: boolean;
  photoRevealed: boolean; // True when photo is flipped to show the couple photo

  // Gift state (door unlock)
  mainGiftUnlocked: boolean;
  giftOpened: boolean; // True when user clicks on opened gift to see key
  giftCombination: number[]; // 6-digit combination from photo fragments

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
  collectFragment: (fragmentId: number) => void;
  revealPhoto: () => void;
  toggleTreeLights: () => void;
  toggleFireplace: () => void;
  unlockGift: () => void;
  openGift: () => void;

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
    tarot: false,
    boardgames: false,
    personal: false,
  },

  roomsCompleted: {
    dog: false,
    taylor: false,
    bedroom: true,  // FOR TESTING - set to false in production
    kitchen: true,  // FOR TESTING - set to false in production
    brother: false,
    airbag: true,   // FOR TESTING - set to false in production
    tarot: false,
    boardgames: false,
    personal: false,
  },

  treeLightsOn: false,
  fireplaceOn: false,

  photosCollected: [],

  // Photo puzzle fragments - each room reveals one fragment
  photoFragments: [
    { id: 1, number: 3, collected: true, roomId: 'airbag' },
    { id: 2, number: 5, collected: true, roomId: 'bedroom' },
    { id: 3, number: 7, collected: true, roomId: 'kitchen' },
  ],
  allFragmentsCollected: true,
  photoRevealed: false,

  mainGiftUnlocked: false,
  giftOpened: false,
  giftCombination: [3, 5, 7], // 3-digit combination from photo fragments

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

  collectFragment: (fragmentId) => set((state) => {
    const updatedFragments = state.photoFragments.map(fragment =>
      fragment.id === fragmentId ? { ...fragment, collected: true } : fragment
    );

    const allCollected = updatedFragments.every(fragment => fragment.collected);

    return {
      photoFragments: updatedFragments,
      allFragmentsCollected: allCollected,
    };
  }),

  revealPhoto: () => set({ photoRevealed: true }),

  toggleTreeLights: () => set((state) => ({
    treeLightsOn: !state.treeLightsOn
  })),

  toggleFireplace: () => set((state) => ({
    fireplaceOn: !state.fireplaceOn
  })),

  unlockGift: () => set({ mainGiftUnlocked: true }),

  openGift: () => set({ giftOpened: true }),

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
