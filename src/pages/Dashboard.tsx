import React from 'react';
import { useStore } from '../store/useStore';
import {
  TrendingUp, AlertTriangle, ShoppingBag, Users,
  Clock, DollarSign, ChefHat, Package
} from 'lucide-react';

export default function Dashboard() {
  const { pedidos, ingredientes, mesas, alertas, currentUser, restauranteConfig } = useStore();

  const pedidosActivos = pedidos.filter(p => p.estado !== 'pagado' && p.estado !== 'cancelado');
  const mesasOcupadas = mesas.filter(m => m.estado === 'ocupada').length;
  const ingresosHoy = pedidos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.total, 0);
  const itemsPendientes = pedidosActivos.reduce((sum, p) =>
    sum + p.items.filter(i => i.estado === 'pendiente' || i.estado === 'preparando').length, 0
  );

  const stats = [
    { label: 'Pedidos Activos', value: pedidosActivos.length, icon: ShoppingBag, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Mesas Ocupadas', value: `${mesasOcupadas}/${mesas.length}`, icon: Users, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-500/10' },
    { label: 'Items en Cocina', value: itemsPendientes, icon: ChefHat, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-500/10' },
    { label: 'Alertas Stock', value: alertas.length, icon: AlertTriangle, color: 'from-red-500 to-red-600', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            ¡Hola, {currentUser?.nombre.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{restauranteConfig.nombre}</p>
          <p className="text-xs text-gray-500">{restauranteConfig.direccion}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`text-${stat.color.includes('blue') ? 'blue' : stat.color.includes('purple') ? 'purple' : stat.color.includes('amber') ? 'amber' : 'red'}-400`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock size={18} className="text-amber-400" />
            Pedidos Recientes
          </h3>
          <div className="space-y-3">
            {pedidosActivos.slice(0, 5).map(pedido => (
              <div key={pedido.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold">
                    M{pedido.mesa_numero}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{pedido.items.length} items</p>
                    <p className="text-xs text-gray-500">{pedido.mesero_nombre}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">${pedido.total}</p>
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
              <p className="text-center text-gray-500 py-8">No hay pedidos activos</p>
            )}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-400" />
            Alertas de Inventario
          </h3>
          <div className="space-y-2">
            {alertas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Todo en orden ✓</p>
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
                  <p className="text-xs text-gray-500 mt-0.5">
                    {alerta.stock_actual} / mín: {alerta.stock_minimo}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mesas Overview */}
      <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Estado de Mesas</h3>
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
            <span className="text-xs text-gray-400">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs text-gray-400">Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs text-gray-400">Reservada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
