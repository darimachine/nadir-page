import { useEffect, useState, type FormEvent } from 'react';
import { LuMapPinned, LuListOrdered, LuHistory, LuSend, LuInfo } from 'react-icons/lu';
import { useNum, useT } from '../lib/i18n';
import { Link, useRouter } from '../lib/router';
import { Reveal } from '../lib/motion';
import { PageHeader } from '../components/PageHeader';
import { Section } from '../components/ui';
import { ComposedPanel, EmailLine, FailedNote, FieldError, SentPanel, EMAIL_RE, deliver } from '../components/forms';
import { FORM_ENDPOINT } from '../content';
import { Pricing } from '../sections/Pricing';
import { MIN_AREA_KM2, PLANS, validArea, type PlanId } from '../pricing';

/* Order form for an AI analysis of satellite / aerial imagery for a client-defined area.
 * Same delivery rule as the contact form: FORM_ENDPOINT, falling back to a composed e-mail.
 * The chosen plan, coverage, cadence, and base price are included in each enquiry. */

type V = {
  plan: PlanId; client: string; area: string; size: string; drone: boolean;
  deadline: string; name: string; org: string; email: string; phone: string; notes: string; consent: boolean;
};
type E = Partial<Record<keyof V, string>>;

export function Order() {
  const t = useT();
  const num = useNum();
  const { route } = useRouter();
  const [v, setV] = useState<V>({ plan: route.plan ?? 'discovery', client: 'municipality', area: '', size: String(MIN_AREA_KM2), drone: false, deadline: '', name: '', org: '', email: '', phone: '', notes: '', consent: false });
  useEffect(() => {
    if (route.plan) setV((current) => ({ ...current, plan: route.plan! }));
  }, [route.plan]);
  const plan = PLANS[v.plan];
  const price = `${num(plan.priceEur)} €`;
  const baseArea = Number(v.size.trim().replace(',', '.')) === MIN_AREA_KM2;
  const [e, setE] = useState<E>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'composed' | 'failed'>('idle');

  const clients = [
    { id: 'municipality', l: t('Община или район', 'Municipality or district') },
    { id: 'public', l: t('Държавна институция', 'Public institution') },
    { id: 'company', l: t('Фирма или собственик на терен', 'Company or landowner') },
    { id: 'other', l: t('Друго', 'Other') },
  ];
  const validate = (x: V): E => {
    const r: E = {};
    if (x.area.trim().length < 5) r.area = t('Опишете зоната: район, адрес, координати или линк към карта.', 'Describe the area: district, address, coordinates or a map link.');
    if (!validArea(x.size)) r.size = t(`Минималната площ е ${MIN_AREA_KM2} km² за двата плана. Въведете число, например 50 или 75,5.`, `Both plans require at least ${MIN_AREA_KM2} km². Enter a number, for example 50 or 75.5.`);
    if (!x.name.trim()) r.name = t('Въведете име.', 'Enter your name.');
    if (!x.email.trim()) r.email = t('Въведете имейл, на който да изпратим офертата.', 'Enter an e-mail for the quote.');
    else if (!EMAIL_RE.test(x.email.trim())) r.email = t('Имейлът трябва да е във вида име@домейн.bg.', 'Use the format name@domain.com.');
    if (!x.consent) r.consent = t('Нужно е съгласие, за да обработим поръчката.', 'Consent is needed to process the order.');
    return r;
  };
  const set = <K extends keyof V>(k: K, val: V[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (e[k]) setE((o) => ({ ...o, [k]: validate(next)[k] }));
  };

  const subject = `${t('Заявка', 'Enquiry')}: ${t(plan.name.bg, plan.name.en)}`;
  const body = () => [
    `${t('План', 'Plan')}: ${t(plan.name.bg, plan.name.en)}`,
    `${t('Цена за 50 km²', 'Price for 50 km²')}: ${price} ${t(plan.billing.bg, plan.billing.en)} ${t('без ДДС', 'excluding VAT')}`,
    `${t('Минимална площ', 'Minimum area')}: ${MIN_AREA_KM2} km²`,
    `${t('Заснемане и анализ', 'Imagery and analysis')}: ${t(plan.cadence.bg, plan.cadence.en)}`,
    `${t('Цена за заявената площ', 'Price for requested area')}: ${baseArea ? `${price} ${t('без ДДС', 'excluding VAT')}` : t('по отделна оферта', 'quoted separately')}`,
    `${t('Клиент', 'Client')}: ${clients.find((c) => c.id === v.client)?.l}`,
    `${t('Зона', 'Area')}: ${v.area.trim()}`,
    `${t('Площ', 'Size')}: ${v.size ? v.size + ' km²' : '—'}`,
    `${t('Допълнително дроново заснемане', 'Additional drone survey')}: ${v.drone ? t('да, по отделна оферта', 'yes, quoted separately') : t('не', 'no')}`,
    `${t('Желан срок', 'Wanted by')}: ${v.deadline || '—'}`,
    '',
    `${t('Име', 'Name')}: ${v.name}`,
    `${t('Организация', 'Organisation')}: ${v.org || '—'}`,
    `${t('Имейл', 'E-mail')}: ${v.email}`,
    `${t('Телефон', 'Phone')}: ${v.phone || '—'}`,
    '',
    v.notes.trim() || '',
  ].join('\n').trim();

  const submit = async (ev: FormEvent) => {
    ev.preventDefault();
    const r = validate(v);
    setE(r);
    const first = Object.keys(r)[0];
    if (first) { document.getElementById(`o-${first}`)?.focus(); return; }
    if (!FORM_ENDPOINT) { showComposed(); return; }
    setStatus('sending');
    setStatus((await deliver(subject, body(), v.email.trim())) ? 'sent' : 'failed');
  };
  const showComposed = () => { setStatus('composed'); scrollTo({ top: (document.getElementById('order-form')?.offsetTop ?? 0) - 80 }); };

  const gets = [
    { icon: LuMapPinned, h: t('Карта на откритите места', 'A map of detected sites'), p: t('Всяко място с контур, снимка и ниво на увереност.', 'Each site with an outline, an image and a confidence level.') },
    { icon: LuListOrdered, h: t('Списък по спешност', 'A list ranked by urgency'), p: t('Кое да се провери първо, с оценка на площта, а с дрон и на обема.', 'What to check first, with an area estimate, and volume when a drone is used.') },
    { icon: LuHistory, h: t('Промяна във времето', 'Change over time'), p: t('Кои места са нови и кои растат спрямо предишни години.', 'Which sites are new and which are growing compared with earlier years.') },
  ];
  const steps = [
    t('Описвате зоната и какво ви трябва.', 'You describe the area and what you need.'),
    t('Връщаме оферта и срок според площта и източниците.', 'We reply with a quote and a timeline based on the area and sources.'),
    t('Анализираме снимките с AI и проверяваме резултата.', 'We analyse the imagery with AI and review the result.'),
    t('Получавате карта и доклад.', 'You receive a map and a report.'),
  ];

  const lbl = 'mb-2 block font-medium';
  return (
    <>
      <PageHeader kicker={t('Поръчка', 'Order')}
        title={t('Изберете план за вашата територия', 'Choose a plan for your area')}
        lede={t('Еднократно сканиране за нови места или 12 месеца мониторинг на откритите сметища. И двата плана са за минимум 50 km².', 'A one-off scan for new sites or 12 months of monitoring identified dumpsites. Both plans require a minimum of 50 km².')}>
        <a href="#order-form" onClick={(ev) => { ev.preventDefault(); document.getElementById('order-form')?.scrollIntoView({ block: 'start', behavior: 'instant' }); }} className="btn btn-signal mt-8">{t('Към поръчката', 'Go to the order form')}</a>
      </PageHeader>

      <Pricing selected={v.plan} onChoose={(id) => { set('plan', id); document.getElementById('order-form')?.scrollIntoView({ block: 'start', behavior: 'instant' }); }} />

      <Section title={t('Какво получавате', 'What you get')}>
        <Reveal as="ul" className="mt-12 grid gap-x-10 md:grid-cols-3">
          {gets.map((g) => {
            const I = g.icon;
            return (
              <li key={g.h} className="border-t border-ink py-6">
                <I size={22} className="text-ice" aria-hidden="true" />
                <p className="t-h4 mt-4">{g.h}</p>
                <p className="mt-2 text-ink-soft">{g.p}</p>
              </li>
            );
          })}
        </Reveal>
        <Reveal className="mt-10 flex max-w-[62ch] gap-3 rounded-[10px] border border-rule bg-raised p-4 text-ink-soft">
          <LuInfo size={20} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" />
          <p>{t('Откритото от снимките е кандидат за проверка на място, не доказано нарушение. Протокол съставя само служебно лице.', 'What the imagery finds is a candidate for an on-site check, not a proven violation. Only an official can write a protocol.')}</p>
        </Reveal>
        <Reveal as="ol" className="mt-16 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 border-t border-rule pt-5">
              <span className="t-num text-[1.5rem] text-signal">{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </Reveal>
      </Section>

      <section id="order-form" className="gutter scroll-mt-20 bg-paper-2">
        <div className="wrap grid gap-12 py-20 md:py-24 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="t-h2">{t('Поръчка', 'Order')}</h2>
            <div className="mt-5 rounded-[12px] border border-rule bg-raised p-5" aria-live="polite" data-order-summary>
              <p className="font-medium">{t(plan.name.bg, plan.name.en)}</p>
              <p className="t-num mt-3 text-[2rem]">{price}</p>
              <p className="t-small mt-2 text-ink-soft">{t(plan.billing.bg, plan.billing.en)} · {t('за 50 km², без ДДС', 'for 50 km², excluding VAT')}</p>
              <p className="mt-4 text-ink-soft">{t(plan.cadence.bg, plan.cadence.en)}</p>
              {!baseArea && <p className="t-small mt-4 text-ink-soft">{t('За друга площ крайната цена се уточнява с отделна оферта.', 'Other areas require a separate quote to confirm the final price.')}</p>}
            </div>
            <p className="mt-5 text-ink-soft">{t('След заявката уточняваме територията и потвърждаваме офертата. Не се извършва плащане.', 'After your enquiry we agree the coverage and confirm the quote. No payment is taken.')}</p>
            <p className="mt-8 text-ink-soft">{t('Въпроси преди поръчка', 'Questions before ordering')}</p>
            <EmailLine className="mt-1" />
          </aside>

          <div className="lg:col-span-8">
            {status === 'composed' ? (
              <ComposedPanel title={t('Поръчката е готова', 'Your order is ready')} subject={subject} body={body()} onEdit={() => setStatus('idle')} />
            ) : status === 'sent' ? (
              <SentPanel title={t('Поръчката е изпратена', 'Order sent')}>{t('Ще изпратим оферта на ', 'We will send a quote to ')}{v.email}.</SentPanel>
            ) : (
              <form noValidate onSubmit={submit} className="grid gap-8">
                <fieldset>
                  <legend className={lbl}>{t('Избран план', 'Selected plan')}</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(Object.keys(PLANS) as PlanId[]).map((id) => (
                      <label key={id} className={`flex cursor-pointer items-start gap-3 rounded-[10px] border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${v.plan === id ? 'border-ink bg-raised' : 'border-rule'}`}>
                        <input type="radio" name="plan" value={id} checked={v.plan === id} onChange={() => set('plan', id)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" />
                        <span><span className="block font-medium">{t(PLANS[id].name.bg, PLANS[id].name.en)}</span><span className="t-small mt-1 block text-ink-soft">{num(PLANS[id].priceEur)} € · {t(PLANS[id].billing.bg, PLANS[id].billing.en)}</span></span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className={lbl}>{t('Кой поръчва', 'Who is ordering')}</legend>
                  <div className="flex flex-wrap gap-2">
                    {clients.map((c) => (
                      <label key={c.id} className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.9375rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${v.client === c.id ? 'border-ink bg-ink text-paper' : 'border-rule bg-raised hover:border-ink'}`}>
                        <input type="radio" name="client" value={c.id} checked={v.client === c.id} onChange={() => set('client', c.id)} className="sr-only" />{c.l}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="o-area" className={lbl}>{t('Зона', 'Area')}</label>
                  <textarea id="o-area" rows={3} className="field" value={v.area} onChange={(x) => set('area', x.target.value)}
                    placeholder={t('Например: район Кремиковци; или координати 42.73, 23.47; или линк към карта', 'For example: Kremikovtsi district; or coordinates 42.73, 23.47; or a map link')}
                    aria-invalid={!!e.area} aria-describedby={e.area ? 'oe-area' : undefined} />
                  <FieldError id="oe-area" msg={e.area} />
                </div>

                <div>
                  <label htmlFor="o-size" className={lbl}>{t('Площ за анализ, km²', 'Area to analyse, km²')}</label>
                  <input id="o-size" inputMode="decimal" required className="field" value={v.size} onChange={(x) => set('size', x.target.value)} aria-invalid={!!e.size} aria-describedby={`o-size-help${e.size ? ' oe-size' : ''}`} />
                  <p id="o-size-help" className="t-small mt-2 text-ink-soft">{t('Минимум 50 km². Посочената цена е за 50 km²; за по-голяма площ ще получите отделна оферта.', 'Minimum 50 km². The published price covers 50 km²; larger areas receive a separate quote.')}</p>
                  <FieldError id="oe-size" msg={e.size} />
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input id="o-drone" type="checkbox" checked={v.drone} onChange={(x) => set('drone', x.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" />
                    <span>{t('Интересуваме се и от дроново заснемане', 'We are also interested in a drone survey')}<span className="t-small mt-1 block text-ink-soft">{t('Допълнителна услуга по отделна оферта; не е включена в цената на плана.', 'An additional service quoted separately; not included in the plan price.')}</span></span>
                  </label>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="o-name" className={lbl}>{t('Име', 'Name')}</label>
                    <input id="o-name" autoComplete="name" className="field" value={v.name} onChange={(x) => set('name', x.target.value)} aria-invalid={!!e.name} aria-describedby={e.name ? 'oe-name' : undefined} />
                    <FieldError id="oe-name" msg={e.name} />
                  </div>
                  <div>
                    <label htmlFor="o-org" className={lbl}>{t('Организация', 'Organisation')} <span className="font-normal text-ink-soft">{t('(по желание)', '(optional)')}</span></label>
                    <input id="o-org" autoComplete="organization" className="field" value={v.org} onChange={(x) => set('org', x.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="o-email" className={lbl}>{t('Имейл', 'E-mail')}</label>
                    <input id="o-email" type="email" inputMode="email" autoComplete="email" className="field" value={v.email} onChange={(x) => set('email', x.target.value)} aria-invalid={!!e.email} aria-describedby={e.email ? 'oe-email' : undefined} />
                    <FieldError id="oe-email" msg={e.email} />
                  </div>
                  <div>
                    <label htmlFor="o-phone" className={lbl}>{t('Телефон', 'Phone')} <span className="font-normal text-ink-soft">{t('(по желание)', '(optional)')}</span></label>
                    <input id="o-phone" type="tel" autoComplete="tel" className="field" value={v.phone} onChange={(x) => set('phone', x.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="o-deadline" className={lbl}>{t('Желан срок', 'Wanted by')} <span className="font-normal text-ink-soft">{t('(по желание)', '(optional)')}</span></label>
                    <input id="o-deadline" type="date" min={new Date().toISOString().slice(0, 10)} className="field" value={v.deadline} onChange={(x) => set('deadline', x.target.value)} />
                  </div>
                </div>

                <div>
                  <label htmlFor="o-notes" className={lbl}>{t('Бележки', 'Notes')} <span className="font-normal text-ink-soft">{t('(по желание)', '(optional)')}</span></label>
                  <textarea id="o-notes" rows={4} className="field" value={v.notes} onChange={(x) => set('notes', x.target.value)} placeholder={t('Например: за какво ще ползвате резултата, има ли известни места.', 'For example: what you will use the result for, any known sites.')} />
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input id="o-consent" type="checkbox" checked={v.consent} onChange={(x) => set('consent', x.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" aria-invalid={!!e.consent} aria-describedby={e.consent ? 'oe-consent' : undefined} />
                    <span className="text-ink-soft">{t('Съгласен/на съм данните ми да се използват само за оферта и изпълнение на тази поръчка.', 'I agree that my details are used only for a quote and to fulfil this order.')}</span>
                  </label>
                  <FieldError id="oe-consent" msg={e.consent} />
                  <p className="t-small mt-2 pl-8 text-ink-soft">{t('Как обработваме личните данни: ', 'How we handle personal data: ')}<Link to="privacy" className="link">{t('политика за поверителност', 'privacy policy')}</Link></p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn btn-ink" disabled={status === 'sending'}><LuSend size={18} aria-hidden="true" />{status === 'sending' ? t('Изпращане…', 'Sending…') : t('Изпрати заявка за план', 'Send plan enquiry')}</button>
                  {status === 'failed' && <FailedNote msg={t('Поръчката не беше изпратена. Опитайте отново или', 'The order was not sent. Try again, or')} onCompose={showComposed} />}
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
