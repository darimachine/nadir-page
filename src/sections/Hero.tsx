import { LuArrowRight } from 'react-icons/lu';
import { useT } from '../lib/i18n';
import { Link } from '../lib/router';
import { NadirView } from './NadirView';
import { OVERVIEW } from '../imagery';

export function Hero() {
  const t = useT();
  return (
    <section className="gutter relative overflow-hidden bg-night text-night-fg" aria-labelledby="hero-title">
      {/* the surveyed ground itself, dimmed, fading into the night band */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-cover bg-center opacity-35"
        style={{ backgroundImage: `url(${OVERVIEW.src})`, maskImage: 'linear-gradient(to bottom, #000 10%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 10%, transparent 95%)' }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[38rem] bg-gradient-to-r from-night via-night/70 to-transparent" />
      <div className="wrap relative pb-16 pt-16 md:pb-24 md:pt-24">
        <h1 id="hero-title" className="t-hero max-w-[17ch]">
          {t('Хиляди декари. Нула обиколки.', 'Hundreds of hectares. Zero patrols.')}
        </h1>
        <div className="mt-8 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="t-lede text-night-muted md:col-span-7">
            {t(
              'Nadir комбинира сателитни, дронови и сигнални данни с AI, за да открива сметища, да разпознава отпадъка и да оценява спешността. Продаваме анализ и мониторинг на всеки, който отговаря за терен: публичен или частен.',
              'Nadir combines satellite, drone and citizen-report data with AI to detect dumpsites, recognise the waste and assess urgency. We sell analysis and monitoring to anyone responsible for land, public or private.'
            )}
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Link to="order" className="btn btn-signal">{t('Поръчайте AI анализ', 'Order an AI analysis')} <LuArrowRight size={18} aria-hidden="true" /></Link>
            <Link to="pilot" className="btn btn-ghost-night">{t('Пилот за общини', 'Pilot for municipalities')}</Link>
          </div>
        </div>
        <div className="mt-12 md:mt-16">
          <NadirView />
        </div>
      </div>
    </section>
  );
}
