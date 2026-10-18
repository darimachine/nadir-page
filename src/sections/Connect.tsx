import { useState, type ReactNode } from 'react';
import { LuMessageSquareWarning, LuCctv, LuTruck, LuPlus } from 'react-icons/lu';
import { useT, useNum } from '../lib/i18n';
import { Reveal } from '../lib/motion';
import { Section, Source, DroneIcon } from '../components/ui';
import { SOURCES, FACTS } from '../content';

type Row = { icon: (p: { size?: number; className?: string }) => ReactNode; name: [string, string]; today: [string, string]; plus: [string, string] };

export function Connect() {
  const t = useT();
  const n = useNum();
  const [connected, setConnected] = useState(true);
  const rows: Row[] = [
    { icon: LuMessageSquareWarning, name: ['Call Sofia', 'Call Sofia'], today: ['Сигнали от граждани, без снимка и без приоритет', 'Citizen reports, with no photo and no priority'], plus: ['Добавяме снимка и място в списъка по спешност', 'We add a photo and a place in the urgency ranking'] },
    { icon: LuCctv, name: ['Камери', 'Cameras'], today: ['Пазят места, които вече са известни', 'Watch places that are already known'], plus: ['Показваме къде да се преместят според горещите точки', 'We show where to move them, based on the hotspots'] },
    { icon: DroneIcon, name: ['Дроново заснемане', 'Drone surveys'], today: ['Два научни института вече заснемат', 'Two research institutes already fly'], plus: ['Става фиксиран маршрут със сравнение във времето', 'It becomes a fixed route with comparison over time'] },
    { icon: LuTruck, name: ['GPS на камионите и кантар на депото', 'Truck GPS and landfill weighbridge'], today: ['Мерят пробега и тоновете', 'Measure routes and tonnes'], plus: ['Свързваме тоновете с мястото, откъдето са извозени', 'We tie the tonnes to the place they were hauled from'] },
  ];

  return (
    <Section id="connect" tone="paper-2"
      title={t('Данните ги има. Не са свързани.', 'The data exists. It isn’t connected.')}
      lede={t(
        'Общината вече има сигнали, камери, дроново заснемане, GPS на камионите и кантар на депото. Тези системи не си говорят, затова инспекторатът ходи на всеки сигнал, без да знае кой е най-спешен.',
        'The city already has citizen reports, cameras, drone surveys, truck GPS and a landfill weighbridge. These systems don’t talk to each other, so inspectors go out to every report without knowing which is most urgent.'
      )}>
      <Reveal className="mt-12">
        {/* Toggle buttons: a radiogroup would promise arrow-key navigation these don't have */}
        <div role="group" aria-label={t('Сравнение', 'Comparison')} className="inline-flex rounded-full border border-rule bg-raised p-1">
          {[false, true].map((v) => (
            <button key={String(v)} type="button" aria-pressed={connected === v} onClick={() => setConnected(v)}
              className={`min-h-10 rounded-full px-4 text-[0.9375rem] font-medium transition-colors ${connected === v ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'}`}>
              {v ? t('С Nadir', 'With Nadir') : t('Днес', 'Today')}
            </button>
          ))}
        </div>

        <div className="mt-8 overflow-hidden rounded-[14px] border border-rule bg-raised">
          <div className="hidden grid-cols-12 gap-6 border-b border-rule px-6 py-3 text-[0.875rem] text-ink-soft md:grid">
            <span className="col-span-4">{t('Система', 'System')}</span>
            <span className="col-span-4">{t('Какво прави днес', 'What it does today')}</span>
            <span className="col-span-4">{t('Какво добавя Nadir', 'What Nadir adds')}</span>
          </div>
          <ul>
            {rows.map((r, i) => {
              const I = r.icon;
              return (
                <li key={i} className="grid gap-2 border-b border-rule px-5 py-5 last:border-b-0 md:grid-cols-12 md:gap-6 md:px-6">
                  <span className="flex items-center gap-3 font-medium md:col-span-4">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${connected ? 'border-ice bg-ice-soft text-ice' : 'border-rule text-ink-soft'}`}>
                      <I size={18} />
                    </span>
                    {t(r.name[0], r.name[1])}
                  </span>
                  <span className="text-ink-soft md:col-span-4">{t(r.today[0], r.today[1])}</span>
                  <span className={`flex items-start gap-2 transition-all duration-500 md:col-span-4 ${connected ? 'opacity-100' : 'opacity-35'}`} aria-hidden={!connected}>
                    <LuPlus size={16} className={`mt-1 shrink-0 ${connected ? 'text-signal' : 'text-ink-soft'}`} />
                    <span className={connected ? '' : 'line-through decoration-rule'}>{connected ? t(r.plus[0], r.plus[1]) : t('Няма връзка с останалите', 'Not linked to the rest')}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className={`flex flex-wrap items-center justify-between gap-4 px-5 py-5 transition-colors duration-500 md:px-6 ${connected ? 'bg-night text-night-fg' : 'bg-paper-2 text-ink'}`}>
            <p className="t-h4">
              {connected
                ? t('Резултатът: най-спешното първо, със снимка преди тръгване.', 'The result: the most urgent first, with a photo before leaving.')
                : t('Резултатът: всеки сигнал е еднакво спешен.', 'The result: every report is equally urgent.')}
            </p>
          </div>
        </div>
        <p className="measure mt-8">
          {t(
            `Откриването на сметища от въздушни снимки вече работи в Европа: в Ломбардия моделът разпознава квадратите със сметища с точност ${n(FACTS.lombardyAccuracy, 1)}%, а с негова помощ проверяващите намират 155 места вместо 95. Нашата работа е да пренесем този подход в София.`,
            `Finding dumpsites in aerial imagery already works in Europe: in Lombardy the model classifies image tiles with ${n(FACTS.lombardyAccuracy, 1)}% accuracy, and with its help reviewers found 155 sites instead of 95. Our work is to bring that approach to Sofia.`
          )}
        </p>
      </Reveal>
      <Source>{t('Източници: ', 'Sources: ')}{t(SOURCES.mentors.bg, SOURCES.mentors.en)}; {t(SOURCES.lombardy.bg, SOURCES.lombardy.en)}</Source>
    </Section>
  );
}
