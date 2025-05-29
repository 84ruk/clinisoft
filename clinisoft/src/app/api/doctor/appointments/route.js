// API para listar citas del doctor autenticado
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '../../lib/prisma'

const SECRET = process.env.JWT_SECRET

export async function GET() {
  try {
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
    
    const doctorUserId = payload.userId

    // Obtener el doctor correspondiente a ese userId
    const doctor = await prisma.doctor.findUnique({
      where: { userId: doctorUserId }
    })
doctorUserId
    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 })
    }

    // Buscar citas del doctor
    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: {
        paciente: {
          select: { id: true, nombre: true, email: true }
        }
      },
      orderBy: { fecha: 'asc' }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error al obtener citas del doctor:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}


export async function POST(req) {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('token')?.value;
  
      if (!token) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }
  
      let payload;
      try {
        payload = jwt.verify(token, SECRET);
      } catch {
        return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
      }
  
      const doctorUserId = payload.userId;
      const doctor = await prisma.doctor.findUnique({ where: { userId: doctorUserId } });
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
      }
  
      const { pacienteId, fecha, motivo } = await req.json();
  
      const nuevaCita = await prisma.appointment.create({
        data: {
          pacienteId,
          doctorId: doctor.id,
          fecha: new Date(fecha),
          motivo,
          estado: 'pendiente',
        },
      });
  
      return NextResponse.json(nuevaCita);
    } catch (error) {
      console.error('Error al crear cita:', error);
      return NextResponse.json({ error: 'Error al crear cita' }, { status: 500 });
    }
  }