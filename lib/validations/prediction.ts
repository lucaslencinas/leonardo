import { z } from 'zod';
import { EYE_COLORS, HAIR_COLORS } from '@/lib/constants/colors';

// Extract valid color IDs from the constants
const eyeColorIds = EYE_COLORS.map(c => c.id) as [string, ...string[]];
const hairColorIds = HAIR_COLORS.map(c => c.id) as [string, ...string[]];

export const predictionSchema = z.object({
  userName: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  userEmail: z.string().email('Invalid email address'),
  connectionTypes: z.array(z.enum(['family', 'friends'])).min(1, 'Please select at least one connection type'),
  birthDate: z.coerce.date(),
  birthTime: z.object({
    hours: z.number().min(0).max(23),
    minutes: z.number().min(0).max(59),
  }),
  weight: z.number().min(2.5, 'Weight must be at least 2.5 kg').max(4.5, 'Weight must be at most 4.5 kg'),
  height: z.number().min(40, 'Height must be at least 40 cm').max(60, 'Height must be at most 60 cm'),
  eyeColor: z.enum(eyeColorIds),
  hairColor: z.enum(hairColorIds),
});

export type PredictionInput = z.infer<typeof predictionSchema>;
