import { LuArrowRight, LuShieldCheck, LuTrash2, LuRecycle, LuMapPinned } from 'react-icons/lu';
import { useT, useNum } from '../lib/i18n';
import { Link } from '../lib/router';
import { Reveal } from '../lib/motion';
import { Section, Source } from '../components/ui';
import { FACTS, SOURCES } from '../content';

/* ---------- Validation ---------- */
export function Validation() {
  const t = useT();
  const heard = [
    { h: t('Липсва приоритизацията', 'Prioritisation is what’s missing'), p: t('Инспекторатът ходи на всеки сигнал. Стойността е в това да се знае кой е най-спешен.', 'Inspectors go out to every report. The value is in knowing which one is most urgent.') },
    { h: t('Горещите точки съвпадат', 'The hotspots match'), p: t('Красна поляна и Кремиковци, посочени от служителите, са същите райони, които излизат от нашия анализ на сигналите в Call Sofia.', 'Krasna Polyana and Kremikovtsi, named by the staff, are the same districts that came out of our analysis of Call Sofia reports.') },
    { h: t('Дронът при нов сигнал', 'A drone on a new report'), p: t('Дрон, който излита при нов сигнал, дава на инспектора снимка още докато е на път.', 'A drone that takes off on a new report gives the inspector a photo while still on the way.') },
  ];
  const changed = [
    { h: t('Не заменяме инспектора', 'We don’t replace the inspector'), p: t('Само служебно лице съставя протокол. Ние подреждаме, инспекторът решава.', 'Only an official can write a protocol. We rank; the inspector decides.') },
    { h: t('Не продаваме готов продукт', 'We don’t sell a finished product'), p: t('Работим в партньорство с общината и кандидатстваме заедно за финансиране.', 'We work in partnership with the city and apply for funding together.') },
    { h: t('Не строим нова платформа', 'We don’t build another platform'), p: t('Свързваме се със системите, които вече обменят данни.', 'We connect to the systems that already exchange data.') },
  ];
  return (
    <Section id="validation"
      title={t('Какво чухме от хората, които чистят', 'What we heard from the people who clean up')}
      lede={t('На менторска среща служители от инспектората, управлението на отпадъците и климатичния отдел на Столична община прегледаха подхода. Променихме го според това, което чухме.', 'At a mentoring session, staff from Sofia Municipality’s inspectorate, waste management and climate departments reviewed the approach. We changed it based on what we heard.')}>
      <Reveal className="mt-14 grid gap-14 lg:grid-cols-2">
        <div>
          <h3 className="border-b border-ink pb-3 text-[0.9375rem] font-medium">{t('Какво потвърдиха', 'What they confirmed')}</h3>
          <ul>
            {heard.map((x) => (
              <li key={x.h} className="border-b border-rule py-6">
                <p className="t-h4">{x.h}</p>
                <p className="mt-2 text-ink-soft">{x.p}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="border-b border-ink pb-3 text-[0.9375rem] font-medium">{t('Какво променихме', 'What we changed')}</h3>
          <ul>
            {changed.map((x) => (
              <li key={x.h} className="border-b border-rule py-6">
                <p className="t-h4">{x.h}</p>
                <p className="mt-2 text-ink-soft">{x.p}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Source>{t(SOURCES.mentors.bg, SOURCES.mentors.en)}</Source>
    </Section>
  );
}

/* ---------- Who it is for ---------- */
export function Audiences() {
  const t = useT();
  const n = useNum();
  const groups = [
    { icon: LuShieldCheck, who: t('Инспекторат', 'Inspectorate'), q: t('Къде да отида първо?', 'Where do I go first?'), a: t('Сигнали, подредени по спешност, със снимка и оценка на обема преди тръгване.', 'Reports ranked by urgency, with a photo and a volume estimate before leaving.') },
    { icon: LuTrash2, who: t('Управление на отпадъците', 'Waste management'), q: t('Колко камиона и колко тона?', 'How many trucks and how many tonnes?'), a: t('Оценка на обема преди извозване и отчет в тонове от кантара след това.', 'A volume estimate before haulage and a weighbridge report in tonnes afterwards.') },
    { icon: LuRecycle, who: t('Климат и кръгова икономика', 'Climate and circular economy'), q: t('Кой отпадък си струва да се прибере?', 'Which waste is worth recovering?'), a: t(`Следващото ниво: строителните отпадъци, около ${n(FACTS.constructionWasteT)} т прогноза за София през 2026 г., най-големият поток.`, `The next level: construction waste, a forecast of about ${n(FACTS.constructionWasteT)} t for Sofia in 2026, the largest stream.`) },
  ];
  return (
    <Section tone="paper-2"
      title={t('За кого в общината', 'Who it is for in a municipality')}
      lede={t('Една и съща карта отговаря на различни въпроси в различните звена.', 'The same map answers different questions in different departments.')}>
      <Reveal as="ul" className="mt-14 grid gap-px overflow-hidden rounded-[14px] border border-rule bg-rule md:grid-cols-3">
        {groups.map((g) => {
          const I = g.icon;
          return (
            <li key={g.who} className="flex flex-col bg-paper-2 p-6 md:p-8">
              <I size={24} className="text-ice" aria-hidden="true" />
              <p className="mt-6 text-[0.9375rem] text-ink-soft">{g.who}</p>
              <p className="t-h3 mt-1">{g.q}</p>
              <p className="mt-4 text-ink-soft">{g.a}</p>
            </li>
          );
        })}
      </Reveal>
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
        <span className="inline-flex items-center gap-2"><LuMapPinned size={18} className="text-signal" aria-hidden="true" />{t(`Започваме от София. В България има ${FACTS.municipalitiesBG} общини, после Балканите.`, `We start in Sofia. Bulgaria has ${FACTS.municipalitiesBG} municipalities, then the Balkans.`)}</span>
      </Reveal>
      <Source>{t('Източник за строителните отпадъци: ', 'Source for construction waste: ')}{t(SOURCES.construction.bg, SOURCES.construction.en)}</Source>
    </Section>
  );
}

/* ---------- Data stack teaser ---------- */
export function StackTeaser() {
  const t = useT();
  const layers = [
    { n: 'Sentinel-2', spec: t('10 м · на ~5 дни · безплатно', '10 m · every ~5 days · free'), w: 100 },
    { n: 'Wyvern Open Data', spec: t('5,3 м · 23 канала', '5.3 m · 23 bands'), w: 82 },
    { n: 'Sfera Technologies', spec: t('0,5 м · по договор', '0.5 m · by agreement'), w: 62 },
    { n: t('Ортофото ГИС-София', 'GIS-Sofia orthophoto'), spec: t('сантиметри', 'centimetres'), w: 44 },
    { n: t('Дрон по маршрут', 'Drone on a route'), spec: t('сантиметри · на полет', 'centimetres · per flight'), w: 28 },
  ];
  return (
    <section className="gutter bg-paper">
      <div className="wrap grid gap-10 border-t border-rule py-20 md:grid-cols-12 md:py-24">
        <Reveal className="md:col-span-5">
          <h2 className="t-h2">{t('Евтино навсякъде, скъпо само където трябва', 'Cheap everywhere, expensive only where it’s needed')}</h2>
          <p className="t-lede mt-6 text-ink-soft">{t('Безплатните сателитни данни покриват целия град. По-детайлните снимки и дронът се ползват само над рисковите зони и горещите точки.', 'Free satellite data covers the whole city. Finer imagery and the drone are used only over risk zones and hotspots.')}</p>
          <Link to="technology" className="btn btn-ghost mt-8">{t('Технологията в детайли', 'The technology in detail')} <LuArrowRight size={18} aria-hidden="true" /></Link>
        </Reveal>
        <Reveal as="ol" className="md:col-span-6 md:col-start-7" aria-label={t('Слоеве данни от най-широк към най-детайлен', 'Data layers from widest to most detailed')}>
          {layers.map((l, i) => (
            <li key={i} className="border-b border-rule py-3.5 first:border-t">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <span className="font-medium">{l.n}</span>
                <span className="t-coord text-ink-soft">{l.spec}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-paper-2" aria-hidden="true">
                <div className="h-full rounded-full" style={{ width: `${l.w}%`, background: i < 2 ? 'var(--ice)' : 'var(--signal)' }} />
              </div>
            </li>
          ))}
          <li className="t-small flex justify-between pt-3 text-ink-soft"><span>{t('по-широко, по-евтино', 'wider, cheaper')}</span><span>{t('по-детайлно, по-скъпо', 'finer, costlier')}</span></li>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Team ---------- */
function Monogram({ txt }: { txt: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
      <circle cx="32" cy="32" r="27" fill="none" stroke="var(--rule)" strokeWidth="1.5" />
      <path d="M32 0v9M32 55v9M0 32h9M55 32h9" stroke="var(--ice)" strokeWidth="1.5" />
      <text x="32" y="39" textAnchor="middle" fill="var(--ink)" style={{ font: '500 19px var(--f-display)' }}>{txt}</text>
    </svg>
  );
}

export function Team() {
  const t = useT();
  const people = [
    // Titles only, without organisations
    { m: t('ЕК', 'EK'), name: t('Елизабет Колева', 'Elizabeth Koleva'), role: t('HPC и AI инженер', 'HPC and AI engineer') },
    { m: t('РЧ', 'RC'), name: t('Радост Чанева', 'Radost Chaneva'), role: t('Право', 'Law') },
    { m: t('ТХ', 'TH'), name: t('Теодор Христов', 'Teodor Hristov'), role: t('Firmware разработчик', 'Firmware developer') },
    { m: t('СР', 'SR'), name: t('Слава Ралчева', 'Slava Ralcheva'), role: t('ГИС, управление и планиране', 'GIS, management and planning') },
    { m: t('ВН', 'VN'), name: t('Валентин Николов', 'Valentin Nikolov'), role: t('AI инженер', 'AI engineer') },
    { m: t('СЧ', 'SC'), name: t('Серхан Чавдарлиев', 'Serhan Chavdarliev'), role: t('Full-stack софтуерен инженер', 'Full-stack software engineer') },
  ].sort((a, b) => a.name.localeCompare(b.name, t('bg', 'en'))); // alphabetical in the current language
  return (
    <Section id="team"
      title={t('AI, ГИС, право и софтуер в един екип', 'AI, GIS, law and software in one team')}
      lede={t('Шестима души, които покриват целия път: от сателитната снимка до договора с институцията.', 'Six people covering the whole path: from the satellite image to the agreement with the institution.')}>
      <Reveal as="ul" className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p, i) => (
          <li key={i} className="flex items-center gap-5 border-t border-rule py-6">
            <Monogram txt={p.m} />
            <div className="min-w-0">
              <p className="t-h4">{p.name}</p>
              <p className="mt-1 text-ink-soft">{p.role}</p>
            </div>
          </li>
        ))}
      </Reveal>
      <Reveal className="mt-12 grid gap-6 border-t border-ink pt-8 md:grid-cols-12">
        <p className="font-medium md:col-span-3">{t('Партньори', 'Partners')}</p>
        <dl className="grid gap-6 sm:grid-cols-3 md:col-span-9">
          <div><dt className="font-medium">Esri</dt><dd className="mt-1 text-ink-soft">{t('ГИС платформата ArcGIS', 'The ArcGIS GIS platform')}</dd></div>
          <div><dt className="font-medium">Sfera Technologies</dt><dd className="mt-1 text-ink-soft">{t('Сателитна снимка на София с резолюция 0,5 м', 'A 0.5 m satellite image of Sofia')}</dd></div>
          <div><dt className="font-medium">{t('Изчислителна мощ', 'Compute')}</dt><dd className="mt-1 text-ink-soft">{t('Достъп до ресурс за обучение на модела', 'Access to resources for model training')}</dd></div>
        </dl>
      </Reveal>
    </Section>
  );
}

/* ---------- Closing call to action ---------- */
export function CtaBand() {
  const t = useT();
  return (
    <section className="gutter bg-night-signal text-[#1A0E05]">
      <div className="wrap grid gap-8 py-20 md:grid-cols-12 md:items-end md:py-24">
        <div className="md:col-span-8">
          <h2 className="t-h2">{t('Предложете ни един район. Осем седмици над горещите му точки.', 'Give us one district. Eight weeks over its hotspots.')}</h2>
          <p className="t-lede mt-5 max-w-[56ch] opacity-85">{t('Пилотът мери две неща: колко потвърдени места намира инспекторът за час работа и за колко дни от появата си сметището стига до проверка.', 'The pilot measures two things: how many confirmed sites an inspector finds per hour of work, and how many days it takes from a dump appearing to its inspection.')}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:col-span-4 md:justify-end">
          <Link to="contact" className="btn bg-[#1A0E05] text-[#ECE8DF] hover:bg-night">{t('Заявете пилот', 'Request a pilot')} <LuArrowRight size={18} aria-hidden="true" /></Link>
          <Link to="pilot" className="btn border border-[#1A0E05]/40 hover:border-[#1A0E05]">{t('Как протича', 'How it runs')}</Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Order an AI analysis ---------- */
export function OrderBand() {
  const t = useT();
  const items = [
    t('Карта на откритите места, с контур и снимка', 'A map of detected sites, each with an outline and an image'),
    t('Списък по спешност с оценка на площта и обема', 'A list ranked by urgency with area and volume estimates'),
    t('Кои места са нови и кои растат спрямо минали години', 'Which sites are new and which are growing since earlier years'),
  ];
  return (
    <section className="gutter bg-night text-night-fg">
      <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-24">
        <Reveal className="md:col-span-6">
          <h2 className="t-h2">{t('Поръчайте AI анализ на снимки за вашия район', 'Order an AI analysis of imagery for your area')}</h2>
          <p className="t-lede mt-6 text-night-muted">{t('Изберете еднократно сканиране или годишен мониторинг за минимум 50 km². Получавате карта и доклад за вашата територия.', 'Choose a one-off scan or annual monitoring for at least 50 km². Receive a map and report for your area.')}</p>
          <Link to="plans" className="btn btn-signal mt-8">{t('Вижте плановете', 'View the plans')} <LuArrowRight size={18} aria-hidden="true" /></Link>
        </Reveal>
        <Reveal as="ul" className="md:col-span-5 md:col-start-8 md:self-end">
          {items.map((it) => (
            <li key={it} className="flex gap-3 border-t border-night-line py-4 text-night-fg">
              <span className="mt-[0.55rem] h-2 w-2 shrink-0 rounded-full bg-night-signal" aria-hidden="true" />{it}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
