import auth from "@/api/auth";
import { cookies } from "next/headers"
import { createMockUser } from "@/mocks/mockUser";

export const currentUser = async () => {
  'use server'
  if (process.env.BYPASS_AUTH === 'true') {
    return createMockUser();
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