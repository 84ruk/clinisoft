// src/app/api/patients/[id]/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/app/api/lib/prisma'

const SECRET = process.env.JWT_SECRET

// GET /api/patients/:id
export async function GET(req, { params }) {
  const { id } = params
  const patient = await prisma.user.findUnique({
    where: { id },
    select: { id: true, nombre: true, email: true }
  })
  if (!patient) return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
  return NextResponse.json(patient)
}

// PUT /api/patients/:id
export async function PUT(req, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let payload
  try { payload = jwt.verify(token, SECRET) }
  catch { return NextResponse.json({ error: 'Token inválido' }, { status: 401 }) }

  // Sólo admin o el mismo paciente
  if (payload.rol !== 'admin' && payload.userId !== params.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { nombre, email } = await req.json()
  const updated = await prisma.user.update({
    where: { id: params.id },
    data: { nombre, email }
  })
  return NextResponse.json(updated)
}


export async function DELETE(request, { params }) {
  const { id } = params;        

  try {

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: 'Paciente eliminado' });
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    return NextResponse.json(
      { error: 'No se pudo eliminar el paciente' },
      { status: 500 }
    );
  }
}