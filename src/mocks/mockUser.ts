import { User } from "@prisma/client";

export const createMockUser = () => {
  const mockDate = new Date();
  const mockUser: Omit<User, 'password'> = {
    id: 1,
    email: 'mockuser@example.com',
    username: 'mockuser',
    role: 'user',
    plan: 1,
    isActive: true,
    profileImage: '',
    createdAt: mockDate,
    updatedAt: mockDate,
    deletedAt: null,
    stripeId: 'mock-stripe-id'
  };

  return {
    user: mockUser,
    credentials: {
      id: 1,
      email: 'mockuser@example.com',
      username: 'mockuser',
      role: 'user'
    }
  };
};