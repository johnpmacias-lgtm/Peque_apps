import React from 'react';
import { useStore } from '../store/useStore';
import {
  AlertTriangle, ShoppingBag, Users,
  Clock, ChefHat
} from 'lucide-react';

export default function Dashboard() {
  const { pedidos, mesas, alertas, currentUser, restauranteConfig, tema } = useStore();
  const isDark = tema === 'dark';

  const pedidosActivos = pedidos.filter(p => p.estado !== 'pagado' && p.estado !== 'cancelado');
  const mesasOcupadas = mesas.filter(m => m.estado === 'ocupada').length;
  const itemsPendientes = pedidosActivos.reduce((sum, p) =>
    sum + p.items.filter(i => i.estado === 'pendiente' || i.estado === 'preparando').length, 0
  );

  const stats = [
    { label: 'Pedidos Activos', value: pedidosActivos.length, icon: ShoppingBag, color: 'blue' },
    { label: 'Mesas Ocupadas', value: `${mesasOcupadas}/${mesas.length}`, icon: Users, color: 'purple' },
    { label: 'Items en Cocina', value: itemsPendientes, icon: ChefHat, color: 'amber' },
    { label: 'Alertas Stock', value: alertas.length, icon: AlertTriangle, color: 'red' },
  ];

  const colorMap: Record<string, string> = {
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
    amber: isDark ? 'text-amber-400' : 'text-amber-600',
    red: isDark ? 'text-red-400' : 'text-red-600',
  };

  const bgMap: Record<string, string> = {
    blue: isDark ? 'bg-blue-500/10' : 'bg-blue-100',
    purple: isDark ? 'bg-purple-500/10' : 'bg-purple-100',
    amber: isDark ? 'bg-amber-500/10' : 'bg-amber-100',
    red: isDark ? 'bg-red-500/10' : 'bg-red-100',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ¡Hola, {currentUser?.nombre.split(' ')[0]}! 👋
          </h1>
          <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{restauranteConfig.nombre}</p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{restauranteConfig.direccion}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`rounded-2xl p-5 border transition ${
              isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${bgMap[stat.color]}`}>
                  <Icon className={colorMap[stat.color]} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className={`lg:col-span-2 rounded-2xl p-5 border ${
          isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Clock size={18} className="text-amber-400" />
            Pedidos Recientes
          </h3>
          <div className="space-y-3">
            {pedidosActivos.slice(0, 5).map(pedido => (
              <div key={pedido.id} className={`flex items-center justify-between p-3 rounded-xl border transition ${
                isDark ? 'bg-gray-900/50 border-gray-700/30' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                    M{pedido.mesa_numero}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{pedido.items.length} items</p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{pedido.mesero_nombre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>${pedido.total}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    pedido.estado === 'pendiente' ? 'bg-yellow-500/10 text-yellow-400' :
                    pedido.estado === 'preparando' ? 'bg-blue-500/10 text-blue-400' :
                    pedido.estado === 'listo' ? 'bg-green-500/10 text-green-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                  </span>
                </div>
              </div>
            ))}
            {pedidosActivos.length === 0 && (
              <p className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No hay pedidos activos</p>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className={`rounded-2xl p-5 border ${
          isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <AlertTriangle size={18} className="text-red-400" />
            Alertas de Inventario
          </h3>
          <div className="space-y-2">
            {alertas.length === 0 ? (
              <p className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Todo en orden ✓</p>
            ) : (
              alertas.map(alerta => (
                <div key={alerta.id} className={`p-3 rounded-xl border ${
                  alerta.nivel === 'critical'
                    ? 'bg-red-500/5 border-red-500/20'
                    : 'bg-yellow-500/5 border-yellow-500/20'
                }`}>
                  <p className={`text-sm font-medium ${
                    alerta.nivel === 'critical' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {alerta.ingrediente_nombre}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {alerta.stock_actual} / mín: {alerta.stock_minimo}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mesas Overview */}
      <div className={`rounded-2xl p-5 border ${
        isDark ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Estado de Mesas</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
          {mesas.map(mesa => (
            <div
              key={mesa.id}
              className={`aspect-square rounded-xl flex flex-col items-center justify-center border transition ${
                mesa.estado === 'libre'
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : mesa.estado === 'ocupada'
                  ? 'bg-red-500/10 border-red-500/30 text-red-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              <span className="text-lg font-bold">{mesa.numero}</span>
              <span className="text-[10px] capitalize">{mesa.estado}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Reservada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
