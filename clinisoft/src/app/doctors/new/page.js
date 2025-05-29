'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EntitySelect from '@/app/components/EntitySelect';

export default function NewDoctorPage() {
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', hospitalId: '', especialidad: '', telefono: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/doctors');
    } else {
      setMessage(data.error || 'Error al crear doctor');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Crear Nuevo Doctor</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <EntitySelect
          url="/api/patients"
          name="userId"
          label="Usuario"
          value={form.userId}
          onChange={handleChange}
          placeholder="Selecciona un paciente"
        />
        <EntitySelect
          url="/api/hospitals"
          name="hospitalId"
          label="Hospital"
          value={form.hospitalId}
          onChange={handleChange}
          placeholder="Selecciona un hospital"
        />
        <div>
          <label className="block text-gray-700 mb-1">Especialidad</label>
          <input
            name="especialidad"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Teléfono</label>
          <input
            name="telefono"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Crear Doctor
        </button>
        {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
}
