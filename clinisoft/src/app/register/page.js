'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Usuario registrado correctamente');
      router.push('/login');
    } else {
      setMessage(data.error || 'Error en el registro');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-sky-600">Registro de Usuario</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4 border border-gray-200">
        <div>
          <label className="block text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition"
        >
          Registrarse
        </button>
      </form>

      {message && <p className="mt-4 text-sky-700 text-center">{message}</p>}
    </div>
  );
}
