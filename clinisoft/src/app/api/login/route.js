// src/app/api/login/route.js

import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '@/app/api/lib/prisma'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET

export async function POST(request) {
  const { email, password } = await request.json()

  // 1) Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ error: 'Correo no registrado' }, { status: 400 })
  }

  // 2) Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 400 })
  }

  // 3) Generar JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email, rol: user.rol },
    SECRET,
    { expiresIn: '1d' }
  )

  // 4) Obtener el store de cookies y luego setear
  const cookieStore = await cookies()
  cookieStore.set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 día
  })

  // 5) Responder sin exponer password
  return NextResponse.json({
    message: 'Login exitoso',
    user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
  })
}
