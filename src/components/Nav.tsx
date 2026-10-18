import { useEffect, useRef, useState } from 'react';
import { LuMenu, LuX } from 'react-icons/lu';
import { useLang, useT } from '../lib/i18n';
import { Link, useRouter } from '../lib/router';
import { Mark } from './ui';

export function LangSwitch({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div role="group" aria-label="Език / Language" className={`flex rounded-full border border-night-line p-0.5 text-[0.8125rem] font-medium ${className}`}>
      {(['bg', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`min-h-9 min-w-10 rounded-full px-2.5 transition-colors ${lang === l ? 'bg-night-fg text-night' : 'text-night-muted hover:text-night-fg'}`}
        >
          {l === 'bg' ? 'БГ' : 'EN'}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const t = useT();
  const { route } = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 8);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [route.page, route.section]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      toggleRef.current?.focus(); // focus was inside the menu that is now hidden
    };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [open]);

  const items = [
    { to: 'how', label: t('Как работи', 'How it works'), page: 'home' },
    { to: 'technology', label: t('Технология', 'Technology'), page: 'technology' },
    { to: 'pilot', label: t('Пилот', 'Pilot'), page: 'pilot' },
    { to: 'team', label: t('Екип', 'Team'), page: 'home' },
    { to: 'contact', label: t('Контакт', 'Contact'), page: 'contact' },
  ];
  const isCurrent = (it: (typeof items)[number]) =>
    it.page !== 'home' ? route.page === it.page : route.page === 'home' && route.section === it.to;

  return (
    <header
      className={`gutter sticky z-50 border-b transition-colors duration-300 ${scrolled || open ? 'border-night-line bg-night/95 backdrop-blur-md' : 'border-transparent bg-night'}`}
      style={{ top: 'env(safe-area-inset-top, 0px)' }}
    >
      {/* Focus <main> directly: letting the hash change would send the router to its not-found page */}
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-night-fg focus:px-3 focus:py-2 focus:text-night">
        {t('Към съдържанието', 'Skip to content')}
      </a>
      <nav className="wrap flex h-16 items-center gap-6" aria-label={t('Основна навигация', 'Main navigation')}>
        <Link to="home" className="flex items-center gap-2.5 text-night-fg" aria-label={t('Nadir — начало', 'Nadir — home')}>
          <Mark />
          <span className="font-display text-[1.375rem] font-medium tracking-[0.08em]">NADIR</span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {items.map((it) => (
            <li key={it.to}>
              <Link
                to={it.to}
                aria-current={isCurrent(it) ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-[0.9375rem] transition-colors hover:text-night-fg ${isCurrent(it) ? 'text-night-fg' : 'text-night-muted'}`}
              >
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
        <LangSwitch className="ml-auto lg:ml-2" />
        <Link to="order" className="btn btn-signal hidden !min-h-10 sm:inline-flex">
          {t('Поръчайте анализ', 'Order an analysis')}
        </Link>
        <button
          ref={toggleRef}
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full text-night-fg lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t('Затвори менюто', 'Close menu') : t('Отвори менюто', 'Open menu')}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <LuX size={22} /> : <LuMenu size={22} />}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="wrap pb-6 lg:hidden">
        <ul className="flex flex-col border-t border-night-line pt-2">
          {items.map((it) => (
            <li key={it.to}>
              <Link to={it.to} className="block border-b border-night-line py-3.5 font-display text-2xl text-night-fg">{it.label}</Link>
            </li>
          ))}
        </ul>
        <Link to="order" className="btn btn-signal mt-5 w-full justify-center">{t('Поръчайте AI анализ', 'Order an AI analysis')}</Link>
      </div>
    </header>
  );
}
