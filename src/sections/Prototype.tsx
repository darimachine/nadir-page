import { useT, useNum } from '../lib/i18n';
import { Reveal } from '../lib/motion';
import { Section, Source } from '../components/ui';
import { DEMO, DISMISSED, KNOWN_SITES, LABEL_TEXT } from '../imagery';

/* The prototype as it stands in the nadir-main repository: a review demo on real municipal orthophoto,
 * and a detector that met its target on development data only. Figures are copied from the repo. */

export function Prototype() {
  const t = useT();
  const n = useNum();
  const facts = [
    { v: String(DEMO.crops), label: t(`кадъра по ${n(DEMO.cropMetres, 1)} × ${n(DEMO.cropMetres, 1)} м в демото за преглед`, `crops of ${n(DEMO.cropMetres, 1)} × ${n(DEMO.cropMetres, 1)} m in the review demo`) },
    { v: `${DEMO.pixelCm} ${t('см', 'cm')}`, label: t('на пиксел: общинско ортофото, безплатно', 'per pixel: municipal orthophoto, free') },
    { v: '38/55', label: t('известни натрупвания, намерени от най-добрия детектор на данните за разработка (69%)', 'known deposits found by the best detector on development data (69%)') },
  ];
  const steps = [
    t('Снимката се нарязва на кадри; моделът предлага кандидати.', 'The image is cut into crops; the model proposes candidates.'),
    t('Човек преглежда всеки кандидат: за проверка, отхвърлен или несигурно.', 'A person reviews each candidate: needs inspection, dismissed or uncertain.'),
    t('Само „за проверка“ влиза в списъка за инспекция (CSV или GeoJSON).', 'Only “needs inspection” goes into the inspection list (CSV or GeoJSON).'),
  ];
  return (
    <Section id="prototype" tone="paper-2"
      title={t('Работещ преглед на реални снимки', 'A working review on real imagery')}
      lede={t('Демото работи върху общинско ортофото на Манастирски ливади. Повечето кадри са празни, а прототипът помага на човека да стигне бързо до малкото, които си струва да се проверят.', 'The demo runs on municipal orthophoto of Manastirski Livadi. Most crops are empty; the prototype helps a person get quickly to the few worth checking.')}>
      <Reveal className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <dl className="border-t border-rule">
            {facts.map((f) => (
              <div key={f.v} className="grid grid-cols-[minmax(6.5rem,auto)_1fr] items-baseline gap-5 border-b border-rule py-5">
                <dt className="t-num text-[2.5rem]">{f.v}</dt>
                <dd className="text-ink-soft">{f.label}</dd>
              </div>
            ))}
          </dl>
          <ol className="mt-10 grid gap-4">
            {steps.map((s, i) => (
              <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-2">
                <span className="t-num text-[1.25rem] text-signal">{i + 1}</span><span>{s}</span>
              </li>
            ))}
          </ol>
          <p className="t-small mt-8 text-ink-soft">
            {t('Детекторът е настроен на същите сцени, на които е оценен, така че резултатът е оптимистичен. Проверка върху нов район предстои. Резултатът е кандидат за проверка на място, не доказано нарушение.', 'The detector was tuned on the same scenes it was scored on, so the result is optimistic. A check on a new area is pending. A result is a candidate for an on-site check, not a proven violation.')}
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="font-medium">{t('Така изглежда повечето от района', 'What most of the area looks like')}</p>
          <ul className="mt-4 grid grid-cols-2 gap-3">
            {DISMISSED.map((d) => (
              <li key={d.id}>
                <img src={d.src} width={480} height={480} alt={t(d.caption[0], d.caption[1])} loading="lazy" className="block aspect-square w-full rounded-[6px] object-cover" />
                <p className="t-small mt-2 font-medium">{t(LABEL_TEXT.none[0], LABEL_TEXT.none[1])}</p>
                <p className="t-small text-ink-soft">{t(d.caption[0], d.caption[1])}</p>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-medium">{t('Следващ район: места, вече подавани на Инспектората', 'Next: places already reported to the Inspectorate')}</p>
          <ul className="mt-3 border-t border-rule">
            {KNOWN_SITES.map((s) => (
              <li key={s.place} className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-rule py-3">
                <span className="font-medium">{t(s.district[0], s.district[1])}</span>
                <span className="t-small self-center text-ink-soft" lang="bg">{s.place}</span>
              </li>
            ))}
          </ul>
          <p className="t-small mt-3 text-ink-soft">{t('Точките са подадени места; сегашното им състояние не е проверено.', 'These are reported locations; their current state is unverified.')}</p>
        </div>
      </Reveal>
      <Source>{t('Източник: картата на Инспектората на Столична община, публикувана от ACF (28.05.2024); хранилището на Nadir.', 'Sources: Sofia Municipality Inspectorate map as published by ACF (28.05.2024); the Nadir repository.')}</Source>
    </Section>
  );
}
