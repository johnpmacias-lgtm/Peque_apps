import React from 'react';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard, UtensilsCrossed, ChefHat, ShoppingBag,
  Settings, LogOut, Users, Package, Sun, Moon
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser, logout, restauranteConfig, alertas, tema, toggleTema } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard, roles: ['admin', 'mesero', 'cocina'] },
    { id: 'mesas', label: 'Mesas', icon: UtensilsCrossed, roles: ['admin', 'mesero'] },
    { id: 'cocina', label: 'Cocina', icon: ChefHat, roles: ['admin', 'cocina'] },
    { id: 'inventario', label: 'Inventario', icon: Package, roles: ['admin'] },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, roles: ['admin', 'mesero'] },
    { id: 'usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
    { id: 'configuracion', label: 'Configuración', icon: Settings, roles: ['admin'] },
  ];

  const filteredMenu = menuItems.filter(item =>
    currentUser && item.roles.includes(currentUser.rol)
  );

  const isDark = tema === 'dark';

  return (
    <aside className={`w-64 flex flex-col h-screen sticky top-0 transition-colors duration-300 ${
      isDark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{restauranteConfig.logotipo}</span>
          <div>
            <h1 className={`text-sm font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {restauranteConfig.nombre}
            </h1>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Sistema POS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredMenu.map(item => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? isDark
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                  : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {item.label}
              {item.id === 'inventario' && alertas.length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {alertas.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className={`px-3 pb-3 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} pt-3`}>
        <button
          onClick={toggleTema}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>

      {/* User Info */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {currentUser?.nombre}
            </p>
            <p className={`text-xs capitalize ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {currentUser?.rol}
            </p>
          </div>
          <button
            onClick={logout}
            className={`p-2 rounded-lg transition ${
              isDark ? 'text-gray-500 hover:text-red-400 hover:bg-gray-800' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
            }`}
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
