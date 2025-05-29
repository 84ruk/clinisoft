// src/app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const tabs = [
    { label: 'Doctores', resource: 'doctors' },
    { label: 'Pacientes', resource: 'patients' },
    { label: 'Hospitales', resource: 'hospitals' },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const [doctors, setDoctors]     = useState([]);
  const [patients, setPatients]   = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading]     = useState(true);

  // 1) Carga inicial de datos
  useEffect(() => {
    async function fetchAll() {
      try {
        const [ds, ps, hs] = await Promise.all([
          fetch('/api/doctors').then(r => r.json()),
          fetch('/api/patients').then(r => r.json()),
          fetch('/api/hospitals').then(r => r.json()),
        ]);
        setDoctors(ds);
        setPatients(ps);
        setHospitals(hs);
      } catch (err) {
        console.error('Error cargando datos:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // 2) Handler genérico de DELETE
  async function handleDelete(resource, id) {
    if (!confirm(`¿Eliminar ${resource.slice(0, -1)} con ID ${id}?`)) return;

    const res = await fetch(`/api/${resource}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || 'Error al eliminar');
      return;
    }

    // Actualizar estado local según resource
    switch (resource) {
      case 'doctors':
        setDoctors(d => d.filter(x => x.id !== id));
        break;
      case 'patients':
        setPatients(p => p.filter(x => x.id !== id));
        break;
      case 'hospitals':
        setHospitals(h => h.filter(x => x.id !== id));
        break;
      default:
        break;
    }
  }

  if (loading) {
    return <p className="p-6 text-center">Cargando datos...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Panel de Administración</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-4">
          {tabs.map(tab => (
            <button
              key={tab.resource}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 ${
                activeTab.resource === tab.resource
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido */}
      <div>
        {activeTab.resource === 'doctors' && (
          <DoctorsTab doctors={doctors} onDelete={handleDelete} />
        )}
        {activeTab.resource === 'patients' && (
          <PatientsTab patients={patients} onDelete={handleDelete} />
        )}
        {activeTab.resource === 'hospitals' && (
          <HospitalsTab hospitals={hospitals} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}

function DoctorsTab({ doctors, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Doctores</h2>
        <Link
          href="/doctors/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Doctor
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Especialidad</th>
            <th className="px-4 py-2">Hospital</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map(doc => (
            <tr key={doc.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{doc.user.nombre}</td>
              <td className="px-4 py-2">{doc.especialidad}</td>
              <td className="px-4 py-2">{doc.hospital.nombre}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onDelete('doctors', doc.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
                <Link
                  href={`/doctors/${doc.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientsTab({ patients, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Pacientes</h2>
        <Link
          href="/patients/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Paciente
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{p.nombre}</td>
              <td className="px-4 py-2">{p.email}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onDelete('patients', p.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
                <Link
                  href={`/patients/${p.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function HospitalsTab({ hospitals, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Hospitales</h2>
        <Link
          href="/hospitals/new"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Nuevo Hospital
        </Link>
      </div>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {hospitals.map(h => (
            <tr key={h.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{h.nombre}</td>
              <td className="px-4 py-2">{h.direccion}</td>
              <td className="px-4 py-2 space-x-2">
                <Link
                  href={`/hospitals/${h.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
                <button
                  onClick={() => onDelete('hospitals', h.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
                <Link
                  href={`/hospitals/${h.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Editar
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
