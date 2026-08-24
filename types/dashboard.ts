export interface NormalizedProduct {
  id: number
  title: string
  grossRevenue: number
  netRevenue: number
  quantity: number
}

export interface NormalizedOrder {
  id: number
  grossRevenue: number
  netRevenue: number
  totalQuantity: number
  products: NormalizedProduct[]
}

export interface TopProduct {
  id: number
  title: string
  revenue: number
  quantity: number
}

export interface DashboardMetrics {
  grossRevenue: number
  netRevenue: number
  discountAmount: number
  discountPercentage: number
  averageOrderValue: number
  orderCount: number
  itemCount: number
}

export interface DashboardData {
  metrics: DashboardMetrics
  topProducts: TopProduct[]
  updatedAt: string
  source: 'DummyJSON'
}

export interface DashboardSuccessResponse {
  data: DashboardData
}

export type DashboardErrorCode =
  | 'UPSTREAM_TIMEOUT'
  | 'UPSTREAM_UNAVAILABLE'
  | 'INVALID_UPSTREAM_RESPONSE'
  | 'INTERNAL_ERROR'

export interface DashboardErrorResponse {
  error: {
    code: DashboardErrorCode
    message: string
  }
}
