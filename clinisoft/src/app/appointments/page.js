'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('/api/appointments');
        const data = await res.json();
        if (res.ok) {
          setAppointments(data);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Error al cargar citas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAppointments(appointments.filter((appt) => appt.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Mis Citas</h1>

      <button
        onClick={() => router.push('/appointments/new')}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Agendar Nueva Cita
      </button>

      {loading ? (
        <p>Cargando...</p>
      ) : appointments.length === 0 ? (
        <p>No tienes citas agendadas.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appt) => (
            <li key={appt.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">Fecha: {new Date(appt.fecha).toLocaleString()}</p>
                <p>Doctor: {appt.doctor?.user.nombre || 'No asignado'}</p>
                <p>Motivo: {appt.motivo}</p>
              </div>
              <button
                onClick={() => handleCancel(appt.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
