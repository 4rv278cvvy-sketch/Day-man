// Small self-contained sound engine built on the Web Audio API, so the
// app needs no external audio files. AudioContext is created lazily on
// the first user gesture (Start button) to satisfy autoplay policies.

let ctx = null;

function getContext() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") {
    ctx.resume();
  }
  return ctx;
}

function playTone(freq, duration, wave = "sine", startTime = 0, volume = 0.25) {
  const audio = getContext();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, audio.currentTime + startTime);
  gain.gain.setValueAtTime(0, audio.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(volume, audio.currentTime + startTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + startTime + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start(audio.currentTime + startTime);
  osc.stop(audio.currentTime + startTime + duration + 0.05);
}

export function playTick(character) {
  const { wave, freq, duration } = character.tick;
  playTone(freq, duration, wave, 0, 0.3);
}

// A tick plus a soft low thump underneath, giving each second some
// physical "footstep" weight to match the buddy's step animation.
export function playFootstep(character) {
  playTick(character);
  playTone(90, 0.07, "sine", 0, 0.14);
}

let voicesReady = false;
function ensureVoices() {
  if (voicesReady || !("speechSynthesis" in window)) return;
  // Some browsers populate the voice list asynchronously.
  window.speechSynthesis.getVoices();
  voicesReady = true;
}

export function speak(text, { pitch = 1, rate = 1 } = {}) {
  if (!("speechSynthesis" in window)) return;
  ensureVoices();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}

export function speakCountNumber(n) {
  speak(String(n), { pitch: 1.3, rate: 1.1 });
}

// ---------- creature / vehicle cry synthesis ----------
// Instead of speaking the buddy's name, we synthesize a sound that
// actually resembles it: pitch-swept oscillators, noise bursts and
// filters standing in for a real meow, bark, roar, honk, siren, etc.

function sweepTone(opts) {
  const audio = getContext();
  const t0 = audio.currentTime + (opts.startTime || 0);
  const duration = opts.duration;
  const osc = audio.createOscillator();
  osc.type = opts.wave || "sine";
  opts.freqPoints.forEach(([frac, freq], i) => {
    const time = t0 + frac * duration;
    if (i === 0) osc.frequency.setValueAtTime(freq, time);
    else osc.frequency.linearRampToValueAtTime(freq, time);
  });

  const gain = audio.createGain();
  const attack = opts.attack ?? 0.02;
  const release = opts.release ?? 0.12;
  const vol = opts.volume ?? 0.3;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.setValueAtTime(vol, t0 + Math.max(attack, duration - release));
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  let lastNode = osc;
  if (opts.filterType) {
    const filter = audio.createBiquadFilter();
    filter.type = opts.filterType;
    filter.frequency.value = opts.filterFreq || 1000;
    filter.Q.value = opts.filterQ ?? 1;
    osc.connect(filter);
    lastNode = filter;
  }
  lastNode.connect(gain).connect(audio.destination);

  if (opts.vibratoHz) {
    const lfo = audio.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = opts.vibratoHz;
    const lfoGain = audio.createGain();
    lfoGain.gain.value = opts.vibratoCents || 10;
    lfo.connect(lfoGain).connect(osc.frequency);
    lfo.start(t0);
    lfo.stop(t0 + duration + 0.05);
  }

  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
  return duration;
}

function noiseBurst(opts) {
  const audio = getContext();
  const t0 = audio.currentTime + (opts.startTime || 0);
  const duration = opts.duration;
  const bufferSize = Math.max(1, Math.floor(audio.sampleRate * duration));
  const buffer = audio.createBuffer(1, bufferSize, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const src = audio.createBufferSource();
  src.buffer = buffer;
  const filter = audio.createBiquadFilter();
  filter.type = opts.filterType || "bandpass";
  filter.frequency.value = opts.filterFreq || 1000;
  filter.Q.value = opts.filterQ ?? 1;

  const gain = audio.createGain();
  const attack = opts.attack ?? 0.01;
  const vol = opts.volume ?? 0.25;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);

  src.connect(filter).connect(gain).connect(audio.destination);
  src.start(t0);
  src.stop(t0 + duration + 0.02);
  return duration;
}

function chordTone(opts) {
  const audio = getContext();
  const t0 = audio.currentTime + (opts.startTime || 0);
  const duration = opts.duration;
  const attack = opts.attack ?? 0.03;
  const release = opts.release ?? 0.1;
  const vol = opts.volume ?? 0.22;

  const gain = audio.createGain();
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + attack);
  gain.gain.setValueAtTime(vol, t0 + Math.max(attack, duration - release));
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  gain.connect(audio.destination);

  opts.freqs.forEach((freq) => {
    const osc = audio.createOscillator();
    osc.type = opts.wave || "square";
    osc.frequency.value = freq;
    osc.connect(gain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  });
  return duration;
}

function sirenAlternate(opts) {
  const { segment, repeats } = opts;
  for (let i = 0; i < repeats; i++) {
    const freq = i % 2 === 0 ? opts.freqA : opts.freqB;
    playTone(freq, segment * 0.95, opts.wave || "square", (opts.startTime || 0) + i * segment, opts.volume || 0.22);
  }
  return segment * repeats;
}

function cryBarkOnce(startTime, vol) {
  noiseBurst({ startTime, duration: 0.05, filterType: "bandpass", filterFreq: 1800, filterQ: 0.6, volume: vol * 0.7, attack: 0.002 });
  return sweepTone({ startTime, duration: 0.18, wave: "square", freqPoints: [[0, 300], [0.4, 220], [1, 150]], volume: vol, attack: 0.005, release: 0.09 });
}

function cryQuackOnce(startTime, vol) {
  return sweepTone({ startTime, duration: 0.16, wave: "sawtooth", freqPoints: [[0, 520], [0.5, 380], [1, 280]], volume: vol, filterType: "bandpass", filterFreq: 1300, filterQ: 1.2, attack: 0.005, release: 0.07 });
}

const CRY_FUNCS = {
  dog(vol) {
    const d1 = cryBarkOnce(0, vol);
    const d2 = cryBarkOnce(d1 + 0.12, vol);
    return d1 + 0.12 + d2;
  },
  cat(vol) {
    return sweepTone({ duration: 0.5, wave: "triangle", freqPoints: [[0, 480], [0.25, 900], [0.6, 640], [1, 420]], volume: vol, vibratoHz: 14, vibratoCents: 18, attack: 0.04, release: 0.22 });
  },
  lion(vol) {
    noiseBurst({ duration: 1.05, filterType: "lowpass", filterFreq: 450, filterQ: 0.8, volume: vol * 0.4, attack: 0.2 });
    return sweepTone({ duration: 1.1, wave: "sawtooth", freqPoints: [[0, 90], [0.25, 135], [0.6, 110], [1, 75]], volume: vol, vibratoHz: 7, vibratoCents: 10, attack: 0.15, release: 0.4 });
  },
  cow(vol) {
    return sweepTone({ duration: 0.9, wave: "triangle", freqPoints: [[0, 180], [0.3, 150], [1, 95]], volume: vol, vibratoHz: 6, vibratoCents: 8, attack: 0.08, release: 0.3 });
  },
  duck(vol) {
    const d1 = cryQuackOnce(0, vol);
    const d2 = cryQuackOnce(d1 + 0.1, vol);
    return d1 + 0.1 + d2;
  },
  elephant(vol) {
    noiseBurst({ startTime: 0.1, duration: 0.15, filterType: "bandpass", filterFreq: 1200, filterQ: 1, volume: vol * 0.3 });
    return sweepTone({ duration: 0.9, wave: "sawtooth", freqPoints: [[0, 160], [0.3, 480], [0.6, 300], [1, 180]], volume: vol, filterType: "bandpass", filterFreq: 900, filterQ: 2, attack: 0.05, release: 0.25 });
  },
  car(vol) {
    return chordTone({ duration: 0.5, freqs: [400, 500], wave: "square", volume: vol * 0.8, attack: 0.02, release: 0.15 });
  },
  bus(vol) {
    return chordTone({ duration: 0.7, freqs: [300, 380], wave: "square", volume: vol * 0.8, attack: 0.03, release: 0.2 });
  },
  train(vol) {
    noiseBurst({ duration: 1.3, filterType: "bandpass", filterFreq: 2200, filterQ: 0.6, volume: vol * 0.18, attack: 0.1 });
    return chordTone({ duration: 1.3, freqs: [349, 523], wave: "sine", volume: vol * 0.9, attack: 0.15, release: 0.35 });
  },
  firetruck(vol) {
    return sirenAlternate({ freqA: 660, freqB: 880, segment: 0.3, repeats: 4, wave: "square", volume: vol * 0.7 });
  },
  rocket(vol) {
    noiseBurst({ duration: 1.2, filterType: "lowpass", filterFreq: 1200, filterQ: 0.5, volume: vol * 0.5, attack: 0.05 });
    return sweepTone({ duration: 1.2, wave: "sawtooth", freqPoints: [[0, 60], [0.5, 45], [1, 30]], volume: vol * 0.6, attack: 0.05, release: 0.5 });
  },
  airplane(vol) {
    return noiseBurst({ duration: 0.9, filterType: "bandpass", filterFreq: 1500, filterQ: 0.5, volume: vol * 0.5, attack: 0.05, release: 0.5 });
  },
};

// A bright ascending sparkle layered under the cry for extra "ta-da!"
// impact — the kind of loud, celebratory hit a countdown payoff needs.
function playSparkle(startTime) {
  [523, 659, 784, 1047].forEach((freq, i) => {
    playTone(freq, 0.4, "sine", startTime + i * 0.045, 0.16);
  });
}

// Plays the buddy's synthesized sound once, then calls onDone after it
// finishes — used both for a single "hear it again" tap and to chain
// indefinite repeats.
export function playFinalOnce(character, onDone) {
  const fn = CRY_FUNCS[character.id] || CRY_FUNCS.cat;
  playSparkle(0);
  const duration = fn(0.6);
  if (onDone) setTimeout(onDone, Math.max(300, duration * 1000 + 250));
}
