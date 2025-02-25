import env from '@/config/env.config'
import jwt, { JwtPayload } from 'jsonwebtoken'
import convertTime from './convert-time'

const accessToken = {
  sign<T extends object>(data: T) {
    const token = jwt.sign({ data }, env.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY,
    })

    return { token, maxAge: convertTime(env.JWT_ACCESS_TOKEN_EXPIRY, 's') }
  },
  verify<T extends object>(token: string) {
    try {
      const payload = jwt.verify(token, env.JWT_ACCESS_TOKEN_SECRET)
      if (typeof payload !== 'object' || !('data'in payload)) {
        throw new Error('invalid payload');
      }
      return payload.data as T 
    } catch (error) {
      throw error;
    }

  },
}

const token = {
  access: accessToken,
}

export default token
