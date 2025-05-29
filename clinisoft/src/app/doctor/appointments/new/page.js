// src/app/doctor/appointments/new/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAppointmentForm() {
  const [pacientes, setPacientes] = useState([])
  const [doctores, setDoctores]   = useState([])
  const [form, setForm] = useState({
    pacienteId: '',
    doctorId: '',
    fecha: '',
    motivo: ''
  })
  const [msg, setMsg] = useState('')
  const router = useRouter()

  // Carga pacientes y doctores
  useEffect(() => {
    fetch('/api/patients')
      .then(r => r.json())
      .then(data => setPacientes(data))
      .catch(console.error)

    fetch('/api/doctors')
      .then(r => r.json())
      .then(data => setDoctores(data))
      .catch(console.error)
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMsg('')
    // Validación simple
    if (!form.pacienteId || !form.doctorId || !form.fecha) {
      setMsg('Selecciona paciente, doctor y fecha.')
      return
    }

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al agendar')
      router.push('/doctor/appointments')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-xl font-bold mb-4">Agendar Nueva Cita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Paciente */}
        <div>
          <label className="block mb-1">Paciente</label>
          <select
            name="pacienteId"
            value={form.pacienteId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">— Selecciona un paciente —</option>
            {pacientes.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="block mb-1">Doctor</label>
          <select
            name="doctorId"
            value={form.doctorId}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">— Selecciona un doctor —</option>
            {doctores.map(d => (
              <option key={d.id} value={d.id}>
                Dr. {d.user.nombre} ({d.especialidad})
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1">Fecha y hora</label>
          <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Motivo */}
        <div>
          <label className="block mb-1">Motivo</label>
          <textarea
            name="motivo"
            value={form.motivo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Agendar Cita
        </button>

        {msg && <p className="text-red-500 mt-2">{msg}</p>}
      </form>
    </div>
  )
}
