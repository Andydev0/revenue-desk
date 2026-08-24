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
import type {
  DashboardErrorResponse,
  DashboardSuccessResponse,
} from '@/types/dashboard'

class DashboardRequestError extends Error {}

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
    )
  }

  if (!response.ok) {
    const errorResponse = payload as DashboardErrorResponse
    throw new DashboardRequestError(
      errorResponse.error?.message ??
        'Não foi possível carregar o painel. Tente novamente.',
    )
  }

  const successResponse = payload as DashboardSuccessResponse

  if (!successResponse.data) {
    throw new DashboardRequestError(
      'O painel recebeu uma resposta inesperada. Tente novamente.',
    )
  }

  return successResponse.data
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

  const refreshDashboard = useCallback(async () => {
    activeRequest.current?.abort()
    const controller = new AbortController()
    activeRequest.current = controller

    setIsRefreshing(true)
    setErrorMessage(undefined)

    try {
      const dashboardData = await requestDashboard(controller.signal)
      setData(dashboardData)
    } catch (error) {
      if (controller.signal.aborted) return

      setData(undefined)
      setErrorMessage(getErrorMessage(error))
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    activeRequest.current = controller

    void requestDashboard(controller.signal)
      .then((dashboardData) => {
        setData(dashboardData)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setErrorMessage(getErrorMessage(error))
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
        onRefresh={() => void refreshDashboard()}
        updatedAt={data?.updatedAt}
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {isLoading ? <DashboardSkeleton /> : null}
        {!isLoading && errorMessage ? (
          <DashboardErrorState
            message={errorMessage}
            onRetry={() => void refreshDashboard()}
          />
        ) : null}
        {!isLoading && data?.metrics.orderCount === 0 ? (
          <DashboardEmptyState />
        ) : null}
        {!isLoading && data && data.metrics.orderCount > 0 ? (
          <div className="space-y-8">
            <MetricsGrid metrics={data.metrics} />
            <TopProducts products={data.topProducts} />
          </div>
        ) : null}
      </main>

      <footer className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-4 pb-8 text-xs text-[var(--muted)] sm:px-6 lg:px-10">
        <p>Ambiente demonstrativo · Nenhum dado pessoal processado</p>
        <p className="font-mono">Fonte: DummyJSON / carts</p>
      </footer>
    </div>
  )
}
