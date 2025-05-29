// src/app/doctor/appointments/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/appointments')
      .then(r => r.json())
      .then(data => setAppointments(data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando citas…</p>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Mis Citas</h1>
        <button
          onClick={() => router.push('/doctor/appointments/new')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Agendar Cita
        </button>
      </div>

      {appointments.length === 0 ? (
        <p>No tienes citas programadas.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li
              key={appt.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(appt.fecha).toLocaleString()}
                </p>
                <p>
                  <strong>Paciente:</strong> {appt.paciente.nombre}
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(`/doctor/appointments/${appt.id}`)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Ver
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}



/* 'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CrearCitaForm from '@/app/components/CrearCitaForm'

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/doctor/appointments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAppointments(data)
        } else {
          console.error('La respuesta no es un arreglo:', data)
          setAppointments([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error al obtener las citas:', err)
        setError('Error al obtener las citas')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Citas</h1>
        <p className="text-gray-600">Cargando citas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Citas</h1>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Citas</h1>
        <p className="text-gray-600">No tienes citas programadas.</p>
        <CrearCitaForm />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Citas</h1>
      <ul className="space-y-4">
        {appointments.map(appt => (
          <li key={appt.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <p><strong>Fecha:</strong> {new Date(appt.fecha).toLocaleString()}</p>
              <p><strong>Paciente:</strong> {appt.paciente.nombre}</p>
            </div>
            <button
              onClick={() => router.push(`/doctor/appointments/${appt.id}`)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              Ver
            </button>
          </li>
        ))}
      </ul>
      <CrearCitaForm />
    </div>
  )
}
 */