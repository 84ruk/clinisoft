// src/components/EntitySelect.jsx
'use client';

import { useState, useEffect } from 'react';

export default function EntitySelect({ url, name, label, value, onChange, placeholder }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) setOptions(data);
      })
      .catch(err => {
        if (!cancelled) setError('Error al cargar ' + label);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [url, label]);

  if (loading) return <p className="text-gray-500">Cargando {label}...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <label className="block text-gray-700 mb-1" htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="">{placeholder || `Selecciona ${label}`}</option>
        {options?.map(opt => (
          <option key={opt.id} value={opt.id}>
            {opt.nombre ?? opt.user?.nombre ?? opt.id}
          </option>
        ))}
      </select>
    </div>
  );
}
