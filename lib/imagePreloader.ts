// Preload images to browser cache for faster room loading
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (srcs: string[]): Promise<void[]> => {
  return Promise.all(srcs.map(preloadImage));
};

// All room images that should be preloaded
export const ROOM_IMAGES = [
  // Hub
  '/assets/hub/hub.webp',
  '/assets/hub/hub-final.webp',

  // Brother Room
  '/assets/brother/brother.webp',
  '/assets/brother/brother-final.webp',
  '/assets/brother/tapestry.webp',

  // Kitchen Room
  '/assets/kitchen/kitchen.webp',
  '/assets/kitchen/kitchen-final.webp',

  // Mother Room
  '/assets/mother/mother-op2.webp',
  '/assets/mother/mother-final-op2.webp',
  '/assets/mother/pasionaria.webp',

  // Airbag Room
  '/assets/airbag/airbag.webp',
  '/assets/airbag/airbag-final.webp',

  // Bedroom (Photo Room)
  '/assets/bedroom/bedroom.webp',
  '/assets/bedroom/bedroom-final.webp',
  '/assets/bedroom/letter.webp',

  // Sister Room
  '/assets/sister/sister.webp',
  '/assets/sister/sister-final.webp',
  '/assets/sister/polaroid.webp',

  // Taylor Room
  '/assets/taylor/taylor.webp',
  '/assets/taylor/taylor-final.webp',

  // Door Room
  '/assets/exit/door.webp',
];
