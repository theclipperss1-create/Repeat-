export const SOUNDS = [
  { id: 'default', name: 'Default', frequencies: [523.25, 659.25, 783.99], type: 'sine', duration: 0.8 },
  { id: 'gentle', name: 'Gentle Chime', frequencies: [523.25, 1046.5, 1567.98], type: 'sine', duration: 0.8 },
  { id: 'alert', name: 'Soft Alert', frequencies: [659.25, 880.00, 1046.50], type: 'triangle', duration: 0.5 },
  { id: 'bell', name: 'Crystal Bell', frequencies: [880.00, 1760.00, 2200.00], type: 'sine', duration: 1.2 },
  { id: 'pulse', name: 'Warm Pulse', frequencies: [329.63, 440.00], type: 'triangle', duration: 0.6 },
  { id: 'drop', name: 'Water Drop', frequencies: [1046.50], type: 'sine', duration: 0.3, slide: true },
];

let audioContext = null;
let loopInterval = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

export function playSound(soundId) {
  const sound = SOUNDS.find((s) => s.id === soundId);
  if (!sound || !sound.frequencies) {
    return;
  }

  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume().catch((err) => console.warn('AudioContext resume failed:', err));
  }
  const masterGain = ctx.createGain();

  // Elevate volume for a louder, clearer sound (max gain 0.8)
  masterGain.gain.setValueAtTime(0, ctx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
  masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (sound.duration || 0.6));
  masterGain.connect(ctx.destination);

  sound.frequencies.forEach((freq, index) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = sound.type || 'sine';
    
    if (sound.slide) {
      // Create a nice water droplet sliding pitch frequency sweep
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + sound.duration);
    } else {
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
    }

    // Lower volume for higher harmonics so it stays clean and premium, not noisy
    const harmonicVolume = index === 0 ? 1.0 : index === 1 ? 0.4 : 0.2;
    gainNode.gain.setValueAtTime(harmonicVolume, ctx.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(masterGain);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + (sound.duration || 0.6));
  });
}

export function startLoopingSound(soundId) {
  stopLoopingSound();
  const sound = SOUNDS.find((s) => s.id === soundId);
  if (!sound || !sound.frequencies) return;

  playSound(soundId);
  const intervalTime = (sound.duration || 0.6) * 1000 + 1000; // duration + 1s gap
  loopInterval = setInterval(() => {
    playSound(soundId);
  }, intervalTime);
}

export function stopLoopingSound() {
  if (loopInterval) {
    clearInterval(loopInterval);
    loopInterval = null;
  }
}

export function playDeepClick() {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.error('Failed to play deep click sound:', e);
  }
}

export function triggerHaptic(intensity) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    let pattern;
    switch (intensity) {
      case 'subtle':
        pattern = 15;
        break;
      case 'strong':
        pattern = [80, 50, 80];
        break;
      case 'default':
      default:
        pattern = 45;
        break;
    }
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration not supported or denied', e);
    }
  }
}

export function previewSound(soundId) {
  playSound(soundId);
}
