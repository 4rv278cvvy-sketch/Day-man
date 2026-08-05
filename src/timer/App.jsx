import React, { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, getCharacter } from "./characters.js";
import { playFootstep, speakCountNumber, playFinalOnce, preloadRealSound } from "./sound.js";
import "./App.css";

const PRESETS = [
  { label: "10s", seconds: 10 },
  { label: "30s", seconds: 30 },
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "5 min", seconds: 300 },
];

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const CONFETTI_EMOJI = ["🎉", "⭐", "✨", "🎈", "🥳"];

function Confetti() {
  const pieces = useRef(
    Array.from({ length: 26 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      emoji: CONFETTI_EMOJI[i % CONFETTI_EMOJI.length],
      size: 18 + Math.random() * 18,
    }))
  ).current;

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}px`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

function SetupScreen({ selectedId, onSelect, duration, onDuration, finalMode, onFinalMode, onStart }) {
  const [customMinutes, setCustomMinutes] = useState(0);
  const [customSeconds, setCustomSeconds] = useState(20);

  const applyCustom = () => {
    const total = Math.max(1, customMinutes * 60 + customSeconds);
    onDuration(total);
  };

  return (
    <div className="screen setup-screen">
      <h1 className="title">🐾 Countdown Buddies 🚗</h1>
      <p className="subtitle">Pick a buddy and a time, then press Start!</p>

      {CATEGORIES.map((cat) => (
        <div key={cat.label} className="character-group">
          <h2 className="group-label">{cat.label}</h2>
          <div className="character-grid">
            {cat.items.map((c) => (
              <button
                key={c.id}
                className={`character-card ${selectedId === c.id ? "selected" : ""}`}
                style={{ "--accent": c.color }}
                onClick={() => onSelect(c.id)}
                type="button"
              >
                {c.sound?.type === "synth" && (
                  <span className="synth-badge" title="Synthesized sound, not a real recording">
                    🎼
                  </span>
                )}
                <span className="character-emoji">{c.emoji}</span>
                <span className="character-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <p className="synth-legend">🎼 = synthesized sound. Buddies without the badge use a real recording.</p>

      <h2 className="group-label">How long?</h2>
      <div className="preset-row">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset-btn ${duration === p.seconds ? "selected" : ""}`}
            onClick={() => onDuration(p.seconds)}
            type="button"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="custom-row">
        <label>
          Min
          <input
            type="number"
            min="0"
            max="59"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          Sec
          <input
            type="number"
            min="0"
            max="59"
            value={customSeconds}
            onChange={(e) => setCustomSeconds(Number(e.target.value) || 0)}
          />
        </label>
        <button className="preset-btn" type="button" onClick={applyCustom}>
          Use custom
        </button>
      </div>

      <p className="duration-readout">Timer set to {formatTime(duration)}</p>

      <h2 className="group-label">Final sound</h2>
      <div className="preset-row">
        <button
          className={`preset-btn ${finalMode === "repeat" ? "selected" : ""}`}
          type="button"
          onClick={() => onFinalMode("repeat")}
        >
          🔁 Keep playing
        </button>
        <button
          className={`preset-btn ${finalMode === "once" ? "selected" : ""}`}
          type="button"
          onClick={() => onFinalMode("once")}
        >
          🔂 Play once
        </button>
      </div>
      <p className="duration-readout">
        {finalMode === "repeat"
          ? "Buddy's sound repeats until you stop it."
          : "Buddy's sound plays once, then it's quiet."}
      </p>

      <button className="start-btn" type="button" disabled={!selectedId} onClick={onStart}>
        ▶ Start!
      </button>
    </div>
  );
}

function CountdownScreen({ character, duration, finalMode, onExit, onRestart }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [repeating, setRepeating] = useState(false);
  const intervalRef = useRef(null);
  const repeatTimeoutRef = useRef(null);
  const repeatingRef = useRef(false);

  const setRepeatingBoth = (value) => {
    repeatingRef.current = value;
    setRepeating(value);
  };

  // Decode a real sound well ahead of the finish moment instead of at it.
  useEffect(() => {
    preloadRealSound(character);
  }, [character]);

  function runFinalCycle() {
    playFinalOnce(character, () => {
      if (repeatingRef.current) {
        repeatTimeoutRef.current = setTimeout(runFinalCycle, 700);
      }
    });
  }

  useEffect(() => {
    if (!running || finished) return undefined;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(intervalRef.current);
          setFinished(true);
          setRepeatingBoth(finalMode === "repeat");
          runFinalCycle();
          return 0;
        }

        playFootstep(character);
        if (next <= 3) {
          speakCountNumber(next);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, finished, character]);

  // Stop any pending repeat / in-flight speech when this run ends (exit or restart).
  // repeatingRef must flip to false here too — an in-flight cry's onDone callback
  // (scheduled before unmount) still fires after unmount and would otherwise see
  // a stale "true" and reschedule another cycle for a screen that's already gone.
  useEffect(() => {
    return () => {
      repeatingRef.current = false;
      clearTimeout(repeatTimeoutRef.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const handleSoundToggle = () => {
    if (finalMode === "once") {
      runFinalCycle();
      return;
    }
    const next = !repeatingRef.current;
    setRepeatingBoth(next);
    if (next) {
      runFinalCycle();
    } else {
      clearTimeout(repeatTimeoutRef.current);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  };

  const soundToggleLabel =
    finalMode === "once" ? "🔊 Hear it again" : repeating ? "🔇 Stop sound" : "🔁 Keep playing";

  const togglePause = () => setRunning((r) => !r);

  const progress = 1 - remaining / duration;

  return (
    <div
      className={`screen countdown-screen ${finished ? "finished" : ""}`}
      style={{ "--accent": character.color }}
    >
      {finished && <Confetti />}
      <div className={`flash-overlay ${finished ? "flashing" : ""}`} aria-hidden="true" />

      <button className="exit-btn" type="button" onClick={onExit}>
        ✕
      </button>

      <div className="progress-ring-wrap">
        <div className="progress-pie" style={{ "--remaining-pct": `${(1 - progress) * 100}%` }} />
        <div className="dial-content">
          {!finished && <div className="time-readout">{formatTime(remaining)}</div>}
          <div
            className={`character-big ${finished ? "celebrate" : remaining % 2 === 0 ? "step-a" : "step-b"}`}
          >
            {character.emoji}
          </div>
        </div>
      </div>

      {!finished ? (
        <>
          <div className="controls-row">
            <button className="control-btn" type="button" onClick={togglePause}>
              {running ? "⏸ Pause" : "▶ Resume"}
            </button>
            <button className="control-btn" type="button" onClick={onRestart}>
              ↺ Restart
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="finished-text">{character.finalWord}</div>
          <div className="controls-row">
            <button className="control-btn primary" type="button" onClick={onRestart}>
              ↺ Again
            </button>
            <button className="control-btn" type="button" onClick={onExit}>
              🐾 Choose another
            </button>
            <button className="control-btn" type="button" onClick={handleSoundToggle}>
              {soundToggleLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("setup");
  const [selectedId, setSelectedId] = useState(null);
  const [duration, setDuration] = useState(30);
  const [finalMode, setFinalMode] = useState("repeat");
  const [runId, setRunId] = useState(0);

  const character = selectedId ? getCharacter(selectedId) : null;

  const handleStart = useCallback(() => {
    if (!selectedId) return;
    setRunId((id) => id + 1);
    setPhase("running");
  }, [selectedId]);

  const handleExit = useCallback(() => setPhase("setup"), []);
  const handleRestart = useCallback(() => {
    setRunId((id) => id + 1);
    setPhase("running");
  }, []);

  return (
    <div className="app-root">
      {phase === "setup" && (
        <SetupScreen
          selectedId={selectedId}
          onSelect={setSelectedId}
          duration={duration}
          onDuration={setDuration}
          finalMode={finalMode}
          onFinalMode={setFinalMode}
          onStart={handleStart}
        />
      )}
      {phase === "running" && character && (
        <CountdownScreen
          key={runId}
          character={character}
          duration={duration}
          finalMode={finalMode}
          onExit={handleExit}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
