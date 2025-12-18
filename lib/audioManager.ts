type AudioType = 'ambient' | 'sfx';

interface AudioTrack {
  audio: HTMLAudioElement;
  type: AudioType;
  loop: boolean;
}

class AudioManager {
  private tracks: Map<string, AudioTrack> = new Map();
  private enabled: boolean = true;
  private ambientVolume: number = 0.3;
  private sfxVolume: number = 0.5;

  /**
   * Preload an audio file
   */
  preload(id: string, src: string, type: AudioType = 'sfx', loop: boolean = false) {
    if (this.tracks.has(id)) return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = type === 'ambient' ? this.ambientVolume : this.sfxVolume;
    audio.preload = 'auto';

    this.tracks.set(id, { audio, type, loop });
  }

  /**
   * Play a sound effect or ambient track
   */
  play(id: string, fadeIn: boolean = false) {
    if (!this.enabled) return;

    const track = this.tracks.get(id);
    if (!track) {
      console.warn(`Audio track "${id}" not found`);
      return;
    }

    const { audio } = track;

    if (fadeIn) {
      audio.volume = 0;
      audio.play().catch(e => console.warn('Audio play failed:', e));
      this.fadeVolume(audio, track.type === 'ambient' ? this.ambientVolume : this.sfxVolume, 1000);
    } else {
      audio.volume = track.type === 'ambient' ? this.ambientVolume : this.sfxVolume;
      audio.play().catch(e => console.warn('Audio play failed:', e));
    }
  }

  /**
   * Stop a track
   */
  stop(id: string, fadeOut: boolean = false) {
    const track = this.tracks.get(id);
    if (!track) return;

    const { audio } = track;

    if (fadeOut) {
      this.fadeVolume(audio, 0, 1000, () => {
        audio.pause();
        audio.currentTime = 0;
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Pause a track (without resetting position)
   */
  pause(id: string) {
    const track = this.tracks.get(id);
    if (track) {
      track.audio.pause();
    }
  }

  /**
   * Resume a paused track
   */
  resume(id: string) {
    if (!this.enabled) return;

    const track = this.tracks.get(id);
    if (track) {
      track.audio.play().catch(e => console.warn('Audio play failed:', e));
    }
  }

  /**
   * Crossfade between two ambient tracks
   */
  crossfade(fromId: string, toId: string, duration: number = 2000) {
    const fromTrack = this.tracks.get(fromId);
    const toTrack = this.tracks.get(toId);

    if (fromTrack) {
      this.fadeVolume(fromTrack.audio, 0, duration, () => {
        fromTrack.audio.pause();
        fromTrack.audio.currentTime = 0;
      });
    }

    if (toTrack) {
      toTrack.audio.volume = 0;
      toTrack.audio.play().catch(e => console.warn('Audio play failed:', e));
      this.fadeVolume(toTrack.audio, this.ambientVolume, duration);
    }
  }

  /**
   * Fade volume over time
   */
  private fadeVolume(
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number,
    onComplete?: () => void
  ) {
    const startVolume = audio.volume;
    const volumeDelta = targetVolume - startVolume;
    const startTime = Date.now();

    const fade = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      audio.volume = startVolume + volumeDelta * progress;

      if (progress < 1) {
        requestAnimationFrame(fade);
      } else if (onComplete) {
        onComplete();
      }
    };

    fade();
  }

  /**
   * Set master enabled state
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;

    if (!enabled) {
      // Pause all currently playing tracks
      this.tracks.forEach(track => {
        if (!track.audio.paused) {
          track.audio.pause();
        }
      });
    }
  }

  /**
   * Set ambient volume
   */
  setAmbientVolume(volume: number) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    this.tracks.forEach(track => {
      if (track.type === 'ambient') {
        track.audio.volume = this.ambientVolume;
      }
    });
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.tracks.forEach(track => {
      if (track.type === 'sfx') {
        track.audio.volume = this.sfxVolume;
      }
    });
  }
}

// Singleton instance
export const audioManager = new AudioManager();

// Preload audio tracks (you'll add actual audio files later)
// For now, these are placeholders - you can replace with real audio URLs
export function initializeAudio() {
  // Ambient tracks
  audioManager.preload('intro-ambient', '/audio/intro-ambient.mp3', 'ambient', true);
  audioManager.preload('hub-ambient', '/audio/hub-ambient.mp3', 'ambient', true);
  audioManager.preload('dog-ambient', '/audio/dog-ambient.mp3', 'ambient', true);
  audioManager.preload('tree-lights', '/audio/tree-lights.mp3', 'ambient', false);

  // SFX
  audioManager.preload('click', '/audio/click.mp3', 'sfx');
  audioManager.preload('zoom-in', '/audio/zoom-in.mp3', 'sfx');
  audioManager.preload('zoom-out', '/audio/zoom-out.mp3', 'sfx');
  audioManager.preload('door-open', '/audio/door-open.mp3', 'sfx');
  audioManager.preload('fireplace-ignite', '/audio/fireplace.mp3', 'sfx');
  audioManager.preload('dog-eat', '/audio/dog-eat.mp3', 'sfx');
  audioManager.preload('photo-reveal', '/audio/photo-reveal.mp3', 'sfx');
  audioManager.preload('gift-unlock', '/audio/gift-unlock.mp3', 'sfx');
}
