import { z } from 'zod'

const signup = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  plan: z.number(),
})

const login = z.object({
  usernameOrEmail: z.string(),
  password: z.string(),
})

const changePassword = z.object({
  password: z.string(),
})

const editProfile = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
})

export type SignupSchema = z.infer<typeof signup>;
export type LoginSchema = z.infer<typeof login>;
export type ChangePasswordSchema = z.infer<typeof changePassword>;
export type EditProfileSchema = z.infer<typeof editProfile>;

const authValidator = {
  signup,
  login,
  changePassword,
  editProfile
}

export default authValidator

