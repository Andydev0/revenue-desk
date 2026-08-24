import {
  calculateSalesMetrics,
  calculateTopProducts,
} from '@/lib/analytics/sales'
import { fetchNormalizedCarts } from '@/lib/dummyjson/client'
import {
  DummyJsonTimeoutError,
  DummyJsonUnavailableError,
  DummyJsonValidationError,
} from '@/lib/dummyjson/errors'
import type {
  DashboardErrorCode,
  DashboardErrorResponse,
  DashboardSuccessResponse,
} from '@/types/dashboard'

interface SanitizedError {
  code: DashboardErrorCode
  message: string
  status: number
}

const RESPONSE_HEADERS = {
  'Cache-Control': 'private, no-store',
}

function sanitizeError(error: unknown): SanitizedError {
  if (error instanceof DummyJsonTimeoutError) {
    return {
      code: 'UPSTREAM_TIMEOUT',
      message: 'A fonte de dados demorou para responder. Tente novamente.',
      status: 504,
    }
  }

  if (error instanceof DummyJsonUnavailableError) {
    return {
      code: 'UPSTREAM_UNAVAILABLE',
      message: 'Não foi possível consultar a fonte de dados. Tente novamente.',
      status: 502,
    }
  }

  if (error instanceof DummyJsonValidationError) {
    return {
      code: 'INVALID_UPSTREAM_RESPONSE',
      message:
        'A fonte de dados retornou informações inválidas. Tente novamente mais tarde.',
      status: 502,
    }
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'Não foi possível carregar o painel. Tente novamente.',
    status: 500,
  }
}

export async function GET() {
  try {
    const orders = await fetchNormalizedCarts()
    const response: DashboardSuccessResponse = {
      data: {
        metrics: calculateSalesMetrics(orders),
        topProducts: calculateTopProducts(orders),
        updatedAt: new Date().toISOString(),
        source: 'DummyJSON',
      },
    }

    return Response.json(response, { headers: RESPONSE_HEADERS })
  } catch (error) {
    const sanitizedError = sanitizeError(error)
    const response: DashboardErrorResponse = {
      error: {
        code: sanitizedError.code,
        message: sanitizedError.message,
      },
    }

    return Response.json(response, {
      headers: RESPONSE_HEADERS,
      status: sanitizedError.status,
    })
  }
}
