// src/app/api/doctors/[id]/route.js
import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET(req, { params }) {
  try {
    const { id } = params
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { hospital: true, user: true },
    })

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
    }

    return NextResponse.json(doctor)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener el doctor' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  // → sólo admin
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  let payload
  try { payload = jwt.verify(token, SECRET) } catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }
  if (payload.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })

  const { id } = params
  const { hospital, user } = await req.json()
  const updated = await prisma.doctor.update({
    where: { id },
    include: { hospital: true, user: true }
  })
  return NextResponse.json(updated)
}

export async function DELETE(req, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try { payload = jwt.verify(token, SECRET) }
  catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }

  if (payload.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  await prisma.doctor.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Doctor eliminado' })
}