import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Users, Shield, ChefHat, UtensilsCrossed, Plus, Edit2, Trash2, X, Save, UserCheck, UserX } from 'lucide-react';
import { UserRole } from '../types';

export default function UsersPage() {
  const { usuarios, addUser, updateUser, deleteUser, tema } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const isDark = tema === 'dark';

  const [form, setForm] = useState({
    nombre: '',
    password: '',
    rol: 'mesero' as UserRole,
    activo: true,
  });

  const openNewUser = () => {
    setEditingUser(null);
    setForm({ nombre: '', password: '', rol: 'mesero', activo: true });
    setShowModal(true);
  };

  const openEditUser = (id: number) => {
    const user = usuarios.find(u => u.id === id);
    if (!user) return;
    setEditingUser(id);
    setForm({ nombre: user.nombre, password: user.password, rol: user.rol, activo: user.activo });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser, form);
    } else {
      addUser(form);
    }
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    deleteUser(id);
    setConfirmDelete(null);
  };

  const toggleActive = (id: number) => {
    const user = usuarios.find(u => u.id === id);
    if (user) {
      updateUser(id, { activo: !user.activo });
    }
  };

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

  const getRoleGradient = (rol: string) => {
    switch (rol) {
      case 'admin': return 'from-purple-400 to-purple-600';
      case 'cocina': return 'from-amber-400 to-amber-600';
      case 'mesero': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Users className="text-amber-400" size={24} />
            Gestión de Usuarios
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Administración de cuentas y roles del sistema
          </p>
        </div>
        <button
          onClick={openNewUser}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
        >
          <Plus size={16} />
          Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Usuarios</p>
          <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{usuarios.length}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Activos</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{usuarios.filter(u => u.activo).length}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Inactivos</p>
          <p className="text-3xl font-bold mt-1 text-red-400">{usuarios.filter(u => !u.activo).length}</p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {usuarios.map(user => (
          <div
            key={user.id}
            className={`rounded-2xl p-5 border transition-all ${
              isDark
                ? 'bg-gray-800/50 border-gray-700/50 hover:border-gray-600'
                : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRoleGradient(user.rol)} flex items-center justify-center text-white font-bold text-lg`}>
                {user.nombre.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.nombre}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize flex items-center gap-1 ${getRoleBadge(user.rol)}`}>
                    {getRoleIcon(user.rol)}
                    {user.rol}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.activo
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {user.activo ? '● Activo' : '○ Inactivo'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleActive(user.id)}
                  className={`p-2 rounded-lg transition ${
                    isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  } ${user.activo ? 'text-green-400' : 'text-gray-400'}`}
                  title={user.activo ? 'Desactivar' : 'Activar'}
                >
                  {user.activo ? <UserCheck size={16} /> : <UserX size={16} />}
                </button>
                <button
                  onClick={() => openEditUser(user.id)}
                  className={`p-2 rounded-lg transition ${
                    isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}
                  title="Editar"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => setConfirmDelete(user.id)}
                  className={`p-2 rounded-lg transition ${
                    isDark ? 'hover:bg-red-500/10 text-gray-400 hover:text-red-400' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'
                  }`}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Roles Info */}
      <div className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200'}`}>
        <h3 className={`text-sm font-semibold uppercase mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Permisos por Rol
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={18} className="text-purple-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>Administrador</span>
            </div>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Acceso total al sistema</li>
              <li>• Gestión de usuarios</li>
              <li>• Configuración global</li>
              <li>• Reportes financieros</li>
              <li>• Inventario completo</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-blue-500/5 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <UtensilsCrossed size={18} className="text-blue-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Mesero</span>
            </div>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Gestión de mesas</li>
              <li>• Tomar pedidos</li>
              <li>• Ver estado de cocina</li>
              <li>• Cobrar cuentas</li>
              <li>• Dashboard básico</li>
            </ul>
          </div>
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <ChefHat size={18} className="text-amber-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>Cocina</span>
            </div>
            <ul className={`text-xs space-y-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>• Pantalla de cocina</li>
              <li>• Ver pedidos en tiempo real</li>
              <li>• Marcar platos listos</li>
              <li>• Dashboard de cocina</li>
              <li>• Sin acceso a cobros</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-md border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Contraseña
                </label>
                <input
                  type="text"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white placeholder-gray-500'
                      : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Contraseña"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Rol
                </label>
                <select
                  value={form.rol}
                  onChange={e => setForm({ ...form, rol: e.target.value as UserRole })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    isDark
                      ? 'bg-gray-700/50 border border-gray-600/50 text-white'
                      : 'bg-gray-50 border border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="admin">👤 Administrador</option>
                  <option value="mesero">🍽️ Mesero</option>
                  <option value="cocina">👨‍🍳 Cocina</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Estado:
                </label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, activo: !form.activo })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    form.activo
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {form.activo ? '● Activo' : '○ Inactivo'}
                </button>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition ${
                    isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm transition flex items-center justify-center gap-2"
                >
                  <Save size={14} />
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl w-full max-w-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              ¿Eliminar usuario?
            </h3>
            <p className={`text-sm mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Esta acción no se puede deshacer. El usuario <strong>
                {usuarios.find(u => u.id === confirmDelete)?.nombre}
              </strong> será eliminado permanentemente.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
