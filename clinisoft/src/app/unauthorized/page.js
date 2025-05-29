// src/app/unauthorized/page.js
export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Acceso Denegado</h1>
        <p className="text-gray-700">No tienes permiso para ver esta página.</p>
      </div>
    </div>
  )
}
