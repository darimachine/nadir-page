/* Single source for facts, figures and open items. Every figure carries its source;
 * anything the team still has to confirm is listed in OPEN_ITEMS and rendered with <Ph>. */

export const FACTS = {
  dumpsitesMapped: 303, // Sofia, Apr 2025 – May 2026 (13 months)
  cleanedTwoYears: 30, // ~19 in 2024 + 11 in 2025
  cleanup2024Eur: 387_000, // 757 187 BGN
  cleanup2025Eur: 182_000,
  kostenetsYears: 12, // first reports 2014, clean-up Sept 2026
  kostenetsTonnesDay1: 20, // "20+ t on the first day"
  municipalitiesBG: 265,
  constructionWasteT: 176_000, // forecast Sofia 2026
  pilotWeeks: 8,
  lombardyAccuracy: 94.56, // tile accuracy at 20 cm; reviewers found 155 sites with AI help vs 95 without
};

export const SOURCES = {
  scale: { bg: 'Столичен общински съвет, доклад СОА26-ВК66-4831; Столична община', en: 'Sofia Municipal Council, report СОА26-ВК66-4831; Sofia Municipality' },
  kostenets: { bg: 'Cross.bg, 17.09.2026', en: 'Cross.bg, 17.09.2026' },
  mentors: { bg: 'Менторска среща със служители на Столична община, 17.10.2026', en: 'Mentoring session with Sofia Municipality staff, 17.10.2026' },
  lombardy: { bg: 'Politecnico di Milano / проект PERIVALLON (Ломбардия)', en: 'Politecnico di Milano / PERIVALLON project (Lombardy)' },
  construction: { bg: 'Програма за управление на отпадъците на СО 2021–2028; ЦИД, „Мръсни потоци“', en: 'Sofia waste management programme 2021–2028; CSD, “Dirty Flows”' },
};

export const DATES = {
  dut: '17.11.2026',
  cassini: '27–29.11.2026',
};

/** Shown on the site as dashed placeholders until the team fills them in. */
export const CONTACT_EMAIL: string | null = 'nadir.sat@proton.me';
export const OPEN_ITEMS = [
  'Privacy policy — draft; have it reviewed before launch',
  'FormSubmit — confirm the activation e-mail sent to CONTACT_EMAIL after the first submission',
];

/** Forms are delivered by FormSubmit (formsubmit.co) to CONTACT_EMAIL. The first submission triggers a
 *  one-time activation e-mail; until it is confirmed, nothing is forwarded. Set to null to fall back to
 *  composing the message for the visitor to send. */
export const FORM_ENDPOINT: string | null = CONTACT_EMAIL ? `https://formsubmit.co/ajax/${CONTACT_EMAIL}` : null;
