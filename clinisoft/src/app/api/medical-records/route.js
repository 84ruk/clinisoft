// src/app/api/medical-records/route.js
import { NextResponse } from 'next/server'
import prisma from '../lib/prisma'

export async function POST(req) {
  try {
    const { pacienteId, doctorId, motivo, diagnostico, receta } = await req.json()

    // Verificar que el doctor existe
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } })
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
    }

    // Verificar que el paciente existe
    const paciente = await prisma.user.findUnique({ where: { id: pacienteId } })
    if (!paciente) {
      return NextResponse.json({ error: 'Paciente no encontrado' }, { status: 404 })
    }

    // Crear el registro médico
    const nuevoRegistro = await prisma.medicalRecord.create({
      data: {
        pacienteId,
        doctorId,
        motivo,
        diagnostico,
        receta,
      },
    })

    return NextResponse.json(nuevoRegistro)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear el registro médico' }, { status: 500 })
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const pacienteId = searchParams.get('pacienteId')
    if (!pacienteId) {
      return NextResponse.json({ error: 'pacienteId es requerido' }, { status: 400 })
    }

    // 1) Traer los records crudos (sin include)
    const records = await prisma.medicalRecord.findMany({
      where: { pacienteId },
      orderBy: { fecha: 'desc' }
    })

    

    // 2) Enriquecer cada record con doctor + user, si existe
   // 2) Enriquecer cada record con doctor + user, si existe
const enriched = await Promise.all(records.map(async (rec) => {
  // 🔄 buscar por userId, no por id
  const doc = await prisma.doctor.findUnique({
    where: { userId: rec.doctorId },
    include: { user: { select: { nombre: true } } }
  })

  if (!doc) return null

  return {
    ...rec,
    doctor: {
      especialidad: doc.especialidad,
      user: { nombre: doc.user.nombre }
    }
  }
}))

// Luego filtras los null
const filtered = enriched.filter(r => r !== null)


    // 3) Filtrar los nulos (registros sin doctor)

    return NextResponse.json(filtered)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al obtener el historial médico' },
      { status: 500 }
    )
  }
}
