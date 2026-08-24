import { Button } from '@/components/ui/button'
import { AlertIcon } from '@/components/ui/icons'

export function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Carregando dados do painel</span>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            className="h-44 animate-pulse rounded-2xl border border-[var(--line)] bg-white/70 motion-reduce:animate-none"
            key={index}
          />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl border border-[var(--line)] bg-white/70 motion-reduce:animate-none" />
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
      className="mx-auto max-w-xl rounded-2xl border border-[#e8c8c1] bg-[#fff8f6] p-8 text-center"
      role="alert"
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#f9e4df] text-[#a34231]">
        <AlertIcon className="size-6" />
      </span>
      <h2
        className="mt-4 text-lg font-bold text-[var(--navy)]"
        id="error-title"
      >
        Os dados não foram carregados
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[var(--muted)]">
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
      className="rounded-2xl border border-dashed border-[#abc4c6] bg-white/70 px-6 py-16 text-center"
    >
      <span className="mx-auto block size-3 rounded-full bg-[var(--amber)] shadow-[0_0_0_7px_#fff1d6]" />
      <h2
        className="mt-6 text-lg font-bold text-[var(--navy)]"
        id="empty-title"
      >
        Nenhum pedido encontrado
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
        A fonte respondeu sem pedidos. Atualize o painel mais tarde para
        verificar se novos dados estão disponíveis.
      </p>
    </section>
  )
}
