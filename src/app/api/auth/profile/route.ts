import { HttpConflictError } from '@/errors'
import prisma from '@/lib/prisma'
import authorizer from '@/server/middleware/authorizer'
import authValidator, {
  EditProfileSchema,
} from '@/server/validators/auth.validator'
import handleError from '@/utils/handle-error'
import token from '@/utils/token'
import validate from '@/utils/validate'
import { HttpStatusCode } from 'axios'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { user, payload } = await authorizer()
    const body = await validate<EditProfileSchema>(
      authValidator.editProfile,
      json,
    )

    if (body.username) {
      const user = await prisma.user.findFirst({
        where: { username: body.username },
      })
      if (user && user.username !== payload.username) {
        throw new HttpConflictError('User with this username already exists')
      }
    }

    if (body.email) {
      const user = await prisma.user.findFirst({ where: { email: body.email } })
      if (user && user.email !== payload.email) {
        throw new HttpConflictError('User with this email already exists')
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { ...body },
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

    const newPayload = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
    }

    const access = token.access.sign(newPayload)

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
