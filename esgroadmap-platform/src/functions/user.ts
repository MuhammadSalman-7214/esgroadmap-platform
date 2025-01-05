import auth from "@/api/auth";
import { cookies } from "next/headers"

export const currentUser = async () => {
  'use server'
  if (process.env.BYPASS_AUTH === 'true') {
    return {
      user: {
        id: 1, // Mock user ID
        email: 'mockuser@example.com',
        username: 'mockuser',
        role: 'user', // Or 'admin'
        plan: 1, // Assuming 'plan' is an integer based on your schema
        isActive: true,
        profileImage: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        stripeId: 'mock-stripe-id'
      },
      credentials: {
        id: 1,
        email: 'mockuser@example.com',
        username: 'mockuser',
        role: 'user'
      }
    };
  }
  const accessToken = cookies().get('token')
  if (!accessToken) throw new Error('token not found!');
  return await auth.me(accessToken.value);
}

export const getToken = async () => {
  'use server'
  const accessToken = cookies().get('token')
  if (!accessToken) throw new Error('token not found!');
  return accessToken.value;
}