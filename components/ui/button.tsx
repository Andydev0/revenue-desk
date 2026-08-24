import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#19434c] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}
