import { useT } from '../lib/i18n';
import { Link } from '../lib/router';
import { CONTACT_EMAIL } from '../content';
import { Mark, Ph } from './ui';

export function Footer() {
  const t = useT();
  return (
    <footer className="gutter bg-night text-night-muted">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2.5 text-night-fg">
            <Mark />
            <span className="font-display text-[1.375rem] font-medium tracking-[0.08em]">NADIR</span>
          </div>
          <p className="mt-5 max-w-sm">
            {t(
              'Мониторинг на нерегламентирани сметища със сателити и дронове. Гледаме отгоре, за да знае инспекторът къде да отиде първо.',
              'Monitoring illegal dumpsites with satellites and drones. We look from above so the inspector knows where to go first.'
            )}
          </p>
          <p className="t-coord mt-6 text-night-muted">42.6977° N · 23.3219° E · {t('София', 'Sofia')}</p>
        </div>
        <div className="md:col-span-3">
          <p className="font-medium text-night-fg">{t('Сайт', 'Site')}</p>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="plans" className="hover:text-night-fg">{t('Планове и цени', 'Plans and pricing')}</Link></li>
            <li><Link to="order" className="hover:text-night-fg">{t('Поръчка на анализ', 'Order an analysis')}</Link></li>
            <li><Link to="how" className="hover:text-night-fg">{t('Как работи', 'How it works')}</Link></li>
            <li><Link to="technology" className="hover:text-night-fg">{t('Технология', 'Technology')}</Link></li>
            <li><Link to="pilot" className="hover:text-night-fg">{t('Пилот за общини', 'Pilot for municipalities')}</Link></li>
            <li><Link to="team" className="hover:text-night-fg">{t('Екип', 'Team')}</Link></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-medium text-night-fg">{t('Контакт', 'Contact')}</p>
          <p className="mt-4 select-all text-night-fg">{CONTACT_EMAIL ?? <Ph>{t('имейл на екипа', 'team e-mail')}</Ph>}</p>
          <Link to="order" className="mt-3 block link text-night-fg">{t('Поръчка на AI анализ', 'Order an AI analysis')}</Link>
          <Link to="contact" className="mt-2 block link text-night-fg">{t('Форма за запитване', 'Enquiry form')}</Link>
        </div>
      </div>
      <div className="wrap flex flex-wrap justify-between gap-4 border-t border-night-line py-6 t-small">
        <p>© 2026 Nadir. {t('Проект, започнал в програмата ГРАДители 2026.', 'A project that started in the ГРАДители 2026 programme.')}</p>
        <p>{t('Сайтът не използва проследяващи бисквитки.', 'This site uses no tracking cookies.')} <Link to="privacy" className="link">{t('Поверителност', 'Privacy')}</Link></p>
      </div>
    </footer>
  );
}
