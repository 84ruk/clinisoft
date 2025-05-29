// src/app/api/doctors/assignDoctor/route.js
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req) {
  try {
    const body = await req.json()

    const { userId, hospitalId, especialidad, telefono } = body

    // Verificar que el usuario existe y que no es ya un doctor
    const usuario = await prisma.user.findUnique({ where: { id: userId } })
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    if (usuario.rol === 'doctor') {
      return NextResponse.json({ error: 'El usuario ya es un doctor' }, { status: 400 })
    }

    // Cambiar el rol del usuario a 'doctor'
    await prisma.user.update({
      where: { id: userId },
      data: { rol: 'doctor' },
    })

    // Crear un nuevo doctor asociado a un hospital
    const nuevoDoctor = await prisma.doctor.create({
      data: {
        userId,
        hospitalId,
        especialidad,
        telefono,
      },
    })

    return NextResponse.json(nuevoDoctor)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al asignar doctor' }, { status: 500 })
  }
}
