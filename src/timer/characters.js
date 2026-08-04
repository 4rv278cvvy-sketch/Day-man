// Countdown "buddies": animals and vehicles the kid can pick.
// Each one has a distinct tick sound (played every second) and a
// bigger final sound + phrase played when the countdown hits zero.

export const CATEGORIES = [
  {
    label: "Animals",
    items: [
      {
        id: "dog",
        name: "Dog",
        emoji: "🐶",
        color: "#f5a623",
        tick: { wave: "triangle", freq: 520, duration: 0.12 },
        finalWord: "Woof woof!",
        finalNotes: [660, 660, 880],
      },
      {
        id: "cat",
        name: "Cat",
        emoji: "🐱",
        color: "#9b59b6",
        tick: { wave: "sine", freq: 700, duration: 0.1 },
        finalWord: "Meow!",
        finalNotes: [784, 988, 1175],
      },
      {
        id: "lion",
        name: "Lion",
        emoji: "🦁",
        color: "#e67e22",
        tick: { wave: "sawtooth", freq: 220, duration: 0.14 },
        finalWord: "ROAR!",
        finalNotes: [196, 220, 330, 440],
      },
      {
        id: "cow",
        name: "Cow",
        emoji: "🐮",
        color: "#2ecc71",
        tick: { wave: "triangle", freq: 300, duration: 0.14 },
        finalWord: "Moo!",
        finalNotes: [294, 349, 392],
      },
      {
        id: "duck",
        name: "Duck",
        emoji: "🦆",
        color: "#f1c40f",
        tick: { wave: "square", freq: 600, duration: 0.08 },
        finalWord: "Quack quack!",
        finalNotes: [523, 659, 784],
      },
      {
        id: "elephant",
        name: "Elephant",
        emoji: "🐘",
        color: "#7f8c8d",
        tick: { wave: "sine", freq: 260, duration: 0.14 },
        finalWord: "Toooot!",
        finalNotes: [174, 196, 261, 174],
      },
    ],
  },
  {
    label: "Vehicles",
    items: [
      {
        id: "car",
        name: "Car",
        emoji: "🚗",
        color: "#3498db",
        tick: { wave: "square", freq: 200, duration: 0.1 },
        finalWord: "Vroom vroom! We arrived!",
        finalNotes: [392, 392, 523],
      },
      {
        id: "bus",
        name: "Bus",
        emoji: "🚌",
        color: "#e74c3c",
        tick: { wave: "square", freq: 180, duration: 0.12 },
        finalWord: "Beep beep! Bus stop!",
        finalNotes: [349, 349, 523, 523],
      },
      {
        id: "train",
        name: "Train",
        emoji: "🚂",
        color: "#16a085",
        tick: { wave: "triangle", freq: 240, duration: 0.16 },
        finalWord: "Choo choo! All aboard home!",
        finalNotes: [261, 293, 329, 392],
      },
      {
        id: "firetruck",
        name: "Fire Truck",
        emoji: "🚒",
        color: "#c0392b",
        tick: { wave: "sawtooth", freq: 500, duration: 0.09 },
        finalWord: "Nee naw! Fire truck is here!",
        finalNotes: [880, 660, 880, 660],
      },
      {
        id: "rocket",
        name: "Rocket",
        emoji: "🚀",
        color: "#8e44ad",
        tick: { wave: "sawtooth", freq: 150, duration: 0.1 },
        finalWord: "Blast off!",
        finalNotes: [130, 165, 196, 261, 392],
      },
      {
        id: "airplane",
        name: "Airplane",
        emoji: "✈️",
        color: "#2980b9",
        tick: { wave: "sine", freq: 440, duration: 0.1 },
        finalWord: "Whoosh! We landed!",
        finalNotes: [440, 494, 587],
      },
    ],
  },
];

export const ALL_CHARACTERS = CATEGORIES.flatMap((c) => c.items);

export function getCharacter(id) {
  return ALL_CHARACTERS.find((c) => c.id === id) ?? ALL_CHARACTERS[0];
}
