import { useState } from 'react';
import { LuArrowRight, LuCpu, LuDatabase, LuMap, LuServer, LuShieldCheck, LuScanSearch } from 'react-icons/lu';
import { useT } from '../lib/i18n';
import { Link } from '../lib/router';
import { Reveal } from '../lib/motion';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/ui';

type Layer = { name: string | [string, string]; res: [string, string]; cadence: [string, string]; licence: [string, string]; use: [string, string]; tile: number; hot: boolean };

const LAYERS: Layer[] = [
  { name: 'Sentinel-2 (Copernicus)', res: ['10 м', '10 m'], cadence: ['на ~5 дни', 'every ~5 days'], licence: ['безплатно', 'free'], use: ['Широк скрининг на целия град за големи промени', 'Wide screening of the whole city for large changes'], tile: 34, hot: false },
  { name: 'Wyvern Open Data', res: ['5,3 м, 23 спектрални канала', '5.3 m, 23 spectral bands'], cadence: ['—', '—'], licence: ['CC BY 4.0', 'CC BY 4.0'], use: ['Следваща стъпка: тип отпадък по спектъра', 'Next step: type of waste from the spectrum'], tile: 24, hot: false },
  { name: 'Sfera Technologies', res: ['0,5 м', '0.5 m'], cadence: ['по договор', 'by agreement'], licence: ['по договор', 'by agreement'], use: ['Рискови зони; малки и средни сметища', 'Risk zones; small and medium dumps'], tile: 14, hot: true },
  { name: ['Ортофото ГИС-София', 'GIS-Sofia orthophoto'], res: ['сантиметри', 'centimetres'], cadence: ['исторически издания', 'historical editions'], licence: ['права за машинно обучение: запитани', 'machine-learning rights: requested'], use: ['Исторически сравнения: кога е започнало едно място', 'Historical comparison: when a site started'], tile: 9, hot: true },
  { name: ['Дрон по фиксиран маршрут', 'Drone on a fixed route'], res: ['сантиметри', 'centimetres'], cadence: ['на полет; при нов сигнал', 'per flight; on a new report'], licence: ['собствени данни на проекта', 'project-owned data'], use: ['Горещи точки: вид отпадък, площ, обем', 'Hotspots: type of waste, area, volume'], tile: 5, hot: true },
];

function LayerSwatch({ tile, hot, on }: { tile: number; hot: boolean; on: boolean }) {
  const c = hot ? 'var(--signal)' : 'var(--ice)';
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true" className="shrink-0">
      <defs>
        <pattern id={`sw${tile}`} width={tile / 2} height={tile / 2} patternUnits="userSpaceOnUse">
          <path d={`M${tile / 2} 0H0V${tile / 2}`} fill="none" stroke={c} strokeOpacity={on ? 0.8 : 0.4} strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="1" y="1" width="54" height="54" rx="6" fill={`url(#sw${tile})`} stroke={on ? c : 'var(--rule)'} strokeWidth="1.5" />
    </svg>
  );
}

export function Technology() {
  const t = useT();
  const [sel, setSel] = useState(0);
  const L = LAYERS[sel];
  const nm = (x: Layer['name']) => (typeof x === 'string' ? x : t(x[0], x[1]));

  const stack = [
    { icon: LuScanSearch, h: t('Откриване', 'Detection'), p: t('Днес: детектор на правила, който сравнява издания на снимките и дава кандидати за проверка. След пилота: модел с основа AerialWaste, дообучен с местни примери.', 'Today: a rule-based detector that compares image editions and produces candidates to check. After the pilot: a model based on AerialWaste, fine-tuned with local examples.') },
    { icon: LuServer, h: t('Обработка', 'Processing'), p: 'Python, PyTorch, FastAPI' },
    { icon: LuDatabase, h: t('Пространствени данни', 'Spatial data'), p: 'PostgreSQL / PostGIS' },
    { icon: LuMap, h: t('Карта', 'Map'), p: 'React + MapLibre' },
    { icon: LuCpu, h: t('Изчислителна мощ', 'Compute'), p: t('Достъп до ресурс за обучение на модела', 'Access to compute for training the model') },
  ];

  const rules = [
    { h: t('Решението остава при инспектора', 'The decision stays with the inspector'), p: t('Системата подрежда сигналите. Протокол на място съставя само служебно лице.', 'The system ranks reports. Only an official writes the on-site protocol.') },
    { h: t('Кандидати, не обвинения', 'Candidates, not accusations'), p: t('Откритото от снимките е кандидат за проверка, не доказано нарушение.', 'What the imagery finds is a candidate to check, not a proven violation.') },
    { h: t('Дронове и киберсигурност', 'Drones and cybersecurity'), p: t('Проверяваме изискванията на Закона за киберсигурност към оборудването при работа с държавни институции.', 'We are checking the Cybersecurity Act’s requirements on equipment used with public institutions.') },
    { h: t('Права върху снимките', 'Image rights'), p: t('Ползваме открити данни с ясен лиценз; за ортофотото и търговските снимки уговаряме правата за обучение на модела.', 'We use open data with a clear licence; for the orthophoto and commercial imagery we agree the rights for model training.') },
  ];

  return (
    <>
      <PageHeader kicker={t('Технология', 'Technology')}
        title={t('Пет слоя данни, от целия град до една купчина', 'Five layers of data, from the whole city to one pile')}
        lede={t('Широките и безплатни данни намират промяната. Детайлните и скъпите я потвърждават, но само там, където има смисъл.', 'Wide, free data finds the change. Fine, costly data confirms it, but only where it makes sense.')} />

      <Section title={t('Слоевете данни', 'The data layers')} lede={t('Изберете слой, за да видите какво дава и за какво го ползваме.', 'Pick a layer to see what it provides and what we use it for.')}>
        <Reveal className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Toggle buttons: a listbox would promise arrow keys and a single tab stop these don't have */}
          <div role="group" aria-label={t('Слоеве данни', 'Data layers')} className="flex flex-col lg:col-span-5">
            {LAYERS.map((l, i) => (
              <button key={i} type="button" aria-pressed={i === sel} onClick={() => setSel(i)}
                className={`flex items-center gap-4 border-t py-4 text-left transition-colors ${i === sel ? 'border-ink' : 'border-rule hover:bg-paper-2'}`}>
                <LayerSwatch tile={l.tile} hot={l.hot} on={i === sel} />
                <span className="min-w-0">
                  <span className="t-h4 block">{nm(l.name)}</span>
                  <span className="t-coord block text-ink-soft">{t(l.res[0], l.res[1])}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="lg:col-span-6 lg:col-start-7" aria-live="polite">
            <div className="rounded-[14px] border border-rule bg-raised p-6 md:p-8">
              <p className="text-ink-soft">{t('За какво го ползваме', 'What we use it for')}</p>
              <p className="t-h3 mt-2">{t(L.use[0], L.use[1])}</p>
              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                <div><dt className="t-small text-ink-soft">{t('Резолюция', 'Resolution')}</dt><dd className="mt-1 font-medium">{t(L.res[0], L.res[1])}</dd></div>
                <div><dt className="t-small text-ink-soft">{t('Честота', 'Frequency')}</dt><dd className="mt-1 font-medium">{t(L.cadence[0], L.cadence[1])}</dd></div>
                <div><dt className="t-small text-ink-soft">{t('Достъп', 'Access')}</dt><dd className="mt-1 font-medium">{t(L.licence[0], L.licence[1])}</dd></div>
              </dl>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section tone="paper-2" title={t('Как е изградено', 'How it is built')}
        lede={t('Отворени инструменти, които общинските ИТ екипи познават, и интеграция със съществуващите системи вместо нова платформа.', 'Open tools that municipal IT teams know, and integration with existing systems instead of a new platform.')}>
        <Reveal as="ul" className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {stack.map((s) => {
            const I = s.icon;
            return (
              <li key={s.h} className="border-t border-rule py-6">
                <I size={22} className="text-ice" aria-hidden="true" />
                <p className="t-h4 mt-4">{s.h}</p>
                <p className="mt-2 text-ink-soft">{s.p}</p>
              </li>
            );
          })}
        </Reveal>
      </Section>

      <Section title={t('Правила, по които работим', 'Rules we work by')}>
        <Reveal as="ul" className="mt-12 grid gap-x-12 md:grid-cols-2">
          {rules.map((r) => (
            <li key={r.h} className="flex gap-4 border-t border-rule py-6">
              <LuShieldCheck size={22} className="mt-1 shrink-0 text-signal" aria-hidden="true" />
              <div><p className="t-h4">{r.h}</p><p className="mt-2 text-ink-soft">{r.p}</p></div>
            </li>
          ))}
        </Reveal>
        <Reveal className="mt-12">
          <Link to="pilot" className="btn btn-ink">{t('Вижте как протича пилотът', 'See how the pilot runs')} <LuArrowRight size={18} aria-hidden="true" /></Link>
        </Reveal>
      </Section>
    </>
  );
}
