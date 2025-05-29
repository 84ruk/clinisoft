'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function HospitalEditPage() {
  const router = useRouter()
  const { id } = useParams()

  const [form, setForm]       = useState({ nombre: '', direccion: '' })
  const [loading, setLoading] = useState(true)
  const [msg, setMsg]         = useState('')

  // 1) Al montar, carga los datos del hospital
  useEffect(() => {
    fetch(`/api/hospitals/${id}`)
      .then(res => res.json())
      .then(h => {
        console.log(h)
        if (!h.error) {
          setForm({
            nombre:    h.nombre,
            direccion: h.direccion || ''
          })
        } else {
          setMsg(h.error)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  // 2) Guardar cambios (PUT)
  const handleSave = async () => {
    const res = await fetch(`/api/hospitals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setMsg(data.error)
    } else {
      router.push('/dashboard')
    }
  }

  // 3) Eliminar (DELETE)
  const handleDelete = async () => {
    if (!confirm('¿Seguro que deseas eliminar este hospital?')) return
    const res = await fetch(`/api/hospitals/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/dashboard')
    } else {
      const err = await res.json()
      setMsg(err.error)
    }
  }

  if (loading) return <p className="p-6 text-center">Cargando hospital…</p>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Hospital</h1>

      {msg && <p className="mb-4 text-red-600">{msg}</p>}

      <div className="mb-4">
        <label className="block mb-1 font-medium">Nombre</label>
        <textarea
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Dirección</label>
        <textarea
          name="direccion"
          value={form.direccion}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
        >
          Guardar cambios
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
