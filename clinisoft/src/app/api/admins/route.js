// src/app/api/admins/route.js
import { NextResponse } from 'next/server';
import prisma from '../lib/prisma';

export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: { rol: 'admin' },
      select: { id: true, nombre: true, email: true },
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error('Error al obtener admins:', error);
    return NextResponse.json({ error: 'Error al obtener administradores' }, { status: 500 });
  }
}
