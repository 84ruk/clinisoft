'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAppointmentPage() {
  const [form, setForm] = useState({ fecha: '', motivo: '', doctorId: '' });
  const [doctores, setDoctores] = useState([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDoctores = async () => {
      const res = await fetch('/api/doctors');
      const data = await res.json();
      if (res.ok) setDoctores(data);
      
    };
    fetchDoctores();
    
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/appointments');
    } else {
      setMessage(data.error || 'Error al crear cita');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Agendar Nueva Cita</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
           
          <label className="block text-gray-700 mb-1">Fecha y hora</label>
          <input
            type="datetime-local"
            name="fecha"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Motivo</label>
          <input
            name="motivo"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Doctor</label>
          <select
            name="doctorId"
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            >
            <option value="">Selecciona un doctor</option>

            {doctores.flat().map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                Doctor ID: {doctor.user.nombre}
                </option>
            ))}
            </select>

        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
          Agendar
        </button>
        {message && <p className="text-red-500 text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
