// Consolidated baby eye colors (reduced from 10 to 7 to group similar shades)
export const EYE_COLORS = [
  { id: 'dark-brown', name: 'Dark Brown / Black', hex: '#2A1810', rgb: 'rgb(42, 24, 16)' }, // Grouped: black + dark-brown
  { id: 'brown', name: 'Brown', hex: '#8B6F47', rgb: 'rgb(139, 111, 71)' }, // Grouped: brown + light-brown
  { id: 'hazel', name: 'Hazel', hex: '#8E7618', rgb: 'rgb(142, 118, 24)' },
  { id: 'amber', name: 'Amber', hex: '#D4A017', rgb: 'rgb(212, 160, 23)' },
  { id: 'green', name: 'Green', hex: '#2E8B57', rgb: 'rgb(46, 139, 87)' },
  { id: 'blue', name: 'Blue', hex: '#5A94D5', rgb: 'rgb(90, 148, 213)' }, // Grouped: blue-grey + blue
  { id: 'light-blue', name: 'Light Blue', hex: '#87CEEB', rgb: 'rgb(135, 206, 235)' },
] as const;

// Legacy eye color mapping for migration (old ID -> new ID)
export const EYE_COLOR_MIGRATION_MAP: Record<string, string> = {
  'black': 'dark-brown',           // Black → Dark Brown / Black
  'dark-brown': 'dark-brown',      // Dark Brown → Dark Brown / Black
  'brown': 'brown',                // Brown → Brown
  'light-brown': 'brown',          // Light Brown → Brown
  'hazel': 'hazel',                // Hazel → Hazel (unchanged)
  'amber': 'amber',                // Amber → Amber (unchanged)
  'green': 'green',                // Green → Green (unchanged)
  'blue-grey': 'blue',             // Blue-Grey → Blue
  'blue': 'blue',                  // Blue → Blue
  'light-blue': 'light-blue',      // Light Blue → Light Blue (unchanged)
} as const;

// Consolidated hair colors (reduced from 10 to 6 to group similar shades)
export const HAIR_COLORS = [
  { id: 'black', name: 'Black / Very Dark Brown', hex: '#1C1C1C', rgb: 'rgb(28, 28, 28)' }, // Grouped: black + near-black + very-dark-brown
  { id: 'dark-brown', name: 'Dark Brown / Brown', hex: '#4B3621', rgb: 'rgb(75, 54, 33)' }, // Grouped: dark-brown + brown
  { id: 'light-brown', name: 'Light Brown', hex: '#A0826D', rgb: 'rgb(160, 130, 109)' },
  { id: 'dark-blonde', name: 'Dark Blonde / Blonde', hex: '#B8860B', rgb: 'rgb(184, 134, 11)' }, // Grouped: dark-blonde + blonde
  { id: 'light-blonde', name: 'Light Blonde', hex: '#F0E68C', rgb: 'rgb(240, 230, 140)' },
  { id: 'platinum-blonde', name: 'Platinum Blonde', hex: '#F5F5DC', rgb: 'rgb(245, 245, 220)' },
] as const;

// Legacy hair color mapping for migration (old ID -> new ID)
export const HAIR_COLOR_MIGRATION_MAP: Record<string, string> = {
  'black': 'black',                       // Black → Black / Very Dark Brown
  'near-black': 'black',                  // Near Black → Black / Very Dark Brown
  'very-dark-brown': 'black',             // Very Dark Brown → Black / Very Dark Brown
  'dark-brown': 'dark-brown',             // Dark Brown → Dark Brown / Brown
  'brown': 'dark-brown',                  // Brown → Dark Brown / Brown
  'light-brown': 'light-brown',           // Light Brown → Light Brown (unchanged)
  'dark-blonde': 'dark-blonde',           // Dark Blonde → Dark Blonde / Blonde
  'blonde': 'dark-blonde',                // Blonde → Dark Blonde / Blonde
  'light-blonde': 'light-blonde',         // Light Blonde → Light Blonde (unchanged)
  'platinum-blonde': 'platinum-blonde',   // Platinum Blonde → Platinum Blonde (unchanged)
} as const;

export type EyeColorId = typeof EYE_COLORS[number]['id'];
export type HairColorId = typeof HAIR_COLORS[number]['id'];
