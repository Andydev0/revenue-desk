import type { ReactNode } from 'react'

interface MetricCardProps {
  detail: string
  icon: ReactNode
  label: string
  tone?: 'default' | 'featured' | 'warning'
  value: string
}

const toneStyles = {
  default: 'border-[var(--line)] bg-[var(--surface)]',
  featured:
    'border-[var(--navy)] bg-[var(--navy)] text-white shadow-[0_12px_30px_rgba(16,47,54,0.14)]',
  warning: 'border-[#ecd5ac] bg-[#fffaf0]',
}

export function MetricCard({
  detail,
  icon,
  label,
  tone = 'default',
  value,
}: MetricCardProps) {
  const isFeatured = tone === 'featured'

  return (
    <article className={`min-w-0 rounded-2xl border p-5 ${toneStyles[tone]}`}>
      <div className="mb-7 flex items-start justify-between gap-3">
        <p
          className={`text-sm font-medium ${isFeatured ? 'text-[#b8d7da]' : 'text-[var(--muted)]'}`}
        >
          {label}
        </p>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-lg ${isFeatured ? 'bg-white/10 text-[var(--cyan)]' : 'bg-[#edf5f4] text-[var(--teal)]'}`}
        >
          {icon}
        </span>
      </div>
      <p className="truncate font-mono text-2xl font-semibold tracking-[-0.05em] sm:text-[1.7rem]">
        {value}
      </p>
      <p
        className={`mt-2 text-xs leading-5 ${isFeatured ? 'text-[#9fc4c8]' : 'text-[var(--muted)]'}`}
      >
        {detail}
      </p>
    </article>
  )
}
