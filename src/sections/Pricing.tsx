import { LuArrowRight, LuCheck, LuSatellite, LuHistory } from 'react-icons/lu';
import { useNum, useT } from '../lib/i18n';
import { Link } from '../lib/router';
import { MIN_AREA_KM2, PLANS, type PlanId } from '../pricing';

export function Pricing({ selected, onChoose }: { selected?: PlanId; onChoose?: (plan: PlanId) => void }) {
  const t = useT();
  const num = useNum();
  return (
    <section id="plans" className="gutter scroll-mt-20 bg-paper-2" aria-labelledby="plans-title">
      <div className="wrap py-20 md:py-24">
        <p className="mb-4 text-[0.9375rem] font-medium text-signal">{t('Планове и цени', 'Plans and pricing')}</p>
        <h2 id="plans-title" className="t-h2">{t('Открийте местата. Следете промяната.', 'Find the sites. Track the changes.')}</h2>
        <p className="t-lede measure mt-5 text-ink-soft">{t('Еднократно сканиране за нови места или мониторинг на откритите сметища през цялата година.', 'A one-off scan for new sites or year-round monitoring of the dumpsites we identify.')}</p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const plan = PLANS[id];
            const annual = id === 'monitoring';
            const Icon = annual ? LuHistory : LuSatellite;
            const chosen = selected === id;
            const action = t(`Изберете ${plan.name.bg.toLowerCase()}`, `Choose ${plan.name.en.toLowerCase()}`);
            return (
              <article key={id} data-plan={id} className={`flex min-w-0 flex-col rounded-[18px] border p-6 md:p-8 ${annual ? 'border-night-line bg-night text-night-fg' : 'border-rule bg-raised text-ink'}`}>
                <div className="flex items-center justify-between gap-3">
                  <Icon size={26} className={annual ? 'text-night-signal' : 'text-signal'} aria-hidden="true" />
                  {chosen && <span className={`t-small flex items-center gap-1.5 ${annual ? 'text-night-ice' : 'text-ink-soft'}`}><LuCheck size={16} aria-hidden="true" />{t('Избран план', 'Selected plan')}</span>}
                </div>
                <h3 className="t-h3 mt-5">{t(plan.name.bg, plan.name.en)}</h3>
                <p className={`mt-3 max-w-[48ch] ${annual ? 'text-night-muted' : 'text-ink-soft'}`}>{t(plan.summary.bg, plan.summary.en)}</p>
                <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <p data-price={plan.priceEur} className="t-num text-[3rem] md:text-[3.5rem]">{num(plan.priceEur)} €</p>
                  <span className={annual ? 'text-night-muted' : 'text-ink-soft'}>{t(plan.billing.bg, plan.billing.en)}</span>
                </div>
                <p className={`t-small mt-2 ${annual ? 'text-night-muted' : 'text-ink-soft'}`}>{t(`За ${MIN_AREA_KM2} km² · без ДДС`, `For ${MIN_AREA_KM2} km² · excluding VAT`)}</p>
                <p className={`mt-6 border-y py-4 font-medium ${annual ? 'border-night-line' : 'border-rule'}`}>{t(plan.cadence.bg, plan.cadence.en)}</p>
                <ul className="my-6 grid gap-3">
                  {plan.features.map((feature) => <li key={feature.en} className="flex items-start gap-2.5"><LuCheck size={18} className={`mt-0.5 shrink-0 ${annual ? 'text-night-ice' : 'text-ice'}`} aria-hidden="true" /><span>{t(feature.bg, feature.en)}</span></li>)}
                </ul>
                <p className={`t-small mb-6 ${annual ? 'text-night-muted' : 'text-ink-soft'}`}>{t(`Минимална анализирана площ: ${MIN_AREA_KM2} km².`, `Minimum analysed area: ${MIN_AREA_KM2} km².`)}</p>
                {onChoose ? (
                  <button type="button" aria-label={action} className={`btn mt-auto justify-center !whitespace-normal !py-3 text-center ${annual ? 'btn-signal' : 'btn-ink'}`} onClick={() => onChoose(id)}>{action}<LuArrowRight size={18} className="shrink-0" aria-hidden="true" /></button>
                ) : (
                  <Link to={`order?plan=${id}`} className={`btn mt-auto justify-center !whitespace-normal !py-3 text-center ${annual ? 'btn-signal' : 'btn-ink'}`}>{action}<LuArrowRight size={18} className="shrink-0" aria-hidden="true" /></Link>
                )}
              </article>
            );
          })}
        </div>
        <p className="t-small mt-6 max-w-[85ch] text-ink-soft">{t('Цените са за 50 km² и са без ДДС. За по-голяма площ и допълнително дроново заснемане подготвяме отделна оферта. Заявката не е плащане и не ви обвързва.', 'Prices cover 50 km² and exclude VAT. Larger areas and additional drone surveys are quoted separately. Submitting an enquiry does not take a payment or commit you.')}</p>
      </div>
    </section>
  );
}
