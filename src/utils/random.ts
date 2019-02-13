import base64url from 'base64url'
import { randomBytes } from 'crypto'

export function randomStringAsBase64Url(size: number) {
  return base64url(randomBytes(size))
}
