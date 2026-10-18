import { LuArrowRight, LuMapPin, LuDatabase, LuHandshake, LuClock, LuTarget } from 'react-icons/lu';
import { useT, useNum } from '../lib/i18n';
import { Link } from '../lib/router';
import { Reveal, useInView, useReducedMotion } from '../lib/motion';
import { PageHeader } from '../components/PageHeader';
import { Section, Source, DroneIcon } from '../components/ui';
import { DATES, FACTS, SOURCES } from '../content';

function Weeks() {
  const t = useT();
  const [ref, seen] = useInView<HTMLDivElement>();
  const rm = useReducedMotion();
  const phases = [
    t('Регистър и горещи точки', 'Register and hotspots'),
    t('Дрон по фиксиран маршрут, сравнение на снимките', 'Drone on a fixed route, image comparison'),
    t('Инспекторът работи с нашия приоритет', 'The inspector works from our priority list'),
    t('Връзка с кантара, отчет в тонове', 'Link to the weighbridge, report in tonnes'),
  ];
  const fill = seen || rm;
  return (
    <div ref={ref} className="overflow-x-auto">
      <div className="min-w-[560px] pt-12">
        <div className="relative grid grid-cols-8 gap-2">
          {Array.from({ length: FACTS.pilotWeeks }, (_, w) => (
            <div key={w}>
              <span className="t-coord block pb-1.5 text-ink-soft">{t('С', 'W')}{w + 1}</span>
              <div className="relative h-3 overflow-hidden rounded-full border border-rule bg-raised">
              <div className="absolute inset-0 origin-left bg-signal"
                style={{ transform: fill ? 'scaleX(1)' : 'scaleX(0)', transition: rm ? undefined : `transform .45s cubic-bezier(.16,.84,.24,1) ${0.2 + w * 0.22}s` }} />
              </div>
            </div>
          ))}
          {/* the drone flies along the weeks once */}
          <span className="absolute -top-10 text-ice" aria-hidden="true"
            style={{ left: fill ? 'calc(100% - 30px)' : '0px', transition: rm ? undefined : 'left 2s cubic-bezier(.45,.05,.25,1) .2s' }}>
            <DroneIcon size={30} />
          </span>
        </div>
        <ol className="mt-4 grid grid-cols-4 gap-2">
          {phases.map((p, i) => (
            <li key={i} className="border-l-2 border-signal pl-3 text-[0.9375rem] leading-snug">{p}</li>
          ))}
        </ol>
        <p className="t-small mt-4 text-ink-soft">{t('Разпределението по седмици е ориентировъчно и се уточнява с общината.', 'The week-by-week split is indicative and agreed with the municipality.')}</p>
      </div>
    </div>
  );
}

export function Pilot() {
  const t = useT();
  const n = useNum();
  const asks = [
    { icon: LuMapPin, h: t('Един район', 'One district'), p: t('Горещите точки на Красна поляна или Кремиковци.', 'The hotspots of Krasna Polyana or Kremikovtsi.') },
    { icon: LuDatabase, h: t('Достъп до данните', 'Access to the data'), p: t('Регистърът на картираните сметища, сигналите от Call Sofia и данните от кантара на депото.', 'The register of mapped dumpsites, Call Sofia reports and the landfill weighbridge data.') },
    { icon: LuHandshake, h: t('Общината като партньор', 'The city as a partner'), p: t(`Столична община като градски партньор в предварителното предложение по Driving Urban Transitions до ${DATES.dut}.`, `Sofia Municipality as the city partner in the Driving Urban Transitions pre-proposal, due ${DATES.dut}.`) },
  ];
  const road = [
    { d: DATES.dut, h: t('Driving Urban Transitions', 'Driving Urban Transitions'), p: t('Предварително предложение заедно с общината (направление „Кръгова градска икономика“).', 'Pre-proposal together with the city (Circular Urban Economies pathway).') },
    { d: DATES.cassini, h: t('CASSINI Хакатон', 'CASSINI Hackathon'), p: t('Космически данни за устойчивост на градовете.', 'Space data for resilient cities.') },
    { d: '2027', h: 'LIFE', p: t('Покана за кръгова икономика; датата е за потвърждение.', 'Circular-economy call; date to be confirmed.') },
    { d: '2028–2034', h: t('Общински проекти', 'Municipal projects'), p: t('Мониторингът като услуга в проекти по еврофондове, които се планират сега.', 'Monitoring as a service inside EU-funded projects being planned now.') },
  ];
  const max = FACTS.cleanup2024Eur;
  const bars = [[2024, FACTS.cleanup2024Eur], [2025, FACTS.cleanup2025Eur]] as const;

  return (
    <>
      <PageHeader kicker={t('Пилот за общини', 'Pilot for municipalities')}
        title={t('Осем седмици над горещите точки на един район', 'Eight weeks over the hotspots of one district')}
        lede={t('Пилотът не изисква нова система от служителите. Инспекторатът продължава да работи както досега, но с подреден списък и снимка преди тръгване.', 'The pilot asks no new system of staff. The inspectorate keeps working as it does, but with a ranked list and a photo before leaving.')}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="contact" className="btn btn-signal">{t('Заявете пилот', 'Request a pilot')} <LuArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </PageHeader>

      <Section title={t('Как протича', 'How it runs')} lede={t('Четирите стъпки на цикъла, една след друга, над горещите точки на избрания район.', 'The four steps of the cycle, one after another, over the hotspots of the chosen district.')}>
        <Reveal className="mt-14"><Weeks /></Reveal>
      </Section>

      <Section tone="paper-2" title={t('Какво мерим', 'What we measure')} lede={t('Две числа, които инспекторатът може да сравни с работата си днес.', 'Two numbers the inspectorate can compare with how it works today.')}>
        <Reveal as="ul" className="mt-12 grid gap-px overflow-hidden rounded-[14px] border border-rule bg-rule md:grid-cols-2">
          <li className="bg-paper-2 p-6 md:p-8"><LuTarget size={24} className="text-signal" aria-hidden="true" /><p className="t-h3 mt-5">{t('Потвърдени места на час работа на инспектор', 'Confirmed sites per hour of an inspector’s work')}</p></li>
          <li className="bg-paper-2 p-6 md:p-8"><LuClock size={24} className="text-signal" aria-hidden="true" /><p className="t-h3 mt-5">{t('Дни от появата на сметището до проверката', 'Days from a dump appearing to its inspection')}</p></li>
        </Reveal>
      </Section>

      <Section title={t('Какво ни трябва от общината', 'What we need from the municipality')}>
        <Reveal as="ol" className="mt-12 grid gap-x-10 md:grid-cols-3">
          {asks.map((a) => {
            const I = a.icon;
            return (
              <li key={a.h} className="border-t border-ink py-6">
                <I size={22} className="text-ice" aria-hidden="true" />
                <p className="t-h4 mt-4">{a.h}</p>
                <p className="mt-2 text-ink-soft">{a.p}</p>
              </li>
            );
          })}
        </Reveal>
      </Section>

      <Section tone="paper-2" title={t('Защо си струва', 'Why it is worth it')}
        lede={t('Столична община вече плаща за почистване. Всяко сметище, хванато по-рано, е по-малко и по-евтино за извозване.', 'Sofia already pays for clean-up. Every dump caught earlier is smaller and cheaper to haul away.')}>
        <Reveal className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <figure className="md:col-span-7">
            <figcaption className="mb-4 text-[0.9375rem] text-ink-soft">{t('Разходи за почистване, евро годишно', 'Clean-up spending, euro per year')}</figcaption>
            <ul className="space-y-3">
              {bars.map(([y, v]) => (
                <li key={y} className="grid grid-cols-[3.5rem_1fr] items-center gap-3">
                  <span className="t-coord">{y}</span>
                  <span className="flex items-center gap-3">
                    <span className="block h-10 rounded-md" style={{ width: `${(v / max) * 78}%`, background: y === 2024 ? 'var(--signal)' : 'var(--ice)' }} />
                    <span className="t-num text-[1.375rem]">{t(`${n(v)} €`, `€${n(v)}`)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </figure>
          <div className="rounded-[14px] bg-night p-6 text-night-fg md:col-span-4 md:col-start-9">
            <p className="opacity-80">{t('10% по-малко почистване означава', '10% less clean-up means')}</p>
            <p className="t-num mt-2 text-[2.75rem] text-night-signal">{t('18–39 хил. €', '€18–39k')}</p>
            <p className="opacity-80">{t('спестени годишно', 'saved per year')}</p>
          </div>
        </Reveal>
        <Source>{t('Източник: ', 'Source: ')}{t(SOURCES.scale.bg, SOURCES.scale.en)}. {t('Спестяването е сметка върху разходите за 2024 и 2025 г., не прогноза.', 'The saving is arithmetic on 2024 and 2025 spending, not a forecast.')}</Source>
      </Section>

      <Section title={t('Как продължава след пилота', 'What follows the pilot')}
        lede={t('Партньорство с общината и съвместно кандидатстване за европейско финансиране, вместо продажба на готов продукт.', 'A partnership with the city and joint applications for EU funding, rather than selling a finished product.')}>
        <Reveal as="ol" className="relative mt-14 grid gap-8 md:grid-cols-4">
          {road.map((r, i) => (
            <li key={r.d} className="relative border-t-2 border-rule pt-6" style={{ borderColor: i === 0 ? 'var(--signal)' : undefined }}>
              <span className="absolute -top-[7px] left-0 h-3 w-3 rounded-full" style={{ background: i === 0 ? 'var(--signal)' : 'var(--ice)' }} aria-hidden="true" />
              <p className="t-coord text-ink-soft">{r.d}</p>
              <p className="t-h4 mt-2">{r.h}</p>
              <p className="mt-2 text-ink-soft">{r.p}</p>
            </li>
          ))}
        </Reveal>
      </Section>
    </>
  );
}
