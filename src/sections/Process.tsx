import { useState, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { LuMap, LuListOrdered, LuScale, LuRefreshCw } from 'react-icons/lu';
import { useT } from '../lib/i18n';
import { Reveal } from '../lib/motion';
import { Section, DroneIcon } from '../components/ui';

type Step = { icon: (p: { size?: number; className?: string }) => ReactNode; title: [string, string]; body: [string, string]; gets: [string, string]; detail: [string, string][] };

const STEPS: Step[] = [
  {
    icon: LuMap,
    title: ['Регистър на сметищата', 'A register of dumpsites'],
    body: ['Сателитни и аерофото снимки, известните сметища и сигналите от Call Sofia дават горещите точки, стари и нови.', 'Satellite and aerial imagery, known dumpsites and Call Sofia reports give the hotspots, old and new.'],
    gets: ['Карта на горещите точки, обновявана при всяко ново издание на снимките', 'A hotspot map, updated with every new image edition'],
    detail: [['Безплатен широк скрининг (Sentinel-2)', 'Free wide-area screening (Sentinel-2)'], ['По-детайлни снимки само за рисковите зони', 'Finer imagery only for risk zones'], ['Сравнение между издания: какво е ново, какво расте', 'Comparison between editions: what is new, what is growing']],
  },
  {
    icon: DroneIcon,
    title: ['Дрон по фиксиран маршрут', 'A drone on a fixed route'],
    body: ['Дронът лети само над горещите точки, не над целия град. При нов сигнал излита, снима и разпознава вида отпадък.', 'The drone flies only over the hotspots, not the whole city. On a new report it takes off, takes photos and recognises the type of waste.'],
    gets: ['Снимка на място, вид отпадък, площ и обем', 'An on-site photo, type of waste, area and volume'],
    detail: [['Площ → обем → ориентировъчна цена за извозване', 'Area → volume → indicative haulage cost'], ['Повторно заснемане по същия маршрут за сравнение', 'Repeat flights on the same route for comparison'], ['Ниша: азбестоцимент, разпознат от разстояние', 'Niche: asbestos cement, recognised from a distance']],
  },
  {
    icon: LuListOrdered,
    title: ['Приоритет за инспектора', 'Priority for the inspector'],
    body: ['Кой сигнал е най-спешен, снимка преди тръгване, тонове и скорост на растеж. Протоколът остава при инспектора: само служебно лице го съставя.', 'Which report is most urgent, a photo before leaving, tonnes and growth rate. The protocol stays with the inspector: only an official can write it.'],
    gets: ['Списък по спешност вместо опашка по ред на постъпване', 'A list ranked by urgency instead of a first-come queue'],
    detail: [['Колко камиона ще трябват за извозване', 'How many trucks the haulage will need'], ['Колко бързо расте сметището', 'How fast the dump is growing'], ['Решението остава при служителя', 'The decision stays with the official']],
  },
  {
    icon: LuScale,
    title: ['Резултат в тонове', 'A result in tonnes'],
    body: ['GPS на камионите и кантарът на депото затварят цикъла: открито → проверено → извозено, в тонове.', 'Truck GPS and the landfill weighbridge close the loop: found → checked → hauled away, in tonnes.'],
    gets: ['Отчет за всяко място: кога е открито, проверено и почистено', 'A record per site: when it was found, checked and cleaned up'],
    detail: [['Интеграция със системите, които вече обменят данни', 'Integration with systems that already exchange data'], ['Без нова платформа за служителите', 'No new platform for staff to learn'], ['Данни за отчети по проекти с европейско финансиране', 'Figures for reporting on EU-funded projects']],
  },
];

function Ring({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const t = useT();
  const pts = [[200, 40], [360, 200], [200, 360], [40, 200]];
  const S = STEPS[active];
  const I = S.icon;
  return (
    <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={t('Цикъл в четири стъпки с превенция', 'A four-step cycle with prevention')}>
      <circle cx="200" cy="200" r="160" fill="none" stroke="var(--rule)" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="160" fill="none" stroke="var(--signal)" strokeWidth="3" pathLength={4}
        strokeDasharray={`${active + 1} 4`} transform="rotate(-90 200 200)" style={{ transition: 'stroke-dasharray .7s cubic-bezier(.16,.84,.24,1)' }} />
      <circle cx="200" cy="200" r="118" fill="none" stroke="var(--rule)" strokeDasharray="2 6" />
      {pts.map(([x, y], i) => (
        <g key={i} className="cursor-pointer" onClick={() => onPick(i)}>
          <circle cx={x} cy={y} r="24" fill={i === active ? 'var(--signal)' : i < active ? 'var(--ink)' : 'var(--raised)'} stroke={i <= active ? 'none' : 'var(--rule)'} style={{ transition: 'fill .4s' }} />
          <text x={x} y={y + 6} textAnchor="middle" fill={i <= active ? 'var(--paper)' : 'var(--ink-soft)'} style={{ font: '500 17px var(--f-display)' }}>{i + 1}</text>
        </g>
      ))}
      <foreignObject x="110" y="140" width="180" height="120">
        <div className="flex h-full flex-col items-center justify-center text-center text-ink">
          <I size={30} className="text-signal" />
          <p className="mt-2 font-display text-[1.125rem] leading-tight">{t(S.title[0], S.title[1])}</p>
        </div>
      </foreignObject>
      <text x="320" y="70" fill="var(--ink-soft)" style={{ font: '400 13px var(--f-body)' }}>{t('превенция', 'prevention')}</text>
      <path d="M300 78 q 30 20 36 46" fill="none" stroke="var(--ink-soft)" strokeWidth="1.2" markerEnd="url(#arr)" />
      <defs><marker id="arr" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 8 4 0 8z" fill="var(--ink-soft)" /></marker></defs>
    </svg>
  );
}

export function Process() {
  const t = useT();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const S = STEPS[active];

  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + STEPS.length) % STEPS.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <Section id="how"
      title={t('От снимката до извозения тон, в един цикъл', 'From the image to the tonne hauled away, in one cycle')}
      lede={t('Четири стъпки, които се повтарят. Повторното заснемане на горещите точки по фиксиран маршрут е и превенцията: ново сметище се вижда, докато е малко.', 'Four steps that repeat. Re-imaging the hotspots on a fixed route is also the prevention: a new dump is seen while it is still small.')}>
      <Reveal className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div role="tablist" aria-orientation="vertical" aria-label={t('Стъпки', 'Steps')} className="flex flex-col" onKeyDown={onKey}>
            {STEPS.map((s, i) => (
              <button key={i} ref={(el) => { tabs.current[i] = el; }} role="tab" id={`step-tab-${i}`} aria-selected={i === active} aria-controls="step-panel"
                tabIndex={i === active ? 0 : -1} onClick={() => setActive(i)}
                className={`group grid grid-cols-[2.5rem_1fr] items-baseline gap-3 border-t py-5 text-left transition-colors ${i === active ? 'border-ink' : 'border-rule'}`}>
                <span className={`t-num text-[1.5rem] ${i === active ? 'text-signal' : 'text-ink-soft'}`}>{i + 1}</span>
                <span>
                  <span className={`t-h4 block ${i === active ? 'text-ink' : 'text-ink-soft group-hover:text-ink'}`}>{t(s.title[0], s.title[1])}</span>
                  {i === active && <span className="mt-2 block text-ink-soft">{t(s.body[0], s.body[1])}</span>}
                </span>
              </button>
            ))}
            <div className="flex items-center gap-3 border-t border-rule py-5 text-ink-soft">
              <LuRefreshCw size={18} className="ml-2.5" />
              <span>{t('Превенция: маршрутът се лети отново и цикълът започва пак.', 'Prevention: the route is flown again and the cycle starts over.')}</span>
            </div>
          </div>
        </div>
        <div id="step-panel" role="tabpanel" aria-labelledby={`step-tab-${active}`} className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:items-center">
          <Ring active={active} onPick={setActive} />
          <div>
            <p className="text-[0.9375rem] text-ink-soft">{t('Какво получава общината', 'What the city gets')}</p>
            <p className="t-h3 mt-2">{t(S.gets[0], S.gets[1])}</p>
            <ul className="mt-6 space-y-3">
              {S.detail.map((d, i) => (
                <li key={i} className="flex gap-3"><span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-ice" />{t(d[0], d[1])}</li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
