import { Button } from '@/components/ui/button'
import { AlertIcon } from '@/components/ui/icons'

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando dados do painel</span>
      <div className="mb-7 space-y-3">
        <div className="h-24 w-full max-w-2xl animate-pulse rounded-2xl bg-[#e5e9e5] motion-reduce:animate-none" />
        <div className="h-[22rem] animate-pulse rounded-[1.75rem] bg-[var(--ink)]/90 motion-reduce:animate-none" />
      </div>
      <div className="mb-10 grid overflow-hidden rounded-2xl border border-[var(--line)] bg-white sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            className="h-28 animate-pulse border-b border-[var(--line)] bg-white motion-reduce:animate-none sm:border-r sm:border-b-0 sm:last:border-r-0"
            key={index}
          />
        ))}
      </div>
      <div className="h-[30rem] animate-pulse rounded-[1.75rem] border border-[var(--line)] bg-white motion-reduce:animate-none" />
    </div>
  )
}

interface DashboardErrorStateProps {
  message: string
  onRetry: () => void
}

export function DashboardErrorState({
  message,
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <section
      aria-labelledby="error-title"
      className="mx-auto max-w-xl rounded-[1.75rem] border border-[#f0c8c0] bg-[var(--coral-soft)] p-8 text-center"
      role="alert"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-white text-[var(--coral)] shadow-sm">
        <AlertIcon className="size-6" />
      </span>
      <h2
        className="mt-4 font-display text-xl font-semibold tracking-tight text-[var(--ink)]"
        id="error-title"
      >
        Os dados não foram carregados
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--slate)]">
        {message}
      </p>
      <Button className="mt-5" onClick={onRetry}>
        Tentar novamente
      </Button>
    </section>
  )
}

export function DashboardEmptyState() {
  return (
    <section
      aria-labelledby="empty-title"
      className="rounded-[1.75rem] border border-dashed border-[var(--line)] bg-white px-6 py-16 text-center"
    >
      <span className="mx-auto block size-3 rounded-full bg-[var(--coral)] shadow-[0_0_0_7px_var(--coral-soft)]" />
      <h2
        className="mt-6 font-display text-xl font-semibold tracking-tight text-[var(--ink)]"
        id="empty-title"
      >
        Nenhum pedido encontrado
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--slate)]">
        A fonte respondeu sem pedidos. Atualize o painel mais tarde para
        verificar se novos dados estão disponíveis.
      </p>
    </section>
  )
}
