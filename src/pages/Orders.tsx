import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ShoppingBag, Clock, CheckCircle2, XCircle, DollarSign } from 'lucide-react';
import { EstadoPedido } from '../types';

export default function Orders() {
  const { pedidos, updatePedidoEstado, restauranteConfig } = useStore();
  const [filter, setFilter] = useState<string>('all');

  const filteredPedidos = pedidos.filter(p => {
    if (filter === 'all') return true;
    return p.estado === filter;
  }).sort((a, b) => b.fecha_creacion.getTime() - a.fecha_creacion.getTime());

  const handleUpdateEstado = (pedidoId: number, estado: EstadoPedido) => {
    updatePedidoEstado(pedidoId, estado);
  };

  const getStatusBadge = (estado: EstadoPedido) => {
    const styles: Record<EstadoPedido, string> = {
      pendiente: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      preparando: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      listo: 'bg-green-500/10 text-green-400 border-green-500/20',
      servido: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      pagado: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      cancelado: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return styles[estado];
  };

  const getEstadoLabel = (estado: EstadoPedido) => {
    const labels: Record<EstadoPedido, string> = {
      pendiente: '⏳ Pendiente',
      preparando: '🔥 Preparando',
      listo: '✅ Listo',
      servido: '🍽️ Servido',
      pagado: '💰 Pagado',
      cancelado: '❌ Cancelado',
    };
    return labels[estado];
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="text-amber-400" size={24} />
            Gestión de Pedidos
          </h1>
          <p className="text-gray-400 mt-1">Historial y estado de pedidos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pendiente', 'preparando', 'listo', 'servido', 'pagado', 'cancelado'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === f
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/30 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Todos' : getEstadoLabel(f as EstadoPedido)}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredPedidos.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-3 opacity-30" />
            <p>No hay pedidos con este filtro</p>
          </div>
        ) : (
          filteredPedidos.map(pedido => (
            <div key={pedido.id} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                    M{pedido.mesa_numero}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Pedido #{pedido.id.toString().slice(-4)}</h3>
                    <p className="text-xs text-gray-500">
                      {formatTime(pedido.fecha_creacion)} — {pedido.mesero_nombre}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full border ${getStatusBadge(pedido.estado)}`}>
                    {getEstadoLabel(pedido.estado)}
                  </span>
                  <span className="text-lg font-bold text-white">${pedido.total} {restauranteConfig.moneda}</span>
                </div>
              </div>

              {/* Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                {pedido.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded font-mono">
                        x{item.cantidad}
                      </span>
                      <span className="text-sm text-white">{item.plato_nombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.notas && (
                        <span className="text-xs text-amber-400/70 italic">📝 {item.notas}</span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getStatusBadge(item.estado)}`}>
                        {item.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {pedido.notas_generales && (
                <div className="p-2 bg-amber-500/5 border border-amber-500/20 rounded-lg mb-4">
                  <p className="text-xs text-amber-400">⚠️ {pedido.notas_generales}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-700/30">
                {pedido.estado === 'pendiente' && (
                  <>
                    <button
                      onClick={() => handleUpdateEstado(pedido.id, 'preparando')}
                      className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-xs transition"
                    >
                      🔥 Preparando
                    </button>
                    <button
                      onClick={() => handleUpdateEstado(pedido.id, 'cancelado')}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs transition"
                    >
                      ❌ Cancelar
                    </button>
                  </>
                )}
                {pedido.estado === 'listo' && (
                  <button
                    onClick={() => handleUpdateEstado(pedido.id, 'servido')}
                    className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs transition"
                  >
                    🍽️ Marcar Servido
                  </button>
                )}
                {pedido.estado === 'servido' && (
                  <button
                    onClick={() => handleUpdateEstado(pedido.id, 'pagado')}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs transition flex items-center gap-1"
                  >
                    <DollarSign size={12} />
                    Cobrar / Pagado
                  </button>
                )}
                <span className="ml-auto text-xs text-gray-500">
                  <Clock size={12} className="inline mr-1" />
                  Actualizado: {formatTime(pedido.fecha_actualizacion)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
