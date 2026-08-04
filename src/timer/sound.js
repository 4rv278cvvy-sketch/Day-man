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
  playTone(freq, duration, wave);
}

export function playFinalFanfare(character) {
  const notes = character.finalNotes || [440, 554, 659];
  notes.forEach((freq, i) => {
    playTone(freq, 0.22, "triangle", i * 0.16, 0.3);
  });
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

export function speakFinal(character) {
  speak(character.finalWord, { pitch: 1.1, rate: 0.95 });
}
