/** Public customer prices. Internal cost/profit inputs are not published. */
type Localized = { bg: string; en: string };
export type PlanId = 'discovery' | 'monitoring';
export const MIN_AREA_KM2 = 50;
export const PLANS: Record<PlanId, {
  name: Localized; priceEur: number; billing: Localized; summary: Localized;
  cadence: Localized; features: Localized[];
}> = {
  discovery: {
    name: { bg: 'Еднократно сканиране', en: 'One-off scan' },
    priceEur: 534,
    billing: { bg: 'еднократно', en: 'one-off' },
    summary: { bg: 'Откриваме нови места със съмнение за отпадъци в избраната територия.', en: 'Find previously unidentified potential dumpsites in your chosen area.' },
    cadence: { bg: 'Един анализ по архивни снимки', en: 'One analysis using archive imagery' },
    features: [
      { bg: 'Анализ на налични архивни сателитни снимки', en: 'Analysis of available archive satellite imagery' },
      { bg: 'Карта на откритите места за проверка', en: 'A map of detected sites for inspection' },
      { bg: 'AI анализ с преглед на резултатите', en: 'AI analysis with a review of the results' },
      { bg: 'Доклад за планиране на следващите действия', en: 'A report to help plan the next actions' },
    ],
  },
  monitoring: {
    name: { bg: 'Годишен мониторинг', en: 'Annual monitoring' },
    priceEur: 24000,
    billing: { bg: 'за 12 месеца', en: 'for 12 months' },
    summary: { bg: 'Следим сметищата, които сме открили, и показваме как се променят.', en: 'Monitor the dumpsites we have identified and see how they change.' },
    cadence: { bg: '2 снимки и анализа месечно · 24 за годината', en: '2 images and analyses per month · 24 per year' },
    features: [
      { bg: '2 нови сателитни заснемания и анализа всеки месец', en: '2 new satellite acquisitions and analyses every month' },
      { bg: '24 заснемания и анализа за 12 месеца', en: '24 acquisitions and analyses over 12 months' },
      { bg: 'Сравнение на откритите сметища във времето', en: 'Comparison of identified dumpsites over time' },
      { bg: 'Обновена карта и доклади за промените', en: 'Updated maps and reports of changes' },
    ],
  },
};

export function validArea(value: string): boolean {
  const area = Number(value.trim().replace(',', '.'));
  return value.trim() !== '' && Number.isFinite(area) && area >= MIN_AREA_KM2;
}

export function isPlanId(value: string | null): value is PlanId {
  return value === 'discovery' || value === 'monitoring';
}
