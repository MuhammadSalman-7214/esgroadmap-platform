import prisma from '@/lib/prisma'
import authorizer from '@/server/middleware/authorizer'
import authValidator, {
  ChangePasswordSchema,
} from '@/server/validators/auth.validator'
import handleError from '@/utils/handle-error'
import token from '@/utils/token'
import validate from '@/utils/validate'
import { HttpStatusCode } from 'axios'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { user } = await authorizer()
    const body = await validate<ChangePasswordSchema>(
      authValidator.changePassword,
      json,
    )
    const hashedPassword = await hash(body.password, 10)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        plan: true,
        role: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    })


    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    const access = token.access.sign(payload)

    return NextResponse.json(
      { data: updatedUser, error: null, success: true },
      {
        status: HttpStatusCode.Ok,
        headers: {
          'Set-Cookie': `token=${access.token};Max-Age=${access.maxAge}; Path=/; SameSite=None; Secure`,
        },
      },
    )
  } catch (error) {
    return handleError(error)
  }
}
