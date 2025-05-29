'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewHospitalPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', direccion: '', adminId: '' });
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/admins'); // Esta ruta debe devolver los usuarios con rol 'admin'
        const data = await res.json();
        setAdmins(data);
      } catch (error) {
        console.error('Error al obtener admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/hospitals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      router.push('/dashboard');
    } else {
      setMessage(data.error || 'Error al crear hospital');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Crear Nuevo Hospital</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            name="nombre"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Dirección</label>
          <input
            name="direccion"
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Administrador</label>
          <select
            name="adminId"
            onChange={handleChange}
            value={form.adminId}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Selecciona un administrador</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.nombre} - {admin.email}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Crear Hospital
        </button>
        {message && <p className="mt-2 text-red-500 text-center">{message}</p>}
      </form>
    </div>
  );
}
