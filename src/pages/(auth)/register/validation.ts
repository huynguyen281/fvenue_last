import * as z from 'zod'
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/ // 8 characters, 1 uppercase, 1 lowercase, 1 number
export const phoneRegex =
  /(\+\d{1,3}\s?)?((\(\d{3}\)\s?)|(\d{3})(\s|-?))(\d{3}(\s|-?))(\d{4})(\s?(([E|e]xt[:|.|]?)|x|X)(\s?\d+))?/g

export const RegisterSchema = z
  .object({
    Email: z.string().email(),
    PhoneNumber: z.string().regex(phoneRegex, {
      message: 'Invalid phone number',
    }),
    Password: z
      .string()
      .min(8)
      .regex(
        passwordRegex,
        'Password must contain 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special characters',
      ),
    ConfirmPassword: z.string().min(8),
    LastName: z.string(),
    FirstName: z.string(),
    Gender: z.string(),
  })
  .superRefine(({ Password, ConfirmPassword }, ctx) => {
    if (ConfirmPassword !== Password) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })
