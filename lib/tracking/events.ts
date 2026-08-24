import type { DashboardErrorCode } from '@/types/dashboard'

export type DashboardLoadType = 'initial' | 'refresh' | 'retry'
export type TrackingErrorCode =
  DashboardErrorCode | 'INVALID_RESPONSE' | 'NETWORK_ERROR'

interface TrackingEventMap {
  dashboard_loaded: {
    item_count: number
    load_type: DashboardLoadType
    net_revenue: number
    order_count: number
    source: 'DummyJSON'
  }
  dashboard_refresh_clicked: {
    last_updated_at: string | null
  }
  dashboard_load_failed: {
    error_code: TrackingErrorCode
    load_type: DashboardLoadType
  }
  top_product_viewed: {
    position: number
    product_id: number
    product_revenue: number
  }
}

export type TrackingEventName = keyof TrackingEventMap
export type DataLayerEvent = {
  [EventName in TrackingEventName]: {
    event: EventName
  } & TrackingEventMap[EventName]
}[TrackingEventName]

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[]
  }
}

const trackedEventKeys = new Set<string>()

export function trackEvent<EventName extends TrackingEventName>(
  event: EventName,
  properties: TrackingEventMap[EventName],
): void {
  if (typeof window === 'undefined') return

  window.dataLayer ??= []
  window.dataLayer.push({ event, ...properties } as DataLayerEvent)
}

export function trackEventOnce<EventName extends TrackingEventName>(
  deduplicationKey: string,
  event: EventName,
  properties: TrackingEventMap[EventName],
): void {
  if (trackedEventKeys.has(deduplicationKey)) return

  trackedEventKeys.add(deduplicationKey)
  trackEvent(event, properties)
}
