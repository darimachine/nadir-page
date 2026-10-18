import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LuCopy, LuCheck, LuCircleAlert, LuMail } from 'react-icons/lu';
import { useT } from '../lib/i18n';
import { CONTACT_EMAIL, FORM_ENDPOINT } from '../content';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Sends the composed message through FORM_ENDPOINT. FormSubmit answers 200 with success "false"
 *  until the form is activated, so the JSON is checked, not just the status. */
export async function deliver(subject: string, body: string, replyTo: string): Promise<boolean> {
  if (!FORM_ENDPOINT) return false;
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ _subject: subject, _replyto: replyTo, _template: 'box', message: body }),
    });
    if (!res.ok) return false;
    const json = await res.json().catch(() => ({}));
    return String(json.success) === 'true';
  } catch {
    return false;
  }
}

/** Replaces the form after delivery; takes focus like ComposedPanel. */
export function SentPanel({ title, children }: { title: string; children: ReactNode }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <div className="rounded-[14px] border border-rule bg-raised p-6 md:p-8" role="status">
      <h2 ref={headingRef} tabIndex={-1} className="t-h3 outline-none">{title}</h2>
      <p className="mt-3 text-ink-soft">{children}</p>
    </div>
  );
}

/** Shown next to the submit button when delivery fails: the visitor can still send it by e-mail. */
export function FailedNote({ msg, onCompose }: { msg: string; onCompose: () => void }) {
  const t = useT();
  return (
    <p className="t-small text-signal" role="alert">
      {msg}{' '}
      <button type="button" onClick={onCompose} className="link font-medium">{t('Подгответе имейл вместо това', 'Prepare an e-mail instead')}</button>
    </p>
  );
}

export function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return <p id={id} className="t-small mt-2 flex items-center gap-1.5 text-signal"><LuCircleAlert size={15} aria-hidden="true" />{msg}</p>;
}

/** The team address as selectable text with a copy button. */
export function EmailLine({ className = '' }: { className?: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const email = CONTACT_EMAIL;
  if (!email) return null;
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };
  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <span className="select-all font-medium">{email}</span>
      <button type="button" onClick={copy} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-current/30 px-2.5 text-[0.8125rem] opacity-80 hover:opacity-100">
        {copied ? <LuCheck size={14} aria-hidden="true" /> : <LuCopy size={14} aria-hidden="true" />}<span aria-live="polite">{copied ? t('Копирано', 'Copied') : t('Копирай', 'Copy')}</span>
      </button>
    </span>
  );
}

/** Shown after a valid submit while the form has no backend: the message is ready to be sent by e-mail.
 *  It never claims anything was sent. */
export function ComposedPanel({ title, subject, body, onEdit, children }:
  { title: string; subject: string; body: string; onEdit: () => void; children?: ReactNode }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // The form this panel replaces held focus; hand it to the heading so keyboard and screen-reader users land here.
  useEffect(() => { headingRef.current?.focus(); }, []);
  const mailto = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : undefined;
  const copy = async () => {
    try { await navigator.clipboard.writeText(body); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch { ref.current?.select(); }
  };
  return (
    <div className="rounded-[14px] border border-rule bg-raised p-6 md:p-8" role="status">
      <h2 ref={headingRef} tabIndex={-1} className="t-h3 outline-none">{title}</h2>
      <p className="mt-3 text-ink-soft">
        {t('Изпратете го на ', 'Send it to ')}<span className="select-all font-medium text-ink">{CONTACT_EMAIL}</span>
        {t(' с тема „', ' with the subject “')}{subject}{t('“. Бутонът отваря имейл програмата ви с готовия текст; ако не се отвори, копирайте текста.', '”. The button opens your e-mail app with the text filled in; if it doesn’t open, copy the text.')}
      </p>
      {children}
      <label htmlFor="f-out" className="sr-only">{t('Текст на съобщението', 'Message text')}</label>
      <textarea id="f-out" ref={ref} readOnly value={body} rows={10} className="field mt-6 font-mono text-[0.8125rem] leading-relaxed" />
      <div className="mt-4 flex flex-wrap gap-3">
        {mailto && <a href={mailto} className="btn btn-ink"><LuMail size={18} aria-hidden="true" />{t('Отвори в имейл', 'Open in e-mail')}</a>}
        <button type="button" onClick={copy} className="btn btn-ghost">{copied ? <LuCheck size={18} aria-hidden="true" /> : <LuCopy size={18} aria-hidden="true" />}<span aria-live="polite">{copied ? t('Копирано', 'Copied') : t('Копирай текста', 'Copy text')}</span></button>
        <button type="button" onClick={onEdit} className="btn btn-ghost">{t('Редактирай', 'Edit')}</button>
      </div>
    </div>
  );
}
