import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore(s => s.login);
  const config = useStore(s => s.restauranteConfig);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
      }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setTimeout(() => {
      login(userEmail, userPassword);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Name */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{config.logotipo}</div>
          <h1 className="text-3xl font-bold text-white">{config.nombre}</h1>
          <p className="text-gray-400 mt-1">Sistema de Administración</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Iniciar Sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando...
                </span>
              ) : 'Ingresar'}
            </button>
          </form>

          {/* Quick Access */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 mb-3 text-center">Acceso rápido (demo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin@restaurante.com', 'admin123')}
                className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/30 rounded-lg text-xs text-gray-300 hover:text-white transition"
              >
                👤 Admin
              </button>
              <button
                onClick={() => quickLogin('mesero@restaurante.com', 'mesero123')}
                className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/30 rounded-lg text-xs text-gray-300 hover:text-white transition"
              >
                🍽️ Mesero
              </button>
              <button
                onClick={() => quickLogin('cocina@restaurante.com', 'cocina123')}
                className="px-3 py-2 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/30 rounded-lg text-xs text-gray-300 hover:text-white transition"
              >
                👨‍🍳 Cocina
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          v1.0.0 — Sistema POS para Restaurantes
        </p>
      </div>
    </div>
  );
}
