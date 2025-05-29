import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'  // ajusta ruta si es necesario

const SECRET = process.env.JWT_SECRET

export async function GET() {
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
  const { userId, rol } = payload

  let citas

  if (rol === 'admin') {
    // Admin ve todas
    citas = await prisma.appointment.findMany({
      include: {
        paciente: { select: { id: true, nombre: true, email: true } },
        doctor:   { include: { user: { select: { nombre: true } } } }
      },
      orderBy: { fecha: 'asc' }
    })

  } else if (rol === 'doctor') {
    // Doctor ve solo las suyas
    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
    }
    citas = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        paciente: { select: { id: true, nombre: true, email: true } },
      },
      orderBy: { fecha: 'asc' }
    })

  } else if (rol === 'paciente') {
    // Paciente ve solo las suyas
    citas = await prisma.appointment.findMany({
      where: { pacienteId: userId },
      include: {
        doctor: { include: { user: { select: { nombre: true } } } },
      },
      orderBy: { fecha: 'asc' }
    })

  } else {
    return NextResponse.json({ error: 'Rol no permitido' }, { status: 403 })
  }
  
  return NextResponse.json(citas)
}


export async function POST(req) {
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

  const { userId, rol } = payload
  
  const body = await req.json()
  
  const { pacienteId: bodyPacienteId, doctorId: bodyDoctorId, fecha, motivo } = body

  // Validación común
  if (!fecha) {
    return NextResponse.json({ error: 'La fecha es requerida' }, { status: 400 })
  }

  let data = { fecha: new Date(fecha), motivo, estado: 'pendiente' }

  if (rol === 'admin') {
    // Admin puede asignar ambos
    if (!bodyPacienteId || !bodyDoctorId) {
      console.log(bodyDoctorId)
      return NextResponse.json({ error: 'Paciente y Doctor son requeridos' }, { status: 400 })
    }
    data.pacienteId = bodyPacienteId
    data.doctorId   = bodyDoctorId

  } else if (rol === 'paciente') {
    // Paciente crea su propia cita
    if (!bodyDoctorId) {
      return NextResponse.json({ error: 'Doctor es requerido' }, { status: 400 })
    }
    data.pacienteId = userId
    data.doctorId   = bodyDoctorId

  } else if (rol === 'doctor') {
    // Doctor crea cita para un paciente
    if (!bodyPacienteId) {
      return NextResponse.json({ error: 'Paciente es requerido' }, { status: 400 })
    }
    // buscamos doctor.id
    const doctor = await prisma.doctor.findUnique({ where: { userId } })
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
    }
    data.pacienteId = bodyPacienteId
    data.doctorId   = doctor.id

  } else {
    return NextResponse.json({ error: 'Rol no permitido para crear citas' }, { status: 403 })
  }

  try {
    const nuevaCita = await prisma.appointment.create({ data })
    console.log(nuevaCita)
    return NextResponse.json(nuevaCita, { status: 201 })
  } catch (err) {
    console.error('Error creando cita:', err)
    return NextResponse.json({ error: 'Error interno creando cita' }, { status: 500 })
  }
}
