import { ProductRevenueChart } from '@/components/dashboard/product-revenue-chart'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import type { TopProduct } from '@/types/dashboard'

interface TopProductsProps {
  products: TopProduct[]
}

export function TopProducts({ products }: TopProductsProps) {
  return (
    <section
      aria-labelledby="top-products-title"
      className="rounded-2xl border border-[var(--line)] bg-white p-5 sm:p-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--teal)]">
        Mix de produtos
      </p>
      <h2
        className="mt-1 text-xl font-bold tracking-tight text-[var(--navy)]"
        id="top-products-title"
      >
        Produtos com maior receita
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Ranking por receita após descontos.
      </p>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
        <ProductRevenueChart products={products} />
        <ol className="divide-y divide-[var(--line)]">
          {products.map((product, index) => (
            <li
              className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 py-4 first:pt-0 last:pb-0"
              key={product.id}
            >
              <span className="font-mono text-xs font-semibold text-[#88a0a4]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--navy)]">
                  {product.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {formatNumber(product.quantity)} itens
                </p>
              </div>
              <p className="font-mono text-sm font-semibold text-[var(--teal)]">
                {formatCurrency(product.revenue)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
