// Web Audio API Sound Synthesizer for celebration and game effects

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const toggleSound = (enabled?: boolean): boolean => {
  if (enabled !== undefined) {
    soundEnabled = enabled;
  } else {
    soundEnabled = !soundEnabled;
  }
  return soundEnabled;
};

export const isSoundEnabled = (): boolean => soundEnabled;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const playSparkleChime = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.08);
    osc.stop(ctx.currentTime + idx * 0.08 + 0.55);
  });
};

export const playGiftRevealFanfare = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Triumph fanfare
  const chords = [
    { freq: 440, time: 0, dur: 0.15 }, // A4
    { freq: 554.37, time: 0.12, dur: 0.15 }, // C#5
    { freq: 659.25, time: 0.24, dur: 0.2 }, // E5
    { freq: 880, time: 0.38, dur: 0.6 }, // A5
    { freq: 1108.73, time: 0.42, dur: 0.6 }, // C#6
  ];

  chords.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

    gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur + 0.05);
  });
};

export const playCardFlip = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.09);
};

export const playPopClick = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.07);
};

export const playApplause = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Gentle congratulatory chime
  const notes = [392, 493.88, 587.33, 783.99];
  notes.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.1);
    osc.stop(ctx.currentTime + i * 0.1 + 0.45);
  });
};

export const playSuccessTone = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [587.33, 880]; // D5, A5
  notes.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08);
    gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.08);
    osc.stop(ctx.currentTime + i * 0.08 + 0.35);
  });
};

// 1. Fireworks Sound: Rising launch whoosh followed by shimmering explosions
export const playFireworksSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Launch rocket whoosh
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.35);

  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.4);

  // Burst explosion & sparkles at 0.35s
  const burstTime = ctx.currentTime + 0.35;
  const burstNotes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
  burstNotes.forEach((freq, idx) => {
    const bOsc = ctx.createOscillator();
    const bGain = ctx.createGain();
    bOsc.type = 'sine';
    bOsc.frequency.setValueAtTime(freq, burstTime + idx * 0.04);
    bGain.gain.setValueAtTime(0.001, burstTime + idx * 0.04);
    bGain.gain.linearRampToValueAtTime(0.18, burstTime + idx * 0.04 + 0.02);
    bGain.gain.exponentialRampToValueAtTime(0.0001, burstTime + idx * 0.04 + 0.6);

    bOsc.connect(bGain);
    bGain.connect(ctx.destination);
    bOsc.start(burstTime + idx * 0.04);
    bOsc.stop(burstTime + idx * 0.04 + 0.65);
  });
};

// 2. Balloons & Lanterns: Light, dreamy ascending bells
export const playBalloonSwaySound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.12);
    gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + i * 0.12 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.12);
    osc.stop(ctx.currentTime + i * 0.12 + 0.75);
  });
};

// 3. Origami Crane Flutter: Gentle paper rustle and wind-chime sweep
export const playOrigamiFlutterSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [587.33, 659.25, 739.99, 880, 987.77, 1174.66];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.07);
    gain.gain.linearRampToValueAtTime(0.14, ctx.currentTime + i * 0.07 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.07 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.07);
    osc.stop(ctx.currentTime + i * 0.07 + 0.5);
  });
};

// 4. Blossom Petal Bloom: Harmonic harp strum
export const playBlossomBloomSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [349.23, 440, 523.25, 659.25, 698.46, 880, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.09);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + i * 0.09);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.09 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.09 + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + i * 0.09);
    osc.stop(ctx.currentTime + i * 0.09 + 0.85);
  });
};

// 5. Trophy Fanfare: Bold majestic brass fanfare
export const playTrophyFanfareSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [
    { freq: 440, time: 0, dur: 0.14 },
    { freq: 554.37, time: 0.12, dur: 0.14 },
    { freq: 659.25, time: 0.24, dur: 0.16 },
    { freq: 880, time: 0.38, dur: 0.7 },
    { freq: 1108.73, time: 0.42, dur: 0.7 },
  ];

  chords.forEach(({ freq, time, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + time);
    osc.stop(ctx.currentTime + time + dur + 0.05);
  });
};

// 6. Chalkboard Magic: Playful xylophone and sparkle chime
export const playChalkboardSparkleSound = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);
    gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.06);
    gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + idx * 0.06 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + idx * 0.06);
    osc.stop(ctx.currentTime + idx * 0.06 + 0.4);
  });
};

export const playCelebrationSoundByType = (type: string) => {
  switch (type) {
    case 'fireworks':
      playFireworksSound();
      break;
    case 'balloons':
      playBalloonSwaySound();
      break;
    case 'origami':
      playOrigamiFlutterSound();
      break;
    case 'blossom':
      playBlossomBloomSound();
      break;
    case 'trophy':
      playTrophyFanfareSound();
      break;
    case 'chalkboard':
      playChalkboardSparkleSound();
      break;
    default:
      playGiftRevealFanfare();
      break;
  }
};
