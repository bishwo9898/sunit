// Utility to select the strongest hero/banner images from the manifest
// Criteria:
// 1. Prefer landscape orientation (aspect between 1.3 and 2.2 ideal)
// 2. Fall back to mildly landscape (>=1.15) then any remaining if still short
// 3. Deterministic pseudo-random selection per day & category so it feels fresh but stable within a day
// 4. Preserve any items tagged as featured (tag includes 'featured' or 'hero') at the front

import type { ImgItem } from './manifest.server';

function daySeed() {
  const d = new Date();
  // Use UTC date to avoid timezone flip surprises
  return Number(`${d.getUTCFullYear()}${d.getUTCMonth() + 1}${d.getUTCDate()}`);
}

// Mulberry32 deterministic PRNG
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], seed: number) : T[] {
  const rand = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export type HeroSelectOptions = {
  categories: string[]; // accepted category labels
  count: number; // desired number of slides
};

export function selectHeroImages(manifest: ImgItem[], opts: HeroSelectOptions): ImgItem[] {
  const { categories, count } = opts;
  const pool = manifest.filter(m => m.category && categories.includes(m.category));
  if (!pool.length) return [];

  // Score images
  interface Scored extends ImgItem { score: number; aspect?: number }
  const scored: Scored[] = pool.map(m => {
    const w = m.width || 0;
    const h = m.height || 0;
    const aspect = w && h ? w / h : 1; // fallback neutral
    // Ideal aspect ~1.6 (between 3:2 and 16:10)
    const ideal = 1.6;
    const orientationPenalty = Math.abs(aspect - ideal); // smaller is better
    const landscapeBonus = aspect >= 1.3 ? 0.2 : aspect >= 1.15 ? 0.05 : 0; // encourage landscape
    const widthBonus = Math.min(w / 4000, 0.25); // mild bonus for very high-res
    const tagBonus = (m.tags || []).some(t => /featured|hero/i.test(t)) ? 0.5 : 0;
    // Lower orientationPenalty is good; convert to positive score
    const score = 1 - orientationPenalty + landscapeBonus + widthBonus + tagBonus;
    return { ...m, aspect, score };
  });

  // Filter tiers
  const tier1 = scored.filter(s => (s.aspect || 0) >= 1.3 && (s.aspect || 0) <= 2.2);
  const tier2 = scored.filter(s => !tier1.includes(s) && (s.aspect || 0) >= 1.15 && (s.aspect || 0) <= 2.6);
  const tier3 = scored.filter(s => !tier1.includes(s) && !tier2.includes(s));

  const seed = daySeed();
  const catSeed = categories.join('|').split('').reduce((a,c)=> a + c.charCodeAt(0), 0);
  const combinedSeed = seed + catSeed;

  const ordered = [
    ...seededShuffle(tier1, combinedSeed + 11).sort((a,b)=> b.score - a.score),
    ...seededShuffle(tier2, combinedSeed + 37).sort((a,b)=> b.score - a.score),
    ...seededShuffle(tier3, combinedSeed + 71).sort((a,b)=> b.score - a.score)
  ];

  // Pull out featured/hero tagged items to pin front (preserving internal order by score)
  const featured = ordered.filter(o => (o.tags || []).some(t => /featured|hero/i.test(t))).slice(0, 2);
  const rest = ordered.filter(o => !featured.includes(o));

  return [...featured, ...rest].slice(0, count);
}
