'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import {
  DashboardEmptyState,
  DashboardErrorState,
  DashboardSkeleton,
} from '@/components/dashboard/dashboard-states'
import { MetricsGrid } from '@/components/dashboard/metrics-grid'
import { TopProducts } from '@/components/dashboard/top-products'
import {
  trackEvent,
  trackEventOnce,
  type DashboardLoadType,
  type TrackingErrorCode,
} from '@/lib/tracking/events'
import type {
  DashboardErrorResponse,
  DashboardSuccessResponse,
} from '@/types/dashboard'

class DashboardRequestError extends Error {
  constructor(
    message: string,
    readonly code: TrackingErrorCode,
  ) {
    super(message)
    this.name = 'DashboardRequestError'
  }
}

async function requestDashboard(signal: AbortSignal) {
  const response = await fetch('/api/dashboard', {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
    signal,
  })
  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new DashboardRequestError(
      'O painel recebeu uma resposta inesperada. Tente novamente.',
      'INVALID_RESPONSE',
    )
  }

  if (!response.ok) {
    const errorResponse = payload as DashboardErrorResponse
    throw new DashboardRequestError(
      errorResponse.error?.message ??
        'Não foi possível carregar o painel. Tente novamente.',
      errorResponse.error?.code ?? 'INVALID_RESPONSE',
    )
  }

  const successResponse = payload as DashboardSuccessResponse

  if (!successResponse.data) {
    throw new DashboardRequestError(
      'O painel recebeu uma resposta inesperada. Tente novamente.',
      'INVALID_RESPONSE',
    )
  }

  return successResponse.data
}

function getErrorCode(error: unknown): TrackingErrorCode {
  return error instanceof DashboardRequestError ? error.code : 'NETWORK_ERROR'
}

function trackDashboardLoaded(
  data: DashboardSuccessResponse['data'],
  loadType: DashboardLoadType,
) {
  trackEventOnce(`dashboard-loaded:${data.updatedAt}`, 'dashboard_loaded', {
    item_count: data.metrics.itemCount,
    load_type: loadType,
    net_revenue: data.metrics.netRevenue,
    order_count: data.metrics.orderCount,
    source: data.source,
  })
}

function getErrorMessage(error: unknown): string {
  return error instanceof DashboardRequestError
    ? error.message
    : 'Não foi possível carregar o painel. Tente novamente.'
}

export function Dashboard() {
  const [data, setData] = useState<DashboardSuccessResponse['data']>()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const activeRequest = useRef<AbortController | null>(null)

  const refreshDashboard = useCallback(
    async (loadType: 'refresh' | 'retry') => {
      activeRequest.current?.abort()
      const controller = new AbortController()
      activeRequest.current = controller

      setIsRefreshing(true)
      setErrorMessage(undefined)

      try {
        const dashboardData = await requestDashboard(controller.signal)
        setData(dashboardData)
        trackDashboardLoaded(dashboardData, loadType)
      } catch (error) {
        if (controller.signal.aborted) return

        setData(undefined)
        setErrorMessage(getErrorMessage(error))
        trackEvent('dashboard_load_failed', {
          error_code: getErrorCode(error),
          load_type: loadType,
        })
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
          setIsRefreshing(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    const controller = new AbortController()
    activeRequest.current = controller

    void requestDashboard(controller.signal)
      .then((dashboardData) => {
        if (controller.signal.aborted) return
        setData(dashboardData)
        trackDashboardLoaded(dashboardData, 'initial')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setErrorMessage(getErrorMessage(error))
        trackEvent('dashboard_load_failed', {
          error_code: getErrorCode(error),
          load_type: 'initial',
        })
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  return (
    <div className="min-h-screen">
      <DashboardHeader
        isRefreshing={isRefreshing}
        onRefresh={() => {
          trackEvent('dashboard_refresh_clicked', {
            last_updated_at: data?.updatedAt ?? null,
          })
          void refreshDashboard('refresh')
        }}
        updatedAt={data?.updatedAt}
      />

      <main className="mx-auto w-full max-w-[1320px] px-4 py-9 sm:px-6 lg:px-8 lg:py-14">
        {isLoading ? <DashboardSkeleton /> : null}
        {!isLoading && errorMessage ? (
          <DashboardErrorState
            message={errorMessage}
            onRetry={() => void refreshDashboard('retry')}
          />
        ) : null}
        {!isLoading && data?.metrics.orderCount === 0 ? (
          <DashboardEmptyState />
        ) : null}
        {!isLoading && data && data.metrics.orderCount > 0 ? (
          <div className="dashboard-enter space-y-10 lg:space-y-14">
            <MetricsGrid metrics={data.metrics} />
            <TopProducts products={data.topProducts} />
          </div>
        ) : null}
      </main>

      <footer className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-2 px-4 pb-8 text-[11px] text-[var(--slate)] sm:px-6 lg:px-8">
        <p>Dados simulados · Nenhum dado pessoal processado</p>
        <p className="font-mono">DummyJSON / carts · USD</p>
      </footer>
    </div>
  )
}
