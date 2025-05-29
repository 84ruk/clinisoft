// src/middleware.js
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// Rutas que solo admins pueden acceder
const ADMIN_ONLY = [
  '/admin',
  '/api/doctors',
  '/api/patients',
  '/api/hospitals'
]

// Rutas que admins y doctores pueden acceder
const ADMIN_OR_DOCTOR = [
  '/dashboard',
  '/api/dashboard',
  '/appointments',
  '/api/appointments'
]

// Verifica el token y devuelve { isValid, payload }
async function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    return { isValid: false, payload: null }
  }
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return { isValid: true, payload }
  } catch (err) {
    console.error('JWT Error:', err)
    return { isValid: false, payload: null }
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Define rutas de login/register
  const isAuthPage = pathname === '/login' || pathname === '/register'

  // 1) Verificar token
  const { isValid, payload } = await verifyToken(token)

  // 2) Si va a /login o /register y ya está autenticado, lo mandamos a /dashboard
  if (isAuthPage) {
    return isValid
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next()
  }

  // 3) Para cualquier otra ruta, si el token no es válido, redirigir a /login
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const role = payload.rol

  // 4) Rutas solo admin
  if (ADMIN_ONLY.some(route => pathname.startsWith(route))) {
    return role === 'admin'
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // 5) Rutas admin o doctor
  if (ADMIN_OR_DOCTOR.some(route => pathname.startsWith(route))) {
    return (role === 'admin' || role === 'doctor')
      ? NextResponse.next()
      : NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // 6) Resto de rutas públicas/authenticated
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/api/dashboard/:path*',
    '/admin/:path*',
    '/api/doctors/:path*',
    '/api/patients/:path*',
    '/api/hospitals/:path*',
    '/appointments/:path*',
    '/api/appointments/:path*',
  ],
}
