// src/app/api/patients/route.js
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'
import prisma from '../lib/prisma';


export async function GET() {
  try {
    const pacientes = await prisma.user.findMany({
      where: { rol: 'paciente' },
      select: { id: true, nombre: true, email: true },
    })
    return NextResponse.json(pacientes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener pacientes' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { nombre, email, password } = await req.json()
    if (!nombre || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verificar email único
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 })
    }

    // Hashear contraseña
    const hashed = await bcrypt.hash(password, 10)

    const nuevoPaciente = await prisma.user.create({
      data: { nombre, email, password: hashed, rol: 'paciente' },
      select: { id: true, nombre: true, email: true, rol: true },
    })

    return NextResponse.json(nuevoPaciente, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear paciente' }, { status: 500 })
  }
}
