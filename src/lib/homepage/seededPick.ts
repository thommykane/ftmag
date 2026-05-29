/** Deterministic index from a string seed — stable picks until seed changes. */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

export function pickBySeed<T>(items: T[], seed: string): T | null {
  if (items.length === 0) return null;
  return items[hashSeed(seed) % items.length] ?? null;
}
