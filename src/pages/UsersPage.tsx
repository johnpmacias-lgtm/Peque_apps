import React from 'react';
import { Users, Shield, ChefHat, UtensilsCrossed } from 'lucide-react';
import { usuarios } from '../data/mockData';

export default function UsersPage() {
  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'admin': return <Shield size={16} className="text-purple-400" />;
      case 'cocina': return <ChefHat size={16} className="text-amber-400" />;
      case 'mesero': return <UtensilsCrossed size={16} className="text-blue-400" />;
      default: return null;
    }
  };

  const getRoleBadge = (rol: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      cocina: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      mesero: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    };
    return styles[rol] || '';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-amber-400" size={24} />
            Gestión de Usuarios
          </h1>
          <p className="text-gray-400 mt-1">Administración de cuentas y roles</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20">
          + Nuevo Usuario
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuarios.map(user => (
          <div key={user.id} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
              {user.nombre.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">{user.nombre}</h3>
              <p className="text-sm text-gray-400">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex items-center gap-1 ${getRoleBadge(user.rol)}`}>
                  {getRoleIcon(user.rol)}
                  {user.rol}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  user.activo ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                }`}>
                  {user.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition text-sm">
              ⚙️
            </button>
          </div>
        ))}
      </div>

      {/* Roles Info */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Permisos por Rol</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-purple-400" />
              <span className="text-sm font-semibold text-purple-400">Administrador</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Acceso total al sistema</li>
              <li>• Gestión de usuarios</li>
              <li>• Configuración global</li>
              <li>• Reportes financieros</li>
              <li>• Inventario completo</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={18} className="text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">Mesero</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Gestión de mesas</li>
              <li>• Tomar pedidos</li>
              <li>• Ver estado de cocina</li>
              <li>• Cobrar cuentas</li>
              <li>• Dashboard básico</li>
            </ul>
          </div>
          <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ChefHat size={18} className="text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Cocina</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Pantalla de cocina</li>
              <li>• Ver pedidos en tiempo real</li>
              <li>• Marcar platos listos</li>
              <li>• Dashboard de cocina</li>
              <li>• Sin acceso a cobros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
