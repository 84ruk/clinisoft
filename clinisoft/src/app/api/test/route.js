// src/app/api/test/route.js
import prisma from '@/app/api/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
