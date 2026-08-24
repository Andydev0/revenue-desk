import 'server-only'

import {
  DummyJsonTimeoutError,
  DummyJsonUnavailableError,
  DummyJsonValidationError,
} from '@/lib/dummyjson/errors'
import { normalizeCarts } from '@/lib/dummyjson/normalizers'
import { dummyJsonCartsResponseSchema } from '@/lib/dummyjson/schemas'
import type { NormalizedOrder } from '@/types/dashboard'

const CARTS_URL = 'https://dummyjson.com/carts?limit=0'
const REQUEST_TIMEOUT_MS = 5_000
const REVALIDATE_SECONDS = 300

function isTimeoutError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === 'TimeoutError' || error.name === 'AbortError')
  )
}

export async function fetchNormalizedCarts(): Promise<NormalizedOrder[]> {
  let response: Response

  try {
    response = await fetch(CARTS_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    if (isTimeoutError(error)) {
      throw new DummyJsonTimeoutError()
    }

    throw new DummyJsonUnavailableError()
  }

  if (!response.ok) {
    throw new DummyJsonUnavailableError()
  }

  let payload: unknown

  try {
    payload = await response.json()
  } catch {
    throw new DummyJsonValidationError()
  }

  const parsedPayload = dummyJsonCartsResponseSchema.safeParse(payload)

  if (!parsedPayload.success) {
    throw new DummyJsonValidationError()
  }

  return normalizeCarts(parsedPayload.data)
}
