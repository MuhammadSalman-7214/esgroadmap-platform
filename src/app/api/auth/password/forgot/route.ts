import { HttpNotFoundError } from '@/errors'
import prisma from '@/lib/prisma'
import handleError from '@/utils/handle-error'
import token from '@/utils/token'
import { HttpStatusCode } from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

const apiKey = process.env.SENDGRID_API_KEY
console.log('API Key exists:', !!apiKey) // Will log true/false without exposing the key

if (!apiKey) {
  throw new Error('SENDGRID_API_KEY is not defined')
}

sgMail.setApiKey(apiKey)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    const user = await prisma.user.findFirst({
      where: { email },
    })

    if (!user) {
      throw new HttpNotFoundError('User not found')
    }

    // Create token payload similar to login
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      purpose: 'password-reset' // Add purpose to differentiate from login tokens
    }

    // Use the same token utility
    const resetToken = token.access.sign(payload)

    // Create reset link matching your frontend structure
    const resetLink = `${process.env.APP_URL}/auth/lost-password?token=${resetToken.token}`

    // Send email
    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'sivasundari075@gmail.com',
        name: 'ESG Roadmap',
      },
      subject: 'Reset Your Password',
      text: `Click the following link to reset your password: ${resetLink}`,
      html: `
        <p>Click the following link to reset your password:</p>
        <p><a href="${resetLink}">Reset Password</a></p>
      `,
    }

    try {
      await sgMail.send(msg)
    } catch (sendError: any) {
      console.error('SendGrid Error Details:', {
        message: sendError.message,
        response: JSON.stringify(sendError.response?.body, null, 2),
        code: sendError.code,
        errors: JSON.stringify(sendError.response?.body?.errors, null, 2),
        stack: sendError.stack
      })
      
      if (sendError.response?.body?.errors) {
        console.error('Specific errors:', sendError.response.body.errors)
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send email',
          details: sendError.response?.body?.errors,
          message: sendError.message,
          specificError: sendError.response?.body?.errors?.[0]?.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message: 'Password reset link sent',
        success: true,
        error: null,
      },
      {
        status: HttpStatusCode.Ok,
      }
    )
  } catch (error) {
    return handleError(error)
  }
} 