'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de verificación de autenticación (reemplaza con lógica real)
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
        router.replace('/dashboard');
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Clinisoft - Sistema Médico Integral</title>
        <meta name="description" content="Gestión hospitalaria: citas, historiales y más." />
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-white"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
            Clinisoft
          </h1>
          <p className="text-gray-600 mb-6">
            Bienvenido a tu plataforma de gestión médica. Agenda citas, consulta
            historiales y administra tu clínica de forma fácil.
          </p>
          {!isAuthenticated && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push('/login')}
                aria-label="Iniciar Sesión"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/register')}
                aria-label="Registrarse"
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Registrarse
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
