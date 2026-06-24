/** AppStax category accent colors for feed chips and borders. */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ai: { bg: '#e6f3ff', text: '#0066d6', border: '#0084ff' },
  agents: { bg: '#e8faf0', text: '#15803d', border: '#22c55e' },
  devtools: { bg: '#fff4e8', text: '#c2410c', border: '#ff7b00' },
  research: { bg: '#f3e8ff', text: '#7e22ce', border: '#a855f7' },
  events: { bg: '#f0f0f0', text: '#525252', border: '#b4b4b4' },
}

export function categoryStyle(id: string) {
  return CATEGORY_COLORS[id] ?? CATEGORY_COLORS.ai
}
