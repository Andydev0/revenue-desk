import { z } from 'zod'

const moneySchema = z.number().finite().nonnegative()
const countSchema = z.number().int().nonnegative()

export const dummyJsonProductSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().trim().min(1),
  price: moneySchema,
  quantity: countSchema,
  total: moneySchema,
  discountPercentage: moneySchema,
  discountedTotal: moneySchema,
  thumbnail: z.url(),
})

export const dummyJsonCartSchema = z.object({
  id: z.number().int().positive(),
  products: z.array(dummyJsonProductSchema),
  total: moneySchema,
  discountedTotal: moneySchema,
  userId: z.number().int().positive(),
  totalProducts: countSchema,
  totalQuantity: countSchema,
})

export const dummyJsonCartsResponseSchema = z.object({
  carts: z.array(dummyJsonCartSchema),
  total: countSchema,
  skip: countSchema,
  limit: countSchema,
})

export type DummyJsonCart = z.infer<typeof dummyJsonCartSchema>
export type DummyJsonCartsResponse = z.infer<
  typeof dummyJsonCartsResponseSchema
>
