import "./globals.css";
import { cookies } from "next/headers";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // Determinar rol desde el JWT
  let isAdmin = false;
  let isDoctor = false;
  let isPaciente = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const rol = payload.rol || payload.role; // manejar posibles campos
      isAdmin = rol === 'admin';
      isDoctor = rol === 'doctor';
      isPaciente = rol === 'paciente';
    } catch (error) {
      console.error("Token inválido", error);
    }
  }

  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Clinisoft</title>
      </head>
      <body className="bg-blue-100 text-gray-800">
        <header className="bg-blue-200 p-4 shadow">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-blue-700">Clinisoft</h1>
            <nav className="flex space-x-4">
              <a href="/" className="hover:text-blue-700">Inicio</a>

              {/* Mostrar login/register si no hay token */}
              {!token && (
                <>
                  <a href="/register" className="hover:text-blue-700">Registrarse</a>
                  <a href="/login" className="hover:text-blue-700">Iniciar Sesión</a>
                </>
              )}

              {/* Si es admin, mostrar dash */}
              {token && isAdmin && (
               <>
               <a href="/dashboard" className="hover:text-blue-700">Dashboard</a>
               <a href="/doctor/appointments" className="hover:text-blue-700">Panel Doctor</a>
             </>
              )}

              {/* Si es doctor, mostrar panel doctor */}
              {token && isDoctor && (
                <>
                  <a href="/dashboard" className="hover:text-blue-700">Dashboard</a>
                  <a href="/doctor/appointments" className="hover:text-blue-700">Panel Doctor</a>
                </>
                
              )}

              {/* Si es paciente, mostrar citas e historial */}
              {token && isPaciente && (
                <>
                  <a href="/appointments" className="hover:text-blue-700">Citas</a>
                  <a href="/medical-records" className="hover:text-blue-700">Historial</a>
                </>
              )}

              {/* Link de logout si está logueado */}
              {token && (
                <a href="/api/logout" className="text-red-600 hover:text-red-800">Cerrar Sesión</a>
              )}
            </nav>
          </div>
        </header>

        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
