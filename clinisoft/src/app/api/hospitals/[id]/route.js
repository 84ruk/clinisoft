import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'

const SECRET = process.env.JWT_SECRET

export async function DELETE(req, { params }) {
  // 1) Autenticación
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  // 2) Verificar JWT y rol
  let payload
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
  if (payload.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // 3) Eliminar
  const { id } = params
  const hospital = await prisma.hospital.findUnique({ where: { id } })
  if (!hospital) {
    return NextResponse.json({ error: 'Hospital no encontrado' }, { status: 404 })
  }
  await prisma.hospital.delete({ where: { id } })
  return NextResponse.json({ message: 'Hospital eliminado' })
}

export async function PUT(req, { params }) {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    let payload
    try { payload = jwt.verify(token, SECRET) } catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }
    if (payload.rol !== 'admin') return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  
    const { id } = params
    const { nombre, direccion } = await req.json()
    const updated = await prisma.hospital.update({
      where: { id },
      data: { nombre, direccion }
    })
    return NextResponse.json(updated)
  }

  
export async function GET(req, { params }) {
  // Autenticación: sólo admin
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }
  let payload
  try {
    payload = jwt.verify(token, SECRET)
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
  }
  if (payload.rol == 'paciente' ) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Obtener el hospital por ID
  const { id } = params
  const hospital = await prisma.hospital.findUnique({
    where: { id },
    include: {
      admin: { select: { id: true, nombre: true, email: true } }
    }
  })

  if (!hospital) {
    return NextResponse.json({ error: 'Hospital no encontrado' }, { status: 404 })
  }

  return NextResponse.json(hospital)
}