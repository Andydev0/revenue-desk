import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-[0.7rem] bg-[var(--cobalt)] px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(64,92,245,0.2)] transition hover:-translate-y-0.5 hover:bg-[var(--cobalt-deep)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
