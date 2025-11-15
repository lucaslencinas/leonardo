// Top 10 most common baby eye colors
export const EYE_COLORS = [
  { id: 'black', name: 'Black', hex: '#1C1C1C', rgb: 'rgb(28, 28, 28)' },
  { id: 'dark-brown', name: 'Dark Brown', hex: '#3D2817', rgb: 'rgb(61, 40, 23)' },
  { id: 'brown', name: 'Brown', hex: '#6F4E37', rgb: 'rgb(111, 78, 55)' },
  { id: 'light-brown', name: 'Light Brown', hex: '#A67B5B', rgb: 'rgb(166, 123, 91)' },
  { id: 'hazel', name: 'Hazel', hex: '#8E7618', rgb: 'rgb(142, 118, 24)' },
  { id: 'amber', name: 'Amber', hex: '#D4A017', rgb: 'rgb(212, 160, 23)' },
  { id: 'green', name: 'Green', hex: '#2E8B57', rgb: 'rgb(46, 139, 87)' },
  { id: 'blue-grey', name: 'Blue-Grey', hex: '#6699CC', rgb: 'rgb(102, 153, 204)' },
  { id: 'blue', name: 'Blue', hex: '#4A90E2', rgb: 'rgb(74, 144, 226)' },
  { id: 'light-blue', name: 'Light Blue', hex: '#87CEEB', rgb: 'rgb(135, 206, 235)' },
] as const;

// Hair colors from black to very light blonde (gradient)
export const HAIR_COLORS = [
  { id: 'black', name: 'Black', hex: '#1C1C1C', rgb: 'rgb(28, 28, 28)' },
  { id: 'near-black', name: 'Near Black', hex: '#2C1810', rgb: 'rgb(44, 24, 16)' },
  { id: 'very-dark-brown', name: 'Very Dark Brown', hex: '#3D2817', rgb: 'rgb(61, 40, 23)' },
  { id: 'dark-brown', name: 'Dark Brown', hex: '#4B3621', rgb: 'rgb(75, 54, 33)' },
  { id: 'brown', name: 'Brown', hex: '#6F4E37', rgb: 'rgb(111, 78, 55)' },
  { id: 'light-brown', name: 'Light Brown', hex: '#A0826D', rgb: 'rgb(160, 130, 109)' },
  { id: 'dark-blonde', name: 'Dark Blonde', hex: '#B8860B', rgb: 'rgb(184, 134, 11)' },
  { id: 'blonde', name: 'Blonde', hex: '#DAA520', rgb: 'rgb(218, 165, 32)' },
  { id: 'light-blonde', name: 'Light Blonde', hex: '#F0E68C', rgb: 'rgb(240, 230, 140)' },
  { id: 'platinum-blonde', name: 'Platinum Blonde', hex: '#F5F5DC', rgb: 'rgb(245, 245, 220)' },
] as const;

export type EyeColorId = typeof EYE_COLORS[number]['id'];
export type HairColorId = typeof HAIR_COLORS[number]['id'];
