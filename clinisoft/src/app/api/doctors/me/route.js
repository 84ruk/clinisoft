import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '../../../lib/prisma'

const SECRET = process.env.JWT_SECRET

// GET  /api/doctors/me
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try { payload = jwt.verify(token, SECRET) }
  catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }

  if (payload.rol !== 'doctor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: payload.userId },
    select: {
      id: true,
      especialidad: true,
      telefono: true
    }
  })
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
  }

  return NextResponse.json(doctor)
}

// PUT /api/doctors/me
export async function PUT(req) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try { payload = jwt.verify(token, SECRET) }
  catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }

  if (payload.rol !== 'doctor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Obtén el doctor para tener su ID interno
  const doctor = await prisma.doctor.findUnique({ where: { userId: payload.userId } })
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
  }

  const { especialidad, telefono } = await req.json()
  const updated = await prisma.doctor.update({
    where: { id: doctor.id },
    data: { especialidad, telefono }
  })

  return NextResponse.json(updated)
}
