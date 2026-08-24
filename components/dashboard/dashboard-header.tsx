import { Button } from '@/components/ui/button'
import { RefreshIcon } from '@/components/ui/icons'
import { formatUpdatedAt } from '@/lib/formatters'

interface DashboardHeaderProps {
  isRefreshing: boolean
  onRefresh: () => void
  updatedAt?: string
}

function DataPulse() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#b9d6d7] bg-[#e7f4f3] px-3.5 py-2.5">
      <div
        aria-hidden="true"
        className="flex h-7 items-end gap-1 rounded-md bg-[var(--teal)] px-2 py-1.5"
      >
        {[45, 80, 58, 100, 70].map((height, index) => (
          <span
            className="data-pulse-bar w-0.5 rounded-full bg-white"
            key={height}
            style={{
              animationDelay: `${index * 120}ms`,
              height: `${height}%`,
            }}
          />
        ))}
      </div>
      <div>
        <p className="text-xs font-semibold text-[#174f50]">Fonte conectada</p>
        <p className="font-mono text-[11px] text-[#4d7779]">
          DummyJSON · cache de 5 min
        </p>
      </div>
    </div>
  )
}

export function DashboardHeader({
  isRefreshing,
  onRefresh,
  updatedAt,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-10">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[var(--navy)] font-mono text-xs font-bold tracking-tight text-white">
              RD
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-[var(--navy)]">
                Revenue Desk
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--muted)]">
                Operações comerciais
              </p>
            </div>
          </div>
          <p className="mb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">
            Visão geral / Vendas
          </p>
          <h1 className="text-3xl font-bold tracking-[-0.045em] text-[var(--navy)] sm:text-4xl">
            Painel de vendas
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Desempenho consolidado dos pedidos simulados, com descontos e
            produtos de maior receita.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <DataPulse />
          <div className="flex items-center justify-between gap-3 sm:block">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--muted)] sm:text-right">
              Última atualização
            </p>
            <p
              aria-live="polite"
              className="text-xs font-medium text-[var(--navy)] sm:mb-2 sm:text-right"
            >
              {updatedAt ? formatUpdatedAt(updatedAt) : 'Aguardando dados'}
            </p>
            <Button
              aria-label="Atualizar dados do painel"
              className="w-full sm:w-auto"
              disabled={isRefreshing}
              onClick={onRefresh}
            >
              <RefreshIcon
                className={`size-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
              />
              {isRefreshing ? 'Atualizando...' : 'Atualizar dados'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
