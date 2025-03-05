import {HttpForbiddenError, HttpNotFoundError} from '@/errors';
import prisma from '@/lib/prisma';
import authValidator, {LoginSchema} from '@/server/validators/auth.validator';
import handleError from '@/utils/handle-error';
import token from '@/utils/token';
import validate from '@/utils/validate';
import {HttpStatusCode} from 'axios';
import {compare} from 'bcrypt';
import {NextResponse} from 'next/server';
export const config = {
  runtime: 'nodejs',
};
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const body = await validate<LoginSchema>(authValidator.login, json);

    const foundUser = await prisma.user.findFirst({
      where: {
        OR: [{email: body.usernameOrEmail}, {username: body.usernameOrEmail}],
      },
    });

    if (!foundUser) {
      throw new HttpForbiddenError('Invalid credentials');
    }

    const isValid = await compare(body.password, foundUser.password);

    if (!isValid) {
      throw new HttpForbiddenError('Invalid credentials');
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role,
    };

    const access = token.access.sign(payload);

    return NextResponse.json(
      {
        data: {
          ...foundUser,
          password: undefined,
        },
        message: `user logged in!`,
        success: true,
        error: null,
      },
      {
        status: HttpStatusCode.Ok,
        headers: {
          'Set-Cookie': `token=${access.token};Max-Age=${access.maxAge}; Path=/; SameSite=None; Secure`,
        },
      }
    );
  } catch (error) {
    return handleError(error);
  }
}
