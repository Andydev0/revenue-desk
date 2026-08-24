import { describe, expect, it } from 'vitest'

import {
  calculateAverageOrderValue,
  calculateDiscountPercentage,
  calculateSalesMetrics,
  calculateTopProducts,
  countItems,
  sumGrossRevenue,
  sumNetRevenue,
} from '@/lib/analytics/sales'
import type { NormalizedOrder } from '@/types/dashboard'

const orders: NormalizedOrder[] = [
  {
    id: 1,
    grossRevenue: 200,
    netRevenue: 170,
    totalQuantity: 3,
    products: [
      {
        id: 10,
        title: 'Tênis Sprint',
        grossRevenue: 100,
        netRevenue: 80,
        quantity: 1,
      },
      {
        id: 20,
        title: 'Mochila Trail',
        grossRevenue: 100,
        netRevenue: 90,
        quantity: 2,
      },
    ],
  },
  {
    id: 2,
    grossRevenue: 100,
    netRevenue: 85,
    totalQuantity: 3,
    products: [
      {
        id: 10,
        title: 'Tênis Sprint',
        grossRevenue: 60,
        netRevenue: 50,
        quantity: 1,
      },
      {
        id: 30,
        title: 'Garrafa Flow',
        grossRevenue: 40,
        netRevenue: 35,
        quantity: 2,
      },
    ],
  },
]

describe('sales analytics', () => {
  it('sums gross and net revenue', () => {
    expect(sumGrossRevenue(orders)).toBe(300)
    expect(sumNetRevenue(orders)).toBe(255)
  })

  it('calculates average order value from net revenue', () => {
    expect(calculateAverageOrderValue(255, 2)).toBe(127.5)
    expect(calculateAverageOrderValue(255, 0)).toBe(0)
  })

  it('calculates the discount percentage over gross revenue', () => {
    expect(calculateDiscountPercentage(300, 45)).toBe(15)
    expect(calculateDiscountPercentage(0, 45)).toBe(0)
  })

  it('counts all sold item quantities', () => {
    expect(countItems(orders)).toBe(6)
  })

  it('aggregates and sorts products by net revenue', () => {
    expect(calculateTopProducts(orders, 2)).toEqual([
      { id: 10, title: 'Tênis Sprint', revenue: 130, quantity: 2 },
      { id: 20, title: 'Mochila Trail', revenue: 90, quantity: 2 },
    ])
  })

  it('returns neutral metrics for an empty order list', () => {
    expect(calculateSalesMetrics([])).toEqual({
      grossRevenue: 0,
      netRevenue: 0,
      discountAmount: 0,
      discountPercentage: 0,
      averageOrderValue: 0,
      orderCount: 0,
      itemCount: 0,
    })
    expect(calculateTopProducts([])).toEqual([])
  })

  it('neutralizes missing and invalid numeric values', () => {
    const invalidOrders = [
      {
        id: 1,
        grossRevenue: Number.NaN,
        netRevenue: -10,
        totalQuantity: Number.POSITIVE_INFINITY,
        products: [
          {
            id: 10,
            title: 'Produto inválido',
            grossRevenue: 20,
            netRevenue: Number.NaN,
            quantity: -1,
          },
        ],
      },
      {
        id: 2,
      },
    ] as unknown as NormalizedOrder[]

    expect(calculateSalesMetrics(invalidOrders)).toEqual({
      grossRevenue: 0,
      netRevenue: 0,
      discountAmount: 0,
      discountPercentage: 0,
      averageOrderValue: 0,
      orderCount: 2,
      itemCount: 0,
    })
    expect(calculateTopProducts(invalidOrders)).toEqual([])
  })

  it('never reports a negative discount when net exceeds gross', () => {
    const inconsistentOrder: NormalizedOrder = {
      id: 1,
      grossRevenue: 100,
      netRevenue: 120,
      totalQuantity: 1,
      products: [],
    }

    expect(calculateSalesMetrics([inconsistentOrder]).discountAmount).toBe(0)
  })
})
