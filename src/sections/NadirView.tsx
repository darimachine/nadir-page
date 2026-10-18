import { useEffect, useRef, useState } from 'react';
import { useT } from '../lib/i18n';
import { useReducedMotion } from '../lib/motion';
import { ATTRIBUTION, CANDIDATES, LABEL_TEXT, OVERVIEW } from '../imagery';

/* The hero's working view on real imagery: the Manastirski Livadi orthophoto with the review queue's
 * candidates outlined on it, and the selected 51 × 51 m crop at full detail. Nothing here is ranked by
 * urgency: in the prototype automated ranking is off, so the queue is for a person to review. */

export function NadirView() {
  const t = useT();
  const rm = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const timer = useRef<number>(0);

  useEffect(() => {
    if (rm || !auto) return;
    timer.current = window.setInterval(() => setActive((a) => (a + 1) % CANDIDATES.length), 4200);
    return () => clearInterval(timer.current);
  }, [rm, auto]);

  const pick = (i: number) => { setAuto(false); setActive(i); };
  const c = CANDIDATES[active];

  return (
    <figure className="overflow-hidden rounded-[14px] border border-night-line bg-night-2 text-night-fg shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]">
      <div className="grid lg:grid-cols-12">
        {/* overview: the whole surveyed area with the candidates outlined */}
        <div className="bg-night lg:col-span-8 lg:flex lg:items-center lg:border-r lg:border-night-line">
          {/* boxes are positioned in percent of the image, so this wrapper must be exactly the image's size */}
          <div className="relative w-full overflow-hidden">
          <img src={OVERVIEW.src} width={OVERVIEW.width} height={OVERVIEW.height}
            alt={t('Ортофото отгоре на Манастирски ливади, София: ниви, нови жилищни блокове, строежи и къщи. Очертани са шест места за преглед.', 'Top-down orthophoto of Manastirski Livadi, Sofia: fields, new housing blocks, building sites and houses. Six places for review are outlined.')}
            className="block h-auto w-full" />
          {CANDIDATES.map((p, i) => {
            const on = i === active;
            return (
              <button key={p.id} type="button" onClick={() => pick(i)} aria-label={`${i + 1}. ${t(p.caption[0], p.caption[1])}`} aria-pressed={on}
                className={`absolute -m-2 box-content border-2 p-2 transition-colors duration-300 ${on ? 'border-night-signal bg-night-signal/15' : 'border-dashed border-night-fg/80 hover:border-night-signal'}`}
                style={{ left: `${p.box.x}%`, top: `${p.box.y}%`, width: `${p.box.w}%`, height: `${p.box.h}%` }}>
                <span className={`absolute -top-6 left-0 rounded-sm px-1.5 text-[0.8125rem] font-semibold leading-5 ${on ? 'bg-night-signal text-[#1A0E05]' : 'bg-night/80 text-night-fg'}`}>{i + 1}</span>
                {on && !rm && <span aria-hidden="true" className="anim-ping absolute inset-0 border-2 border-night-signal" />}
              </button>
            );
          })}
          <p className="absolute bottom-2 left-3 rounded-sm bg-night/75 px-2 py-0.5 text-[0.8125rem] text-night-fg">
            {t('Манастирски ливади, София. Около 1,3 × 0,7 км', 'Manastirski Livadi, Sofia. About 1.3 × 0.7 km')}
          </p>
          </div>
        </div>

        {/* the selected crop at full detail */}
        <div className="flex flex-col lg:col-span-4">
          <div className="relative">
            <img key={c.id} src={c.src} width={480} height={480} alt={t(c.caption[0], c.caption[1])} className="block aspect-square w-full object-cover lg:aspect-[4/3]" />
            <span className="absolute left-3 top-3 rounded-sm bg-night/80 px-2 py-0.5 text-[0.8125rem]">{t('51 × 51 м, пиксел 5 см', '51 × 51 m, 5 cm pixel')}</span>
          </div>
          <div className="flex-1 px-4 py-4 sm:px-5" aria-live="polite">
            <p className={`text-[0.875rem] font-medium ${c.label === 'suspect' ? 'text-night-signal' : 'text-night-ice'}`}>
              {active + 1}. {t(LABEL_TEXT[c.label][0], LABEL_TEXT[c.label][1])}
            </p>
            <p className="mt-1 leading-snug">{t(c.caption[0], c.caption[1])}</p>
          </div>
          <div role="group" aria-label={t('Места за преглед', 'Places for review')} className="grid grid-cols-6 gap-1 border-t border-night-line p-2">
            {CANDIDATES.map((p, i) => (
              <button key={p.id} type="button" onClick={() => pick(i)} aria-pressed={i === active} aria-label={`${i + 1}. ${t(p.caption[0], p.caption[1])}`}
                className={`overflow-hidden rounded-[4px] border-2 transition-colors ${i === active ? 'border-night-signal' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                <img src={p.src} alt="" width={480} height={480} className="block aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="border-t border-night-line px-4 py-3 text-[0.8125rem] text-night-muted sm:px-5">
        {t('Етикетите са предварителни, от модела и от преглед на снимката, без проверка на място. ', 'Labels are preliminary, from the model and a look at the image, with no on-site check. ')}
        {t(ATTRIBUTION[0], ATTRIBUTION[1])}
      </figcaption>
    </figure>
  );
}
