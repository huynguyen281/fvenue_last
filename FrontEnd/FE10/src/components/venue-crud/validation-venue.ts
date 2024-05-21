import * as z from 'zod'

export const venueSchema = z.object({
  Name: z.string().min(3),
  // description: z.string().min(10),
})

export const venueUpdateSchema = z.object({
  Name: z.string().min(3),
  // description: z.string().min(10),
  // status: z.enum(['ENABLE', 'DISABLE']),
})
