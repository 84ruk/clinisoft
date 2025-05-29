"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AppointmentDetailForm({ pacienteId, doctorId }) {
  const [form, setForm] = useState({ motivo: '', diagnostico: '', receta: '' })
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    const res = await fetch('/api/medical-records', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pacienteId, doctorId, ...form })
    })
    const data = await res.json()
    if (res.ok) {
      setMsg('Antecedente creado')
      router.refresh()
    } else {
      setMsg(data.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
      <h3 className="text-xl font-semibold">Agregar Antecedente</h3>
      <div>
        <label className="block mb-1">Motivo</label>
        <input name="motivo" onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Diagnóstico</label>
        <input name="diagnostico" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <div>
        <label className="block mb-1">Receta</label>
        <input name="receta" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Guardar</button>
      {msg && <p className="text-green-600 mt-2">{msg}</p>}
    </form>
  )
}
