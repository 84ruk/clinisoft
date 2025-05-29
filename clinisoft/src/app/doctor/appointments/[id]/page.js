// src/app/doctor/appointments/[id]/page.jsx
import { redirect } from 'next/navigation'
import prisma from '@/app/api/lib/prisma'
import AppointmentDetailForm from '@/app/components/AppointmentDetailForm'
import MedicalHistory from '@/app/components/MedicalHistory'

export default async function AppointmentDetailPage({ params }) {
  const { id } = await params

  const cita = await prisma.appointment.findUnique({
    where: { id },
    include: {
      paciente: { select: { id: true, nombre: true } },
      doctor: {
        select: {
          user: { select: { nombre: true } },
          especialidad: true,
          userId: true
        }
      }
    }
  })

  if (!cita) redirect('/doctor/appointments')

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold">
          Cita: {new Date(cita.fecha).toLocaleString()}
        </h2>
        <p><strong>Paciente:</strong> {cita.paciente.nombre}</p>
        <p>
          <strong>Doctor:</strong> {cita.doctor.user.nombre} — <em>{cita.doctor.especialidad}</em>
        </p>
        {cita.motivo && <p><strong>Motivo:</strong> {cita.motivo}</p>}
      </div>

      {/* Aquí renderizamos el historial MED en el cliente */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Historial Médico</h3>
        <MedicalHistory pacienteId={cita.paciente.id} />
      </div>

      {/* Formulario para agregar antecedente */}
      <AppointmentDetailForm pacienteId={cita.paciente.id} doctorId={cita.doctor.userId} />
    </div>
  )
}
