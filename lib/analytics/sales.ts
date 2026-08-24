import type {
  DashboardMetrics,
  NormalizedOrder,
  TopProduct,
} from '@/types/dashboard'

const DEFAULT_TOP_PRODUCT_LIMIT = 5

function toNonNegativeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : 0
}

function toNonNegativeInteger(value: unknown): number {
  return Math.floor(toNonNegativeNumber(value))
}

function round(value: number, decimalPlaces = 2): number {
  const factor = 10 ** decimalPlaces
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function sumGrossRevenue(orders: readonly NormalizedOrder[]): number {
  return round(
    orders.reduce(
      (total, order) => total + toNonNegativeNumber(order?.grossRevenue),
      0,
    ),
  )
}

export function sumNetRevenue(orders: readonly NormalizedOrder[]): number {
  return round(
    orders.reduce(
      (total, order) => total + toNonNegativeNumber(order?.netRevenue),
      0,
    ),
  )
}

export function countItems(orders: readonly NormalizedOrder[]): number {
  return orders.reduce(
    (total, order) => total + toNonNegativeInteger(order?.totalQuantity),
    0,
  )
}

export function calculateAverageOrderValue(
  netRevenue: number,
  orderCount: number,
): number {
  const validRevenue = toNonNegativeNumber(netRevenue)
  const validOrderCount = toNonNegativeInteger(orderCount)

  return validOrderCount > 0 ? round(validRevenue / validOrderCount) : 0
}

export function calculateDiscountPercentage(
  grossRevenue: number,
  discountAmount: number,
): number {
  const validGrossRevenue = toNonNegativeNumber(grossRevenue)
  const validDiscountAmount = toNonNegativeNumber(discountAmount)

  return validGrossRevenue > 0
    ? round((validDiscountAmount / validGrossRevenue) * 100)
    : 0
}

export function calculateTopProducts(
  orders: readonly NormalizedOrder[],
  limit = DEFAULT_TOP_PRODUCT_LIMIT,
): TopProduct[] {
  const productsById = new Map<number, TopProduct>()

  for (const order of orders) {
    if (!Array.isArray(order?.products)) continue

    for (const product of order.products) {
      if (
        !Number.isInteger(product?.id) ||
        product.id <= 0 ||
        typeof product.title !== 'string' ||
        product.title.trim().length === 0
      ) {
        continue
      }

      const currentProduct = productsById.get(product.id)
      const revenue = toNonNegativeNumber(product.netRevenue)
      const quantity = toNonNegativeInteger(product.quantity)

      productsById.set(product.id, {
        id: product.id,
        title: product.title.trim(),
        revenue: (currentProduct?.revenue ?? 0) + revenue,
        quantity: (currentProduct?.quantity ?? 0) + quantity,
      })
    }
  }

  return [...productsById.values()]
    .map((product) => ({ ...product, revenue: round(product.revenue) }))
    .filter((product) => product.revenue > 0)
    .sort(
      (firstProduct, secondProduct) =>
        secondProduct.revenue - firstProduct.revenue ||
        secondProduct.quantity - firstProduct.quantity ||
        firstProduct.title.localeCompare(secondProduct.title),
    )
    .slice(0, Math.max(0, toNonNegativeInteger(limit)))
}

export function calculateSalesMetrics(
  orders: readonly NormalizedOrder[],
): DashboardMetrics {
  const grossRevenue = sumGrossRevenue(orders)
  const netRevenue = sumNetRevenue(orders)
  const discountAmount = round(Math.max(0, grossRevenue - netRevenue))
  const orderCount = orders.length

  return {
    grossRevenue,
    netRevenue,
    discountAmount,
    discountPercentage: calculateDiscountPercentage(
      grossRevenue,
      discountAmount,
    ),
    averageOrderValue: calculateAverageOrderValue(netRevenue, orderCount),
    orderCount,
    itemCount: countItems(orders),
  }
}
