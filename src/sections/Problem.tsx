import { useT, useNum } from '../lib/i18n';
import { CountUp, Reveal, useInView, useReducedMotion } from '../lib/motion';
import { Section, Source } from '../components/ui';
import { FACTS, SOURCES } from '../content';

function KostenetsChart() {
  const t = useT();
  const [ref, seen] = useInView<SVGSVGElement>();
  const rm = useReducedMotion();
  const X = (y: number) => 40 + (y - 2014) * 42;
  const curve = `M${X(2014)} 200 C ${X(2017)} 198, ${X(2020)} 190, ${X(2022)} 170 S ${X(2023.6)} 90, ${X(2024.4)} 60 S ${X(2026)} 42, ${X(2026.6)} 38`;
  const draw = seen && !rm;
  return (
    <svg ref={ref} viewBox="0 0 600 250" className="h-auto w-full" role="img"
      aria-label={t('Илюстративен растеж на сметището на ул. „Костенец“ от 2014 до 2026 г.', 'Illustrative growth of the Kostenets Street dumpsite, 2014 to 2026')}>
      <line x1="40" y1="210" x2="580" y2="210" stroke="var(--rule)" />
      {[2014, 2016, 2018, 2020, 2022, 2024, 2026].map((y) => (
        <g key={y}>
          <line x1={X(y)} x2={X(y)} y1="210" y2="216" stroke="var(--rule)" />
          <text x={X(y)} y="236" textAnchor="middle" fill="var(--ink-soft)" style={{ font: '400 13px var(--f-mono)' }}>{y}</text>
        </g>
      ))}
      <rect x={X(2023)} y="44" width={X(2024.6) - X(2023)} height="166" fill="var(--signal-soft)" />
       <text x={X(2023) + 6} y="202" fill="var(--signal)" style={{ font: '500 13px var(--f-body)' }}>{t('рязък растеж', 'sharp growth')}</text>
      <path d={curve} fill="none" stroke="var(--ink)" strokeWidth="3" pathLength={1}
        style={draw ? { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw 2s cubic-bezier(.16,.84,.24,1) .2s forwards' } : undefined} />
      <circle cx={X(2014)} cy="200" r="5" fill="var(--ice)" />
      <text x={X(2014) + 10} y="190" fill="var(--ink)" style={{ font: '500 14px var(--f-body)' }}>{t('първи сигнали', 'first reports')}</text>
      <circle cx={X(2026.6)} cy="38" r="6" fill="var(--signal)" />
       <text x={X(2026.6) - 12} y="26" textAnchor="end" fill="var(--ink)" style={{ font: '500 14px var(--f-body)' }}>{t('септ. 2026: почистване', 'Sept 2026: clean-up')}</text>
    </svg>
  );
}

function DotField() {
  const t = useT();
  const dots = Array.from({ length: FACTS.dumpsitesMapped }, (_, i) => i);
  return (
    <figure>
      <div className="grid grid-cols-[repeat(26,minmax(0,1fr))] gap-[3px] sm:gap-1" role="img"
        aria-label={t('303 точки за картираните сметища, 30 от тях оцветени като почистени', '303 dots for mapped dumpsites, 30 of them coloured as cleaned up')}>
        {dots.map((i) => (
          <span key={i} className={`aspect-square rounded-full ${i < FACTS.cleanedTwoYears ? 'bg-signal' : 'bg-rule'}`} />
        ))}
      </div>
      <figcaption className="t-small mt-4 flex flex-wrap gap-x-5 gap-y-1 text-ink-soft">
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rule" />{t('картирани за 13 месеца', 'mapped in 13 months')}</span>
        <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-signal" />{t('почистени за 2 години', 'cleaned up in 2 years')}</span>
      </figcaption>
    </figure>
  );
}

export function Problem() {
  const t = useT();
  const n = useNum();
  return (
    <Section id="problem"
      title={t('Никой не вижда кога започва едно сметище. Виждат го, когато стане голямо.', 'Nobody sees a dumpsite start. People see it once it is big.')}
      lede={t(
        'Първите сигнали за сметището на ул. „Костенец“ в София са от 2014 г. Почистването започва през септември 2026 г. и още първия ден извозват над 20 тона.',
        'The first reports about the dumpsite on Kostenets Street in Sofia date from 2014. The clean-up began in September 2026, and more than 20 tonnes were hauled away on the first day.'
      )}>
      <Reveal className="mt-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <KostenetsChart />
          <p className="t-small mt-3 text-ink-soft">{t('Формата на кривата е илюстративна: обемът не е измерван преди почистването. Източник: ', 'The curve’s shape is illustrative: volume was not measured before the clean-up. Source: ')}{t(SOURCES.kostenets.bg, SOURCES.kostenets.en)}</p>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:self-center">
          <p className="t-num text-[5rem] text-signal sm:text-[6rem]"><CountUp to={FACTS.kostenetsYears} /></p>
          <p className="mt-2 text-ink-soft">{t('години от първия сигнал до почистването', 'years from the first report to the clean-up')}</p>
        </div>
      </Reveal>

      <Reveal className="mt-24 grid gap-12 border-t border-rule pt-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <h3 className="t-h3">{t('И това не е изключение.', 'And it is not an exception.')}</h3>
          <dl className="mt-8 grid gap-7">
            <div>
              <dt className="sr-only">{t('Картирани сметища', 'Mapped dumpsites')}</dt>
              <dd className="t-num text-[3.25rem]"><CountUp to={FACTS.dumpsitesMapped} /></dd>
              <dd className="mt-1 text-ink-soft">{t('незаконни сметища, картирани в София за 13 месеца (април 2025 – май 2026)', 'illegal dumpsites mapped in Sofia in 13 months (April 2025 – May 2026)')}</dd>
            </div>
            <div>
              <dt className="sr-only">{t('Почистени', 'Cleaned up')}</dt>
              <dd className="t-num text-[3.25rem] text-signal">~<CountUp to={FACTS.cleanedTwoYears} /></dd>
              <dd className="mt-1 text-ink-soft">{t('почистени за две години (19 през 2024 г., 11 през 2025 г.)', 'cleaned up in two years (19 in 2024, 11 in 2025)')}</dd>
            </div>
            <div>
              <dt className="sr-only">{t('Разход', 'Cost')}</dt>
              <dd className="t-num text-[3.25rem]"><CountUp to={FACTS.cleanup2024Eur} format={(v) => t(`${n(v)} €`, `€${n(v)}`)} /></dd>
              <dd className="mt-1 text-ink-soft">{t('за почистване само през 2024 г. (757 187 лв.)', 'spent on clean-up in 2024 alone (BGN 757,187)')}</dd>
            </div>
          </dl>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <DotField />
          <p className="mt-8 text-[1.1875rem] leading-relaxed">
            {t('Проблемът не е, че общината не чисти. Проблемът е, че разбираме късно и няма ред кое е първо.', 'The problem is not that the city doesn’t clean up. It finds out late, and there is no order for what comes first.')}
          </p>
        </div>
      </Reveal>
      <Source>{t('Различни периоди, показани в един мащаб. Източници: ', 'Different time windows, shown at one scale. Sources: ')}{t(SOURCES.scale.bg, SOURCES.scale.en)}</Source>
    </Section>
  );
}
