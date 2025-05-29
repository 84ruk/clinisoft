// src/app/api/doctors/route.js
import { NextResponse } from 'next/server'
import prisma from '../lib/prisma'

export async function GET() {
  try {
    const doctores = await prisma.doctor.findMany({
      include: { hospital: true, user: { select: { id: true, nombre: true, email: true } } },
    })
    return NextResponse.json(doctores)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener los doctores' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { userId, hospitalId, especialidad, telefono } = await req.json()

    console.log('userId:', userId)
    if (!userId || !hospitalId || !especialidad) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verificar que el usuario existe y tiene rol 'doctor'
    const usuario = await prisma.user.findUnique({ where: { id: userId } })
    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Verificar que el hospital exista
    const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId } })
    if (!hospital) {
      return NextResponse.json({ error: 'Hospital no encontrado' }, { status: 404 })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { rol: 'doctor' },
    });


    const nuevoDoctor = await prisma.doctor.create({
      data: { userId, hospitalId, especialidad, telefono },
    })

    return NextResponse.json(nuevoDoctor, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear el doctor' }, { status: 500 })
  }
}

