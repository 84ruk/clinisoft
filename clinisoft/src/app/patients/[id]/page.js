// src/app/patients/[id]/page.jsx
import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/app/api/lib/prisma'

export default async function PatientPage({ params }) {
  const { id } = params

  // 1. Obtener datos del paciente
  const patient = await prisma.user.findUnique({
    where: { id },
    select: { id: true, nombre: true, email: true, rol: true }
  })

  if (!patient) {
    // Si no existe, redirigir al dashboard
    redirect('/dashboard')
  }

  // 2. Obtener antecedentes médicos
  const records = await prisma.medicalRecord.findMany({
    where: { pacienteId: id },
    orderBy: { fecha: 'desc' }
  })

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      {/* Información del paciente */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Datos del Paciente</h2>
        <p><strong>ID:</strong> {patient.id}</p>
        <p><strong>Nombre:</strong> {patient.nombre}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Rol:</strong> {patient.rol}</p>
        <div className="mt-4">
          <Link href={`/patients/${id}/edit`} className="text-green-600 hover:underline">
            Editar Paciente
          </Link>
        </div>
      </section>

      {/* Historial Médico */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Antecedentes Médicos</h2>
        {records.length === 0 ? (
          <p className="text-gray-600">No hay registros de antecedentes.</p>
        ) : (
          <ul className="space-y-4">
            {records.map((rec) => (
              <li key={rec.id} className="border-b pb-4">
                <p><strong>Fecha:</strong> {new Date(rec.fecha).toLocaleString()}</p>
                {rec.motivo && <p><strong>Motivo:</strong> {rec.motivo}</p>}
                {rec.diagnostico && <p><strong>Diagnóstico:</strong> {rec.diagnostico}</p>}
                {rec.receta && <p><strong>Receta:</strong> {rec.receta}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
