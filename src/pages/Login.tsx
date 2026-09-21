import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Lock, User, AlertCircle, Moon, Sun } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useStore(s => s.login);
  const config = useStore(s => s.restauranteConfig);
  const usuarios = useStore(s => s.usuarios);
  const tema = useStore(s => s.tema);
  const toggleTema = useStore(s => s.toggleTema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setError('Usuario o contraseña incorrectos.');
      }
      setLoading(false);
    }, 500);
  };

  const quickLogin = (user: { nombre: string; password: string }) => {
    setUsername(user.nombre);
    setPassword(user.password);
    setTimeout(() => {
      login(user.nombre, user.password);
    }, 200);
  };

  const usuariosActivos = usuarios.filter(u => u.activo);

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
      tema === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${
          tema === 'dark' ? 'bg-amber-500/10' : 'bg-amber-300/20'
        }`}></div>
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl ${
          tema === 'dark' ? 'bg-amber-500/5' : 'bg-orange-300/15'
        }`}></div>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTema}
        className={`absolute top-4 right-4 p-3 rounded-xl transition-all ${
          tema === 'dark' 
            ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700' 
            : 'bg-white hover:bg-gray-50 text-amber-600 border border-gray-200 shadow-sm'
        }`}
      >
        {tema === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="relative w-full max-w-md">
        {/* Logo & Name */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">{config.logotipo}</div>
          <h1 className={`text-3xl font-bold ${tema === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {config.nombre}
          </h1>
          <p className={`mt-1 ${tema === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Sistema de Administración
          </p>
        </div>

        {/* Login Card */}
        <div className={`backdrop-blur-xl rounded-2xl p-8 shadow-2xl transition-colors duration-300 ${
          tema === 'dark'
            ? 'bg-gray-800/80 border border-gray-700/50'
            : 'bg-white/90 border border-gray-200 shadow-lg'
        }`}>
          <h2 className={`text-xl font-semibold mb-6 ${tema === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tema === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Usuario
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${tema === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition ${
                    tema === 'dark'
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1.5 ${tema === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Contraseña
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${tema === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition ${
                    tema === 'dark'
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
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

          {/* User Selection List */}
          <div className={`mt-6 pt-6 border-t ${tema === 'dark' ? 'border-gray-700/50' : 'border-gray-200'}`}>
            <p className={`text-xs mb-3 text-center ${tema === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
              Selecciona un usuario para acceso rápido:
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {usuariosActivos.map(user => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all text-left ${
                    tema === 'dark'
                      ? 'bg-gray-700/30 hover:bg-gray-700/60 border-gray-600/30 hover:border-gray-500/50'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    user.rol === 'admin' ? 'bg-gradient-to-br from-purple-400 to-purple-600' :
                    user.rol === 'cocina' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    'bg-gradient-to-br from-blue-400 to-blue-600'
                  }`}>
                    {user.nombre.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${tema === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {user.nombre}
                    </p>
                    <p className={`text-xs capitalize ${tema === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                      {user.rol === 'admin' ? '👤 Administrador' :
                       user.rol === 'cocina' ? '👨‍🍳 Cocina' : '🍽️ Mesero'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tema === 'dark' ? 'bg-gray-600/50 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    Click
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className={`text-center text-xs mt-6 ${tema === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
          v1.0.0 — Sistema POS para Restaurantes
        </p>
      </div>
    </div>
  );
}
