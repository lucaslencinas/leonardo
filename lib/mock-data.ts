export interface MockPrediction {
  id: string;
  userName: string;
  birthDate: Date;
  birthTime: { hours: number; minutes: number };
  weight: number; // kg
  height: number; // cm
  eyeColor: string;
  hairColor: string;
}

export const mockPredictions: MockPrediction[] = [
  {
    id: "1",
    userName: "Lucas",
    birthDate: new Date("2026-02-03"),
    birthTime: { hours: 8, minutes: 30 },
    weight: 3.2,
    height: 48,
    eyeColor: "blue",
    hairColor: "light-blonde",
  },
  {
    id: "2",
    userName: "Maria",
    birthDate: new Date("2026-02-05"),
    birthTime: { hours: 14, minutes: 0 },
    weight: 3.5,
    height: 50,
    eyeColor: "green",
    hairColor: "brown",
  },
  {
    id: "3",
    userName: "Carlos",
    birthDate: new Date("2026-02-07"),
    birthTime: { hours: 22, minutes: 45 },
    weight: 3.8,
    height: 52,
    eyeColor: "brown",
    hairColor: "dark-brown",
  },
  {
    id: "4",
    userName: "Sofia",
    birthDate: new Date("2026-02-04"),
    birthTime: { hours: 6, minutes: 15 },
    weight: 3.0,
    height: 47,
    eyeColor: "hazel",
    hairColor: "blonde",
  },
  {
    id: "5",
    userName: "Diego",
    birthDate: new Date("2026-02-06"),
    birthTime: { hours: 18, minutes: 30 },
    weight: 4.0,
    height: 54,
    eyeColor: "dark-brown",
    hairColor: "black",
  },
  {
    id: "6",
    userName: "Ana",
    birthDate: new Date("2026-02-05"),
    birthTime: { hours: 12, minutes: 0 },
    weight: 3.4,
    height: 49,
    eyeColor: "amber",
    hairColor: "light-brown",
  },
  {
    id: "7",
    userName: "Miguel",
    birthDate: new Date("2026-02-02"),
    birthTime: { hours: 3, minutes: 20 },
    weight: 2.9,
    height: 46,
    eyeColor: "grey-blue",
    hairColor: "dark-blonde",
  },
  {
    id: "8",
    userName: "Isabella",
    birthDate: new Date("2026-02-08"),
    birthTime: { hours: 16, minutes: 45 },
    weight: 4.2,
    height: 55,
    eyeColor: "light-blue",
    hairColor: "near-black",
  },
  {
    id: "9",
    userName: "Roberto",
    birthDate: new Date("2026-02-05"),
    birthTime: { hours: 10, minutes: 30 },
    weight: 3.6,
    height: 51,
    eyeColor: "blue",
    hairColor: "brown",
  },
  {
    id: "10",
    userName: "Patricia",
    birthDate: new Date("2026-02-05"),
    birthTime: { hours: 14, minutes: 0 },
    weight: 3.5,
    height: 50,
    eyeColor: "hazel",
    hairColor: "light-brown",
  },
];
