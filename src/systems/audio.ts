// Web Audio API Sound Synthesizer for Samurai Money

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private sfxVolume: number = 0.7;
  private musicVolume: number = 0.3;
  private ambientOscillator: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSettings(soundEnabled: boolean, musicEnabled: boolean, sfxVol: number = 0.7, musicVol: number = 0.3) {
    this.isMuted = !soundEnabled;
    this.isMusicMuted = !musicEnabled;
    this.sfxVolume = Math.max(0, Math.min(1, sfxVol));
    this.musicVolume = Math.max(0, Math.min(1, musicVol));

    if (this.isMusicMuted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!this.isMusicMuted && this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.15, this.ctx.currentTime);
    }
  }

  /**
   * Crisp Katana Blade Slash + Subtle Coin Clink
   */
  public playClick(isCombo: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Blade Whoosh / Slice White Noise Filter
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(isCombo ? 3200 : 2400, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);

    // High Coin Ping Tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const baseFreq = isCombo ? 1480 : 1200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.05);

    gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Solid Upgrade / Purchase Cash Thud & Chime
   */
  public playPurchase() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Harmonic double chime
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(this.sfxVolume * 0.3, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.25);
    });
  }

  /**
   * Deep Japanese Temple Gong for Region Unlocks & Milestones
   */
  public playRegionUnlock() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 1.2);

    gain.gain.setValueAtTime(this.sfxVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.5);
  }

  /**
   * Triumphant Fanfare for Achievement Unlocks
   */
  public playAchievement() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const chords = [
      { freq: 440, time: 0 },    // A4
      { freq: 554.37, time: 0.1 }, // C#5
      { freq: 659.25, time: 0.2 }, // E5
      { freq: 880, time: 0.35 }    // A5 (sustained)
    ];

    chords.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now + note.time);

      gain.gain.setValueAtTime(0, now);
      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now + note.time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.time + (note.time === 0.35 ? 0.6 : 0.25));

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + (note.time === 0.35 ? 0.6 : 0.25));
    });
  }

  /**
   * Trade Purchase Sound Effect (Gold coins transfer)
   */
  public playTradeBuy() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [520, 680, 880].forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(this.sfxVolume * 0.25, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.12);
    });
  }

  /**
   * Trade Sale Sound Effect (Cash in / coin waterfall)
   */
  public playTradeSell(isProfit: boolean = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = isProfit ? [587, 740, 880, 1174] : [440, 392, 330];
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(this.sfxVolume * (isProfit ? 0.3 : 0.2), now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.18);
    });
  }

  /**
   * Optional Meditative Ambient Zen Tone
   */
  public startAmbientDrone() {
    if (this.isMusicMuted || this.ambientOscillator) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.ambientOscillator = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      this.ambientOscillator.type = 'sine';
      this.ambientOscillator.frequency.setValueAtTime(110, now); // A2 deep drone

      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(this.musicVolume * 0.1, now + 3);

      this.ambientOscillator.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);
      this.ambientOscillator.start();
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public stopAmbientDrone() {
    if (this.ambientOscillator) {
      try {
        this.ambientOscillator.stop();
        this.ambientOscillator.disconnect();
      } catch {
        // Safe ignore
      }
      this.ambientOscillator = null;
      this.ambientGain = null;
    }
  }
}

export const soundEngine = new SoundEngine();
