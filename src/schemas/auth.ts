import supabase from '@/supabase'
import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
})

export const profileSetupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters long'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' }),
})

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email({ message: 'Please enter a valid email address' })
})

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and numbers'),
  confirmPassword: z
    .string()
    .min(1, 'Password confirmation is required')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

const verifyOTP = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user)
    throw new Error(error?.message || "Session not found");

  const { data: userProfileData, error: userProfileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .maybeSingle();
  if (userProfileError && userProfileError.code !== "PGRST116") {
    throw new Error(userProfileError?.message || "User not found");
  }

  // If no profile exists, return user data with needsProfile flag
  if (!userProfileData) {
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        name: "",
        user_id: "",
        is_active: true,
      },
      success: true,
      message: "User authenticated but profile needs to be created",
      needsProfile: true,
    };
  }

  // Check if user is active
  if (!userProfileData.is_active) {
    // Sign out the user immediately if they are inactive
    await supabase.auth.signOut();
    throw new Error(
      "Your account has been deactivated. Please contact support."
    );
  }

  return {
    user: userProfileData,
    success: true,
    message: "Login successful",
    needsProfile: false,
  };
};  

export type LoginFormData = z.infer<typeof loginSchema>
export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
