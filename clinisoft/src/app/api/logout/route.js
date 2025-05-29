// src/app/api/logout/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  const url = new URL('/', request.url) // crea una URL absoluta
  const response = NextResponse.redirect(url)

  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return response
}
