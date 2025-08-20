import { z } from 'zod'

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
})

export const adminUserManagementSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  action: z.enum(['grant_access', 'revoke_access', 'extend_subscription']),
  months: z.number().optional(),
  reason: z.string().optional()
})

export const adminSubscriptionSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  plan: z.string().min(1, 'Plan is required'),
  months: z.number().min(1, 'Months must be at least 1'),
  amount: z.number().min(0, 'Amount must be positive')
})
