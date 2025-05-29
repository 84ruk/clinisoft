// src/app/components/MedicalHistory.jsx
'use client'

import { useState, useEffect } from 'react'

export default function MedicalHistory({ pacienteId }) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/medical-records?pacienteId=${pacienteId}`)
        if (!res.ok) throw new Error((await res.json()).error || 'Error al cargar historial')
        const data = await res.json()
        setRecords(data)
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [pacienteId])

  console.log(records)

  if (loading) return <p>Cargando historial…</p>
  if (error)   return <p className="text-red-500">Error: {error}</p>
  if (records.length === 0) return <p className="text-gray-600">Sin antecedentes.</p>

  return (
    <ul className="space-y-4">
      {records.map(r => (
        <li key={r.id} className="bg-white p-4 rounded shadow">
          <p><strong>Fecha:</strong> {new Date(r.fecha).toLocaleString()}</p>
          <p>
            <strong>Doctor:</strong> {r.doctor.user.nombre} — <em>{r.doctor.especialidad}</em>
          </p>
          {r.motivo      && <p><strong>Motivo:</strong> {r.motivo}</p>}
          {r.diagnostico && <p><strong>Diagnóstico:</strong> {r.diagnostico}</p>}
          {r.receta      && <p><strong>Receta:</strong> {r.receta}</p>}
        </li>
      ))}
    </ul>
  )
}
