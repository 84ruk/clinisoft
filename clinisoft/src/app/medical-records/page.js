'use client';

import { useState } from 'react';

export default function MedicalRecordsPage() {
  const [pacienteId, setPacienteId] = useState('');
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    if (!pacienteId) {
      setMessage('Ingrese el ID del paciente');
      return;
    }
    const res = await fetch(`/api/medical-records?pacienteId=${pacienteId}`);
    const data = await res.json();
    if (res.ok) {
      setRecords(data);
      setMessage('');
    } else {
      setMessage(data.error || 'Error al obtener el historial');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6 text-sky-600">Historial Médico</h2>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">ID Paciente</label>
        <input 
          type="text" 
          value={pacienteId}
          onChange={e => setPacienteId(e.target.value)}
          placeholder="Ingrese el ID del paciente"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
        <button
          onClick={fetchRecords}
          className="mt-4 bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition"
        >
          Buscar Historial
        </button>
      </div>

      {message && <p className="text-sky-700 mb-4">{message}</p>}

      <ul className="space-y-4">
        {records.map(record => (
          <li key={record.id} className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm text-gray-700">
            <div><strong>Fecha:</strong> {new Date(record.fecha).toLocaleString()}</div>
            <div><strong>Motivo:</strong> {record.motivo}</div>
            <div><strong>Diagnóstico:</strong> {record.diagnostico}</div>
            <div><strong>Receta:</strong> {record.receta}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
