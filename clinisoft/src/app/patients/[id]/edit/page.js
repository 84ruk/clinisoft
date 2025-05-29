'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PatientEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm]       = useState({ nombre: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState('');

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setForm({ nombre: data.nombre, email: data.email });
        else setMsg(data.error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) setMsg(data.error);
    else router.push(`/patients/${id}`);
  };

  const handleDelete = async () => {
    if (!confirm('¿Eliminar este paciente?')) return;
    const res = await fetch(`/api/patients/${id}`, { method: 'DELETE' });
    if (res.ok) router.push('/dashboard');
    else {
      const err = await res.json();
      setMsg(err.error);
    }
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Paciente</h1>
      {msg && <p className="mb-4 text-red-600">{msg}</p>}
      <label className="block mb-1">Nombre</label>
      <textarea
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
      />
      <label className="block mb-1">Email</label>
      <textarea
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full border p-2 mb-4"
      />
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Guardar cambios
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
