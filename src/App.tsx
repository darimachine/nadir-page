import { useEffect } from 'react';
import { LangProvider, useT } from './lib/i18n';
import { RouterProvider, useRouter, Link } from './lib/router';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Technology } from './pages/Technology';
import { Pilot } from './pages/Pilot';
import { Contact } from './pages/Contact';
import { Order } from './pages/Order';
import { Privacy } from './pages/Privacy';

const TITLES = {
  home: ['Nadir', 'Nadir'],
  technology: ['Технология · Nadir', 'Technology · Nadir'],
  order: ['Заявка за план · Nadir', 'Plan enquiry · Nadir'],
  pilot: ['Пилот за общини · Nadir', 'Pilot for municipalities · Nadir'],
  contact: ['Контакт · Nadir', 'Contact · Nadir'],
  privacy: ['Поверителност · Nadir', 'Privacy · Nadir'],
  notfound: ['Страницата не е намерена · Nadir', 'Page not found · Nadir'],
} as const;

function NotFound() {
  const t = useT();
  return (
    <section className="gutter bg-paper">
      <div className="wrap py-28">
        <h1 className="t-h2">{t('Тази страница не съществува.', 'This page does not exist.')}</h1>
        <p className="t-lede mt-4 text-ink-soft">{t('Връзката може да е стара. Започнете от началната страница.', 'The link may be out of date. Start from the home page.')}</p>
        <Link to="home" className="btn btn-ink mt-8">{t('Към началото', 'Go to the home page')}</Link>
      </div>
    </section>
  );
}

function Shell() {
  const { route } = useRouter();
  const t = useT();
  useEffect(() => {
    const [bg, en] = TITLES[route.page];
    document.title = t(bg, en);
  }, [route.page, t]);
  const Page = { home: Home, order: Order, technology: Technology, pilot: Pilot, contact: Contact, privacy: Privacy, notfound: NotFound }[route.page];
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Page key={route.page} />
      </main>
      <Footer />
    </>
  );
}

export function App() {
  return (
    <LangProvider>
      <RouterProvider>
        <Shell />
      </RouterProvider>
    </LangProvider>
  );
}
