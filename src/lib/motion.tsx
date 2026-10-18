/* A small motion layer with the same roles Motion for React would play here (scroll reveals,
 * count-ups, reduced-motion awareness). The npm registry was unreachable when this was built,
 * so it is written on IntersectionObserver + CSS transitions; swapping in `motion/react` later
 * only touches this file. */
import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';

export function useReducedMotion() {
  const [rm, setRm] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setRm(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return rm;
}

/** Fires once when the element enters the viewport. Elements already on screen at mount count as seen. */
export function useInView<T extends Element>(margin = '0px 0px -12% 0px') {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setSeen(true); io.disconnect(); }
    }, { rootMargin: margin });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, seen] as const;
}

/** Scroll reveal. Visible by default (so the page is complete for no-JS, thumbnails and above-the-fold);
 *  only elements that start below the fold get the hidden start state. */
export function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }:
  { as?: string; delay?: number; className?: string; children?: ReactNode; [k: string]: unknown }) {
  const ref = useRef<HTMLElement>(null);
  const [pre, setPre] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight * 0.92) return; // already visible: leave it alone
    setPre(true);
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setPre(false); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(as, {
    ref,
    className: `rv ${pre ? 'rv-pre' : ''} ${className}`,
    style: delay ? { transitionDelay: `${delay}s` } : undefined,
    ...rest,
  }, children);
}

/** Number that counts up once when it scrolls into view. Renders the final value without JS motion. */
export function CountUp({ to, duration = 1.4, format }: { to: number; duration?: number; format?: (n: number) => string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const rm = useReducedMotion();
  const [v, setV] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    if (!seen || rm || started.current) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / (duration * 1000));
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setV(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, rm, to, duration]);
  const n = Math.round(v);
  return <span ref={ref}>{format ? format(n) : n}</span>;
}
