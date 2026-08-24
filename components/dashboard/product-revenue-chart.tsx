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
  return value.length > 15 ? `${value.slice(0, 14)}…` : value
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
            stroke="#d5e1e3"
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
            contentStyle={{
              background: '#102f36',
              border: 0,
              borderRadius: 10,
              color: '#fff',
              fontSize: 12,
            }}
            cursor={{ fill: '#edf5f4' }}
            formatter={(value) => [
              formatCurrency(Number(value)),
              'Receita líquida',
            ]}
            itemStyle={{ color: '#72d4cf' }}
            labelStyle={{ color: '#fff', marginBottom: 4 }}
          />
          <Bar
            dataKey="revenue"
            fill="#0e7775"
            maxBarSize={34}
            name="Receita líquida"
            radius={[0, 7, 7, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
