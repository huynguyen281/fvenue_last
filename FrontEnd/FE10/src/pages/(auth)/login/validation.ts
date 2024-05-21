import * as z from 'zod'

export const LoginSchema = z.object({
  Email: z.string().min(3),
  Password: z.string().min(6),
  Remember: z.boolean(),
})
