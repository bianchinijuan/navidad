// Simple Audio Manager - Rebuilt from scratch
class AudioManager {
  private tracks: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private musicVolume: number = 0.15; // 15% volume for music
  private sfxVolume: number = 0.3; // 30% volume for SFX

  /**
   * Initialize all audio tracks
   */
  init() {
    // Background music
    this.preload('christmas-music', '/assets/christmas-music.mp3', true, this.musicVolume);

    // Room/Game music
    this.preload('kitchen-room', '/assets/kitchen-room.mp3', true, this.musicVolume);
    this.preload('brother-room-v2', '/assets/brother-room-v2.mp3', true, this.musicVolume);
    this.preload('zodiac-room', '/assets/zodiac-room.mp3', true, this.musicVolume);
    this.preload('taylor-room', '/assets/taylor-room.mp3', true, this.musicVolume);
    this.preload('airbag-room', '/assets/airbag-room.mp3', true, this.musicVolume);
    this.preload('sister-room', '/assets/sister-room.mp3', true, this.musicVolume);
    this.preload('final', '/assets/final.mp3', true, this.musicVolume);

    // SFX
    this.preload('mouse-click', '/assets/mouse-click.mp3', false, this.sfxVolume);
    this.preload('unlock', '/assets/unlock.mp3', false, this.sfxVolume);
    this.preload('achievement', '/assets/achievement.mp3', false, this.sfxVolume);
    this.preload('door-open', '/audio/door-open.mp3', false, this.sfxVolume);
  }

  /**
   * Preload audio file
   */
  private preload(id: string, src: string, loop: boolean, volume: number) {
    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = 'auto';
    this.tracks.set(id, audio);
  }

  /**
   * Play audio
   */
  play(id: string) {
    if (!this.enabled) return;

    const audio = this.tracks.get(id);
    if (!audio) {
      console.warn(`Audio "${id}" not found`);
      return;
    }

    audio.currentTime = 0;
    audio.play().catch(e => console.warn(`Failed to play "${id}":`, e));
  }

  /**
   * Stop audio
   */
  stop(id: string) {
    const audio = this.tracks.get(id);
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
  }

  /**
   * Pause audio (without resetting)
   */
  pause(id: string) {
    const audio = this.tracks.get(id);
    if (!audio) return;
    audio.pause();
  }

  /**
   * Resume paused audio
   */
  resume(id: string) {
    if (!this.enabled) return;

    const audio = this.tracks.get(id);
    if (!audio) return;
    audio.play().catch(e => console.warn(`Failed to resume "${id}":`, e));
  }

  /**
   * Set enabled state
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      // Stop all playing tracks
      this.tracks.forEach(audio => audio.pause());
    }
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    // Update volume for all music tracks
    ['christmas-music', 'kitchen-room', 'brother-room-v2', 'zodiac-room', 'taylor-room', 'airbag-room', 'sister-room', 'final'].forEach(id => {
      const audio = this.tracks.get(id);
      if (audio) audio.volume = this.musicVolume;
    });
  }

  /**
   * Get music volume
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }
}

// Singleton
export const audioManager = new AudioManager();

// Initialize audio
export function initializeAudio() {
  audioManager.init();
}
