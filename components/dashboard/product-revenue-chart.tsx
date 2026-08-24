'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { formatCompactCurrency, formatCurrency } from '@/lib/formatters'
import type { TopProduct } from '@/types/dashboard'

interface ProductRevenueChartProps {
  products: TopProduct[]
}

function truncateLabel(value: string): string {
  if (value.length <= 19) return value

  const shortenedLabel = value.slice(0, 19)
  const lastSpace = shortenedLabel.lastIndexOf(' ')

  return `${shortenedLabel.slice(0, lastSpace > 8 ? lastSpace : 18).trim()}…`
}

export function ProductRevenueChart({ products }: ProductRevenueChartProps) {
  return (
    <div
      aria-label="Gráfico de barras da receita líquida dos cinco principais produtos"
      className="h-[320px] w-full"
      role="img"
    >
      <ResponsiveContainer height="100%" width="100%">
        <BarChart
          accessibilityLayer
          data={products}
          layout="vertical"
          margin={{ bottom: 4, left: 4, right: 24, top: 4 }}
        >
          <CartesianGrid
            horizontal={false}
            stroke="var(--line)"
            strokeDasharray="3 3"
          />
          <XAxis
            axisLine={false}
            dataKey="revenue"
            fontSize={11}
            tickFormatter={formatCompactCurrency}
            tickLine={false}
            tickMargin={10}
            type="number"
          />
          <YAxis
            axisLine={false}
            dataKey="title"
            fontSize={11}
            tickFormatter={truncateLabel}
            tickLine={false}
            tickMargin={8}
            type="category"
            width={108}
          />
          <Tooltip
            content={({ active, payload }) => {
              const product = payload?.[0]?.payload as TopProduct | undefined

              if (!active || !product) return null

              return (
                <div className="rounded-xl bg-[var(--ink)] px-3 py-2.5 text-xs shadow-xl">
                  <p className="font-semibold text-white">{product.title}</p>
                  <p className="mt-1 font-mono text-[var(--cobalt-pale)]">
                    {formatCurrency(product.revenue)} líquidos
                  </p>
                </div>
              )
            }}
            cursor={{ fill: 'var(--cobalt-soft)' }}
          />
          <Bar
            dataKey="revenue"
            fill="var(--cobalt)"
            maxBarSize={34}
            name="Receita líquida"
            radius={[0, 7, 7, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
