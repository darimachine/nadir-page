import { isPlanId, type PlanId } from '../pricing';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

/** Pages are top-level routes; any other hash token is a section on the home page.
 *  Hash tokens are plain words so a shared artifact link like …#pilot lands on the right page. */
export const PAGES = ['home', 'order', 'technology', 'pilot', 'contact', 'privacy'] as const;
export type Page = (typeof PAGES)[number];
export const HOME_SECTIONS = ['problem', 'connect', 'how', 'prototype', 'validation', 'team', 'plans'] as const;

type Route = { page: Page | 'notfound'; section?: string; plan?: PlanId };
function parse(hash: string): Route {
  const [token, query = ''] = hash.replace(/^#\/?/, '').split('?', 2);
  if (token === 'order') {
    const plan = new URLSearchParams(query).get('plan');
    return { page: 'order', plan: isPlanId(plan) ? plan : undefined };
  }
  if (!token || token === 'home' || token === 'top' || token === 'main') return { page: 'home' };
  if ((PAGES as readonly string[]).includes(token)) return { page: token as Page };
  if ((HOME_SECTIONS as readonly string[]).includes(token)) return { page: 'home', section: token };
  return { page: 'notfound' };
}

type Ctx = { route: Route; go: (token: string) => void };
const RouterCtx = createContext<Ctx>({ route: { page: 'home' }, go: () => {} });

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parse(location.hash));

  useEffect(() => {
    const on = () => setRoute(parse(location.hash));
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);

  // After every route change: scroll to the section, or to the top of a new page, and move focus for screen readers.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (route.section) {
        document.getElementById(route.section)?.scrollIntoView({ block: 'start' });
      } else {
        scrollTo({ top: 0 });
        (document.getElementById('main') as HTMLElement | null)?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [route.page, route.section]);

  const go = useCallback((token: string) => {
    const next = '#' + token;
    if (location.hash === next) setRoute(parse(next)); // re-trigger scroll on repeat clicks
    else location.hash = token;
  }, []);

  return <RouterCtx.Provider value={{ route, go }}>{children}</RouterCtx.Provider>;
}

export const useRouter = () => useContext(RouterCtx);

/** Internal link: a real <a href="#token"> so it works without JS handlers, middle-click and keyboard. */
export function Link({ to, className, children, onClick, ...rest }: { to: string; className?: string; children: ReactNode; onClick?: () => void; [k: string]: unknown }) {
  const { go } = useRouter();
  return (
    <a
      href={'#' + to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.();
        go(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
