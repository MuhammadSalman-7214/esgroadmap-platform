import { z } from 'zod'

export const signupSchema = z
  .object({
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be string',
      })
      .refine((data) => data !== '', {
        message: 'Username cannot be empty',
      }),
    email: z
      .string({
        required_error: 'Email Address is required',
        invalid_type_error: 'Email Address must be string',
      })
      .email({ message: 'Invalid Email Address' })
      .refine((data) => data !== '', {
        message: 'Email Address cannot be empty',
      }),
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be string',
      })
      .refine((data) => data !== '', {
        message: 'Password cannot be empty',
      }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password must be string',
      })
      .refine((data) => data !== '', {
        message: 'Confirm Password cannot be empty',
      }),
    confirmEmail: z
      .string({
        required_error: 'Confirm Email Address is required',
        invalid_type_error: 'Confirm Email Address must be string',
      })
      .email({ message: 'Invalid Confirm Email Address' })
      .refine((data) => data !== '', {
        message: 'Confirm Email Address cannot be empty',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Path of error
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails don't match",
    path: ['confirmEmail'], // Path of error
  })

export const loginSchema = z.object({
  usernameOrEmail: z
    .string({
      required_error: 'Username Or Email Address is required',
      invalid_type_error: 'Username Or Email Address must be string',
    })
    .refine((data) => data !== '', {
      message: 'Username Or Email Address cannot be empty',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be string',
    })
    .refine((data) => data !== '', {
      message: 'Password cannot be empty',
    }),
})

export const changePasswordSchema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be string',
      })
      .refine((data) => data !== '', {
        message: 'Password cannot be empty',
      }),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password must be string',
      })
      .refine((data) => data !== '', {
        message: 'Confirm Password cannot be empty',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // Path of error
  })

export const editProfileSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be string',
    })
    .refine((data) => data !== '', {
      message: 'Username cannot be empty',
    }),
  email: z
    .string({
      required_error: 'Email Address is required',
      invalid_type_error: 'Email Address must be string',
    })
    .email({ message: 'Invalid Email Address' })
    .refine((data) => data !== '', {
      message: 'Email Address cannot be empty',
    }),
})

export const createTicketSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be string',
    })
    .min(5, { message: 'Title needs to be bigger than or equal to 5 characters' })
    .max(250, { message: 'Title cannot be longer than 250 characters' }),
  description: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be string',
  }).min(10, { message: 'Title needs to be bigger than or equal to 10 characters' })
})
