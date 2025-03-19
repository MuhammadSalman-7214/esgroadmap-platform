import {
  changePasswordSchema,
  editProfileSchema,
  loginSchema,
  signupSchema,
} from '@/lib/schema';
import {z} from 'zod';
import router from './router';
import {AxiosError} from 'axios';
import {User} from '@prisma/client';

const signup = async (body: z.infer<typeof signupSchema> & {plan: number}) => {
  try {
    const response = await router.public.post('/auth/signup', {
      username: body.username,
      email: body.email,
      password: body.password,
      plan: body.plan,
    });

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Signup failed');
  }
};

const login = async (body: z.infer<typeof loginSchema>) => {
  try {
    const response = await router.public.post('/auth/login', {
      ...body,
    });

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Signup failed');
  }
};

const me = async (accessToken: string) => {
  try {
    const response = await router.public.get(
      'http://localhost:4000/api/auth/me',
      {
        headers: {Authorization: `Bearer ${accessToken}`},
      }
    );

    if (!response.data.success) {
      throw new Error(response?.data?.error ?? '');
    }
    return response.data.data as {
      user: Omit<User, 'password'>;
      credentials: {id: number; email: string; username: string; role: string};
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error?.response?.data?.error);
    }
    throw new Error('Cannot get user data');
  }
};

const changePassword = async (body: z.infer<typeof changePasswordSchema>) => {
  try {
    const response = await router.private.post('/auth/password/change', {
      ...body,
    });

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Something went wrong');
  }
};

const editProfile = async (body: z.infer<typeof editProfileSchema>) => {
  try {
    const response = await router.private.post('/auth/profile', {
      ...body,
    });

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Something went wrong');
  }
};

const logout = async () => {
  try {
    const response = await router.private.get('/auth/logout');

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }
    return response.data.message;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error('logout failed');
  }
};

// Update forgotPassword function
const forgotPassword = async (email: string) => {
  try {
    const response = await router.public.post('/auth/password/forgot', {
      email,
    });

    if (!response.data.success) {
      throw new Error(response.data.error ?? '');
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.error);
    }
    throw new Error('Failed to process password reset request');
  }
};

const auth = {
  signup,
  login,
  me,
  changePassword,
  editProfile,
  logout,
  forgotPassword,
};

export default auth;
