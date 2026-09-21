import React from 'react';
import { useStore } from '../store/useStore';
import {
  LayoutDashboard, UtensilsCrossed, ChefHat, ShoppingBag,
  Settings, LogOut, Bell, Users, Package
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { currentUser, logout, restauranteConfig, alertas } = useStore();

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

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{restauranteConfig.logotipo}</span>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">{restauranteConfig.nombre}</h1>
            <p className="text-xs text-gray-500">Sistema POS</p>
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
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
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

      {/* User Info */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
            {currentUser?.nombre.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{currentUser?.nombre}</p>
            <p className="text-xs text-gray-500 capitalize">{currentUser?.rol}</p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-lg transition"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
