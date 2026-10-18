import type { ReactNode } from 'react';
import { Reveal } from '../lib/motion';

/** Dashed marker for information the team still has to supply. */
export function Ph({ children }: { children: ReactNode }) {
  return <span className="ph" title="Placeholder">[{children}]</span>;
}

/** Section frame: a left rail with the section's question, content to the right on wide screens. */
export function Section({ id, tone = 'paper', label, title, lede, children, className = '' }:
  { id?: string; tone?: 'paper' | 'paper-2'; label?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <section id={id} className={`gutter scroll-mt-20 ${tone === 'paper-2' ? 'bg-paper-2' : 'bg-paper'} ${className}`}>
      <div className="wrap py-20 md:py-28">
        <Reveal className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-8">
            {label && <p className="mb-4 text-[0.9375rem] font-medium text-signal">{label}</p>}
            <h2 className="t-h2">{title}</h2>
            {lede && <p className="t-lede measure mt-6 text-ink-soft">{lede}</p>}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Source({ children }: { children: ReactNode }) {
  return <p className="t-small mt-8 text-ink-soft">{children}</p>;
}

/** Brand glyph for a quadcopter (Lucide has none). 24-unit grid, stroke follows currentColor. */
export function DroneIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
      <path d="M9.5 9.5 6.5 6.5M14.5 9.5l3-3M9.5 14.5l-3 3M14.5 14.5l3 3" />
      <circle cx="5" cy="5" r="2.6" /><circle cx="19" cy="5" r="2.6" /><circle cx="5" cy="19" r="2.6" /><circle cx="19" cy="19" r="2.6" />
    </svg>
  );
}

/** The Nadir mark: a reticle looking straight down. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="var(--night-ice)" strokeWidth="1.6" />
      <path d="M16 1v6M16 25v6M1 16h6M25 16h6" stroke="var(--night-ice)" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.2" fill="var(--night-signal)" />
    </svg>
  );
}
