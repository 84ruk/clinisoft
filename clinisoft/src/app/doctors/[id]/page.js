'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function DoctorEditPage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm] = useState({ especialidad: '', telefono: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then(r => r.json())
      .then(d => {
        setForm({ especialidad: d.especialidad, telefono: d.telefono || '' })
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) return setMsg(data.error)
    router.push('/dashboard')
  }

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este doctor?')) return
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' })
    if (res.ok) router.push('/dashboard')
    else {
      const err = await res.json()
      setMsg(err.error)
    }
  }

  if (loading) return <p>Cargando doctor…</p>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Doctor</h1>
      <label className="block mb-1">Especialidad</label>
      <textarea
        name="especialidad"
        value={form.especialidad}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
      />
      <label className="block mb-1">Teléfono</label>
      <textarea
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >Guardar cambios</button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >Eliminar</button>
      </div>
      {msg && <p className="mt-3 text-red-600">{msg}</p>}
    </div>
  )
}
