# Day-man
Genealogy

## Countdown Buddies (animal & vehicle timer)

A kid-friendly countdown timer at `/timer.html`. Pick an animal or vehicle
buddy, choose a duration, and start the countdown: every second plays a
themed tick sound, and reaching zero plays a fun fanfare plus the buddy's
"sound" (e.g. Woof!, Vroom vroom!) with a confetti celebration. All sound
is generated in-browser (Web Audio API + speech synthesis), no external
audio files needed.

Run it with the existing Vite dev server (`npm run dev`) and open
`/timer.html`, or build with `npm run build` (both `index.html` and
`timer.html` are built as separate pages).

Source: `src/timer/`.
