export const MOODS = {
  WARM: {
    bg: 'bg-[#FDFCF8]',
    accent: 'text-[#D4AF37]',
    border: 'border-[#D4AF37]/20',
    highlight: 'bg-[#D4AF37]/5',
  },
  ENERGETIC: {
    bg: 'bg-[#F5F2EA]',
    accent: 'text-[#A0522D]',
    border: 'border-[#A0522D]/20',
    highlight: 'bg-[#A0522D]/5',
  },
  REFLECTIVE: {
    bg: 'bg-[#FDFCF8]',
    accent: 'text-[#1A2B48]',
    border: 'border-[#1A2B48]/20',
    highlight: 'bg-[#1A2B48]/5',
  },
  CLEAN: {
    bg: 'bg-[#FDFCF8]',
    accent: 'text-[#333333]',
    border: 'border-[#333333]/20',
    highlight: 'bg-[#333333]/5',
  }
}

export function getThemeByMood(mood: string | null | undefined) {
  if (!mood) return MOODS.REFLECTIVE

  const upperMood = mood.toUpperCase()
  if (upperMood.includes('WARM') || upperMood.includes('EXCITED')) return MOODS.WARM
  if (upperMood.includes('ENERGETIC') || upperMood.includes('SPORTS')) return MOODS.ENERGETIC
  if (upperMood.includes('CLEAN') || upperMood.includes('DOC')) return MOODS.CLEAN

  return MOODS.REFLECTIVE
}
