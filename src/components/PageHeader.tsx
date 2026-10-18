import type { ReactNode } from 'react';

export function PageHeader({ kicker, title, lede, children }: { kicker: ReactNode; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="gutter bg-night text-night-fg">
      <div className="wrap pb-16 pt-14 md:pb-20 md:pt-20">
        <p className="text-[0.9375rem] text-night-ice">{kicker}</p>
        <h1 className="t-hero mt-4 max-w-[20ch]">{title}</h1>
        {lede && <p className="t-lede mt-6 max-w-[60ch] text-night-muted">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
