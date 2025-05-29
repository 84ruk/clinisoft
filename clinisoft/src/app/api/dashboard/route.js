// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';


import prisma from '../lib/prisma';
const SECRET = process.env.JWT_SECRET;

export async function GET() {
  // 1) Esperamos la instancia de cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // 2) Verificamos el token
    const { userId } = jwt.verify(token, SECRET);

    // 3) Consultamos los datos del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, nombre: true, email: true, rol: true }
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
