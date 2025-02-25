import { HttpForbiddenError } from '@/errors'
import prisma from '@/lib/prisma'
import handleError from '@/utils/handle-error'
import token from '@/utils/token'
import { HttpStatusCode } from 'axios'
import { hash } from 'bcrypt'
import { NextResponse } from 'next/server'

interface ResetTokenPayload {
  id: number;
  email: string;
  username: string;
  purpose: string;
}

export async function POST(request: Request) {
  try {
    const { token: resetToken, password } = await request.json()

    // Verify the token
    const payload = token.access.verify(resetToken) as ResetTokenPayload

    // Check if this is a password reset token
    if (payload.purpose !== 'password-reset') {
      throw new HttpForbiddenError('Invalid reset token')
    }

    // Hash the new password
    const hashedPassword = await hash(password, 10)

    // Update user password
    await prisma.user.update({
      where: { id: payload.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json(
      {
        message: 'Password successfully reset',
        success: true,
        error: null,
        redirectTo: '/auth/login'
      },
      {
        status: HttpStatusCode.Ok,
      }
    )
  } catch (error) {
    return handleError(error)
  }
} 