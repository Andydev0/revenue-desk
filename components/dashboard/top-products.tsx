'use client'

import { useEffect, useRef } from 'react'

import { ProductRevenueChart } from '@/components/dashboard/product-revenue-chart'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { trackEventOnce } from '@/lib/tracking/events'
import type { TopProduct } from '@/types/dashboard'

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const topProduct = products[0]

    if (!section || !topProduct) return

    const trackTopProduct = () => {
      trackEventOnce(
        `top-product-viewed:${topProduct.id}`,
        'top_product_viewed',
        {
          position: 1,
          product_id: topProduct.id,
          product_revenue: topProduct.revenue,
        },
      )
    }

    if (!('IntersectionObserver' in window)) {
      trackTopProduct()
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        trackTopProduct()
        observer.disconnect()
      },
      { threshold: 0.45 },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [products])

  return (
    <section
      aria-labelledby="top-products-title"
      className="rounded-[1.75rem] border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-7 lg:p-8"
      ref={sectionRef}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--cobalt)]">
            Concentração do mix
          </p>
          <h2
            className="mt-2 font-display text-2xl font-semibold tracking-[-0.04em] text-[var(--ink)] sm:text-3xl"
            id="top-products-title"
          >
            Produtos que puxam a receita.
          </h2>
          <p className="mt-2 text-sm text-[var(--slate)]">
            Cinco maiores contribuições após descontos.
          </p>
        </div>
        <p className="rounded-full bg-[var(--cobalt-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--cobalt-deep)]">
          Receita líquida
        </p>
      </div>

      <div className="mt-8 grid items-center gap-8 lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)] lg:gap-10">
        <ProductRevenueChart products={products} />
        <ol className="divide-y divide-[var(--line)] lg:border-l lg:border-[var(--line)] lg:pl-8">
          {products.map((product, index) => (
            <li
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 first:pt-0 last:pb-0"
              key={product.id}
            >
              <span
                className={`grid size-7 place-items-center rounded-full font-mono text-[10px] font-semibold ${index === 0 ? 'bg-[var(--cobalt)] text-white' : 'bg-[var(--canvas)] text-[var(--slate)]'}`}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--ink)]">
                  {product.title}
                </p>
                <p className="mt-0.5 text-[11px] text-[var(--slate)]">
                  {formatNumber(product.quantity)} itens
                </p>
              </div>
              <p className="font-mono text-xs font-medium tracking-[-0.03em] text-[var(--ink)] sm:text-sm">
                {formatCurrency(product.revenue)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
