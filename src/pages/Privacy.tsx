import { useT } from '../lib/i18n';
import { PageHeader } from '../components/PageHeader';
import { CONTACT_EMAIL } from '../content';

/* Starting draft of the privacy policy (GDPR). It describes what the site actually does: two forms
 * delivered by FormSubmit to a Proton Mail inbox, a language preference in localStorage, Google Fonts.
 * Have it reviewed before launch and update UPDATED when it changes. */
const UPDATED = '18.10.2026';

export function Privacy() {
  const t = useT();
  const email = CONTACT_EMAIL ?? '';
  const sections: { h: string; p: string[] }[] = [
    {
      h: t('Кои сме', 'Who we are'),
      p: [
        t(`Nadir е екип, който разработва мониторинг на нерегламентирани сметища в рамките на програмата ГРАДители 2026. За въпроси относно личните данни пишете на ${email}.`,
          `Nadir is a team developing monitoring of illegal dumpsites within the ГРАДители 2026 programme. For questions about personal data, write to ${email}.`),
      ],
    },
    {
      h: t('Какви данни събираме', 'What data we collect'),
      p: [
        t('Само данните, които въвеждате във формите за запитване и поръчка: име, организация, имейл, телефон (по желание), описание на зоната и текста на съобщението.',
          'Only what you enter in the enquiry and order forms: name, organisation, e-mail, phone (optional), a description of the area and the text of your message.'),
        t('Не събираме данни за посещенията, не ползваме аналитика и проследяващи бисквитки.',
          'We do not collect visit data and use no analytics or tracking cookies.'),
      ],
    },
    {
      h: t('За какво ги ползваме и на какво основание', 'What we use it for and on what basis'),
      p: [
        t('За да отговорим на запитването ви, да изготвим оферта и да изпълним поръчка. Основанието е вашето съгласие, дадено във формата (чл. 6, ал. 1, б. „а“ от ОРЗД), и действия преди сключване на договор по ваше искане (чл. 6, ал. 1, б. „б“).',
          'To reply to your enquiry, prepare a quote and fulfil an order. The basis is the consent you give in the form (GDPR Art. 6(1)(a)) and steps taken at your request before entering into a contract (Art. 6(1)(b)).'),
        t('Не продаваме данните ви и не ги ползваме за реклама.', 'We do not sell your data or use it for advertising.'),
      ],
    },
    {
      h: t('Кой друг ги обработва', 'Who else processes it'),
      p: [
        t('FormSubmit (formsubmit.co) доставя съобщенията от формите до нашата пощенска кутия. Пощата ни се хоства от Proton Mail (Proton AG, Швейцария, държава с решение на ЕК за адекватна защита).',
          'FormSubmit (formsubmit.co) delivers form messages to our inbox. Our e-mail is hosted by Proton Mail (Proton AG, Switzerland, a country with an EU adequacy decision).'),
        t('Шрифтовете на сайта се зареждат от Google Fonts, при което IP адресът ви се изпраща на Google.',
          'The site’s fonts are loaded from Google Fonts, which sends your IP address to Google.'),
      ],
    },
    {
      h: t('Колко дълго ги пазим', 'How long we keep it'),
      p: [
        t('До 12 месеца след последната ни кореспонденция, освен ако не сключим договор; тогава ги пазим колкото изисква законът.',
          'Up to 12 months after our last correspondence, unless we enter into a contract; then for as long as the law requires.'),
      ],
    },
    {
      h: t('Какво запомня браузърът ви', 'What your browser remembers'),
      p: [
        t('Само избрания език (БГ или EN), записан локално в браузъра ви. Той не се изпраща на нас.',
          'Only the language you chose (BG or EN), stored locally in your browser. It is not sent to us.'),
      ],
    },
    {
      h: t('Вашите права', 'Your rights'),
      p: [
        t(`Можете да поискате достъп до данните си, поправка, изтриване, ограничаване или преносимост, да възразите срещу обработването и да оттеглите съгласието си по всяко време, като пишете на ${email}.`,
          `You can ask for access to your data, correction, erasure, restriction or portability, object to processing and withdraw your consent at any time by writing to ${email}.`),
        t('Имате право на жалба до Комисията за защита на личните данни (cpdp.bg).',
          'You have the right to complain to the Bulgarian Commission for Personal Data Protection (cpdp.bg).'),
      ],
    },
  ];

  return (
    <>
      <PageHeader kicker={t('Поверителност', 'Privacy')}
        title={t('Политика за поверителност', 'Privacy policy')}
        lede={t(`Как обработваме данните, които ни изпращате. Работна версия, последна промяна ${UPDATED}.`, `How we handle the data you send us. Working draft, last updated ${UPDATED}.`)} />
      <section className="gutter bg-paper">
        <div className="wrap py-16 md:py-24">
          <div className="measure grid gap-12">
            {sections.map((s) => (
              <div key={s.h}>
                <h2 className="t-h3">{s.h}</h2>
                {s.p.map((p) => <p key={p} className="mt-4 text-ink-soft">{p}</p>)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
