import type { DummyJsonCartsResponse } from '@/lib/dummyjson/schemas'
import type { NormalizedOrder } from '@/types/dashboard'

export function normalizeCarts(
  response: DummyJsonCartsResponse,
): NormalizedOrder[] {
  return response.carts.map((cart) => ({
    id: cart.id,
    grossRevenue: cart.total,
    netRevenue: cart.discountedTotal,
    totalQuantity: cart.totalQuantity,
    products: cart.products.map((product) => ({
      id: product.id,
      title: product.title,
      grossRevenue: product.total,
      netRevenue: product.discountedTotal,
      quantity: product.quantity,
    })),
  }))
}
