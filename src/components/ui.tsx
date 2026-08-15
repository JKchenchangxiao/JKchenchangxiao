import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { speak, speechSupported } from '../lib/speech'

export function Card({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  )
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'outline'
}

export function Button({ variant = 'outline', className = '', ...rest }: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40'
  const styles = {
    primary: 'bg-[var(--accent)] text-white hover:brightness-110 active:brightness-95',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
  }[variant]
  return <button className={`${base} ${styles} ${className}`} {...rest} />
}

export function SpeakButton({ text, className = '' }: { text: string; className?: string }) {
  if (!speechSupported()) return null
  return (
    <button
      type="button"
      title="朗读"
      aria-label={`朗读 ${text}`}
      onClick={(e) => {
        e.stopPropagation()
        speak(text)
      }}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 5 6 9H3v6h3l5 4V5Z" strokeLinejoin="round" />
        <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export function Progress({ value, max }: { value: number; max: number }) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <Card className="p-5">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-semibold tabular-nums text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </Card>
  )
}

export function Tag({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
        active
          ? 'bg-[var(--accent)] text-white'
          : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300'
      }`}
    >
      {children}
    </button>
  )
}

export function EmptyState({
  title,
  hint,
  icon = '🎉',
}: {
  title: string
  hint?: string
  icon?: string
}) {
  return (
    <Card className="grid place-items-center gap-2 p-12 text-center">
      <div className="text-4xl">{icon}</div>
      <div className="text-lg font-medium text-slate-800">{title}</div>
      {hint && <div className="max-w-sm text-sm text-slate-500">{hint}</div>}
    </Card>
  )
}
