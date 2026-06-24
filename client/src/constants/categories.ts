export const CATEGORIES = [
  { id: '', label: 'All' },
  { id: 'ai', label: 'AI' },
  { id: 'agents', label: 'Agents' },
  { id: 'devtools', label: 'Dev Tools' },
  { id: 'research', label: 'Research' },
  { id: 'events', label: 'Events' },
] as const

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}
