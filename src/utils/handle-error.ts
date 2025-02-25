import { ApiError } from '@/errors'
import { NextResponse } from 'next/server'

const handleError = (error: unknown) => {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, data: null, success: false },
      { status: error.statusCode },
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message, data: null, success: false },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { error: 'Something Went Wrong', data: null, success: false },
    { status: 500 },
  )
}

export default handleError
