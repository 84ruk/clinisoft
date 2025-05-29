import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export async function POST(request) {
  const { nombre, email, password } = await request.json(); // <-- sin rol

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'El correo ya está registrado' }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: 'paciente', // ← o el rol por defecto que tú decidas
      },
    });

    return new Response(JSON.stringify({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        email: newUser.email,
        rol: newUser.rol,
      }
    }), {
      status: 201,
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error al registrar usuario' }), {
      status: 500,
    });
  }
}
