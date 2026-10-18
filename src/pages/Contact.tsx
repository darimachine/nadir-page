import { useState, type FormEvent } from 'react';
import { LuSend } from 'react-icons/lu';
import { useT } from '../lib/i18n';
import { Link } from '../lib/router';
import { PageHeader } from '../components/PageHeader';
import { ComposedPanel, EmailLine, FailedNote, FieldError, SentPanel, EMAIL_RE, deliver } from '../components/forms';
import { FORM_ENDPOINT } from '../content';

/* Delivery goes through FORM_ENDPOINT (see content.ts). Without it, or when delivery fails, the form
 * composes the message for the visitor to send by e-mail; it never pretends to have sent anything. */

type Values = { name: string; org: string; email: string; topic: string; message: string; consent: boolean };
type Errors = Partial<Record<keyof Values, string>>;

export function Contact() {
  const t = useT();
  const [v, setV] = useState<Values>({ name: '', org: '', email: '', topic: 'pilot', message: '', consent: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'composed' | 'failed'>('idle');

  const topics = [
    { id: 'pilot', label: t('Пилот в нашата община', 'A pilot in our municipality') },
    { id: 'analysis', label: t('AI анализ на снимки', 'AI image analysis') },
    { id: 'funding', label: t('Съвместно кандидатстване за финансиране', 'Applying for funding together') },
    { id: 'data', label: t('Данни, снимки или дронове', 'Data, imagery or drones') },
    { id: 'other', label: t('Друго', 'Something else') },
  ];

  const validate = (x: Values): Errors => {
    const e: Errors = {};
    if (!x.name.trim()) e.name = t('Въведете име.', 'Enter your name.');
    if (!x.email.trim()) e.email = t('Въведете имейл, на който да ви отговорим.', 'Enter an e-mail we can reply to.');
    else if (!EMAIL_RE.test(x.email.trim())) e.email = t('Имейлът трябва да е във вида име@домейн.bg.', 'Use the format name@domain.com.');
    if (x.message.trim().length < 20) e.message = t('Опишете накратко запитването (поне 20 знака).', 'Describe your enquiry briefly (at least 20 characters).');
    if (!x.consent) e.consent = t('Нужно е съгласие, за да обработим запитването.', 'Consent is needed to process your enquiry.');
    return e;
  };

  const set = <K extends keyof Values>(k: K, val: Values[K]) => {
    const next = { ...v, [k]: val };
    setV(next);
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validate(next)[k] }));
  };

  const composed = () => {
    const topic = topics.find((x) => x.id === v.topic)?.label ?? '';
    return `${t('Тема', 'Topic')}: ${topic}\n${t('Име', 'Name')}: ${v.name}\n${t('Организация', 'Organisation')}: ${v.org || '—'}\n${t('Имейл', 'E-mail')}: ${v.email}\n\n${v.message}`;
  };

  const subject = t('Запитване от сайта', 'Enquiry from the website');
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const er = validate(v);
    setErrors(er);
    const first = Object.keys(er)[0];
    if (first) { document.getElementById(`f-${first}`)?.focus(); return; }
    if (!FORM_ENDPOINT) { setStatus('composed'); return; }
    setStatus('sending');
    setStatus((await deliver(subject, composed(), v.email.trim())) ? 'sent' : 'failed');
  };

  const err = (k: keyof Values) => <FieldError id={`e-${k}`} msg={errors[k]} />;

  return (
    <>
      <PageHeader kicker={t('Контакт', 'Contact')}
        title={t('Разкажете ни за вашия район', 'Tell us about your district')}
        lede={t('Пишат ни общини, общински звена, доставчици на данни и партньори за съвместни проекти. Отговаряме с конкретно предложение за следваща стъпка.', 'Municipalities, municipal departments, data providers and project partners write to us. We reply with a concrete proposal for a next step.')} />

      <section className="gutter bg-paper">
        <div className="wrap grid gap-14 py-16 md:py-24 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <h2 className="t-h3">{t('Директно', 'Directly')}</h2>
            <p className="mt-4 text-ink-soft">{t('Имейл', 'E-mail')}</p>
            <EmailLine className="mt-1 text-[1.125rem]" />
            <h2 className="t-h3 mt-12">{t('Какво следва', 'What happens next')}</h2>
            <ol className="mt-4 space-y-4">
              {[t('Отговаряме и уточняваме кой район и кои данни.', 'We reply and agree on the district and the data.'), t('Предлагаме план за пилот с ясни мерки за успех.', 'We propose a pilot plan with clear success measures.'), t('Започваме с регистъра на горещите точки.', 'We start with the hotspot register.')].map((s, i) => (
                <li key={i} className="grid grid-cols-[1.75rem_1fr] gap-2"><span className="t-num text-[1.25rem] text-signal">{i + 1}</span><span className="text-ink-soft">{s}</span></li>
              ))}
            </ol>
          </aside>

          <div className="lg:col-span-7 lg:col-start-6">
            {status === 'composed' ? (
              <ComposedPanel title={t('Съобщението е готово', 'Your message is ready')} subject={subject} body={composed()} onEdit={() => setStatus('idle')} />
            ) : status === 'sent' ? (
              <SentPanel title={t('Запитването е изпратено', 'Enquiry sent')}>{t('Ще ви отговорим на ', 'We will reply to ')}{v.email}.</SentPanel>
            ) : (
              <form noValidate onSubmit={submit} className="grid gap-6" aria-describedby="form-note">
                <fieldset>
                  <legend className="mb-3 font-medium">{t('За какво пишете', 'What is it about')}</legend>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((x) => (
                      <label key={x.id} className={`cursor-pointer rounded-full border px-4 py-2.5 text-[0.9375rem] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-signal ${v.topic === x.id ? 'border-ink bg-ink text-paper' : 'border-rule bg-raised hover:border-ink'}`}>
                        <input type="radio" name="topic" value={x.id} checked={v.topic === x.id} onChange={() => set('topic', x.id)} className="sr-only" />
                        {x.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="f-name" className="mb-2 block font-medium">{t('Име', 'Name')}</label>
                    <input id="f-name" autoComplete="name" className="field" value={v.name} onChange={(e) => set('name', e.target.value)} onBlur={() => setErrors((er) => ({ ...er, name: validate(v).name }))} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'e-name' : undefined} />
                    {err('name')}
                  </div>
                  <div>
                    <label htmlFor="f-org" className="mb-2 block font-medium">{t('Организация', 'Organisation')} <span className="font-normal text-ink-soft">{t('(по желание)', '(optional)')}</span></label>
                    <input id="f-org" autoComplete="organization" className="field" value={v.org} onChange={(e) => set('org', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label htmlFor="f-email" className="mb-2 block font-medium">{t('Имейл', 'E-mail')}</label>
                  <input id="f-email" type="email" inputMode="email" autoComplete="email" className="field" value={v.email} onChange={(e) => set('email', e.target.value)} onBlur={() => setErrors((er) => ({ ...er, email: v.email ? validate(v).email : er.email }))} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'e-email' : undefined} />
                  {err('email')}
                </div>
                <div>
                  <label htmlFor="f-message" className="mb-2 block font-medium">{t('Запитване', 'Enquiry')}</label>
                  <textarea id="f-message" rows={6} className="field" placeholder={t('Например: кой район, какви сигнали получавате, какви данни имате.', 'For example: which district, what reports you receive, what data you have.')} value={v.message} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'e-message' : undefined} />
                  {err('message')}
                </div>
                <div>
                  <label className="flex cursor-pointer items-start gap-3">
                    <input id="f-consent" type="checkbox" checked={v.consent} onChange={(e) => set('consent', e.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" aria-invalid={!!errors.consent} aria-describedby={errors.consent ? 'e-consent' : undefined} />
                    <span className="text-ink-soft">{t('Съгласен/на съм данните ми да се използват само за отговор на това запитване.', 'I agree that my details are used only to reply to this enquiry.')}</span>
                  </label>
                  {err('consent')}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <button type="submit" className="btn btn-ink" disabled={status === 'sending'}><LuSend size={18} aria-hidden="true" />{status === 'sending' ? t('Изпращане…', 'Sending…') : t('Изпрати запитването', 'Send enquiry')}</button>
                  {status === 'failed' && <FailedNote msg={t('Запитването не беше изпратено. Опитайте отново или', 'The enquiry was not sent. Try again, or')} onCompose={() => setStatus('composed')} />}
                </div>
                <p id="form-note" className="t-small text-ink-soft">{t('Как обработваме личните данни: ', 'How we handle personal data: ')}<Link to="privacy" className="link">{t('политика за поверителност', 'privacy policy')}</Link></p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
