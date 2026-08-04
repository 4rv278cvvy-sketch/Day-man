import React, { useCallback, useEffect, useRef, useState } from "react";
import { CATEGORIES, getCharacter } from "./characters.js";
import { playTick, playFinalFanfare, speakCountNumber, speakFinal } from "./sound.js";
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

function SetupScreen({ selectedId, onSelect, duration, onDuration, onStart }) {
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
                <span className="character-emoji">{c.emoji}</span>
                <span className="character-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

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

      <button className="start-btn" type="button" disabled={!selectedId} onClick={onStart}>
        ▶ Start!
      </button>
    </div>
  );
}

function CountdownScreen({ character, duration, onExit, onRestart }) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(true);
  const [bounceKey, setBounceKey] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running || finished) return undefined;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;

        if (next <= 0) {
          clearInterval(intervalRef.current);
          setFinished(true);
          playFinalFanfare(character);
          speakFinal(character);
          setBounceKey((k) => k + 1);
          return 0;
        }

        playTick(character);
        if (next <= 3) {
          speakCountNumber(next);
        }
        setBounceKey((k) => k + 1);
        return next;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, finished, character]);

  const togglePause = () => setRunning((r) => !r);

  const progress = 1 - remaining / duration;

  return (
    <div
      className={`screen countdown-screen ${finished ? "finished" : ""}`}
      style={{ "--accent": character.color }}
    >
      {finished && <Confetti />}

      <button className="exit-btn" type="button" onClick={onExit}>
        ✕
      </button>

      <div className="progress-ring-wrap">
        <svg viewBox="0 0 120 120" className="progress-ring">
          <circle cx="60" cy="60" r="54" className="ring-bg" />
          <circle
            cx="60"
            cy="60"
            r="54"
            className="ring-fg"
            style={{
              strokeDasharray: 2 * Math.PI * 54,
              strokeDashoffset: 2 * Math.PI * 54 * (1 - progress),
            }}
          />
        </svg>
        <div key={bounceKey} className={`character-big ${finished ? "celebrate" : "bounce"}`}>
          {character.emoji}
        </div>
      </div>

      {!finished ? (
        <>
          <div className="time-readout">{formatTime(remaining)}</div>
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
          onStart={handleStart}
        />
      )}
      {phase === "running" && character && (
        <CountdownScreen
          key={runId}
          character={character}
          duration={duration}
          onExit={handleExit}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
