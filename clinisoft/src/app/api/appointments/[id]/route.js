import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'  // ajusta ruta si es necesario

const SECRET = process.env.JWT_SECRET

function extractId(req) {
  const parts = new URL(req.url).pathname.split('/')
  return parts.pop()
}

export async function GET(req) {
  const id = extractId(req)
  try {
    const cita = await prisma.appointment.findUnique({
      where: { id },
      include: {
        paciente: { select: { id: true, nombre: true, email: true } },
        doctor:   { include: { user: { select: { nombre: true } } } }
      }
    })
    if (!cita) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
    return NextResponse.json(cita)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error obteniendo cita' }, { status: 500 })
  }
}

export async function PUT(req) {
  const id = extractId(req)
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const { userId, rol } = payload
  const body = await req.json()
  const citaExist = await prisma.appointment.findUnique({ where: { id } })
  if (!citaExist) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })

  // Control de acceso
  if (rol === 'admin') {
    // todo permitido
  } else if (rol === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor || doctor.id !== citaExist.doctorId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  } else if (rol === 'paciente') {
    if (citaExist.pacienteId !== userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
    // Solo permitimos que el paciente solicite cambio de fecha o motivo
    const { fecha, motivo } = body
    body = { ...(fecha && { fecha: new Date(fecha) }), ...(motivo && { motivo }) }
  } else {
    return NextResponse.json({ error: 'Rol no permitido' }, { status: 403 })
  }

  try {
    const update = await prisma.appointment.update({
      where: { id },
      data: body
    })
    return NextResponse.json(update)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error actualizando cita' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const id = extractId(req)
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }

  const { userId, rol } = payload
  const citaExist = await prisma.appointment.findUnique({ where: { id } })
  if (!citaExist) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })

  // Solo admin y doctor pueden eliminar
  if (rol === 'admin') {
    // ok
  } else if (rol === 'doctor') {
    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor || doctor.id !== citaExist.doctorId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }
  } else {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    await prisma.appointment.delete({ where: { id } })
    return NextResponse.json({ message: 'Cita eliminada' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Error eliminando cita' }, { status: 500 })
  }
}
