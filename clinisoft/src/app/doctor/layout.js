// src/app/doctor/layout.js
import Link from 'next/link'

export const metadata = {
  title: 'Panel Doctor – Clinisoft',
}

export default function DoctorLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-6">Doctor</h2>
        <nav className="space-y-3">
          <Link href="/doctor/appointments" className="block hover:text-blue-600">
            Mis Citas
          </Link>
          <Link href="/doctor/appointments/new" className="block hover:text-blue-600">
            Agendar Cita
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-gray-50 p-8">
        {children}
      </main>
    </div>
  )
}
