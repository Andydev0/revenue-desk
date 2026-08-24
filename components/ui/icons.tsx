import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

const baseProps: IconProps = {
  'aria-hidden': true,
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 1.8,
  viewBox: '0 0 24 24',
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20 7v5h-5" />
      <path d="M18.5 16a8 8 0 1 1 .8-7.1L20 12" />
    </svg>
  )
}

export function RevenueIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
      <path d="m3 6 5-3 5 4 7-5" />
    </svg>
  )
}

export function DiscountIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M19 13 13 19 4 10V4h6l9 9Z" />
      <path d="M7.5 7.5h.01M8 16l8-8" />
    </svg>
  )
}

export function OrderIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M6 3h12l2 5-2 13H6L4 8l2-5Z" />
      <path d="M4 8h16M9 12h6" />
    </svg>
  )
}

export function ItemsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 17l9 5 9-5" />
    </svg>
  )
}

export function AlertIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 3 2.5 20h19L12 3Z" />
      <path d="M12 9v4m0 3h.01" />
    </svg>
  )
}
