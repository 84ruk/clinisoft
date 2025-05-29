'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AgendarCita() {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/patients')
      .then(res => res.json())
      .then(data => setPacientes(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/doctor/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pacienteId, fecha, motivo }),
      });

      if (res.ok) {
        router.push('/doctor/appointments');
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Error al agendar la cita');
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Agendar Nueva Cita</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="paciente" className="block text-sm font-medium text-gray-700">Paciente</label>
          <select
            id="paciente"
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Seleccione un paciente</option>
            {pacientes.map((p) => (
                
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
          <input
            type="datetime-local"
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">Motivo</label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agendar Cita
        </button>
      </form>
    </div>
  );
}
