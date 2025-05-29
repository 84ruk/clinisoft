// src/app/api/hospitals/route.js
import { NextResponse } from 'next/server'
import prisma from '../lib/prisma';

export async function GET() {
  try {
    const hospitals = await prisma.hospital.findMany({
      where: {
        NOT: {
          adminId: null,
        },
      },
      include: {
        admin: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json(hospitals)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener hospitales' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { nombre, direccion, adminId } = await req.json()
    if (!nombre || !adminId) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    // Verificar que el usuario admin exista y tenga rol 'admin'
    const admin = await prisma.user.findUnique({ where: { id: adminId } })
    if (!admin) {
      return NextResponse.json({ error: 'Usuario admin no encontrado' }, { status: 404 })
    }
    if (admin.rol !== 'admin') {
      return NextResponse.json({ error: 'El usuario no tiene rol de admin' }, { status: 400 })
    }


    const nuevoHospital = await prisma.hospital.create({
      data: { nombre, direccion, adminId },
    })

    return NextResponse.json(nuevoHospital, { status: 201 })
  } catch (error) {
    console.error(error)
    console.log(error)
    return NextResponse.json({ error: 'Error al crear hospital' }, { status: 500 })
  }
}


