import { Button } from '@/components/ui/button'
import { RefreshIcon } from '@/components/ui/icons'
import { formatUpdatedAt } from '@/lib/formatters'

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
  updatedAt?: string
}

export function DashboardHeader({
  isRefreshing,
  onRefresh,
  updatedAt,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--canvas)]/92 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-[0.65rem] bg-[var(--cobalt)] font-mono text-[11px] font-bold tracking-[-0.04em] text-white shadow-[0_7px_20px_rgba(64,92,245,0.22)]">
            RD
          </div>
          <div>
            <p className="font-display text-sm font-semibold tracking-[-0.025em] text-[var(--ink)]">
              Revenue Desk
            </p>
            <p className="text-[10px] text-[var(--slate)]">
              Operações de vendas DTC
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--slate)]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#38a66f] opacity-40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-[#278b5b]" />
            </span>
            <span>DummyJSON conectada</span>
          </div>

          <span
            aria-hidden="true"
            className="hidden h-5 w-px bg-[var(--line)] sm:block"
          />

          <div className="text-right">
            <p className="text-[10px] text-[var(--slate)]">Atualizado em</p>
            <p aria-live="polite" className="mt-0.5 text-xs text-[var(--ink)]">
              {updatedAt ? formatUpdatedAt(updatedAt) : 'Aguardando dados'}
            </p>
          </div>

          <Button
            aria-label="Atualizar dados do painel"
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <RefreshIcon
              className={`size-3.5 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
            />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Atualizando' : 'Atualizar'}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
